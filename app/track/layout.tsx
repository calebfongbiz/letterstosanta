/**
 * Tracker Layout
 * 
 * Special layout for tracker pages - no navbar/footer for kid-friendly viewing.
 */

import { Snowfall } from '@/components'

export default function TrackerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#1a1a2e]">
      {/* Snowfall background effect */}
      <Snowfall count={50} />
      
      {/* Main content - no navbar or footer */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  )
}
