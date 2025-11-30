/**
 * FeatureCard Component
 * 
 * Display a feature with icon, title, and description.
 */

import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

export interface FeatureCardProps extends HTMLAttributes<HTMLDivElement> {
  icon: string
  title: string
  description: string
  variant?: 'default' | 'compact'
}

export function FeatureCard({
  icon,
  title,
  description,
  variant = 'default',
  className,
  ...props
}: FeatureCardProps) {
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-start gap-4 p-4 rounded-xl',
          'bg-white/5 border border-white/10',
          'transition-all duration-300 hover:bg-white/10',
          className
        )}
        {...props}
      >
        <span className="text-3xl flex-shrink-0">{icon}</span>
        <div>
          <h4 className="font-display font-semibold text-snow-cream mb-1">
            {title}
          </h4>
          <p className="text-snow-cream/60 text-sm">{description}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group flex flex-col items-center text-center p-8 rounded-2xl',
        'bg-white/5 backdrop-blur-sm border border-white/10',
        'transition-all duration-300',
        'hover:bg-white/10 hover:border-white/20 hover:scale-105',
        className
      )}
      {...props}
    >
      {/* Icon with glow effect */}
      <div className="relative mb-6">
        <span className="text-6xl block group-hover:animate-bounce-soft">
          {icon}
        </span>
        <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <h3 className="font-display text-xl font-bold text-snow-cream mb-3">
        {title}
      </h3>
      <p className="text-snow-cream/70 leading-relaxed">
        {description}
      </p>
    </div>
  )
}

// Step Card for How It Works section
export interface StepCardProps extends HTMLAttributes<HTMLDivElement> {
  step: number
  title: string
  description: string
}

export function StepCard({
  step,
  title,
  description,
  className,
  ...props
}: StepCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center text-center p-8',
        className
      )}
      {...props}
    >
      {/* Step number with decorative circle */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-santa-red to-santa-red-dark flex items-center justify-center shadow-lg shadow-santa-red/30">
          <span className="font-display text-2xl font-bold text-white">
            {step}
          </span>
        </div>
        {/* Decorative ring */}
        <div className="absolute inset-0 -m-2 rounded-full border-2 border-dashed border-gold/30 animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      {/* Content */}
      <h3 className="font-display text-xl font-bold text-snow-cream mb-3">
        {title}
      </h3>
      <p className="text-snow-cream/70 leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  )
}
