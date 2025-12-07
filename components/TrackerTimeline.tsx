/**
 * TrackerTimeline Component - Magical Flight Tracker
 * 
 * Southwest Airlines-style flight tracker with a magical Christmas theme.
 * Shows the letter's journey on an illustrated path with video milestones.
 */

'use client'

import { cn } from '@/lib/utils'
import { MILESTONE_DATA, MILESTONE_ORDER, type MilestoneInfo, type Milestone } from '@/lib/types'
import { useEffect, useState, useRef } from 'react'

export interface TrackerTimelineProps {
  currentMilestone: Milestone
  milestoneIndex: number
  storyText?: string | null
  childName: string
}

// Only show first 5 milestones (exclude North Pole Workshop)
const VISIBLE_MILESTONES = MILESTONE_ORDER.slice(0, 5)

export function TrackerTimeline({
  currentMilestone,
  milestoneIndex,
  storyText,
  childName,
}: TrackerTimelineProps) {
  const [animatedIndex, setAnimatedIndex] = useState(-1)
  const [showVideo, setShowVideo] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Cap the milestone index at 4 (last visible milestone)
  const visibleMilestoneIndex = Math.min(milestoneIndex, 4)

  // Animate milestones on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedIndex(visibleMilestoneIndex)
      // Show video after animation completes
      setTimeout(() => setShowVideo(true), 1000)
    }, 100)
    return () => clearTimeout(timer)
  }, [visibleMilestoneIndex])

  const progress = ((visibleMilestoneIndex + 1) / VISIBLE_MILESTONES.length) * 100
  const currentInfo = MILESTONE_DATA[VISIBLE_MILESTONES[visibleMilestoneIndex]]

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-snow-cream">
            {childName}&apos;s Letter Journey
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-snow-cream/60 text-sm">Status:</span>
            <span className="px-3 py-1 rounded-full bg-forest-green/30 text-forest-green-light text-sm font-semibold">
              ✈️ In Transit
            </span>
          </div>
        </div>
        <p className="text-snow-cream/60 text-sm">
          Track your letter as it makes its magical journey to Santa
        </p>
      </div>

      {/* Main Tracker Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0a1628] to-[#1a2744] border border-white/10">
        
        {/* Starry background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                opacity: 0.3 + Math.random() * 0.5,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
          {/* Aurora effect at top */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-emerald-500/10 via-purple-500/5 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative p-6 md:p-8">
          
          {/* Flight info bar */}
          <div className="flex items-center justify-between mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-santa-red flex items-center justify-center">
                <span className="text-lg">✉️</span>
              </div>
              <div>
                <p className="text-snow-cream font-semibold">{childName}&apos;s Letter</p>
                <p className="text-snow-cream/50 text-xs">Flight #SANTA-{new Date().getFullYear()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gold font-bold text-lg">{Math.round(progress)}%</p>
              <p className="text-snow-cream/50 text-xs">Journey Complete</p>
            </div>
          </div>

          {/* Video Section - Current Milestone */}
          {showVideo && (
            <div className="mb-8">
              <div className="relative aspect-[9/16] max-h-[500px] rounded-xl overflow-hidden bg-black/50 border border-white/10">
                {/* Video element */}
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  onLoadedData={() => setVideoLoaded(true)}
                  poster={`/milestones/milestone-${visibleMilestoneIndex + 1}-poster.jpg`}
                >
                  <source src={`/milestones/milestone-${visibleMilestoneIndex + 1}.mp4`} type="video/mp4" />
                </video>

                {/* Placeholder overlay - shows until video is added */}
                {!videoLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-midnight via-[#1a2744] to-midnight">
                    <div className="text-6xl mb-4 animate-bounce-soft">{currentInfo.icon}</div>
                    <h3 className="font-display text-xl font-bold text-snow-cream mb-2">{currentInfo.name}</h3>
                    <p className="text-snow-cream/60 text-sm text-center max-w-md px-4">{currentInfo.description}</p>
                    <div className="mt-6 px-4 py-2 rounded-full bg-white/10 text-snow-cream/50 text-xs">
                      🎬 Video coming soon
                    </div>
                  </div>
                )}

                {/* Current location badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-snow-cream text-sm font-medium">Currently at {currentInfo.shortName}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Story text */}
          {storyText && (
            <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📖</span>
                <p className="text-snow-cream/80 text-sm leading-relaxed italic">
                  &ldquo;{storyText}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Flight Path Visualization */}
          <div className="relative">
            {/* Section header */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🗺️</span>
              <h3 className="text-snow-cream/80 font-semibold text-sm">Flight Path</h3>
            </div>

            {/* Path container */}
            <div className="relative py-4">
              {/* Connection line (background) */}
              <div className="absolute top-1/2 left-8 right-8 h-1 -translate-y-1/2 bg-white/10 rounded-full" />
              
              {/* Animated progress line */}
              <div 
                className="absolute top-1/2 left-8 h-1 -translate-y-1/2 bg-gradient-to-r from-forest-green via-gold to-santa-red rounded-full transition-all duration-1500 ease-out"
                style={{ 
                  width: `calc(${(animatedIndex / (VISIBLE_MILESTONES.length - 1)) * 100}% - 32px)`,
                }}
              />

              {/* Animated sleigh/plane on the path */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 transition-all duration-1500 ease-out z-20"
                style={{ 
                  left: `calc(${8 + (animatedIndex / (VISIBLE_MILESTONES.length - 1)) * (100 - 16)}% - 16px)`,
                }}
              >
                <div className="relative">
                  <span className="text-2xl drop-shadow-lg">🛷</span>
                  {/* Glow effect */}
                  <div className="absolute inset-0 blur-md bg-gold/50 rounded-full -z-10" />
                </div>
              </div>

              {/* Milestone nodes */}
              <div className="relative flex justify-between px-4">
                {VISIBLE_MILESTONES.map((milestone, index) => {
                  const info = MILESTONE_DATA[milestone]
                  const isCompleted = index < animatedIndex
                  const isCurrent = index === animatedIndex
                  const isPending = index > animatedIndex

                  return (
                    <div
                      key={milestone}
                      className={cn(
                        'flex flex-col items-center transition-all duration-500 z-10',
                        isPending && 'opacity-40'
                      )}
                    >
                      {/* Node */}
                      <div
                        className={cn(
                          'relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 border-2',
                          isCompleted && 'bg-forest-green border-forest-green-light shadow-lg shadow-forest-green/30',
                          isCurrent && 'bg-gradient-to-br from-gold to-gold-dark border-gold-light shadow-xl shadow-gold/50 scale-110',
                          isPending && 'bg-white/10 border-white/20'
                        )}
                      >
                        <span className={cn(
                          'text-xl md:text-2xl',
                          isCurrent && 'animate-bounce-soft'
                        )}>
                          {isCompleted ? '✓' : info.icon}
                        </span>

                        {/* Pulse ring for current */}
                        {isCurrent && (
                          <div className="absolute inset-0 -m-1 rounded-full border-2 border-gold/50 animate-ping" />
                        )}
                      </div>

                      {/* Label */}
                      <div className="mt-3 text-center">
                        <p className={cn(
                          'font-display font-semibold text-xs md:text-sm transition-colors',
                          isCompleted || isCurrent ? 'text-snow-cream' : 'text-snow-cream/40'
                        )}>
                          {info.shortName}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Journey Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-2xl font-bold text-gold">{visibleMilestoneIndex + 1}</p>
              <p className="text-snow-cream/50 text-xs">Stops Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-snow-cream">{VISIBLE_MILESTONES.length - visibleMilestoneIndex - 1}</p>
              <p className="text-snow-cream/50 text-xs">Stops Remaining</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-forest-green-light">
                {visibleMilestoneIndex === VISIBLE_MILESTONES.length - 1 ? '🎉' : '✈️'}
              </p>
              <p className="text-snow-cream/50 text-xs">
                {visibleMilestoneIndex === VISIBLE_MILESTONES.length - 1 ? 'Delivered!' : 'In Flight'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Details - Expandable List */}
      <div className="mt-6">
        <h3 className="text-snow-cream/80 font-semibold text-sm mb-4 flex items-center gap-2">
          <span>📍</span> Journey Details
        </h3>
        <div className="space-y-2">
          {VISIBLE_MILESTONES.map((milestone, index) => {
            const info = MILESTONE_DATA[milestone]
            const isCompleted = index < animatedIndex
            const isCurrent = index === animatedIndex
            const isPending = index > animatedIndex

            return (
              <div
                key={milestone}
                className={cn(
                  'flex items-center gap-4 p-3 rounded-xl transition-all duration-300',
                  isCurrent && 'bg-gold/20 border border-gold/30',
                  isCompleted && 'bg-white/5',
                  isPending && 'opacity-40'
                )}
              >
                <span className={cn(
                  'text-2xl',
                  isCurrent && 'animate-bounce-soft'
                )}>
                  {info.icon}
                </span>
                <div className="flex-grow">
                  <p className={cn(
                    'font-semibold text-sm',
                    isCompleted || isCurrent ? 'text-snow-cream' : 'text-snow-cream/50'
                  )}>
                    {info.name}
                  </p>
                  <p className="text-snow-cream/50 text-xs">{info.description}</p>
                </div>
                <div>
                  {isCompleted && (
                    <span className="w-6 h-6 rounded-full bg-forest-green/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-forest-green-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                  {isCurrent && (
                    <span className="px-2 py-1 rounded-full bg-gold/30 text-gold text-xs font-semibold">NOW</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Locked tracker overlay for free tier
export function TrackerLocked() {
  return (
    <div className="relative">
      {/* Blurred background preview */}
      <div className="blur-sm opacity-50 pointer-events-none">
        <TrackerTimeline
          currentMilestone="CANDY_CANE_FOREST"
          milestoneIndex={1}
          storyText="This is a preview of the magical tracker..."
          childName="Preview"
        />
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-midnight/80 backdrop-blur-sm rounded-2xl">
        <div className="text-center p-8 max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gold"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>

          <h3 className="font-display text-2xl font-bold text-snow-cream mb-3">
            Unlock the Magical Tracker
          </h3>
          <p className="text-snow-cream/70 mb-6">
            Upgrade to Santa&apos;s Tracker or The Santa Experience to watch your letter&apos;s journey in real-time with videos from each magical location!
          </p>
          <a
            href="/#pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-midnight font-semibold hover:scale-105 transition-transform"
          >
            View Upgrade Options
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
