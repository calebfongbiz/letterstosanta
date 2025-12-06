'use client'

/**
 * Santa's Letter Page
 * 
 * Displays a beautifully formatted letter from Santa that can be printed/saved as PDF
 */

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface ChildData {
  name: string
  letter?: {
    wishlist?: string
    goodThings?: string
    petsAndFamily?: string
  }
}

export default function SantaLetterPage() {
  const params = useParams()
  const childId = params.childId as string
  const [child, setChild] = useState<ChildData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchChild() {
      try {
        const res = await fetch(`/api/child/${childId}`)
        if (res.ok) {
          const data = await res.json()
          setChild(data)
        }
      } catch (error) {
        console.error('Error fetching child:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchChild()
  }, [childId])

  if (loading) {
    return (
      <div className="min-h-screen bg-red-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Santa&apos;s Letter...</div>
      </div>
    )
  }

  if (!child) {
    return (
      <div className="min-h-screen bg-red-900 flex items-center justify-center">
        <div className="text-white text-xl">Letter not found</div>
      </div>
    )
  }

  const wishlist = child.letter?.wishlist || ''
  const goodThings = child.letter?.goodThings || ''
  const petsAndFamily = child.letter?.petsAndFamily || ''
  
  const wishes = wishlist ? wishlist.split(',').map(w => w.trim()).filter(w => w).slice(0, 3) : []
  const goodDeeds = goodThings ? goodThings.split(',').map(g => g.trim()).filter(g => g).slice(0, 3) : []

  return (
    <div className="min-h-screen bg-red-900 py-8 px-4 print:bg-white print:py-0">
      {/* Print button - hidden when printing */}
      <div className="max-w-2xl mx-auto mb-4 print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-yellow-500 text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition-colors"
        >
          🖨️ Print / Save as PDF
        </button>
      </div>

      {/* Letter */}
      <div className="max-w-2xl mx-auto bg-amber-50 rounded-lg shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
        {/* Header with North Pole design */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 p-6 text-center border-b-4 border-yellow-500">
          <div className="text-6xl mb-2">🎅</div>
          <h1 className="text-3xl text-yellow-400 font-bold tracking-wide">
            SANTA CLAUS
          </h1>
          <p className="text-amber-200 text-sm mt-1 tracking-widest">
            NORTH POLE WORKSHOP • ARCTIC CIRCLE
          </p>
        </div>

        {/* Letter content */}
        <div className="p-8 md:p-12">
          {/* Date */}
          <p className="text-right text-gray-600 mb-8 italic">
            December {new Date().getFullYear()}
          </p>

          {/* Greeting */}
          <p className="text-2xl text-red-800 mb-6">
            Ho Ho Ho, Dear {child.name}! 🎄
          </p>

          {/* Body */}
          <div className="space-y-4 text-gray-800 text-lg leading-relaxed">
            <p>
              Merry Christmas from the North Pole! I received your wonderful letter, 
              and it warmed my heart like a cup of hot cocoa by the fire! Mrs. Claus 
              and I read it together, and we both agreed it was one of the most special 
              letters we&apos;ve received this year.
            </p>

            {goodDeeds.length > 0 && (
              <p>
                I&apos;ve been watching, and I&apos;m SO proud of you for{' '}
                <span className="text-red-700 font-semibold">{goodDeeds[0].toLowerCase()}</span>
                {goodDeeds.length > 1 && (
                  <>, and <span className="text-red-700 font-semibold">{goodDeeds[1].toLowerCase()}</span> too</>
                )}! That&apos;s exactly the kind of thing that puts a big smile on my face 
                and makes Rudolph&apos;s nose glow extra bright!
              </p>
            )}

            {wishes.length > 0 && (
              <p>
                Now, about your Christmas wishes... I&apos;ve made a special note about{' '}
                <span className="text-green-700 font-semibold">{wishes[0]}</span>
                {wishes.length > 1 && (
                  <>, and <span className="text-green-700 font-semibold">{wishes[1]}</span> sounds wonderful too</>
                )}! The elves are very busy in the workshop, and I&apos;ve asked them to 
                pay extra special attention to your list.
              </p>
            )}

            {petsAndFamily && (
              <p>
                Please give my warm wishes to your family
                {(petsAndFamily.toLowerCase().includes('dog') || 
                  petsAndFamily.toLowerCase().includes('cat') || 
                  petsAndFamily.toLowerCase().includes('pet')) && (
                  <> and a special pat to your furry friends</>
                )}!
              </p>
            )}

            <p>
              Remember, {child.name}, Christmas is about love, kindness, and being 
              together with the people we care about. You&apos;ve shown so much of that 
              this year, and it makes me very happy.
            </p>

            <p>
              Keep being the amazing person you are, and always believe in the magic 
              of Christmas!
            </p>
          </div>

          {/* Sign off */}
          <div className="mt-10">
            <p className="text-gray-800 text-lg mb-4">
              With love and jingle bells,
            </p>
            <div className="text-4xl text-red-800" style={{ fontFamily: 'cursive' }}>
              🎅 Santa Claus
            </div>
            <p className="text-gray-600 text-sm mt-4 italic">
              P.S. The reindeer say hello! Rudolph wanted me to tell you that your 
              letter made his nose glow extra bright! ✨
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-green-800 via-green-700 to-green-800 p-4 text-center">
          <p className="text-amber-200 text-xs tracking-wider">
            ❄️ OFFICIAL LETTER FROM SANTA&apos;S WORKSHOP ❄️
          </p>
          <p className="text-amber-100/60 text-xs mt-1">
            Letters to Santa™ • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}
