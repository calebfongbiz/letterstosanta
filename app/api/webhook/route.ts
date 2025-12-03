/**
 * Stripe Webhook API Route
 * 
 * Handles Stripe webhook events, particularly checkout.session.completed.
 * Creates customer and children records after successful payment.
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { generateTrackerId } from '@/lib/utils'
import bcrypt from 'bcryptjs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    try {
      // Extract metadata
      const { tier, childrenCount, orderData: orderDataStr } = session.metadata || {}
      const orderData = JSON.parse(orderDataStr || '{}')

      // Hash passcode
      const passcodeHash = await bcrypt.hash(orderData.passcode, 10)

      // Calculate extra children
      const extraChildrenCount = Math.max(0, parseInt(childrenCount || '1') - 1)

      // Create customer with children
      const customer = await db.customer.create({
        data: {
          firstName: orderData.parentFirstName,
          lastName: orderData.parentLastName,
          email: orderData.parentEmail.toLowerCase().trim(),
          passcodeHash,
          tier: tier as 'FREE' | 'MAGIC',
          extraChildrenCount,
          stripeCustomerId: session.customer as string || null,
          stripePaymentId: session.payment_intent as string || null,
          children: {
            create: orderData.children.map((child: any) => ({
              name: child.name,
              age: parseInt(child.age, 10),
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

      console.log('Created customer from Stripe webhook:', customer.id)

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
              totalPrice: (session.amount_total || 0) / 100,
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

    } catch (error) {
      console.error('Error processing webhook:', error)
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
