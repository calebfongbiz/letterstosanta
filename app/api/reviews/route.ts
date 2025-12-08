import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Fetch approved reviews
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

// POST: Submit a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, comment, photoUrl } = body

    if (!name || !comment) {
      return NextResponse.json({ error: 'Name and comment are required' }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: {
        name,
        comment,
        photoUrl: photoUrl || null,
        approved: false,
      },
    })

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
