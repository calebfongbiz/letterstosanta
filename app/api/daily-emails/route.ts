/**
 * Daily Story Emails API Route
 * 
 * GET /api/daily-emails
 * Returns all children grouped by milestone index (day) for sending story emails.
 * Called daily by Make.com scheduler.
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization')
    const expectedToken = `Bearer ${process.env.CRON_SECRET || 'santa-cron-secret-2024'}`
    
    if (authHeader !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all children with their customer info, grouped by milestone
    const children = await db.child.findMany({
      where: {
        milestoneIndex: {
          lt: 5, // Only get children who haven't completed the journey (0-4)
        },
      },
      include: {
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

    // Group children by milestone index (day)
    const groupedByDay: Record<number, Array<{
      childName: string
      childAge: number
      parentFirstName: string
      parentEmail: string
      tier: string
      milestoneIndex: number
    }>> = {
      0: [], // Day 1 - Elf Sorting Station
      1: [], // Day 2 - Candy Cane Forest
      2: [], // Day 3 - Reindeer Runway
      3: [], // Day 4 - Aurora Gate
      4: [], // Day 5 - Santa's Workshop (Delivered!)
    }

    for (const child of children) {
      const day = child.milestoneIndex
      if (day >= 0 && day <= 4) {
        groupedByDay[day].push({
          childName: child.name,
          childAge: child.age,
          parentFirstName: child.customer.firstName,
          parentEmail: child.customer.email,
          tier: child.customer.tier,
          milestoneIndex: day,
        })
      }
    }

    return NextResponse.json({
      success: true,
      // Each array contains children who should receive that day's email
      day1_elf_sorting: groupedByDay[0],
      day2_candy_cane: groupedByDay[1],
      day3_reindeer: groupedByDay[2],
      day4_aurora: groupedByDay[3],
      day5_delivered: groupedByDay[4],
      totalChildren: children.length,
    })
  } catch (error) {
    console.error('Daily emails API error:', error)
    return NextResponse.json(
      { error: 'Failed to get daily email data' },
      { status: 500 }
    )
  }
}
