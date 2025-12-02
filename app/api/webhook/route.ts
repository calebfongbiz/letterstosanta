/**
 * Stripe Webhook Handler
 * 
 * Processes successful payments and creates orders.
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { hashPasscode, generateTrackerId } from '@/lib/utils'
import type { LetterTier } from '@/lib/types'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const metadata = session.metadata!
      const orderData = JSON.parse(metadata.orderData)
      const tier = metadata.tier as LetterTier

      // Hash the passcode
      const passcodeHash = await hashPasscode(orderData.passcode)

      // Check if customer already exists
      let customer = await db.customer.findUnique({
        where: { email: orderData.parentEmail },
      })

      if (customer) {
        // Update existing customer's tier if upgrading
        customer = await db.customer.update({
          where: { id: customer.id },
          data: {
            tier: tier,
            stripeCustomerId: session.customer as string || undefined,
            stripePaymentId: session.payment_intent as string || undefined,
          },
        })
      } else {
        // Create new customer
        customer = await db.customer.create({
          data: {
            firstName: orderData.parentFirstName,
            lastName: orderData.parentLastName,
            email: orderData.parentEmail,
            passcodeHash,
            tier: tier,
            extraChildrenCount: Math.max(0, orderData.children.length - 1),
            stripeCustomerId: session.customer as string || undefined,
            stripePaymentId: session.payment_intent as string || undefined,
          },
        })
      }

      // Create children and their letters
      for (const childData of orderData.children) {
        const trackerId = generateTrackerId()

        const child = await db.child.create({
          data: {
            name: childData.name,
            age: parseInt(childData.age),
            trackerId,
            customerId: customer.id,
            currentMilestone: 'ELF_SORTING_STATION',
            milestoneIndex: 0,
            currentStoryText: 'Your letter has arrived at the Elf Sorting Station! Jingle and Twinkle are carefully reviewing your wishes.',
          },
        })

        await db.letter.create({
          data: {
            childId: child.id,
            letterText: childData.letterText,
            wishlist: childData.wishlist || null,
            goodThings: childData.goodThings || null,
            petsAndFamily: childData.petsAndFamily || null,
          },
        })
      }

      // Trigger Make.com webhook for new order (if configured)
      if (process.env.MAKE_WEBHOOK_NEW_ORDER) {
        try {
          await fetch(process.env.MAKE_WEBHOOK_NEW_ORDER, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customerId: customer.id,
              email: customer.email,
              firstName: customer.firstName,
              lastName: customer.lastName,
              tier: customer.tier,
              childrenCount: orderData.children.length,
              children: orderData.children.map((c: any) => ({
                name: c.name,
                age: c.age,
              })),
              paymentId: session.payment_intent,
              amountPaid: session.amount_total ? session.amount_total / 100 : 0,
            }),
          })
        } catch (webhookError) {
          console.error('Make.com webhook failed:', webhookError)
          // Don't fail the order if webhook fails
        }
      }

      console.log('Order created successfully for:', customer.email)
    } catch (error) {
      console.error('Error processing webhook:', error)
      return NextResponse.json({ error: 'Error processing order' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
