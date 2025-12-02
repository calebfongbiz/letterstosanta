/**
 * Tracker Layout
 * 
 * Special layout for tracker pages - completely standalone, no navbar/footer.
 * This replaces the root layout for /track routes.
 */

import { Snowfall } from '@/components'
import '../globals.css'

export default function TrackerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#1a1a2e]">
        {/* Snowfall background effect */}
        <Snowfall count={50} />
        
        {/* Main content - NO navbar or footer */}
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  )
}
