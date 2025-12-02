/**
 * Upgrade Complete API Route
 * 
 * POST /api/upgrade/complete
 * Completes the upgrade after successful Stripe payment.
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    // Get upgrade info from metadata
    const { customerId, targetTier } = session.metadata || {}

    if (!customerId || !targetTier) {
      return NextResponse.json(
        { error: 'Invalid session metadata' },
        { status: 400 }
      )
    }

    // Update customer tier
    const updatedCustomer = await db.customer.update({
      where: { id: customerId },
      data: {
        tier: targetTier as 'TRACKER' | 'EXPERIENCE',
        stripePaymentId: session.payment_intent as string,
      },
    })

    console.log(`Upgraded customer ${customerId} to ${targetTier}`)

    return NextResponse.json({
      success: true,
      customerId: updatedCustomer.id,
      newTier: updatedCustomer.tier,
    })
  } catch (error) {
    console.error('Upgrade complete error:', error)
    return NextResponse.json(
      { error: 'Failed to complete upgrade' },
      { status: 500 }
    )
  }
}
