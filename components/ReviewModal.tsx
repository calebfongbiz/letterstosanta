'use client'

import { useState } from 'react'
import ReviewForm from './ReviewForm'

export default function ReviewModal() {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-santa-red text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
      >
        ⭐ Leave a Review
      </button>
    )
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Share Your Experience</h2>
          <p className="text-gray-600 text-center mb-6">Had a magical experience? We would love to hear from you!</p>
          <ReviewForm onClose={() => setIsOpen(false)} />
        </div>
      </div>
    </>
  )
}
