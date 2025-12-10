/**
* Root Layout
*
* Main application layout - updated for light theme.
*/

import type { Metadata } from 'next'
import { Navbar, Footer, MetaPixel } from '@/components'
import './globals.css'

export const metadata: Metadata = {
  title: 'Letters to Santa™ - Create Magical Christmas Memories',
  description: 'Write a letter to Santa, track its magical journey to the North Pole, and receive a personalized reply. Create unforgettable Christmas memories for your children.',
  keywords: 'letters to santa, santa letter, christmas tradition, north pole, santa tracker, personalized santa letter',
  authors: [{ name: 'Letters to Santa™' }],
  openGraph: {
    title: 'Letters to Santa™ - Create Magical Christmas Memories',
    description: 'Write a letter to Santa, track its magical journey to the North Pole, and receive a personalized reply.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Letters to Santa™',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Letters to Santa™',
    description: 'Create magical Christmas memories with personalized letters to Santa.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-white">
        {/* Meta Pixel */}
        <MetaPixel />
        
        {/* Navigation */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white py-3 px-4 text-center">
          <p className="text-sm md:text-base font-medium">
            🎅 <span className="font-bold">Parents!</span> You have until December 20th to send a letter, watch it travel through magical locations, and get a personalized letter back from Santa! ✨
          </p>
        </div>
        <Navbar />

        {/* Main content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  )
}
