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
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      children: {
        include: {
          letter: true,
        },
      },
    },
  })
  return NextResponse.json(customers)
}
