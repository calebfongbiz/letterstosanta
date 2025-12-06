/**
 * Landing Page
 * 
 * Main marketing page with hero, features, pricing, and more.
 */

import Link from 'next/link'
import {
  Button,
  SectionContainer,
  SectionTitle,
  PricingCard,
  FeatureCard,
  StepCard,
  TestimonialCard,
  FaqSection,
  Card,
} from '@/components'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Trust Bar */}
      <TrustBar />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Features */}
      <FeaturesSection />

      {/* Tracker Preview */}
      <TrackerPreviewSection />

      {/* Pricing */}
      <PricingSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQ */}
      <FaqSectionWrapper />

      {/* Final CTA */}
      <FinalCtaSection />
    </>
  )
}

// ============================================
// HERO SECTION
// ============================================
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient and decorations */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large blurred shapes */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-santa-red/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-forest-green/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust line */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
            <span className="text-gold">⭐</span>
            <span className="text-snow-cream/70 text-sm">✨ Just launched for Christmas 2025!</span>
          </div>

          {/* Main headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-snow-cream mb-6 animate-slide-up">
            Create a Christmas Tradition{' '}
            <span className="gradient-text">They&apos;ll Remember Forever</span>
          </h1>

          {/* Rhyming intro in blurred panel */}
          <div className="glass-card p-6 md:p-8 mb-10 max-w-2xl mx-auto animate-slide-up animation-delay-200">
            <p className="font-script text-xl md:text-2xl text-gold leading-relaxed">
              &ldquo;A letter to Santa, sent with love and care,<br />
              Tracked through magical lands, floating through air.<br />
              Watch its journey from your home so bright,<br />
              To the North Pole workshop, on Christmas night.&rdquo;
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-300">
            <Link href="/write-letter">
              <Button variant="gold" size="xl">
                Write Your Letter to Santa ✨
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="xl">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-12 animate-fade-in animation-delay-500">
            <Badge icon="📧" text="Magical Email Updates" />
            <Badge icon="✈️" text="Flight-Style Tracker" />
            <Badge icon="🎅" text="Personalized Santa Reply" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-snow-cream/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

function Badge({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
      <span>{icon}</span>
      <span className="text-snow-cream/70 text-sm">{text}</span>
    </div>
  )
}

