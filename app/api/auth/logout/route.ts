/**
 * Logout API Route
 * 
 * POST /api/auth/logout
 * Clears the session cookie.
 */

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    // Clear the session cookie
    cookieStore.delete('santa-session')

    // Redirect to home page
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Also support GET for simple form submissions
  return POST()
}
