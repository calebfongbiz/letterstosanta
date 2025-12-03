/**
 * Nice List Certificate Component
 * 
 * Generates a beautiful printable Nice List Certificate
 * Can be rendered as a page or converted to PDF
 */

'use client'

import React, { useRef } from 'react'

interface NiceListCertificateProps {
  childName: string
  year?: number
}

export function NiceListCertificate({ childName, year = 2024 }: NiceListCertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null)

  return (
    <div 
      ref={certificateRef}
      className="w-[800px] h-[600px] mx-auto bg-gradient-to-b from-[#1a1a2e] via-[#1e3a5f] to-[#1a1a2e] relative overflow-hidden font-serif"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)
        `
      }}
    >
      {/* Decorative border */}
      <div className="absolute inset-4 border-4 border-[#D4AF37] rounded-lg" />
      <div className="absolute inset-6 border-2 border-[#D4AF37]/50 rounded-lg" />
      
      {/* Corner decorations */}
      <div className="absolute top-8 left-8 text-4xl">❄️</div>
      <div className="absolute top-8 right-8 text-4xl">❄️</div>
      <div className="absolute bottom-8 left-8 text-4xl">🎄</div>
      <div className="absolute bottom-8 right-8 text-4xl">🎄</div>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-16">
        {/* Header */}
        <div className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-2">
          Official Document from the North Pole
        </div>
        
        {/* Title */}
        <h1 className="text-5xl font-bold text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          Nice List
        </h1>
        <h2 className="text-3xl text-[#D4AF37] mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          Certificate
        </h2>
        
        {/* Decorative line */}
        <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mb-6" />
        
        {/* This certifies */}
        <p className="text-white/80 text-lg mb-4">This is to certify that</p>
        
        {/* Child's name */}
        <div className="relative mb-4">
          <p className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: 'Georgia, serif' }}>
            {childName}
          </p>
          <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#D4AF37]/50" />
        </div>
        
        {/* Certificate text */}
        <p className="text-white/80 text-lg mb-2">
          has been officially placed on
        </p>
        <p className="text-2xl font-semibold text-white mb-4">
          Santa&apos;s Nice List for {year}
        </p>
        
        <p className="text-white/70 text-sm max-w-md mb-8">
          In recognition of outstanding kindness, wonderful behavior, and spreading Christmas cheer throughout the year.
        </p>
        
        {/* Signature area */}
        <div className="flex items-end gap-16">
          <div className="text-center">
            <p className="text-3xl mb-1" style={{ fontFamily: 'cursive' }}>
              🎅 Santa Claus
            </p>
            <div className="w-32 h-0.5 bg-[#D4AF37]/50 mb-1" />
            <p className="text-white/60 text-xs">Santa Claus</p>
          </div>
          
          <div className="text-center">
            <p className="text-3xl mb-1">⭐</p>
            <p className="text-[#D4AF37] text-sm">Official Seal</p>
          </div>
          
          <div className="text-center">
            <p className="text-3xl mb-1" style={{ fontFamily: 'cursive' }}>
              🧝 Head Elf
            </p>
            <div className="w-32 h-0.5 bg-[#D4AF37]/50 mb-1" />
            <p className="text-white/60 text-xs">Head Elf, Records Department</p>
          </div>
        </div>
        
        {/* Year stamp */}
        <div className="absolute bottom-12 right-12 text-[#D4AF37]/30 text-6xl font-bold">
          {year}
        </div>
      </div>
      
      {/* Sparkle effects */}
      <div className="absolute top-20 left-20 text-yellow-200/40 text-2xl animate-pulse">✨</div>
      <div className="absolute top-32 right-32 text-yellow-200/40 text-xl animate-pulse delay-100">✨</div>
      <div className="absolute bottom-32 left-32 text-yellow-200/40 text-xl animate-pulse delay-200">✨</div>
      <div className="absolute bottom-20 right-20 text-yellow-200/40 text-2xl animate-pulse delay-300">✨</div>
    </div>
  )
}

// Page wrapper for generating the certificate
export default function NiceListCertificatePage({ 
  params 
}: { 
  params: { childName: string } 
}) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <NiceListCertificate childName={decodeURIComponent(params.childName)} />
    </div>
  )
}
