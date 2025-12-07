'use client'

/**
 * Santa's Letter Page
 * 
 * Displays a beautifully formatted letter from Santa that can be printed/saved as PDF
 * Uses AI-generated personalized letter content
 */

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface ChildData {
  name: string
  santaLetter?: string
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
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎅</div>
          <div className="text-white text-xl">Santa is writing your letter...</div>
        </div>
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

  // Use AI-generated letter or fall back to basic version
  const letterContent = child.santaLetter || generateFallbackLetter(child)

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

          {/* Letter body - preserving line breaks */}
          <div className="text-gray-800 text-lg leading-relaxed whitespace-pre-line">
            {letterContent}
          </div>

          {/* Signature */}
          <div className="mt-8">
            <div className="text-4xl text-red-800" style={{ fontFamily: 'cursive' }}>
              🎅 Santa Claus
            </div>
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

// Fallback letter if AI generation fails
function generateFallbackLetter(child: ChildData): string {
  const name = child.name
  const wishlist = child.letter?.wishlist
  const goodThings = child.letter?.goodThings
  const petsAndFamily = child.letter?.petsAndFamily

  let letter = `Ho Ho Ho, Dear ${name}! 🎄

Merry Christmas from the North Pole! I received your wonderful letter, and it warmed my heart like a cup of hot cocoa by the fire! Mrs. Claus and I read it together, and we both agreed it was one of the most special letters we've received this year.

`

  if (goodThings) {
    letter += `I've been watching, and I'm SO proud of all the good things you've been doing. That's exactly the kind of thing that puts a big smile on my face and makes Rudolph's nose glow extra bright!

`
  }

  if (wishlist) {
    letter += `Now, about your Christmas wishes... I've made special notes about everything you mentioned! The elves are very busy in the workshop, and I've asked them to pay extra special attention to your list.

`
  }

  if (petsAndFamily) {
    letter += `Please give my warm wishes to your family and anyone special in your life!

`
  }

  letter += `Remember, ${name}, Christmas is about love, kindness, and being together with the people we care about. You've shown so much of that this year, and it makes me very happy.

Keep being the amazing person you are, and always believe in the magic of Christmas!

With love and jingle bells,

P.S. The reindeer say hello! Rudolph wanted me to tell you that your letter made his nose glow extra bright! ✨`

  return letter
}
