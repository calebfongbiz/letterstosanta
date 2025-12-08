'use client'

import { useState, useRef } from 'react'

interface ReviewFormProps {
  onSuccess?: () => void
  onClose?: () => void
}

export default function ReviewForm({ onSuccess, onClose }: ReviewFormProps) {
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      let photoUrl = null

      // Upload photo first if exists
      if (photoFile) {
        const formData = new FormData()
        formData.append('file', photoFile)
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) throw new Error('Failed to upload photo')
        
        const uploadData = await uploadRes.json()
        photoUrl = uploadData.url
      }

      // Submit review
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, comment, photoUrl }),
      })

      if (!res.ok) throw new Error('Failed to submit')

      setSubmitted(true)
      onSuccess?.()
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">🎄</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-600">Your review has been submitted and will appear once approved.</p>
        {onClose && (
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-santa-red text-white rounded-xl hover:bg-red-700 transition-colors"
          >
            Close
          </button>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-santa-red focus:border-transparent"
          placeholder="Jane D."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-santa-red focus:border-transparent resize-none"
          placeholder="Tell us about your magical experience..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Add a Photo (optional)</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {photoPreview ? (
          <div className="relative inline-block">
            <img src={photoPreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl" />
            <button
              type="button"
              onClick={() => {
                setPhotoFile(null)
                setPhotoPreview(null)
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
            >
              ×
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-santa-red transition-colors flex flex-col items-center gap-2 text-gray-500"
          >
            <span className="text-3xl">📷</span>
            <span>Click to upload a photo</span>
          </button>
        )}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-santa-red text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review ⭐'}
      </button>
    </form>
  )
}
