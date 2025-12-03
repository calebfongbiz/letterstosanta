/**
 * Stripe Checkout API Route
 * 
 * Creates a Stripe Checkout session for paid tier (MAGIC).
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tier, childrenCount, orderData } = body

    // Validate tier - only MAGIC tier goes through checkout
    if (tier !== 'MAGIC') {
      return NextResponse.json(
        { error: 'Invalid tier for checkout' },
        { status: 400 }
      )
    }

    // Calculate price
    const basePrice = 799 // $7.99 in cents
    const extraChildPrice = 99 // $0.99 in cents
    const extraChildren = Math.max(0, childrenCount - 1)
    const totalPrice = basePrice + (extraChildren * extraChildPrice)

    // Create line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: "Santa's Magic",
            description: 'Visual Flight Tracker + Personalized Santa Reply + Nice List Certificate',
          },
          unit_amount: basePrice,
        },
        quantity: 1,
      },
    ]

    // Add extra children if any
    if (extraChildren > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Additional Child',
            description: 'Add another child to your magical experience',
          },
          unit_amount: extraChildPrice,
        },
        quantity: extraChildren,
      })
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/write-letter?tier=${tier}`,
      metadata: {
        tier,
        childrenCount: childrenCount.toString(),
        orderData: JSON.stringify(orderData),
      },
      customer_email: orderData.parentEmail,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
