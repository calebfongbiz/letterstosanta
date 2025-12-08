'use client'

import { useState, useEffect } from 'react'

interface Review {
  id: string
  name: string
  comment: string
  photoUrl: string | null
  createdAt: string
}

export default function ReviewCarousel() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        setReviews(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-santa-red"></div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return null
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      {reviews.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
            aria-label="Previous review"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
            aria-label="Next review"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {reviews[currentIndex]?.photoUrl && (
            <div className="flex-shrink-0">
              <img
                src={reviews[currentIndex].photoUrl}
                alt={`Photo from ${reviews[currentIndex].name}`}
                className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-2xl"
              />
            </div>
          )}

          <div className="flex-grow text-center md:text-left">
            <div className="text-4xl text-santa-red mb-4">&ldquo;</div>
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-6">
              {reviews[currentIndex]?.comment}
            </p>
            <p className="font-semibold text-gray-900">
              — {reviews[currentIndex]?.name}
            </p>
          </div>
        </div>
      </div>

      {reviews.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-santa-red' : 'bg-gray-300'
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
