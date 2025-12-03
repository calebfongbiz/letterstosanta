/**
 * Orders API Route
 * 
 * POST /api/orders
 * Creates a new order for FREE tier (paid tiers go through Stripe checkout).
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateTrackerId } from '@/lib/utils'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.parentFirstName || !body.parentLastName || !body.parentEmail || !body.passcode) {
      return NextResponse.json(
        { error: 'Missing required parent information' },
        { status: 400 }
      )
    }

    if (!body.children || body.children.length === 0) {
      return NextResponse.json(
        { error: 'At least one child is required' },
        { status: 400 }
      )
    }

    // Only FREE tier orders come through this endpoint
    // MAGIC tier goes through Stripe checkout
    if (body.tier !== 'FREE') {
      return NextResponse.json(
        { error: 'Paid orders must go through checkout' },
        { status: 400 }
      )
    }

    // Hash the passcode
    const passcodeHash = await bcrypt.hash(body.passcode, 10)

    // Calculate extra children
    const extraChildrenCount = Math.max(0, body.children.length - 1)

    // Create customer with children and letters
    const customer = await db.customer.create({
      data: {
        firstName: body.parentFirstName.trim(),
        lastName: body.parentLastName.trim(),
        email: body.parentEmail.toLowerCase().trim(),
        passcodeHash,
        tier: 'FREE',
        extraChildrenCount,
        children: {
          create: body.children.map((child: any) => ({
            name: child.name.trim(),
            age: child.age,
            trackerId: generateTrackerId(),
            currentMilestone: 'ELF_SORTING_STATION',
            milestoneIndex: 0,
            currentStoryText: "Your letter has just begun its magical journey! Jingles the Elf has been assigned as your letter's personal guide.",
            letter: {
              create: {
                letterText: child.letterText,
                wishlist: child.wishlist || null,
                goodThings: child.goodThings || null,
                petsAndFamily: child.petsAndFamily || null,
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

    // Trigger Make.com webhook for new order
    if (process.env.MAKE_WEBHOOK_NEW_ORDER) {
      try {
        await fetch(process.env.MAKE_WEBHOOK_NEW_ORDER, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: customer.id,
            customer: {
              id: customer.id,
              firstName: customer.firstName,
              lastName: customer.lastName,
              email: customer.email,
            },
            tier: customer.tier,
            extraChildrenCount: customer.extraChildrenCount,
            totalPrice: 0, // FREE tier
            children: customer.children.map((child) => ({
              id: child.id,
              name: child.name,
              age: child.age,
              trackerId: child.trackerId,
              trackerUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/track/${child.trackerId}`,
              letter: child.letter,
            })),
            createdAt: customer.createdAt.toISOString(),
          }),
        })
      } catch (webhookError) {
        console.error('Make.com webhook failed:', webhookError)
        // Don't fail the request if webhook fails
      }
    }

    return NextResponse.json({
      success: true,
      customerId: customer.id,
      message: 'Order created successfully',
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
