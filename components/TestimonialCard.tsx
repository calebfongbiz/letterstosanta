/**
 * TestimonialCard Component
 * 
 * Display customer testimonials with avatar and rating.
 */

import { cn } from '@/lib/utils'

export interface TestimonialCardProps {
  quote: string
  author: string
  location?: string
  rating?: number
  avatarInitials?: string
  className?: string
}

export function TestimonialCard({
  quote,
  author,
  location,
  rating = 5,
  avatarInitials,
  className,
}: TestimonialCardProps) {
  const initials = avatarInitials || author.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <div
      className={cn(
        'flex flex-col p-6 md:p-8 rounded-2xl',
        'bg-white/5 backdrop-blur-sm border border-white/10',
        'transition-all duration-300 hover:bg-white/10',
        className
      )}
    >
      {/* Rating stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={cn(
              'w-5 h-5',
              i < rating ? 'text-gold' : 'text-white/20'
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-snow-cream/90 text-lg leading-relaxed mb-6 flex-grow">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-santa-red to-forest-green flex items-center justify-center">
          <span className="font-display font-bold text-white text-sm">
            {initials}
          </span>
        </div>

        {/* Name & Location */}
        <div>
          <p className="font-semibold text-snow-cream">{author}</p>
          {location && (
            <p className="text-snow-cream/50 text-sm">{location}</p>
          )}
        </div>
      </div>
    </div>
  )
}
