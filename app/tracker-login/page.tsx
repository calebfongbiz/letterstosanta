/**
 * Tracker Login Page
 * 
 * Simple login form for accessing the family tracker dashboard.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Card, Input, SectionContainer } from '@/components'

export default function TrackerLoginPage() {
  const router = useRouter()
  const [lastName, setLastName] = useState('')
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!lastName.trim() || !passcode.trim()) {
      setError('Please enter both last name and passcode')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/tracker-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastName, passcode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] pt-20">
    <SectionContainer size="md">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-forest-green/20 border border-forest-green/30 mb-6">
            <span className="text-4xl">🔑</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-snow-cream mb-3">
            Track Your Letter
          </h1>
          <p className="text-snow-cream/70">
            Enter your details to access your family&apos;s tracker dashboard
          </p>
        </div>

        {/* Login Form */}
        <Card variant="glass" className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Your family last name"
              autoComplete="family-name"
            />

            <Input
              label="Passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Your 4-6 character passcode"
              autoComplete="current-password"
            />

            {error && (
              <div className="p-3 rounded-lg bg-santa-red/20 border border-santa-red/30 text-snow-cream text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Access Tracker
            </Button>
          </form>

          {/* Help text */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-snow-cream/50 text-sm">
              Don&apos;t have a letter yet?{' '}
              <Link href="/write-letter" className="text-gold hover:underline">
                Write to Santa
              </Link>
            </p>
          </div>
        </Card>

        {/* Additional info */}
        <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-snow-cream/60 text-sm">
            🔒 Your passcode was created when you submitted your letter. 
            It&apos;s the 4-6 character code you chose during registration.
          </p>
        </div>
      </div>
    </SectionContainer>
    </div>
  )
}
