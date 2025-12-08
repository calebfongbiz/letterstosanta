/**
 * Upgrade Checkout API Route
 * 
 * POST /api/upgrade
 * Creates a Stripe Checkout session for upgrading from FREE to MAGIC.
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, targetTier } = body

    // Only upgrade to MAGIC is valid
    if (targetTier !== 'MAGIC') {
      return NextResponse.json(
        { error: 'Invalid target tier' },
        { status: 400 }
      )
    }

    // Get current customer
    const customer = await db.customer.findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Check if already at MAGIC tier
    if (customer.tier === 'MAGIC') {
      return NextResponse.json(
        { error: 'Already at highest tier' },
        { status: 400 }
      )
    }

    // Calculate upgrade price - full price since upgrading from FREE
    const upgradePrice = 499 // $7.99 in cents

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: "Upgrade to Santa's Magic",
              description: 'Visual Flight Tracker + Personalized Santa Reply + Nice List Certificate',
            },
            unit_amount: upgradePrice,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
      metadata: {
        customerId: customer.id,
        currentTier: customer.tier,
        targetTier: targetTier,
        upgradeType: 'tier_upgrade',
      },
      customer_email: customer.email,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Upgrade checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create upgrade checkout session' },
      { status: 500 }
    )
  }
}
