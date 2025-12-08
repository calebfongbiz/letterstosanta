import { ReviewCarousel, ReviewForm } from '@/components'

export const metadata = {
  title: 'Reviews - Letters to Santa™',
  description: 'Read reviews from families who created magical Christmas memories with Letters to Santa.',
}

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ❤️ Family Reviews
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what families are saying about their magical Letters to Santa experience
          </p>
        </div>

        {/* Carousel */}
        <div className="mb-20">
          <ReviewCarousel />
        </div>

        {/* Submit Form */}
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Share Your Experience</h2>
            <p className="text-gray-600 text-center mb-6">Had a magical experience? We would love to hear from you!</p>
            <ReviewForm />
          </div>
        </div>
      </div>
    </div>
  )
}
