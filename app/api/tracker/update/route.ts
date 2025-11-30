/**
 * Tracker Update API Route
 * 
 * POST /api/tracker/update
 * Called by Make.com to update a child's tracker status.
 * Secured via x-make-secret header.
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { MILESTONE_ORDER, getMilestoneIndex } from '@/lib/types'

// Milestone type (matches Prisma schema enum)
type Milestone = 'ELF_SORTING_STATION' | 'CANDY_CANE_FOREST' | 'REINDEER_RUNWAY' | 'AURORA_GATE' | 'SANTAS_DESK' | 'NORTH_POLE_WORKSHOP'

// Request body type
interface TrackerUpdateRequest {
  trackerId: string
  milestone: Milestone
  milestoneIndex?: number
  storyText?: string
  santaLetterPdfUrl?: string
  niceListCertificateUrl?: string
}

export async function POST(request: NextRequest) {
  try {
    // Verify Make.com secret
    const makeSecret = request.headers.get('x-make-secret')
    const expectedSecret = process.env.MAKE_WEBHOOK_SECRET

    if (!expectedSecret || makeSecret !== expectedSecret) {
      console.error('Invalid or missing webhook secret')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: TrackerUpdateRequest = await request.json()

    // Validate required fields
    if (!body.trackerId) {
      return NextResponse.json(
        { error: 'trackerId is required' },
        { status: 400 }
      )
    }

    if (!body.milestone) {
      return NextResponse.json(
        { error: 'milestone is required' },
        { status: 400 }
      )
    }

    // Validate milestone is valid
    if (!MILESTONE_ORDER.includes(body.milestone)) {
      return NextResponse.json(
        { error: 'Invalid milestone value' },
        { status: 400 }
      )
    }

    // Find the child by trackerId
    const child = await db.child.findUnique({
      where: { trackerId: body.trackerId },
      include: { letter: true },
    })

    if (!child) {
      return NextResponse.json(
        { error: 'Tracker not found' },
        { status: 404 }
      )
    }

    // Calculate milestone index if not provided
    const milestoneIndex = body.milestoneIndex ?? getMilestoneIndex(body.milestone)

    // Update child's tracker status
    const updatedChild = await db.child.update({
      where: { id: child.id },
      data: {
        currentMilestone: body.milestone,
        milestoneIndex,
        currentStoryText: body.storyText || child.currentStoryText,
      },
    })

    // Update letter with PDFs if provided (for EXPERIENCE tier)
    if (child.letter && (body.santaLetterPdfUrl || body.niceListCertificateUrl)) {
      await db.letter.update({
        where: { id: child.letter.id },
        data: {
          ...(body.santaLetterPdfUrl && { santaLetterPdfUrl: body.santaLetterPdfUrl }),
          ...(body.niceListCertificateUrl && { niceListCertificateUrl: body.niceListCertificateUrl }),
        },
      })
    }

    // Fetch updated child with letter
    const result = await db.child.findUnique({
      where: { id: child.id },
      include: {
        letter: true,
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            tier: true,
          },
        },
      },
    })

    console.log(`Tracker updated: ${body.trackerId} -> ${body.milestone}`)

    return NextResponse.json({
      success: true,
      trackerId: body.trackerId,
      milestone: body.milestone,
      milestoneIndex,
      child: result,
    })
  } catch (error) {
    console.error('Tracker update error:', error)
    return NextResponse.json(
      { error: 'Failed to update tracker' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/tracker/update',
    method: 'POST',
    description: 'Update a child\'s tracker status (requires x-make-secret header)',
  })
}
