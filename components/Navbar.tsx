/**
 * Navbar Component
 * 
 * Light theme navigation with red accents.
 */

'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from './Button'

const navLinks = [
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Add scroll listener for background change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Background - white when scrolled or on other pages */}
      <div 
        className={cn(
          "absolute inset-0 transition-all duration-300",
          scrolled || pathname !== '/' 
            ? "bg-white shadow-md" 
            : "bg-white/90 backdrop-blur-sm"
        )} 
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl group-hover:animate-bounce-soft">🎅</span>
            <span className="font-display text-xl font-bold text-santa-red">
              Letters to Santa
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-gray-600 hover:text-santa-red transition-colors font-medium'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/tracker-login">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-santa-red">
                Track Letter
              </Button>
            </Link>
            <Link href="/write-letter">
              <Button variant="primary" size="sm">
                Start Your Letter Free
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-santa-red"
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
            'md:hidden overflow-hidden transition-all duration-300 bg-white',
            isOpen ? 'max-h-96 pb-6' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-4 pt-4 border-t border-gray-100">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-gray-600 hover:text-santa-red transition-colors font-medium py-2"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
              <Link href="/tracker-login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" size="md" className="w-full">
                  Track Letter
                </Button>
              </Link>
              <Link href="/write-letter" onClick={() => setIsOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  Start Your Letter Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
