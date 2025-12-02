/**
 * Individual Tracker Page
 * 
 * Kid-friendly view of the letter's journey to Santa.
 * No business/pricing elements visible.
 */

import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { Card, SectionContainer, TrackerTimeline, TrackerLocked } from '@/components'
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

  return (
    <SectionContainer size="lg">
      <div className="max-w-4xl mx-auto py-8">
        {/* Small back link for parents - subtle so kids don't notice */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 mb-6 transition-colors text-sm"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Parent Dashboard
        </Link>

        {/* Tracker content */}
        {canAccessTracker ? (
          <>
            {/* Main tracker - the magical experience! */}
            <Card variant="glass" className="p-6 md:p-8 mb-8">
              <TrackerTimeline
                currentMilestone={child.currentMilestone}
                milestoneIndex={child.milestoneIndex}
                storyText={child.currentStoryText}
                childName={child.name}
              />
            </Card>

            {/* Santa letter section for Experience tier - kid-friendly */}
            {canAccessSantaLetter && (child.letter?.santaLetterPdfUrl || child.letter?.niceListCertificateUrl) && (
              <Card variant="gradient" className="p-6 md:p-8 mb-8">
                <h3 className="font-display text-xl font-semibold text-snow-cream mb-4 text-center">
                  🎅 A Special Message from Santa! 🎅
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {child.letter?.santaLetterPdfUrl && (
                    <a
                      href={child.letter.santaLetterPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <span className="text-4xl">📜</span>
                      <div>
                        <p className="font-semibold text-snow-cream">Santa&apos;s Letter</p>
                        <p className="text-snow-cream/60 text-sm">Click to read!</p>
                      </div>
                    </a>
                  )}
                  {child.letter?.niceListCertificateUrl && (
                    <a
                      href={child.letter.niceListCertificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <span className="text-4xl">⭐</span>
                      <div>
                        <p className="font-semibold text-snow-cream">Nice List Certificate</p>
                        <p className="text-snow-cream/60 text-sm">You made it!</p>
                      </div>
                    </a>
                  )}
                </div>
              </Card>
            )}

            {/* Letter preview - what the child wrote */}
            <Card variant="glass" className="p-6 md:p-8">
              <h3 className="font-display text-xl font-semibold text-snow-cream mb-4 text-center">
                ✉️ {child.name}&apos;s Letter to Santa ✉️
              </h3>
              
              <div className="space-y-4 text-snow-cream/80">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="whitespace-pre-wrap font-body leading-relaxed">
                    {child.letter?.letterText}
                  </p>
                </div>

                {child.letter?.wishlist && (
                  <div className="text-center">
                    <h4 className="font-semibold text-gold text-sm mb-2">🎁 Wishlist</h4>
                    <p className="text-sm">{child.letter.wishlist}</p>
                  </div>
                )}
              </div>
            </Card>
          </>
        ) : (
          /* Locked state for free tier - parent needs to upgrade */
          <Card variant="glass" className="p-6 md:p-8">
            <TrackerLocked />
          </Card>
        )}
      </div>
    </SectionContainer>
  )
}
