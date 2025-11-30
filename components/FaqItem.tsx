/**
 * FaqItem Component
 * 
 * Expandable FAQ accordion item.
 */

'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'

export interface FaqItemProps {
  question: string
  answer: string
  defaultOpen?: boolean
  className?: string
}

export function FaqItem({
  question,
  answer,
  defaultOpen = false,
  className,
}: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div
      className={cn(
        'border-b border-white/10 last:border-b-0',
        className
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left focus:outline-none group"
      >
        <h3 className="font-display font-semibold text-lg text-snow-cream pr-4 group-hover:text-gold transition-colors">
          {question}
        </h3>
        <span
          className={cn(
            'flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300',
            isOpen && 'rotate-180 bg-gold/20'
          )}
        >
          <svg
            className={cn(
              'w-4 h-4 transition-colors',
              isOpen ? 'text-gold' : 'text-snow-cream/60'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-out',
          isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'
        )}
      >
        <p className="text-snow-cream/70 leading-relaxed pr-12">
          {answer}
        </p>
      </div>
    </div>
  )
}

// FAQ Section wrapper
export interface FaqSectionProps {
  faqs: { question: string; answer: string }[]
  className?: string
}

export function FaqSection({ faqs, className }: FaqSectionProps) {
  return (
    <div
      className={cn(
        'max-w-3xl mx-auto rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-8',
        className
      )}
    >
      {faqs.map((faq, index) => (
        <FaqItem
          key={index}
          question={faq.question}
          answer={faq.answer}
          defaultOpen={index === 0}
        />
      ))}
    </div>
  )
}
