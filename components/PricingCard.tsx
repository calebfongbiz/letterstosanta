/**
 * PricingCard Component
 * 
 * Beautiful pricing tier display with features list and CTA.
 */

import { cn } from '@/lib/utils'
import { Button } from './Button'
import Link from 'next/link'

export interface PricingCardProps {
  name: string
  price: number
  extraChildPrice?: number
  description: string
  features: string[]
  popular?: boolean
  ctaText?: string
  ctaLink?: string
  tier: 'FREE' | 'MAGIC'
}

export function PricingCard({
  name,
  price,
  extraChildPrice,
  description,
  features,
  popular = false,
  ctaText = 'Get Started',
  ctaLink,
  tier,
}: PricingCardProps) {
  const href = ctaLink || `/write-letter?tier=${tier}`

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-3xl p-8 transition-all duration-300',
        'bg-white/5 backdrop-blur-xl border border-white/10',
        popular && 'scale-105 border-gold/50 shadow-xl shadow-gold/20',
        'hover:border-white/20 hover:shadow-2xl'
      )}
    >
      {/* Popular badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-gold-dark via-gold to-gold-light text-midnight">
            ✨ Most Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="font-display text-2xl font-bold text-snow-cream mb-2">
          {name}
        </h3>
        <p className="text-snow-cream/60 text-sm">
          {description}
        </p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          {price === 0 ? (
            <span className="font-display text-5xl font-bold text-gold">FREE</span>
          ) : (
            <>
              <span className="font-display text-5xl font-bold text-snow-cream">
                ${price.toFixed(2)}
              </span>
            </>
          )}
        </div>
        {extraChildPrice && extraChildPrice > 0 && (
          <p className="text-snow-cream/50 text-sm mt-1">
            + ${extraChildPrice.toFixed(2)} per extra child
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-forest-green-light flex-shrink-0 mt-0.5"
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
            <span className="text-snow-cream/80 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link href={href} className="block">
        <Button
          variant={popular ? 'gold' : 'primary'}
          size="lg"
          className="w-full"
        >
          {ctaText}
        </Button>
      </Link>
    </div>
  )
}
