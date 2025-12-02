/**
 * Shared Types and Constants
 * 
 * Central location for type definitions, pricing, and milestone data.
 */

// Type definitions (matches Prisma schema enums)
export type LetterTier = 'FREE' | 'TRACKER' | 'EXPERIENCE'
export type Milestone = 'ELF_SORTING_STATION' | 'CANDY_CANE_FOREST' | 'REINDEER_RUNWAY' | 'AURORA_GATE' | 'SANTAS_DESK' | 'NORTH_POLE_WORKSHOP'

// ===========================================
// PRICING
// ===========================================

export const PRICING = {
  FREE: {
    tier: 'FREE' as LetterTier,
    name: 'Letter to Santa',
    price: 0,
    extraChildPrice: 0, // Free tier doesn't support extra children
  },
  TRACKER: {
    tier: 'TRACKER' as LetterTier,
    name: "Santa's Tracker",
    price: 14.99,
    extraChildPrice: 2.99,
  },
  EXPERIENCE: {
    tier: 'EXPERIENCE' as LetterTier,
    name: 'The Santa Experience',
    price: 19.99,
    extraChildPrice: 2.99,
  },
} as const

// ===========================================
// MILESTONE DATA
// ===========================================

// Order of milestones for the tracker
export const MILESTONE_ORDER: Milestone[] = [
  'ELF_SORTING_STATION',
  'CANDY_CANE_FOREST',
  'REINDEER_RUNWAY',
  'AURORA_GATE',
  'SANTAS_DESK',
  'NORTH_POLE_WORKSHOP',
]

// Milestone display information
export interface MilestoneInfo {
  id: Milestone
  name: string
  shortName: string
  description: string
  icon: string // Emoji for now, could be replaced with actual icons
  defaultStory: string
}

export const MILESTONE_DATA: Record<Milestone, MilestoneInfo> = {
  ELF_SORTING_STATION: {
    id: 'ELF_SORTING_STATION',
    name: 'Elf Sorting Station',
    shortName: 'Sorting',
    description: 'Where magical elves receive and sort all incoming letters',
    icon: '📬',
    defaultStory: 'Your letter has arrived at the Elf Sorting Station! Jingle and Twinkle are carefully reviewing your wishes and adding special sparkle dust for the journey ahead.',
  },
  CANDY_CANE_FOREST: {
    id: 'CANDY_CANE_FOREST',
    name: 'Candy Cane Forest',
    shortName: 'Forest',
    description: 'A magical forest of peppermint trees and candy cane paths',
    icon: '🍬',
    defaultStory: 'Your letter is traveling through the enchanted Candy Cane Forest! The sweet scent of peppermint guides the way as snow fairies light the path with their glowing wands.',
  },
  REINDEER_RUNWAY: {
    id: 'REINDEER_RUNWAY',
    name: 'Reindeer Runway',
    shortName: 'Runway',
    description: 'Where Santa\'s reindeer prepare for their magical flights',
    icon: '🦌',
    defaultStory: 'Arriving at Reindeer Runway! Dasher and Dancer have given your letter their stamp of approval, and it\'s now being loaded onto the express sleigh to the North Pole.',
  },
  AURORA_GATE: {
    id: 'AURORA_GATE',
    name: 'Aurora Gate',
    shortName: 'Aurora',
    description: 'The shimmering northern lights gateway to Santa\'s realm',
    icon: '✨',
    defaultStory: 'Your letter is passing through the magnificent Aurora Gate! The dancing northern lights are guiding it safely into the heart of the North Pole.',
  },
  SANTAS_DESK: {
    id: 'SANTAS_DESK',
    name: "Santa's Desk",
    shortName: 'Santa',
    description: 'Where Santa personally reads each and every letter',
    icon: '🎅',
    defaultStory: 'Amazing news! Your letter has reached Santa\'s Desk! Santa himself is reading your letter with his reading glasses and a warm cup of cocoa.',
  },
  NORTH_POLE_WORKSHOP: {
    id: 'NORTH_POLE_WORKSHOP',
    name: 'North Pole Workshop',
    shortName: 'Workshop',
    description: 'The final destination where holiday magic happens',
    icon: '🎁',
    defaultStory: 'Your letter has completed its journey to the North Pole Workshop! Santa has shared your wishes with his team of master toymakers. The magic of Christmas is now in full swing!',
  },
}

// ===========================================
// FORM TYPES
// ===========================================

export interface ChildFormData {
  name: string
  age: number
  letterText: string
  wishlist: string
  goodThings: string
  petsAndFamily: string
  photoFile?: File | null
}

export interface OrderFormData {
  parentFirstName: string
  parentLastName: string
  parentEmail: string
  passcode: string
  tier: LetterTier
  children: ChildFormData[]
}

// ===========================================
// API TYPES
// ===========================================

// Webhook payload sent to Make.com when a new order is created
export interface MakeWebhookNewOrderPayload {
  orderId: string
  customer: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  tier: LetterTier
  extraChildrenCount: number
  totalPrice: number
  children: Array<{
    id: string
    name: string
    age: number
    trackerId: string
    trackerUrl: string
    letter: {
      id: string
      letterText: string
      wishlist: string | null
      goodThings: string | null
      petsAndFamily: string | null
      photoUrl: string | null
    }
  }>
  createdAt: string
}

// Payload received from Make.com to update tracker status
export interface TrackerUpdatePayload {
  trackerId: string
  milestone: Milestone
  milestoneIndex: number
  storyText?: string
  santaLetterPdfUrl?: string
  niceListCertificateUrl?: string
}

// ===========================================
// HELPERS
// ===========================================

/**
 * Calculate total price for an order
 */
export function calculateOrderPrice(tier: LetterTier, childrenCount: number): number {
  const pricing = PRICING[tier]
  const basePrice = pricing.price
  const extraChildren = Math.max(0, childrenCount - 1)
  const extraChildrenCost = extraChildren * pricing.extraChildPrice
  
  return basePrice + extraChildrenCost
}

/**
 * Get milestone index from milestone enum value
 */
export function getMilestoneIndex(milestone: Milestone): number {
  return MILESTONE_ORDER.indexOf(milestone)
}

/**
 * Get milestone from index
 */
export function getMilestoneFromIndex(index: number): Milestone {
  return MILESTONE_ORDER[Math.min(index, MILESTONE_ORDER.length - 1)]
}

/**
 * Check if a tier includes tracker access
 */
export function hasTrackerAccess(tier: LetterTier): boolean {
  return tier === 'TRACKER' || tier === 'EXPERIENCE'
}

/**
 * Check if a tier includes Santa letter
 */
export function hasSantaLetterAccess(tier: LetterTier): boolean {
  return tier === 'EXPERIENCE'
}

/**
 * Generate a tracker URL for a child
 */
export function getTrackerUrl(trackerId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/track/${trackerId}`
}
