/**
 * Upgrade Checkout API Route
 * 
 * POST /api/upgrade
 * Creates a Stripe Checkout session for upgrading tiers.
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Pricing in cents
const TIER_PRICES = {
  FREE: 0,
  TRACKER: 1499,
  EXPERIENCE: 1999,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, targetTier } = body

    // Validate target tier
    if (!['TRACKER', 'EXPERIENCE'].includes(targetTier)) {
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

    // Check if upgrade is valid
    const currentTierValue = customer.tier === 'FREE' ? 0 : customer.tier === 'TRACKER' ? 1 : 2
    const targetTierValue = targetTier === 'TRACKER' ? 1 : 2

    if (targetTierValue <= currentTierValue) {
      return NextResponse.json(
        { error: 'Cannot downgrade or upgrade to same tier' },
        { status: 400 }
      )
    }

    // Calculate upgrade price
    const currentPrice = TIER_PRICES[customer.tier as keyof typeof TIER_PRICES]
    const targetPrice = TIER_PRICES[targetTier as keyof typeof TIER_PRICES]
    const upgradePrice = targetPrice - currentPrice

    // Get product name based on upgrade path
    let productName = ''
    let productDescription = ''
    
    if (customer.tier === 'FREE' && targetTier === 'TRACKER') {
      productName = "Upgrade to Santa's Tracker"
      productDescription = 'Flight-style tracker for your letter to Santa'
    } else if (customer.tier === 'FREE' && targetTier === 'EXPERIENCE') {
      productName = 'Upgrade to The Santa Experience'
      productDescription = 'Complete magical experience with personalized Santa letter'
    } else if (customer.tier === 'TRACKER' && targetTier === 'EXPERIENCE') {
      productName = 'Upgrade to The Santa Experience'
      productDescription = 'Add personalized Santa letter and Nice List certificate'
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: productDescription,
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
