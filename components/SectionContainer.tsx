/**
 * SectionContainer Component
 * 
 * Consistent section wrapper with optional background patterns
 * and standardized padding.
 */

import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

export interface SectionContainerProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'gradient' | 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  withPattern?: boolean
}

const SectionContainer = forwardRef<HTMLElement, SectionContainerProps>(
  ({ className, variant = 'default', size = 'lg', withPattern = false, children, ...props }, ref) => {
    const sizes = {
      sm: 'py-12 md:py-16',
      md: 'py-16 md:py-24',
      lg: 'py-20 md:py-32',
      xl: 'py-24 md:py-40',
    }

    const variants = {
      default: '',
      gradient: 'bg-gradient-to-b from-transparent via-forest-green/10 to-transparent',
      dark: 'bg-midnight-light/50',
      light: 'bg-white/5',
    }

    return (
      <section
        ref={ref}
        className={cn('relative overflow-hidden', sizes[size], variants[variant], className)}
        {...props}
      >
        {/* Optional decorative pattern */}
        {withPattern && (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
        )}
        
        {/* Content container */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {children}
        </div>
      </section>
    )
  }
)

SectionContainer.displayName = 'SectionContainer'

// Section Title Component
export interface SectionTitleProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
}

const SectionTitle = forwardRef<HTMLDivElement, SectionTitleProps>(
  ({ className, title, subtitle, align = 'center', ...props }, ref) => {
    const alignClasses = {
      left: 'text-left',
      center: 'text-center mx-auto',
      right: 'text-right ml-auto',
    }

    return (
      <div
        ref={ref}
        className={cn('max-w-3xl mb-12 md:mb-16', alignClasses[align], className)}
        {...props}
      >
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-snow-cream mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg md:text-xl text-snow-cream/70">
            {subtitle}
          </p>
        )}
      </div>
    )
  }
)

SectionTitle.displayName = 'SectionTitle'

export { SectionContainer, SectionTitle }
