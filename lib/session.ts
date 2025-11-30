/**
 * Session Management Utilities
 * 
 * Simple cookie-based session using signed JWT tokens.
 * Stores customer ID to identify logged-in users accessing the tracker dashboard.
 */

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Session configuration
const SESSION_COOKIE_NAME = 'santa-session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30 days in seconds

// Get the secret key for JWT signing (from env or fallback for dev)
function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET || 'dev-session-secret-32-chars-minimum'
  return new TextEncoder().encode(secret)
}

// Session payload structure
export interface SessionPayload {
  customerId: string
  firstName: string
  lastName: string
  exp?: number
}

/**
 * Create a signed session token
 */
export async function createSessionToken(payload: Omit<SessionPayload, 'exp'>): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .setIssuedAt()
    .sign(getSecretKey())
  
  return token
}

/**
 * Verify and decode a session token
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    return payload as unknown as SessionPayload
  } catch {
    // Token is invalid, expired, or tampered with
    return null
  }
}

/**
 * Set session cookie with the token
 */
export async function setSessionCookie(payload: Omit<SessionPayload, 'exp'>): Promise<void> {
  const token = await createSessionToken(payload)
  const cookieStore = await cookies()
  
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

/**
 * Get current session from cookie
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  
  if (!token) {
    return null
  }
  
  return verifySessionToken(token)
}

/**
 * Clear session cookie (logout)
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * Middleware helper to set session cookie in API response
 */
export async function setSessionCookieInResponse(
  response: NextResponse,
  payload: Omit<SessionPayload, 'exp'>
): Promise<NextResponse> {
  const token = await createSessionToken(payload)
  
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
  
  return response
}

/**
 * Helper to redirect with session cookie set
 */
export async function redirectWithSession(
  url: string,
  payload: Omit<SessionPayload, 'exp'>
): Promise<NextResponse> {
  const response = NextResponse.redirect(new URL(url, process.env.NEXT_PUBLIC_APP_URL))
  return setSessionCookieInResponse(response, payload)
}
