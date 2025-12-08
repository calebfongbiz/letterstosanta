import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'santa2024'

function checkAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
    return false
  }
  return true
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(reviews)
}

export async function PATCH(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id, approved } = await request.json()
  const review = await prisma.review.update({
    where: { id },
    data: { approved },
  })
  return NextResponse.json(review)
}

export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 })
  }
  await prisma.review.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
