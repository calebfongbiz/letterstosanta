/**
 * Tracker Login API Route
 * 
 * POST /api/auth/tracker-login
 * Authenticates a customer by email and passcode.
 * Sets a session cookie on success.
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { setSessionCookieInResponse } from '@/lib/session'
import bcrypt from 'bcryptjs'

interface LoginRequest {
  email: string
  passcode: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()

    // Validate input
    if (!body.email?.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!body.passcode?.trim()) {
      return NextResponse.json(
        { error: 'Passcode is required' },
        { status: 400 }
      )
    }

    // Find customer by email (case insensitive)
    const customer = await db.customer.findFirst({
      where: {
        email: {
          equals: body.email.trim().toLowerCase(),
          mode: 'insensitive',
        },
      },
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'No account found with that email' },
        { status: 401 }
      )
    }

    // Verify passcode
    const isMatch = await bcrypt.compare(body.passcode, customer.passcodeHash)
    
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid passcode' },
        { status: 401 }
      )
    }

    // Create session response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      customer: {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
    })

    // Set session cookie
    await setSessionCookieInResponse(response, {
      customerId: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}
