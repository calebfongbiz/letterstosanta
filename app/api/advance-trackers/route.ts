/**
 * Advance Trackers API Route
 * 
 * POST /api/advance-trackers
 * Advances all children's trackers by 1 milestone.
 * Called daily by Make.com scheduler.
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Milestone order for progression
const MILESTONE_ORDER = [
  'ELF_SORTING_STATION',
  'CANDY_CANE_FOREST',
  'REINDEER_RUNWAY',
  'AURORA_GATE',
  'SANTAS_DESK',
  'NORTH_POLE_WORKSHOP',
] as const

// Story text for each milestone
const MILESTONE_STORIES: Record<string, string> = {
  ELF_SORTING_STATION: "Your letter has arrived at the Elf Sorting Station! Jingle and Twinkle are carefully reviewing your wishes and adding special sparkle dust for the journey ahead.",
  CANDY_CANE_FOREST: "Your letter is traveling through the enchanted Candy Cane Forest! The sweet scent of peppermint guides the way as snow fairies light the path with their glowing wands.",
  REINDEER_RUNWAY: "Your letter has reached the Reindeer Runway! Dasher and Dancer are preparing for the next leg of the journey. The northern lights are shimmering above!",
  AURORA_GATE: "Your letter is passing through the magical Aurora Gate! The northern lights create a dazzling display as your wishes float closer to Santa's workshop.",
  SANTAS_DESK: "Wonderful news! Your letter has arrived at Santa's Desk! Santa himself is reading your letter with a warm smile and twinkling eyes.",
  NORTH_POLE_WORKSHOP: "Your letter's journey is complete! It's now safely in Santa's workshop where the elves are busy making Christmas magic happen!",
}

export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization')
    const expectedToken = `Bearer ${process.env.CRON_SECRET || 'santa-cron-secret-2024'}`
    
    if (authHeader !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all children who haven't reached the final milestone
    const children = await db.child.findMany({
      where: {
        milestoneIndex: {
          lt: MILESTONE_ORDER.length - 1, // Not at final milestone yet
        },
      },
      include: {
        customer: true,
      },
    })

    let advancedCount = 0

    // Advance each child's tracker by 1 milestone
    for (const child of children) {
      const newIndex = child.milestoneIndex + 1
      const newMilestone = MILESTONE_ORDER[newIndex]
      const newStory = MILESTONE_STORIES[newMilestone]

      await db.child.update({
        where: { id: child.id },
        data: {
          milestoneIndex: newIndex,
          currentMilestone: newMilestone,
          currentStoryText: newStory,
        },
      })

      advancedCount++
    }

    console.log(`Advanced ${advancedCount} trackers`)

    return NextResponse.json({
      success: true,
      advancedCount,
      message: `Advanced ${advancedCount} trackers to next milestone`,
    })
  } catch (error) {
    console.error('Advance trackers error:', error)
    return NextResponse.json(
      { error: 'Failed to advance trackers' },
      { status: 500 }
    )
  }
}
