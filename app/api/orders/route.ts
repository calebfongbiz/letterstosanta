/**
 * Orders API Route
 * 
 * POST /api/orders
 * Creates a new customer with children and letters.
 * Sends webhook to Make.com for automation.
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateTrackerId } from '@/lib/utils'
import { calculateOrderPrice, getTrackerUrl, type MakeWebhookNewOrderPayload } from '@/lib/types'
import bcrypt from 'bcryptjs'

// LetterTier type (matches Prisma schema enum)
type LetterTier = 'FREE' | 'TRACKER' | 'EXPERIENCE'

// Request body type
interface CreateOrderRequest {
  parentFirstName: string
  parentLastName: string
  parentEmail: string
  passcode: string
  tier: LetterTier
  children: Array<{
    name: string
    age: number
    letterText: string
    wishlist?: string | null
    goodThings?: string | null
    petsAndFamily?: string | null
  }>
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json()

    // Validate required fields
    if (!body.parentFirstName?.trim()) {
      return NextResponse.json({ error: 'Parent first name is required' }, { status: 400 })
    }
    if (!body.parentLastName?.trim()) {
      return NextResponse.json({ error: 'Parent last name is required' }, { status: 400 })
    }
    if (!body.parentEmail?.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    if (!body.passcode?.trim()) {
      return NextResponse.json({ error: 'Passcode is required' }, { status: 400 })
    }
    if (!body.children?.length) {
      return NextResponse.json({ error: 'At least one child is required' }, { status: 400 })
    }

    // Validate tier
    if (!['FREE', 'TRACKER', 'EXPERIENCE'].includes(body.tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    // Validate children
    for (const child of body.children) {
      if (!child.name?.trim()) {
        return NextResponse.json({ error: 'Child name is required' }, { status: 400 })
      }
      if (!child.age || child.age < 1 || child.age > 18) {
        return NextResponse.json({ error: 'Invalid child age' }, { status: 400 })
      }
      if (!child.letterText?.trim()) {
        return NextResponse.json({ error: 'Letter content is required' }, { status: 400 })
      }
    }

    // Check if email already exists
    const existingCustomer = await db.customer.findUnique({
      where: { email: body.parentEmail.toLowerCase() },
    })

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please use tracker login.' },
        { status: 400 }
      )
    }

    // Hash the passcode
    const passcodeHash = await bcrypt.hash(body.passcode, 10)

    // Calculate extra children count (for pricing)
    const extraChildrenCount = Math.max(0, body.children.length - 1)

    // Create customer with children and letters in a transaction
    const customer = await db.customer.create({
      data: {
        firstName: body.parentFirstName.trim(),
        lastName: body.parentLastName.trim(),
        email: body.parentEmail.toLowerCase().trim(),
        passcodeHash,
        tier: body.tier,
        extraChildrenCount,
        children: {
          create: body.children.map((child) => ({
            name: child.name.trim(),
            age: child.age,
            trackerId: generateTrackerId(),
            currentMilestone: 'ELF_SORTING_STATION',
            milestoneIndex: 0,
            currentStoryText: 'Your letter has just begun its magical journey! The elves are carefully sorting it at the Elf Sorting Station.',
            letter: {
              create: {
                letterText: child.letterText.trim(),
                wishlist: child.wishlist?.trim() || null,
                goodThings: child.goodThings?.trim() || null,
                petsAndFamily: child.petsAndFamily?.trim() || null,
              },
            },
          })),
        },
      },
      include: {
        children: {
          include: {
            letter: true,
          },
        },
      },
    })

    // Calculate total price
    const totalPrice = calculateOrderPrice(body.tier, body.children.length)

    // Prepare webhook payload for Make.com
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const webhookPayload: MakeWebhookNewOrderPayload = {
      orderId: customer.id,
      customer: {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
      },
      tier: customer.tier as LetterTier,
      extraChildrenCount: customer.extraChildrenCount,
      totalPrice,
      children: customer.children.map((child: { id: string; name: string; age: number; trackerId: string; letter: { id: string; letterText: string; wishlist: string | null; goodThings: string | null; petsAndFamily: string | null; photoUrl: string | null } | null }) => ({
        id: child.id,
        name: child.name,
        age: child.age,
        trackerId: child.trackerId,
        trackerUrl: getTrackerUrl(child.trackerId),
        letter: {
          id: child.letter!.id,
          letterText: child.letter!.letterText,
          wishlist: child.letter!.wishlist,
          goodThings: child.letter!.goodThings,
          petsAndFamily: child.letter!.petsAndFamily,
          photoUrl: child.letter!.photoUrl,
        },
      })),
      createdAt: customer.createdAt.toISOString(),
    }

    // Send webhook to Make.com (fire and forget)
    const webhookUrl = process.env.MAKE_WEBHOOK_NEW_ORDER
    if (webhookUrl && webhookUrl !== 'https://hook.make.com/placeholder') {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload),
        })
        console.log('Webhook sent to Make.com successfully')
      } catch (webhookError) {
        // Log but don't fail the request if webhook fails
        console.error('Failed to send webhook to Make.com:', webhookError)
      }
    } else {
      console.log('Make.com webhook not configured, skipping...')
      console.log('Webhook payload:', JSON.stringify(webhookPayload, null, 2))
    }

    // Return success response
    return NextResponse.json({
      success: true,
      customerId: customer.id,
      childrenCount: customer.children.length,
      tier: customer.tier,
      totalPrice,
      message: 'Order created successfully',
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 }
    )
  }
}
