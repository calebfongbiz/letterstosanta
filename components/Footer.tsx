/**
 * Footer Component
 * 
 * Site footer with links, trust badges, and copyright.
 */

import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-4xl">🎅</span>
              <span className="font-display text-2xl font-bold text-snow-cream">
                Letters to Santa<span className="text-gold">™</span>
              </span>
            </Link>
            <p className="text-snow-cream/60 max-w-md mb-6">
              Creating magical Christmas memories for families around the world. 
              Every letter is a journey, every tracker a window into the wonder of the North Pole.
            </p>
            {/* Trust badges */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-snow-cream/50">
                <svg className="w-4 h-4 text-forest-green-light" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-snow-cream/50">
                <span>⭐</span>
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-snow-cream mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#how-it-works" className="text-snow-cream/60 hover:text-snow-cream transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-snow-cream/60 hover:text-snow-cream transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-snow-cream/60 hover:text-snow-cream transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/tracker-login" className="text-snow-cream/60 hover:text-snow-cream transition-colors">
                  Track Your Letter
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-snow-cream mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:support@letterstosanta.com" className="text-snow-cream/60 hover:text-snow-cream transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/privacy" className="text-snow-cream/60 hover:text-snow-cream transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-snow-cream/60 hover:text-snow-cream transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-snow-cream/40 text-sm">
            © {currentYear} Letters to Santa™. All rights reserved. Made with ❤️ at the North Pole.
          </p>
          
          {/* Decorative snowflakes */}
          <div className="flex items-center gap-2 text-snow-cream/20">
            <span>❄️</span>
            <span>🎄</span>
            <span>⭐</span>
            <span>🎁</span>
            <span>❄️</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
