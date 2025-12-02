/**
 * Upgrade Success Page
 * 
 * Shown after successful upgrade payment.
 * Updates the customer's tier in the database.
 */

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button, Card, SectionContainer } from '@/components'

export default function UpgradeSuccessPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (sessionId) {
      // Call API to complete the upgrade
      fetch('/api/upgrade/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setStatus('success')
          } else {
            setStatus('error')
          }
        })
        .catch(() => {
          setStatus('error')
        })
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] pt-20">
      <SectionContainer size="md">
        <div className="max-w-2xl mx-auto text-center">
          {status === 'loading' && (
            <>
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gold/20 border border-gold/30 mb-6 animate-pulse">
                <span className="text-5xl">⏳</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-snow-cream mb-4">
                Processing Your Upgrade...
              </h1>
              <p className="text-snow-cream/70 text-lg">
                Please wait while we upgrade your account.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-forest-green/20 border border-forest-green/30 mb-6">
                <span className="text-5xl">🎄</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-snow-cream mb-4">
                Upgrade Successful!
              </h1>
              <p className="text-snow-cream/70 text-lg mb-8">
                Your account has been upgraded. Enjoy your enhanced magical experience!
              </p>

              <Card variant="glass" className="p-8 mb-8">
                <h2 className="font-display text-xl font-semibold text-snow-cream mb-4">
                  What&apos;s New For You
                </h2>
                <ul className="text-left text-snow-cream/70 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-forest-green">✓</span>
                    Access to the magical flight tracker
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-forest-green">✓</span>
                    Watch your letter travel to the North Pole
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-forest-green">✓</span>
                    Daily milestone updates with videos
                  </li>
                </ul>
              </Card>

              <Link href="/dashboard">
                <Button variant="gold" size="lg">
                  Go to Your Dashboard
                </Button>
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-santa-red/20 border border-santa-red/30 mb-6">
                <span className="text-5xl">😕</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-snow-cream mb-4">
                Something Went Wrong
              </h1>
              <p className="text-snow-cream/70 text-lg mb-8">
                We had trouble processing your upgrade. Your payment may have been received - please contact support.
              </p>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  Return to Dashboard
                </Button>
              </Link>
            </>
          )}
        </div>
      </SectionContainer>
    </div>
  )
}