// ============================================
// TRUST BAR
// ============================================
function TrustBar() {
  return (
    <div className="py-8 border-y border-white/5 bg-white/[0.02]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-snow-cream/40">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            <span className="text-sm">100% Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="text-sm">New for 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">👨‍👩‍👧‍👦</span>
            <span className="text-sm">Made with Love</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💝</span>
            <span className="text-sm">Satisfaction Guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// HOW IT WORKS
// ============================================
function HowItWorksSection() {
  const steps = [
    {
      step: 1,
      title: 'Your Child Writes a Letter',
      description: 'Have your little one write or draw their letter to Santa the old-fashioned way. Then "mail" it together – put it in your mailbox, leave it by the fireplace, or create your own magical tradition!',
    },
    {
      step: 2,
      title: 'Parents Log the Details',
      description: 'Once the letter is "sent," secretly fill out our form with your child\'s wishes, good deeds, and any special details you want Santa to know. This powers the magic behind the scenes!',
    },
    {
      step: 3,
      title: 'Track & Experience the Magic',
      description: 'Watch the letter travel through enchanted lands together! With paid tiers, receive a personalized reply from Santa and a Nice List Certificate.',
    },
  ]

  return (
    <SectionContainer id="how-it-works" variant="gradient" withPattern>
      <SectionTitle
        title="How the Magic Works"
        subtitle="A magical experience that combines real traditions with digital wonder"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {steps.map((step, index) => (
          <div key={step.step} className="relative">
            <StepCard {...step} />
            
            {/* Connection line (desktop only) */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gold/50 to-transparent" />
            )}
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}

// ============================================
// FEATURES
// ============================================
function FeaturesSection() {
  const features = [
    {
      icon: '✉️',
      title: 'Easy Letter Writing',
      description: 'Our guided form makes it simple to capture your child\'s wishes, dreams, and the good things they\'ve done this year.',
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Multiple Children Support',
      description: 'Add all your children to the same account. Each child gets their own letter, tracker, and personalized experience.',
    },
    {
      icon: '📍',
      title: 'Real-Time Tracking',
      description: 'Watch the letter\'s journey through 6 magical locations with our beautiful flight-style tracker.',
    },
    {
      icon: '📱',
      title: 'Daily Elf Updates',
      description: 'Receive charming email updates from the elves as your letter makes its way to Santa.',
    },
    {
      icon: '🎅',
      title: 'Personalized Santa Letter',
      description: 'Each child receives a uniquely crafted response from Santa that references their specific letter.',
    },
    {
      icon: '📜',
      title: 'Nice List Certificate',
      description: 'A beautiful printable certificate confirming your child\'s place on Santa\'s Nice List.',
    },
  ]

  return (
    <SectionContainer id="features" size="lg">
      <SectionTitle
        title="Magical Features"
        subtitle="Everything you need to create the perfect Christmas experience"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </SectionContainer>
  )
}

// ============================================
// TRACKER PREVIEW
// ============================================
function TrackerPreviewSection() {
  return (
    <SectionContainer variant="dark" size="lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div>
          <span className="inline-block px-4 py-1 rounded-full bg-gold/20 text-gold text-sm font-semibold mb-4">
            Flight-Style Tracker
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-snow-cream mb-6">
            Watch Your Letter&apos;s Magical Journey
          </h2>
          <p className="text-snow-cream/70 text-lg mb-8 leading-relaxed">
            Our beautiful tracker shows your letter traveling through enchanted locations on its way to Santa. 
            Each stop comes alive with animations and story updates that bring the magic of Christmas to life.
          </p>

          <ul className="space-y-4 mb-8">
            {[
              'Elf Sorting Station – Where magic begins',
              'Candy Cane Forest – Through peppermint trees',
              'Reindeer Runway – Where Dasher approves',
              'Aurora Gate – Under northern lights',
              'Santa\'s Desk – Personal reading time',
              'North Pole Workshop – Journey complete!',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-forest-green/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-forest-green-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-snow-cream/80">{item}</span>
              </li>
            ))}
          </ul>

          <p className="text-snow-cream/50 text-sm italic mb-6">
            * Visual Flight Tracker included with Santa&apos;s Magic plan
          </p>

          <Link href="/write-letter?tier=MAGIC">
            <Button variant="gold" size="lg">
              Get Tracker Access
            </Button>
          </Link>
        </div>

        {/* Preview mockup */}
        <div className="relative">
          <Card variant="glass" className="p-6 md:p-8">
            {/* Mock progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-snow-cream/60 mb-2">
                <span>Emma&apos;s Letter Journey</span>
                <span className="text-gold">67% Complete</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-forest-green via-gold to-santa-red rounded-full" />
              </div>
            </div>

            {/* Mock timeline */}
            <div className="space-y-4">
              {[
                { icon: '📬', name: 'Elf Sorting Station', done: true },
                { icon: '🍬', name: 'Candy Cane Forest', done: true },
                { icon: '🦌', name: 'Reindeer Runway', done: true },
                { icon: '✨', name: 'Aurora Gate', done: true, current: true },
                { icon: '🎅', name: "Santa's Desk", done: false },
                { icon: '🎁', name: 'North Pole Workshop', done: false },
              ].map((stop, i) => (
                <div
                  key={stop.name}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                    stop.current ? 'bg-gold/20 border border-gold/30' : stop.done ? 'bg-white/5' : 'opacity-40'
                  }`}
                >
                  <span className={`text-2xl ${stop.current ? 'animate-bounce-soft' : ''}`}>{stop.icon}</span>
                  <span className={stop.done ? 'text-snow-cream' : 'text-snow-cream/50'}>{stop.name}</span>
                  {stop.done && !stop.current && (
                    <svg className="w-5 h-5 text-forest-green-light ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {stop.current && (
                    <span className="ml-auto text-xs text-gold font-semibold">NOW</span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Decorative glow */}
          <div className="absolute -inset-4 bg-gold/10 blur-3xl rounded-full -z-10" />
        </div>
      </div>
    </SectionContainer>
  )
}

// ============================================
// PRICING
// ============================================
function PricingSection() {
  const plans = [
    {
      name: 'Letter to Santa',
      price: 0,
      extraChildPrice: 0.99,
      description: 'The magical journey begins',
      tier: 'FREE' as const,
      features: [
        'Printable letter template with North Pole GPS seal',
        '5 daily magical story emails from Jingles the Elf',
        '"Delivered to Santa!" confirmation email',
        'Account status updates',
        'Add extra children (+$0.99 each)',
      ],
      ctaText: 'Start Free',
    },
    {
      name: "Santa's Magic",
      price: 7.99,
      extraChildPrice: 0.99,
      description: 'The complete magical experience',
      tier: 'MAGIC' as const,
      popular: true,
      features: [
        'Everything in Letter to Santa',
        'Visual Flight Tracker - watch the journey!',
        'Personalized Santa Reply PDF',
        'Nice List Certificate PDF',
        'Add extra children (+$0.99 each)',
      ],
      ctaText: 'Get the Magic ✨',
    },
  ]

  return (
    <SectionContainer id="pricing" variant="gradient" size="lg">
      <SectionTitle
        title="Choose Your Christmas Magic"
        subtitle="Both plans include the printable letter template and daily story updates!"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <PricingCard key={plan.tier} {...plan} />
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-snow-cream/70 text-sm mb-2">
          🎁 <strong>Coming Soon:</strong> Physical letter from Santa mailed to your home!
        </p>
        <p className="text-snow-cream/50 text-xs">
          (Pay only shipping + printing costs)
        </p>
      </div>
    </SectionContainer>
  )
}

// ============================================
// TESTIMONIALS
// ============================================
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "I built this for my 8-year-old stepdaughter. She asked me how Santa actually gets her letter, and I didn't have an answer. Now she tracks it traveling to the North Pole every morning and her face lights up every time.",
      author: 'Caleb',
      location: 'Creator & Stepdad',
      rating: 5,
    },
    {
      quote: "This is our first Christmas offering Letters to Santa to families everywhere. We put our hearts into every detail - from Jingles the Elf's daily updates to Santa's personalized reply.",
      author: 'Letters to Santa Team',
      location: 'North Pole HQ 🎅',
      rating: 5,
    },
    {
      quote: "Be one of our first families to experience the magic! We'd love to hear how your kids react to tracking their letter and getting Santa's response.",
      author: 'Join Us',
      location: 'Christmas 2025',
      rating: 5,
    },
  ]

  return (
    <SectionContainer size="lg">
      <SectionTitle
        title="The Story Behind Letters to Santa"
        subtitle="Created by a stepdad who wanted to keep the magic alive"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {testimonials.map((testimonial, i) => (
          <TestimonialCard key={i} {...testimonial} />
        ))}
      </div>
    </SectionContainer>
  )
}

// ============================================
// FAQ
// ============================================
function FaqSectionWrapper() {
  const faqs = [
    {
      question: 'How does the letter tracking work?',
      answer: 'After submitting your letter, you\'ll receive login credentials to access your family dashboard. From there, you can watch your letter travel through 6 magical locations on our flight-style tracker. Each location activates with animations and story updates as your letter progresses.',
    },
    {
      question: 'Can I add multiple children?',
      answer: 'Absolutely! On our paid plans (Santa\'s Tracker and The Santa Experience), you can add additional children for just $2.99 each. Each child gets their own letter, their own tracker journey, and their own personalized Santa response.',
    },
    {
      question: 'How long does it take for the letter to reach Santa?',
      answer: 'The magical journey typically takes 5-7 days, with your letter stopping at a new location each day. You\'ll receive email updates from the elves and can watch progress on the tracker.',
    },
    {
      question: 'What\'s included in the personalized Santa letter?',
      answer: 'The Santa Experience includes a beautifully designed PDF letter from Santa that references your child\'s specific letter, wishes, and the good things they\'ve done. It also includes a printable Nice List Certificate.',
    },
    {
      question: 'Is this suitable for all ages?',
      answer: 'Yes! Our experience is designed to be magical for children of all ages who believe in Santa. Parents can customize the letter content based on their child\'s age and interests.',
    },
    {
      question: 'How do I access the tracker?',
      answer: 'After placing your order, you\'ll create a simple account with your last name and a 4-6 digit passcode. Use these credentials at our tracker login page to access your family dashboard and view all your children\'s trackers.',
    },
  ]

  return (
    <SectionContainer id="faq" variant="dark" size="lg">
      <SectionTitle
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about Letters to Santa"
      />

      <FaqSection faqs={faqs} />
    </SectionContainer>
  )
}

// ============================================
// FINAL CTA
// ============================================
function FinalCtaSection() {
  return (
    <SectionContainer size="lg">
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-6xl mb-6 block">🎄</span>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-snow-cream mb-6">
          Ready to Create Some Christmas Magic?
        </h2>
        <p className="text-snow-cream/70 text-lg mb-10">
          Join thousands of families who have made Letters to Santa part of their holiday tradition. 
          Start your child&apos;s magical journey today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/write-letter">
            <Button variant="gold" size="xl">
              Write to Santa Now ✨
            </Button>
          </Link>
          <Link href="/tracker-login">
            <Button variant="outline" size="xl">
              Already Have a Letter? Track It
            </Button>
          </Link>
        </div>
      </div>
    </SectionContainer>
  )
}
