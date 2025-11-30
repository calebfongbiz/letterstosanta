/**
 * Dashboard Page
 * 
 * Family dashboard showing all children's trackers.
 * Protected route - requires valid session.
 */

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { Button, Card, SectionContainer } from '@/components'
import { MILESTONE_DATA, hasTrackerAccess, hasSantaLetterAccess, type Milestone } from '@/lib/types'

// Child type for dashboard display
interface DashboardChild {
  id: string
  name: string
  age: number
  trackerId: string
  currentMilestone: Milestone
  milestoneIndex: number
  currentStoryText: string | null
  letter: {
    santaLetterPdfUrl: string | null
    niceListCertificateUrl: string | null
  } | null
}

export default async function DashboardPage() {
  // Check for valid session
  const session = await getSession()

  if (!session) {
    redirect('/tracker-login')
  }

  // Fetch customer with children
  const customer = await db.customer.findUnique({
    where: { id: session.customerId },
    include: {
      children: {
        include: {
          letter: true,
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!customer) {
    redirect('/tracker-login')
  }

  const canAccessTracker = hasTrackerAccess(customer.tier)
  const canAccessSantaLetter = hasSantaLetterAccess(customer.tier)

  return (
    <SectionContainer size="md">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-snow-cream mb-2">
              Welcome back, {customer.firstName}! 👋
            </h1>
            <p className="text-snow-cream/70">
              Here&apos;s the status of your family&apos;s letters to Santa
            </p>
          </div>

          <LogoutButton />
        </div>

        {/* Tier info */}
        <Card variant="glass" className="p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {customer.tier === 'FREE' ? '📧' : customer.tier === 'TRACKER' ? '✈️' : '🎅'}
            </span>
            <div>
              <p className="font-semibold text-snow-cream">
                {customer.tier === 'FREE'
                  ? 'Letter to Santa'
                  : customer.tier === 'TRACKER'
                  ? "Santa's Tracker"
                  : 'The Santa Experience'}
              </p>
              <p className="text-snow-cream/50 text-sm">
                {customer.children.length} child{customer.children.length !== 1 ? 'ren' : ''}
              </p>
            </div>
          </div>

          {customer.tier === 'FREE' && (
            <Link href="/#pricing">
              <Button variant="gold" size="sm">
                Upgrade
              </Button>
            </Link>
          )}
        </Card>

        {/* Children list */}
        <div className="space-y-6">
          <h2 className="font-display text-xl font-semibold text-snow-cream">
            Your Children&apos;s Letters
          </h2>

          {customer.children.length === 0 ? (
            <Card variant="glass" className="p-8 text-center">
              <span className="text-5xl mb-4 block">📭</span>
              <h3 className="font-display text-lg font-semibold text-snow-cream mb-2">
                No Letters Yet
              </h3>
              <p className="text-snow-cream/60 mb-4">
                Start your magical Christmas journey by writing a letter to Santa!
              </p>
              <Link href="/write-letter">
                <Button variant="gold">Write a Letter</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-4">
              {(customer.children as DashboardChild[]).map((child) => {
                const milestoneInfo = MILESTONE_DATA[child.currentMilestone]
                const progress = ((child.milestoneIndex + 1) / 6) * 100

                return (
                  <Card key={child.id} variant="glass" className="p-6" hover>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Child info */}
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">{milestoneInfo.icon}</span>
                          <div>
                            <h3 className="font-display text-lg font-semibold text-snow-cream">
                              {child.name}&apos;s Letter
                            </h3>
                            <p className="text-snow-cream/60 text-sm">Age {child.age}</p>
                          </div>
                        </div>

                        {/* Current status */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-snow-cream/70">
                              Currently at: <span className="text-gold">{milestoneInfo.name}</span>
                            </span>
                            <span className="text-snow-cream/50">{Math.round(progress)}%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-forest-green via-gold to-santa-red rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Story text preview */}
                        {child.currentStoryText && (
                          <p className="mt-3 text-snow-cream/60 text-sm italic line-clamp-2">
                            &ldquo;{child.currentStoryText}&rdquo;
                          </p>
                        )}

                        {/* Santa letter status */}
                        {canAccessSantaLetter && (
                          <div className="mt-3 flex items-center gap-4 text-sm">
                            {child.letter?.santaLetterPdfUrl ? (
                              <a
                                href={child.letter.santaLetterPdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gold hover:underline flex items-center gap-1"
                              >
                                📜 Download Santa&apos;s Letter
                              </a>
                            ) : (
                              <span className="text-snow-cream/40">
                                📜 Santa&apos;s letter pending...
                              </span>
                            )}
                            {child.letter?.niceListCertificateUrl ? (
                              <a
                                href={child.letter.niceListCertificateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gold hover:underline flex items-center gap-1"
                              >
                                ⭐ Nice List Certificate
                              </a>
                            ) : (
                              <span className="text-snow-cream/40">
                                ⭐ Certificate pending...
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action button */}
                      <div className="flex-shrink-0">
                        {canAccessTracker ? (
                          <Link href={`/track/${child.trackerId}`}>
                            <Button variant="primary" size="md">
                              View Tracker
                            </Button>
                          </Link>
                        ) : (
                          <Link href="/#pricing">
                            <Button variant="outline" size="md">
                              🔒 Unlock Tracker
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Add another letter */}
        {customer.children.length > 0 && (
          <div className="mt-8 text-center">
            <Link href="/write-letter">
              <Button variant="outline" size="lg">
                ✨ Write Another Letter
              </Button>
            </Link>
          </div>
        )}
      </div>
    </SectionContainer>
  )
}

// Client component for logout
function LogoutButton() {
  return (
    <form action="/api/auth/logout" method="POST">
      <button
        type="submit"
        className="px-4 py-2 text-sm text-snow-cream/60 hover:text-snow-cream transition-colors"
      >
        Sign Out
      </button>
    </form>
  )
}
