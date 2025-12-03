/**
 * Shared Types and Constants
 * 
 * Central location for type definitions, pricing, and milestone data.
 */

// Type definitions (matches Prisma schema enums)
export type LetterTier = 'FREE' | 'MAGIC'
export type Milestone = 'ELF_SORTING_STATION' | 'CANDY_CANE_FOREST' | 'REINDEER_RUNWAY' | 'AURORA_GATE' | 'SANTAS_DESK' | 'NORTH_POLE_WORKSHOP'

// ===========================================
// PRICING
// ===========================================

export const PRICING = {
  FREE: {
    tier: 'FREE' as LetterTier,
    name: 'Letter to Santa',
    tagline: 'The magical journey begins',
    price: 0,
    extraChildPrice: 0.99,
    features: [
      'Printable letter template with North Pole GPS seal',
      '5 daily magical story emails from Jingles the Elf',
      '"Delivered to Santa!" confirmation email',
      'Account status updates',
    ],
    notIncluded: [
      'Visual Flight Tracker',
      'Personalized Santa Reply PDF',
      'Nice List Certificate',
    ],
  },
  MAGIC: {
    tier: 'MAGIC' as LetterTier,
    name: "Santa's Magic",
    tagline: 'The complete magical experience',
    price: 7.99,
    extraChildPrice: 0.99,
    features: [
      'Everything in FREE tier',
      'Visual Flight Tracker - watch the journey unfold!',
      'Personalized Santa Reply PDF',
      'Nice List Certificate PDF',
    ],
    popular: true,
  },
} as const

// Physical letter add-on (priced separately based on shipping + Thankster cost)
export const PHYSICAL_LETTER_ADDON = {
  name: 'Physical Letter from Santa',
  description: 'Handwritten-style letter mailed to your home',
  basePrice: 0, // Will be calculated based on Thankster + shipping
  enabled: false, // Enable once pricing is determined
}

// ===========================================
// MILESTONE DATA
// ===========================================

// Order of milestones for the tracker (5 days + final delivery)
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
  icon: string
  defaultStory: string
  emailDay: number // Which day this email goes out (1-5, 0 for final)
}

export const MILESTONE_DATA: Record<Milestone, MilestoneInfo> = {
  ELF_SORTING_STATION: {
    id: 'ELF_SORTING_STATION',
    name: 'Elf Sorting Station',
    shortName: 'Sorting',
    description: 'Where magical elves receive and sort all incoming letters',
    icon: '📬',
    defaultStory: 'Your letter has arrived at the Elf Sorting Station! Jingles the Delivery Elf has been assigned as your letter\'s personal guide for this magical journey.',
    emailDay: 1,
  },
  CANDY_CANE_FOREST: {
    id: 'CANDY_CANE_FOREST',
    name: 'Candy Cane Forest',
    shortName: 'Forest',
    description: 'A magical forest of peppermint trees and candy cane paths',
    icon: '🍬',
    defaultStory: 'Your letter is traveling through the enchanted Candy Cane Forest! The Sugar Sprites are cheering it on as Jingles guides it through the peppermint paths.',
    emailDay: 2,
  },
  REINDEER_RUNWAY: {
    id: 'REINDEER_RUNWAY',
    name: 'Reindeer Runway',
    shortName: 'Runway',
    description: 'Where Santa\'s reindeer prepare for their magical flights',
    icon: '🦌',
    defaultStory: 'Your letter has reached Reindeer Runway! Dasher gave it an approving sniff, and Rudolph\'s nose glowed extra bright when he saw it.',
    emailDay: 3,
  },
  AURORA_GATE: {
    id: 'AURORA_GATE',
    name: 'Aurora Gate',
    shortName: 'Aurora',
    description: 'The shimmering northern lights gateway to Santa\'s realm',
    icon: '✨',
    defaultStory: 'Your letter is passing through the magnificent Aurora Gate! The northern lights wrapped around it, infusing it with extra North Pole magic.',
    emailDay: 4,
  },
  SANTAS_DESK: {
    id: 'SANTAS_DESK',
    name: "Santa's Workshop",
    shortName: 'Workshop',
    description: 'The final destination - Santa\'s Workshop at the North Pole',
    icon: '🎅',
    defaultStory: 'YOUR LETTER HAS BEEN DELIVERED! Santa himself read your letter with a warm smile and twinkling eyes. The magic of Christmas is now in full swing!',
    emailDay: 5,
  },
  NORTH_POLE_WORKSHOP: {
    id: 'NORTH_POLE_WORKSHOP',
    name: 'Delivered!',
    shortName: 'Delivered',
    description: 'Your letter has been delivered to Santa!',
    icon: '🎁',
    defaultStory: 'Your letter\'s journey is complete! It\'s now safely with Santa, who has shared your wishes with his team of master toymakers.',
    emailDay: 0, // Final confirmation, not a daily email
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
 * Check if a tier includes visual tracker access
 */
export function hasTrackerAccess(tier: LetterTier): boolean {
  return tier === 'MAGIC'
}

/**
 * Check if a tier includes Santa letter PDF
 */
export function hasSantaLetterAccess(tier: LetterTier): boolean {
  return tier === 'MAGIC'
}

/**
 * Generate a tracker URL for a child
 */
export function getTrackerUrl(trackerId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/track/${trackerId}`
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return price === 0 ? 'FREE' : `$${price.toFixed(2)}`
}
