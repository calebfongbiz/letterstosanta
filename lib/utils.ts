/**
 * Utility Functions
 */

import { clsx, type ClassValue } from 'clsx'

/**
 * Combine class names with clsx
 * Simple alternative to tailwind-merge for class composition
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

/**
 * Generate a random alphanumeric string for tracker IDs
 */
export function generateTrackerId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Format currency for display
 */
export function formatPrice(price: number): string {
  if (price === 0) return 'FREE'
  return `$${price.toFixed(2)}`
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate passcode (4-6 characters, alphanumeric)
 */
export function isValidPasscode(passcode: string): boolean {
  return /^[a-zA-Z0-9]{4,6}$/.test(passcode)
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

/**
 * Delay execution (for animations/testing)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}
