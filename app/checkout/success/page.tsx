/**
 * Checkout Success Page
 * 
 * Shown after successful Stripe payment.
 */

import Link from 'next/link'
import { Button, Card, SectionContainer } from '@/components'

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] pt-20">
      <SectionContainer size="md">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success animation */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-forest-green/20 border border-forest-green/30 mb-6 animate-bounce-soft">
              <span className="text-5xl">🎄</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-snow-cream mb-4">
              Payment Successful!
            </h1>
            <p className="text-snow-cream/70 text-lg">
              Thank you for your order! Your magical Christmas journey is about to begin.
            </p>
          </div>

          {/* Next steps card */}
          <Card variant="glass" className="p-8 text-left mb-8">
            <h2 className="font-display text-xl font-semibold text-snow-cream mb-6 text-center">
              What Happens Next?
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-santa-red/20 flex items-center justify-center">
                  <span className="font-display font-bold text-santa-red-light">1</span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">📧</span>
                    <h3 className="font-semibold text-snow-cream">Check Your Email</h3>
                  </div>
                  <p className="text-snow-cream/60 text-sm leading-relaxed">
                    You&apos;ll receive a confirmation email with your login details and tracking information.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-santa-red/20 flex items-center justify-center">
                  <span className="font-display font-bold text-santa-red-light">2</span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">🔑</span>
                    <h3 className="font-semibold text-snow-cream">Log In to Track</h3>
                  </div>
                  <p className="text-snow-cream/60 text-sm leading-relaxed">
                    Use your last name and passcode to access your family&apos;s magical tracker dashboard.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-santa-red/20 flex items-center justify-center">
                  <span className="font-display font-bold text-santa-red-light">3</span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">✨</span>
                    <h3 className="font-semibold text-snow-cream">Watch the Magic</h3>
                  </div>
                  <p className="text-snow-cream/60 text-sm leading-relaxed">
                    Over the next 5 days, watch your letter travel through magical locations on its way to Santa!
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/tracker-login">
              <Button variant="gold" size="lg">
                Go to Tracker Login
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg">
                Return Home
              </Button>
            </Link>
          </div>

          {/* Decorative footer message */}
          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="font-script text-xl text-gold mb-2">
              &ldquo;Ho ho ho! Your letter is on its way to me!&rdquo;
            </p>
            <p className="text-snow-cream/50 text-sm">— Santa Claus</p>
          </div>
        </div>
      </SectionContainer>
    </div>
  )
}
