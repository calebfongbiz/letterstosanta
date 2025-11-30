/**
 * Button Component
 * 
 * Reusable button with multiple variants and sizes.
 * Supports magical Christmas-themed styling.
 */

import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center
      font-body font-semibold
      rounded-full
      transition-all duration-300 ease-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      transform hover:scale-105 active:scale-95
    `

    const variants = {
      primary: `
        bg-santa-red text-white
        hover:bg-santa-red-dark
        focus:ring-santa-red
        shadow-lg shadow-santa-red/30
        hover:shadow-xl hover:shadow-santa-red/40
      `,
      secondary: `
        bg-forest-green text-white
        hover:bg-forest-green-dark
        focus:ring-forest-green
        shadow-lg shadow-forest-green/30
        hover:shadow-xl hover:shadow-forest-green/40
      `,
      outline: `
        bg-transparent
        border-2 border-snow-cream text-snow-cream
        hover:bg-snow-cream/10
        focus:ring-snow-cream
      `,
      ghost: `
        bg-transparent text-snow-cream
        hover:bg-snow-cream/10
        focus:ring-snow-cream
      `,
      gold: `
        bg-gradient-to-r from-gold-dark via-gold to-gold-light
        text-midnight font-bold
        hover:from-gold hover:via-gold-light hover:to-gold
        focus:ring-gold
        shadow-lg shadow-gold/30
        hover:shadow-xl hover:shadow-gold/50
      `,
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
