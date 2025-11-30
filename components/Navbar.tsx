/**
 * Navbar Component
 * 
 * Main navigation with logo, links, and CTA button.
 */

'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from './Button'

const navLinks = [
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#features', label: 'Features' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight/95 to-midnight/80 backdrop-blur-lg border-b border-white/5" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl group-hover:animate-bounce-soft">🎅</span>
            <span className="font-display text-xl font-bold text-snow-cream hidden sm:inline">
              Letters to Santa<span className="text-gold">™</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-snow-cream/70 hover:text-snow-cream transition-colors font-medium',
                  pathname === link.href && 'text-snow-cream'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/tracker-login">
              <Button variant="ghost" size="sm">
                Track Letter
              </Button>
            </Link>
            <Link href="/write-letter">
              <Button variant="gold" size="sm">
                Write to Santa ✨
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-snow-cream/70 hover:text-snow-cream"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300',
            isOpen ? 'max-h-96 pb-6' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-snow-cream/70 hover:text-snow-cream transition-colors font-medium py-2"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
              <Link href="/tracker-login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" size="md" className="w-full">
                  Track Letter
                </Button>
              </Link>
              <Link href="/write-letter" onClick={() => setIsOpen(false)}>
                <Button variant="gold" size="md" className="w-full">
                  Write to Santa ✨
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
