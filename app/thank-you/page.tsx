/**
 * Thank You Page
 * 
 * Confirmation page after letter submission.
 */

import Link from 'next/link'
import { Button, Card, SectionContainer } from '@/components'

export default function ThankYouPage() {
  return (
    <SectionContainer size="md">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success animation */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-forest-green/20 border border-forest-green/30 mb-6 animate-bounce-soft">
            <span className="text-5xl">✉️</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-snow-cream mb-4">
            Your Letter is on Its Way!
          </h1>
          <p className="text-snow-cream/70 text-lg">
            The magic has begun! Your letter has been received by Santa&apos;s helpers.
          </p>
        </div>

        {/* Next steps card */}
        <Card variant="glass" className="p-8 text-left mb-8">
          <h2 className="font-display text-xl font-semibold text-snow-cream mb-6 text-center">
            What Happens Next?
          </h2>

          <div className="space-y-6">
            <NextStep
              number={1}
              icon="📧"
              title="Check Your Email"
              description="You'll receive a confirmation email shortly with your tracking details and login information."
            />

            <NextStep
              number={2}
              icon="🔑"
              title="Log In to Track"
              description="Use your last name and passcode to log in at our tracker login page. You'll be able to see all your children's letter journeys from your family dashboard."
            />

            <NextStep
              number={3}
              icon="✨"
              title="Watch the Magic Unfold"
              description="Over the next few days, watch your letter travel through enchanted locations on its way to Santa. You'll also receive daily email updates from the elves!"
            />

            <NextStep
              number={4}
              icon="🎅"
              title="Santa's Response"
              description="If you chose The Santa Experience, you'll receive a personalized letter from Santa and a Nice List Certificate once your letter reaches the North Pole Workshop."
            />
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
            &ldquo;Ho ho ho! I can&apos;t wait to read your letter!&rdquo;
          </p>
          <p className="text-snow-cream/50 text-sm">— Santa Claus</p>
        </div>
      </div>
    </SectionContainer>
  )
}

function NextStep({
  number,
  icon,
  title,
  description,
}: {
  number: number
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-santa-red/20 flex items-center justify-center">
        <span className="font-display font-bold text-santa-red-light">{number}</span>
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{icon}</span>
          <h3 className="font-semibold text-snow-cream">{title}</h3>
        </div>
        <p className="text-snow-cream/60 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
