/**
 * Landing Page
 * 
 * Redesigned with warm Santa hero image background and new 2-tier pricing.
 */

import Link from 'next/link'
import Image from 'next/image'
import {
  ReviewCarousel,
  ReviewModal,
  Button,
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

      {/* Reviews */}
      <ReviewsSection />

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
// HERO SECTION - Redesigned with background image
// ============================================
function HeroSection() {
  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center overflow-hidden -mt-28 md:-mt-32">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/santa-hero.png"
          alt="Santa reading a letter"
          fill
          className="object-contain md:object-cover object-top md:object-center"
          priority
          quality={90}
        />
        {/* Overlay for better text readability on left side */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
      </div>

      {/* Snowfall effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-snowfall"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${4 + Math.random() * 6}px`,
              height: `${4 + Math.random() * 6}px`,
              opacity: 0.4 + Math.random() * 0.4,
              animationDuration: `${10 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-36 md:pt-20">
        <div className="max-w-2xl">
          {/* Trust line */}
          <p className="text-white/80 text-sm mb-4 font-medium">
            Trusted by parents. Loved by kids.
          </p>

          {/* Main headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Create a Christmas{' '}
            <span className="text-santa-red">Tradition</span> They&apos;ll Remember Forever
          </h1>

          {/* Rhyming description in frosted glass box */}
          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 md:p-6 mb-6 md:mb-8 border border-white/20 w-fit">
            <p className="text-white/90 text-sm md:text-lg leading-relaxed">
              Your child writes a letter with wonder and cheer...
              <br />
              Then tracks where it travels as Christmas draws near...
              <br />
              And Santa&apos;s reply soon arrives with good cheer
              <br />
              <span className="font-semibold text-white">
                A handwritten letter they&apos;ll treasure each year.
              </span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link href="/write-letter">
              <Button variant="primary" size="lg" className="text-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Start Your Letter Free
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg" className="text-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

// ============================================
// TRUST BAR
// ============================================
function TrustBar() {
  return (
    <div className="py-8 border-b border-gray-100 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            <span className="text-sm font-medium">100% Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="text-sm font-medium">New for 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">👨‍👩‍👧‍👦</span>
            <span className="text-sm font-medium">Made with Love</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💝</span>
            <span className="text-sm font-medium">Satisfaction Guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// HOW IT WORKS - Updated with physical letter instructions
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
    <section id="how-it-works" className="py-20 md:py-32 bg-gradient-to-b from-white to-red-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How the Magic Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A magical experience that combines real traditions with digital wonder
          </p>
        </div>

        {/* Video */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src="https://www.youtube.com/embed/RLxNhicjMJI"
              title="How Letters to Santa Works"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              <div className="flex flex-col items-center text-center p-8">
                {/* Step number */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full bg-santa-red flex items-center justify-center shadow-lg shadow-santa-red/30">
                    <span className="font-display text-2xl font-bold text-white">
                      {step.step}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
              
              {/* Connection line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-santa-red/50 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
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
      description: 'Receive charming email updates from Jingles the Elf as your letter makes its way to Santa.',
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
    <section id="features" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Magical Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to create the perfect Christmas experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
            >
              <span className="text-5xl mb-4 block group-hover:scale-110 transition-transform">
                {feature.icon}
              </span>
              <h3 className="font-display text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// TRACKER PREVIEW
// ============================================
function TrackerPreviewSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-midnight to-midnight-light text-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-gold/20 text-gold text-sm font-semibold mb-4">
              Visual Flight Tracker
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
              Watch Your Letter&apos;s Magical Journey
            </h2>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
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
                  <span className="w-6 h-6 rounded-full bg-forest-green/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-forest-green-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-white/80">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-white/50 text-sm italic mb-6">
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
                <div className="flex justify-between text-sm text-white/60 mb-2">
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
                ].map((stop) => (
                  <div
                    key={stop.name}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                      stop.current ? 'bg-gold/20 border border-gold/30' : stop.done ? 'bg-white/5' : 'opacity-40'
                    }`}
                  >
                    <span className={`text-2xl ${stop.current ? 'animate-bounce-soft' : ''}`}>{stop.icon}</span>
                    <span className={stop.done ? 'text-white' : 'text-white/50'}>{stop.name}</span>
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
      </div>
    </section>
  )
}

// ============================================
// PRICING - New 2-tier structure
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
      name: "🎄 Santa's Magic",
      price: 4.99,
      extraChildPrice: 0.99,
      description: 'The ULTIMATE Christmas experience your kids will never forget',
      tier: 'MAGIC' as const,
      popular: true,
      features: [
        '✅ Everything in the Free tier, PLUS...',
        '🎬 Magical Video Updates - watch Jingles the Elf carry your letter through 5 stunning locations to the North Pole!',
        '🎅 Personalized Letter FROM Santa - mentions your child by name, their wishes, and good deeds!',
        '📜 Official Nice List Certificate - frameable keepsake with your child\'s name!',
        'Add extra children (+$0.99 each)',
      ],
      ctaText: 'Get the Magic ✨',
    },
  ]

  return (
    <section id="pricing" className="py-20 md:py-32 bg-gradient-to-b from-red-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Christmas Magic
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Both plans include the printable letter template and daily story updates!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <PricingCardLight key={plan.tier} {...plan} />
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm mb-2">
            🎁 <strong>Coming Soon:</strong> Physical letter from Santa mailed to your home!
          </p>
          <p className="text-gray-400 text-xs">
            (Pay only shipping + printing costs)
          </p>
        </div>
      </div>
    </section>
  )
}

// Light theme pricing card
function PricingCardLight({
  name,
  price,
  extraChildPrice,
  description,
  features,
  popular = false,
  ctaText = 'Get Started',
  tier,
}: {
  name: string
  price: number
  extraChildPrice?: number
  description: string
  features: string[]
  popular?: boolean
  ctaText?: string
  tier: 'FREE' | 'MAGIC'
}) {
  const href = `/write-letter?tier=${tier}`

  return (
    <div
      className={`relative flex flex-col rounded-3xl p-8 transition-all duration-300 ${
        popular 
          ? 'bg-white scale-105 shadow-2xl border-2 border-santa-red' 
          : 'bg-white shadow-lg border border-gray-100 hover:shadow-xl'
      }`}
    >
      {/* Popular badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-santa-red text-white">
            ✨ Most Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">
          {name}
        </h3>
        <p className="text-gray-500 text-sm">
          {description}
        </p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          {price === 0 ? (
            <span className="font-display text-5xl font-bold text-santa-red">FREE</span>
          ) : (
            <>
              <span className="font-display text-5xl font-bold text-gray-900">
                ${price.toFixed(2)}
              </span>
            </>
          )}
        </div>
        {extraChildPrice && extraChildPrice > 0 && (
          <p className="text-gray-400 text-sm mt-1">
            + ${extraChildPrice.toFixed(2)} per extra child
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-forest-green flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-600 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link href={href} className="block">
        <Button
          variant={popular ? 'primary' : 'secondary'}
          size="lg"
          className="w-full"
        >
          {ctaText}
        </Button>
      </Link>
    </div>
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
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            The Story Behind Letters to Santa
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Created by a stepdad who wanted to keep the magic alive
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-gray-50 border border-gray-100"
            >
              {/* Rating stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-gold"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-santa-red to-forest-green flex items-center justify-center">
                  <span className="font-display font-bold text-white text-sm">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
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
      answer: 'Absolutely! You can add additional children for just $0.99 each. Each child gets their own letter, their own tracker journey, and their own personalized Santa response.',
    },
    {
      question: 'How long does it take for the letter to reach Santa?',
      answer: 'The magical journey typically takes 5 days, with your letter stopping at a new location each day. You\'ll receive email updates from Jingles the Elf and can watch progress on the tracker.',
    },
    {
      question: 'What\'s included in the personalized Santa letter?',
      answer: 'The Santa\'s Magic plan includes a beautifully designed PDF letter from Santa that references your child\'s specific letter, wishes, and the good things they\'ve done. It also includes a printable Nice List Certificate.',
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
    <section id="faq" className="py-20 md:py-32 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about Letters to Santa
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {faqs.map((faq, index) => (
            <FaqItemLight
              key={index}
              question={faq.question}
              answer={faq.answer}
              isLast={index === faqs.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqItemLight({ question, answer, isLast }: { question: string; answer: string; isLast: boolean }) {
  return (
    <details className={`group ${!isLast ? 'border-b border-gray-100' : ''}`}>
      <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
        <h3 className="font-display font-semibold text-lg text-gray-900 pr-4 group-hover:text-santa-red transition-colors">
          {question}
        </h3>
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-open:rotate-180 transition-transform">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </summary>
      <div className="px-6 pb-6">
        <p className="text-gray-600 leading-relaxed">
          {answer}
        </p>
      </div>
    </details>
  )
}

// ============================================
// FINAL CTA
// ============================================
function FinalCtaSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-red-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-6xl mb-6 block">🎄</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ready to Create Some Christmas Magic?
          </h2>
          <p className="text-gray-600 text-lg mb-10">
            Be one of the first families to make Letters to Santa part of their holiday tradition. 
            Start your child&apos;s magical journey today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/write-letter">
              <Button variant="primary" size="xl">
                Start Your Letter Free ✨
              </Button>
            </Link>
            <Link href="/tracker-login">
              <Button variant="ghost" size="xl" className="text-gray-600 hover:text-santa-red">
                Already Have a Letter? Track It →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// Reviews Section with carousel
function ReviewsSection() {
  return (
    <section id="reviews" className="py-20 md:py-32 bg-gradient-to-b from-white to-red-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            ❤️ Loved by Families
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what parents are saying about their magical experience
          </p>
        </div>
        
        <ReviewCarousel />
        
        <div className="text-center mt-8">
          <ReviewModal />
            
          
        </div>
      </div>
    </section>
  )
}
