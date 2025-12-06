/**
 * Individual Tracker Page
 * 
 * Shows the flight-style tracker for a specific child's letter.
 * Validates that the logged-in user owns this tracker.
 */

import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { Button, Card, SectionContainer, TrackerTimeline, TrackerLocked } from '@/components'
import { hasTrackerAccess, hasSantaLetterAccess } from '@/lib/types'

interface TrackerPageProps {
  params: Promise<{
    trackerId: string
  }>
}

export default async function TrackerPage({ params }: TrackerPageProps) {
  const { trackerId } = await params

  // Check for valid session
  const session = await getSession()

  if (!session) {
    redirect('/tracker-login')
  }

  // Fetch the child with this tracker ID
  const child = await db.child.findUnique({
    where: { trackerId },
    include: {
      customer: true,
      letter: true,
    },
  })

  if (!child) {
    notFound()
  }

  // Verify the logged-in user owns this child's tracker
  if (child.customerId !== session.customerId) {
    redirect('/dashboard')
  }

  const canAccessTracker = hasTrackerAccess(child.customer.tier)
  const canAccessSantaLetter = hasSantaLetterAccess(child.customer.tier)
  const letterDelivered = child.milestoneIndex >= 4

  return (
    <SectionContainer size="lg">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-snow-cream/60 hover:text-snow-cream mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        {/* Tracker content */}
        {canAccessTracker ? (
          <>
            {/* Main tracker */}
            <Card variant="glass" className="p-6 md:p-8 mb-8">
              <TrackerTimeline
                currentMilestone={child.currentMilestone}
                milestoneIndex={child.milestoneIndex}
                storyText={child.currentStoryText}
                childName={child.name}
              />
            </Card>

            {/* Santa's Response notification for MAGIC tier when delivered */}
            {canAccessSantaLetter && letterDelivered && (
              <Card variant="gradient" className="p-6 md:p-8">
                <div className="text-center">
                  <span className="text-5xl mb-4 block">🎅</span>
                  <h3 className="font-display text-xl font-semibold text-snow-cream mb-2">
                    Santa&apos;s Response Has Been Sent!
                  </h3>
                  <p className="text-snow-cream/70 max-w-md mx-auto">
                    Check your email for a special letter from Santa and {child.name}&apos;s 
                    Official Nice List Certificate! 📧
                  </p>
                </div>
              </Card>
            )}

            {/* Waiting message for MAGIC tier before delivery */}
            {canAccessSantaLetter && !letterDelivered && (
              <Card variant="gradient" className="p-6 md:p-8">
                <div className="text-center">
                  <span className="text-5xl mb-4 block animate-bounce-soft">🎁</span>
                  <h3 className="font-display text-xl font-semibold text-snow-cream mb-2">
                    Santa&apos;s Response is Coming!
                  </h3>
                  <p className="text-snow-cream/70 max-w-md mx-auto">
                    Once {child.name}&apos;s letter reaches Santa&apos;s desk, you&apos;ll receive 
                    a personalized letter from Santa and an Official Nice List Certificate via email!
                  </p>
                </div>
              </Card>
            )}

            {/* Upgrade prompt for FREE tier */}
            {child.customer.tier === 'FREE' && (
              <Card variant="glass" className="p-6 mt-8 text-center">
                <span className="text-4xl mb-4 block">✨</span>
                <h3 className="font-display text-lg font-semibold text-snow-cream mb-2">
                  Want a Personal Letter from Santa?
                </h3>
                <p className="text-snow-cream/60 mb-4 max-w-md mx-auto">
                  Upgrade to Santa&apos;s Magic to receive a personalized Santa letter 
                  and Nice List Certificate for {child.name}!
                </p>
                <Link href="/#pricing">
                  <Button variant="gold">Upgrade to Santa&apos;s Magic - $7.99</Button>
                </Link>
              </Card>
            )}
          </>
        ) : (
          /* Locked state for free tier */
          <Card variant="glass" className="p-6 md:p-8">
            <TrackerLocked />
          </Card>
        )}

        {/* Letter preview */}
        <Card variant="glass" className="p-6 md:p-8 mt-8">
          <h3 className="font-display text-xl font-semibold text-snow-cream mb-4 flex items-center gap-2">
            <span>✉️</span>
            {child.name}&apos;s Letter to Santa
          </h3>
          
          <div className="space-y-4 text-snow-cream/80">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="whitespace-pre-wrap font-body leading-relaxed">
                {child.letter?.letterText}
              </p>
            </div>

            {child.letter?.wishlist && (
              <div>
                <h4 className="font-semibold text-snow-cream/60 text-sm mb-2">🎁 Wishlist</h4>
                <p className="text-sm">{child.letter.wishlist}</p>
              </div>
            )}

            {child.letter?.goodThings && (
              <div>
                <h4 className="font-semibold text-snow-cream/60 text-sm mb-2">⭐ Good Things Done</h4>
                <p className="text-sm">{child.letter.goodThings}</p>
              </div>
            )}

            {child.letter?.petsAndFamily && (
              <div>
                <h4 className="font-semibold text-snow-cream/60 text-sm mb-2">🐾 Pets & Family</h4>
                <p className="text-sm">{child.letter.petsAndFamily}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </SectionContainer>
  )
}
