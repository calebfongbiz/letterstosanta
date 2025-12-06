/**
 * Get Child Data API (Public)
 * 
 * GET /api/child/[childId]
 * Returns child data for Santa letter and certificate pages
 * Security: childId is a random UUID that's hard to guess
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ childId: string }> }
) {
  try {
    const { childId } = await params

    const child = await db.child.findUnique({
      where: { id: childId },
      include: {
        customer: true,
        letter: true,
      },
    })

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    // Only allow MAGIC tier to access
    if (child.customer.tier !== 'MAGIC') {
      return NextResponse.json({ error: 'MAGIC tier required' }, { status: 403 })
    }

    return NextResponse.json({
      id: child.id,
      name: child.name,
      letter: child.letter ? {
        wishlist: child.letter.wishlist,
        goodThings: child.letter.goodThings,
        petsAndFamily: child.letter.petsAndFamily,
      } : null,
    })

  } catch (error) {
    console.error('Get child error:', error)
    return NextResponse.json({ error: 'Failed to fetch child' }, { status: 500 })
  }
}
