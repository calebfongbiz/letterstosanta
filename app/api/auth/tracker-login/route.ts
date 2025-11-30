/**
 * Tracker Login API Route
 * 
 * POST /api/auth/tracker-login
 * Authenticates a customer by last name and passcode.
 * Sets a session cookie on success.
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { setSessionCookieInResponse } from '@/lib/session'
import bcrypt from 'bcryptjs'

interface LoginRequest {
  lastName: string
  passcode: string
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()

    // Validate input
    if (!body.lastName?.trim()) {
      return NextResponse.json(
        { error: 'Last name is required' },
        { status: 400 }
      )
    }

    if (!body.passcode?.trim()) {
      return NextResponse.json(
        { error: 'Passcode is required' },
        { status: 400 }
      )
    }

    // Find customer by last name (case insensitive)
    // Note: In production with many users, you might want to add
    // additional identifying info like email or a unique family code
    const customers = await db.customer.findMany({
      where: {
        lastName: {
          equals: body.lastName.trim(),
          mode: 'insensitive',
        },
      },
    })

    if (customers.length === 0) {
      return NextResponse.json(
        { error: 'No account found with that last name' },
        { status: 401 }
      )
    }

    // Try to match passcode against each customer with this last name
    let matchedCustomer = null
    for (const customer of customers) {
      const isMatch = await bcrypt.compare(body.passcode, customer.passcodeHash)
      if (isMatch) {
        matchedCustomer = customer
        break
      }
    }

    if (!matchedCustomer) {
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
        id: matchedCustomer.id,
        firstName: matchedCustomer.firstName,
        lastName: matchedCustomer.lastName,
      },
    })

    // Set session cookie
    await setSessionCookieInResponse(response, {
      customerId: matchedCustomer.id,
      firstName: matchedCustomer.firstName,
      lastName: matchedCustomer.lastName,
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
