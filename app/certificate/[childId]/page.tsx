'use client'

/**
 * Nice List Certificate Page
 * 
 * Displays a beautiful certificate that can be printed/saved as PDF
 */

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface ChildData {
  id: string
  name: string
}

export default function CertificatePage() {
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Certificate...</div>
      </div>
    )
  }

  if (!child) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Certificate not found</div>
      </div>
    )
  }

  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 print:bg-white print:py-0">
      {/* Print button - hidden when printing */}
      <div className="max-w-4xl mx-auto mb-4 print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-yellow-500 text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition-colors"
        >
          🖨️ Print / Save as PDF
        </button>
      </div>

      {/* Certificate */}
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-amber-50 via-white to-amber-50 rounded-lg shadow-2xl overflow-hidden print:shadow-none print:rounded-none border-8 border-double border-yellow-500">
        <div className="p-8 md:p-12 relative min-h-[600px] flex flex-col">
          {/* Decorative corners */}
          <div className="absolute top-4 left-4 text-4xl">❄️</div>
          <div className="absolute top-4 right-4 text-4xl">❄️</div>
          <div className="absolute bottom-4 left-4 text-4xl">🎄</div>
          <div className="absolute bottom-4 right-4 text-4xl">🎄</div>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">⭐</div>
            <h1 className="text-red-800 text-xl md:text-2xl tracking-widest font-bold">
              OFFICIAL NORTH POLE DOCUMENT
            </h1>
          </div>

          {/* Title */}
          <div className="text-center flex-grow flex flex-col justify-center">
            <h2 className="text-green-800 text-4xl md:text-6xl font-bold mb-2">
              Nice List
            </h2>
            <h3 className="text-red-700 text-3xl md:text-5xl font-bold mb-8">
              Certificate
            </h3>

            {/* This certifies */}
            <p className="text-gray-600 text-lg md:text-xl mb-4">
              This is to certify that
            </p>

            {/* Name */}
            <div className="relative inline-block mx-auto mb-4">
              <p className="text-red-800 text-4xl md:text-6xl px-8 py-2" style={{ fontFamily: 'cursive' }}>
                {child.name}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
            </div>

            {/* Certificate text */}
            <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              has been officially recognized by Santa Claus and placed on the
            </p>
            <p className="text-green-700 text-2xl md:text-3xl font-bold mt-2 mb-4">
              ✨ Official Nice List for {currentYear} ✨
            </p>
            <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto">
              for demonstrating kindness, good behavior, and the true spirit of Christmas
            </p>
          </div>

          {/* Footer with signatures */}
          <div className="flex justify-between items-end mt-8 pt-6 border-t-2 border-yellow-500/30">
            {/* Santa signature */}
            <div className="text-center">
              <div className="text-3xl md:text-4xl text-red-800 mb-1" style={{ fontFamily: 'cursive' }}>
                Santa Claus
              </div>
              <div className="w-32 md:w-40 h-0.5 bg-gray-400 mx-auto mb-1"></div>
              <p className="text-gray-500 text-xs md:text-sm">Santa Claus</p>
              <p className="text-gray-400 text-xs">Chief Gift Giver</p>
            </div>

            {/* Seal */}
            <div className="text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center shadow-lg border-4 border-yellow-500">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl">🎅</div>
                  <div className="text-amber-200 text-xs font-bold">NORTH POLE</div>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-1">Official Seal</p>
            </div>

            {/* Mrs Claus signature */}
            <div className="text-center">
              <div className="text-3xl md:text-4xl text-red-800 mb-1" style={{ fontFamily: 'cursive' }}>
                Mrs. Claus
              </div>
              <div className="w-32 md:w-40 h-0.5 bg-gray-400 mx-auto mb-1"></div>
              <p className="text-gray-500 text-xs md:text-sm">Mrs. Claus</p>
              <p className="text-gray-400 text-xs">Head of Nice List Review</p>
            </div>
          </div>

          {/* Bottom text */}
          <div className="text-center mt-4">
            <p className="text-gray-400 text-xs">
              Certificate #{child.id.slice(-8).toUpperCase()} • Issued December {currentYear} • North Pole, Arctic Circle
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
