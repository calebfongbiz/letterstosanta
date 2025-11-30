/**
 * Card Component
 * 
 * Versatile card container with Christmas-themed styling.
 * Supports glass morphism and gradient backgrounds.
 */

import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'solid' | 'gradient'
  hover?: boolean
  glow?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, glow = false, children, ...props }, ref) => {
    const baseStyles = `
      rounded-2xl
      transition-all duration-300 ease-out
    `

    const variants = {
      default: `
        bg-white/10 backdrop-blur-md
        border border-white/20
      `,
      glass: `
        bg-white/5 backdrop-blur-xl
        border border-white/10
        shadow-xl
      `,
      solid: `
        bg-midnight-light
        border border-white/10
        shadow-xl
      `,
      gradient: `
        bg-gradient-to-br from-forest-green/30 to-santa-red/30
        backdrop-blur-md
        border border-white/10
      `,
    }

    const hoverStyles = hover
      ? `
        hover:scale-[1.02]
        hover:shadow-2xl
        hover:border-white/30
        cursor-pointer
      `
      : ''

    const glowStyles = glow
      ? `
        shadow-lg shadow-gold/20
        hover:shadow-xl hover:shadow-gold/40
      `
      : ''

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], hoverStyles, glowStyles, className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Card Header
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pb-4', className)} {...props}>
      {children}
    </div>
  )
)
CardHeader.displayName = 'CardHeader'

// Card Content
export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  )
)
CardContent.displayName = 'CardContent'

// Card Footer
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-4 flex items-center', className)} {...props}>
      {children}
    </div>
  )
)
CardFooter.displayName = 'CardFooter'

// Card Title
export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-xl font-display font-bold text-snow-cream', className)}
      {...props}
    >
      {children}
    </h3>
  )
)
CardTitle.displayName = 'CardTitle'

// Card Description
export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-snow-cream/70 text-sm mt-1', className)}
      {...props}
    >
      {children}
    </p>
  )
)
CardDescription.displayName = 'CardDescription'

export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription }
