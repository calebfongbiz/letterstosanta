/**
 * TrackerTimeline Component
 * 
 * Flight-tracker style visualization of the letter's journey to Santa.
 * Shows milestones as stops along a path with animations.
 */

'use client'

import { cn } from '@/lib/utils'
import { MILESTONE_DATA, MILESTONE_ORDER, type MilestoneInfo, type Milestone } from '@/lib/types'
import { useEffect, useState } from 'react'

export interface TrackerTimelineProps {
  currentMilestone: Milestone
  milestoneIndex: number
  storyText?: string | null
  childName: string
}

export function TrackerTimeline({
  currentMilestone,
  milestoneIndex,
  storyText,
  childName,
}: TrackerTimelineProps) {
  const [animatedIndex, setAnimatedIndex] = useState(-1)

  // Animate milestones on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedIndex(milestoneIndex)
    }, 100)
    return () => clearTimeout(timer)
  }, [milestoneIndex])

  const progress = ((milestoneIndex + 1) / MILESTONE_ORDER.length) * 100

  return (
    <div className="w-full">
      {/* Header with progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-snow-cream">
            {childName}&apos;s Letter Journey
          </h2>
          <span className="text-gold font-semibold">
            {Math.round(progress)}% Complete
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-forest-green via-gold to-santa-red rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
          {/* Animated shine effect */}
          <div
            className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
            style={{ left: `${progress - 10}%` }}
          />
        </div>
      </div>

      {/* Current story text */}
      {storyText && (
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-forest-green/20 to-santa-red/20 border border-white/10">
          <p className="text-snow-cream/90 text-lg leading-relaxed font-body italic">
            &ldquo;{storyText}&rdquo;
          </p>
        </div>
      )}

      {/* Timeline - Desktop (horizontal) */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-10 left-0 right-0 h-1 bg-white/10" />
          <div
            className="absolute top-10 left-0 h-1 bg-gradient-to-r from-forest-green via-gold to-santa-red transition-all duration-1000 ease-out"
            style={{ width: `${(animatedIndex / (MILESTONE_ORDER.length - 1)) * 100}%` }}
          />

          {/* Milestone nodes */}
          <div className="relative flex justify-between">
            {MILESTONE_ORDER.map((milestone, index) => {
              const info = MILESTONE_DATA[milestone]
              const isCompleted = index <= animatedIndex
              const isCurrent = index === animatedIndex
              const isPending = index > animatedIndex

              return (
                <MilestoneNode
                  key={milestone}
                  info={info}
                  isCompleted={isCompleted}
                  isCurrent={isCurrent}
                  isPending={isPending}
                  index={index}
                  animatedIndex={animatedIndex}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Timeline - Mobile (vertical) */}
      <div className="md:hidden">
        <div className="relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-white/10" />
          <div
            className="absolute left-3 top-0 w-0.5 bg-gradient-to-b from-forest-green via-gold to-santa-red transition-all duration-1000 ease-out"
            style={{ height: `${(animatedIndex / (MILESTONE_ORDER.length - 1)) * 100}%` }}
          />

          {/* Milestone items */}
          <div className="space-y-6">
            {MILESTONE_ORDER.map((milestone, index) => {
              const info = MILESTONE_DATA[milestone]
              const isCompleted = index <= animatedIndex
              const isCurrent = index === animatedIndex
              const isPending = index > animatedIndex

              return (
                <MilestoneNodeMobile
                  key={milestone}
                  info={info}
                  isCompleted={isCompleted}
                  isCurrent={isCurrent}
                  isPending={isPending}
                  index={index}
                  animatedIndex={animatedIndex}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Desktop milestone node
interface MilestoneNodeProps {
  info: MilestoneInfo
  isCompleted: boolean
  isCurrent: boolean
  isPending: boolean
  index: number
  animatedIndex: number
}

function MilestoneNode({
  info,
  isCompleted,
  isCurrent,
  isPending,
  index,
  animatedIndex,
}: MilestoneNodeProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center transition-all duration-500',
        isCurrent && 'transform scale-110',
        isPending && 'opacity-40'
      )}
      style={{
        transitionDelay: `${index * 100}ms`,
        opacity: index <= animatedIndex ? 1 : 0.4,
      }}
    >
      {/* Node circle */}
      <div
        className={cn(
          'relative w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all duration-500',
          isCompleted && 'bg-gradient-to-br from-forest-green to-forest-green-dark shadow-lg shadow-forest-green/30',
          isCurrent && 'bg-gradient-to-br from-gold to-gold-dark shadow-xl shadow-gold/50 animate-pulse-glow',
          isPending && 'bg-white/10'
        )}
      >
        <span className={cn(isCurrent && 'animate-bounce-soft')}>
          {info.icon}
        </span>

        {/* Current indicator ring */}
        {isCurrent && (
          <div className="absolute inset-0 -m-2 rounded-full border-2 border-gold/50 animate-ping" />
        )}
      </div>

      {/* Label */}
      <div className="mt-4 text-center max-w-[100px]">
        <p
          className={cn(
            'font-display font-semibold text-sm transition-colors',
            isCompleted ? 'text-snow-cream' : 'text-snow-cream/50'
          )}
        >
          {info.shortName}
        </p>
      </div>
    </div>
  )
}

// Mobile milestone node
function MilestoneNodeMobile({
  info,
  isCompleted,
  isCurrent,
  isPending,
  index,
  animatedIndex,
}: MilestoneNodeProps) {
  return (
    <div
      className={cn(
        'relative flex items-start gap-4 transition-all duration-500',
        isPending && 'opacity-40'
      )}
      style={{
        transitionDelay: `${index * 100}ms`,
        opacity: index <= animatedIndex ? 1 : 0.4,
      }}
    >
      {/* Node dot */}
      <div
        className={cn(
          'absolute left-[-25px] w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500',
          isCompleted && 'bg-forest-green',
          isCurrent && 'bg-gold animate-pulse',
          isPending && 'bg-white/20'
        )}
      >
        {isCurrent && (
          <div className="absolute inset-0 -m-1 rounded-full border border-gold/50 animate-ping" />
        )}
      </div>

      {/* Content card */}
      <div
        className={cn(
          'flex-grow p-4 rounded-xl transition-all duration-300',
          isCurrent && 'bg-white/10 border border-gold/30',
          isCompleted && !isCurrent && 'bg-white/5',
          isPending && 'bg-transparent'
        )}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{info.icon}</span>
          <h4
            className={cn(
              'font-display font-semibold',
              isCompleted ? 'text-snow-cream' : 'text-snow-cream/50'
            )}
          >
            {info.name}
          </h4>
        </div>
        <p className="text-snow-cream/60 text-sm">
          {info.description}
        </p>
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
      <div className="absolute inset-0 flex items-center justify-center bg-midnight/60 backdrop-blur-sm rounded-2xl">
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
            You&apos;re currently on the free Letter to Santa plan. You&apos;ll still receive magical email updates, but to watch your letter&apos;s journey in real-time, upgrade to Santa&apos;s Tracker or The Santa Experience.
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
