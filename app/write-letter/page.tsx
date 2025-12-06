'use client'

/**
 * Write Letter Page
 * 
 * Multi-step form for parents to submit letters on behalf of their children.
 * Supports multiple children and different pricing tiers.
 */

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Card, Input, SectionContainer } from '@/components'
import { PRICING, calculateOrderPrice, type LetterTier } from '@/lib/types'

// Form data for each child
interface ChildForm {
  id: string
  name: string
  age: string
  letterText: string
  wishlist: string
  goodThings: string
  petsAndFamily: string
}

// Create empty child form
const createEmptyChild = (): ChildForm => ({
  id: Math.random().toString(36).substr(2, 9),
  name: '',
  age: '',
  letterText: '',
  wishlist: '',
  goodThings: '',
  petsAndFamily: '',
})

export default function WriteLetterPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Get tier from URL params, default to FREE
  const tierParam = searchParams.get('tier') as LetterTier | null
  const [tier, setTier] = useState<LetterTier>(tierParam === 'MAGIC' ? 'MAGIC' : 'FREE')

  // Form state
  const [parentFirstName, setParentFirstName] = useState('')
  const [parentLastName, setParentLastName] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [passcode, setPasscode] = useState('')
  const [children, setChildren] = useState<ChildForm[]>([createEmptyChild()])
  const [currentChildIndex, setCurrentChildIndex] = useState(0)
  const [step, setStep] = useState<'parent' | 'children' | 'review'>('parent')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Helper to format price
  const formatPrice = (price: number) => price === 0 ? 'FREE' : `$${price.toFixed(2)}`

  // Calculate total price
  const totalPrice = calculateOrderPrice(tier, children.length)

  // Validation
  const validateParentInfo = () => {
    if (!parentFirstName.trim()) return 'First name is required'
    if (!parentLastName.trim()) return 'Last name is required'
    if (!parentEmail.trim()) return 'Email is required'
    if (!parentEmail.includes('@')) return 'Please enter a valid email'
    if (!passcode.trim()) return 'Passcode is required'
    if (passcode.length < 4 || passcode.length > 6) return 'Passcode must be 4-6 characters'
    return null
  }

  const validateChildInfo = (child: ChildForm) => {
    if (!child.name.trim()) return 'Child\'s name is required'
    if (!child.age.trim()) return 'Child\'s age is required'
    if (!child.letterText.trim()) return 'Letter text is required'
    return null
  }

  const validateForm = () => {
    const parentError = validateParentInfo()
    if (parentError) {
      setError(parentError)
      return false
    }

    for (let i = 0; i < children.length; i++) {
      const childError = validateChildInfo(children[i])
      if (childError) {
        setError(`Child ${i + 1}: ${childError}`)
        return false
      }
    }

    setError(null)
    return true
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    const orderData = {
      parentFirstName,
      parentLastName,
      parentEmail,
      passcode,
      children: children.map((c) => ({
        name: c.name,
        age: parseInt(c.age, 10),
        letterText: c.letterText,
        wishlist: c.wishlist || null,
        goodThings: c.goodThings || null,
        petsAndFamily: c.petsAndFamily || null,
      })),
    }

    try {
      // For FREE tier, submit directly
      if (tier === 'FREE') {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...orderData,
            tier,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create order')
        }

        // Redirect to success page
        router.push('/checkout/success?free=true')
      } else {
        // For MAGIC tier, redirect to Stripe checkout
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tier,
            childrenCount: children.length,
            orderData,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create checkout session')
        }

        // Redirect to Stripe Checkout
        if (data.url) {
          window.location.href = data.url
        }
      }
    } catch (err) {
      console.error('Submission error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create order. Please try again.')
      setIsSubmitting(false)
    }
  }

  // Add another child
  const addChild = () => {
    setChildren([...children, createEmptyChild()])
    setCurrentChildIndex(children.length)
  }

  // Remove a child
  const removeChild = (index: number) => {
    if (children.length > 1) {
      const newChildren = children.filter((_, i) => i !== index)
      setChildren(newChildren)
      if (currentChildIndex >= newChildren.length) {
        setCurrentChildIndex(newChildren.length - 1)
      }
    }
  }

  // Update child form data
  const updateChild = (index: number, field: keyof ChildForm, value: string) => {
    const newChildren = [...children]
    newChildren[index] = { ...newChildren[index], [field]: value }
    setChildren(newChildren)
  }

  const currentChild = children[currentChildIndex]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] py-12">
      <SectionContainer size="md">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-snow-cream mb-4">
              ✉️ Write Your Letter to Santa
            </h1>
            <p className="text-snow-cream/70">
              Fill out the details below to send a magical letter to the North Pole
            </p>
          </div>

          {/* Tier selector */}
          <Card variant="glass" className="p-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setTier('FREE')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  tier === 'FREE'
                    ? 'border-gold bg-gold/10'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="font-semibold text-snow-cream">Letter to Santa</div>
                <div className="text-gold font-bold">FREE</div>
                <div className="text-snow-cream/50 text-xs mt-1">Story emails + delivery confirmation</div>
              </button>
              <button
                onClick={() => setTier('MAGIC')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  tier === 'MAGIC'
                    ? 'border-gold bg-gold/10'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="font-semibold text-snow-cream">Santa&apos;s Magic ✨</div>
                <div className="text-gold font-bold">$7.99</div>
                <div className="text-snow-cream/50 text-xs mt-1">Flight tracker + Santa reply + certificate</div>
              </button>
            </div>
          </Card>

          {/* Progress steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {['Parent Info', 'Letter Details', 'Review'].map((label, index) => {
              const stepKey = ['parent', 'children', 'review'][index]
              const isActive = step === stepKey
              const isCompleted = 
                (stepKey === 'parent' && (step === 'children' || step === 'review')) ||
                (stepKey === 'children' && step === 'review')

              return (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-gold text-midnight-blue'
                        : isCompleted
                        ? 'bg-forest-green text-white'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <span className={`hidden sm:inline text-sm ${isActive ? 'text-gold' : 'text-white/50'}`}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Error display */}
          {error && (
            <div className="mb-6 p-4 bg-santa-red/20 border border-santa-red/50 rounded-xl text-santa-red text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Parent Information */}
            {step === 'parent' && (
              <Card variant="glass" className="p-6 md:p-8">
                <h2 className="font-display text-xl font-semibold text-snow-cream mb-6">
                  👨‍👩‍👧 Parent Information
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={parentFirstName}
                      onChange={(e) => setParentFirstName(e.target.value)}
                      placeholder="Your first name"
                      required
                    />
                    <Input
                      label="Last Name"
                      value={parentLastName}
                      onChange={(e) => setParentLastName(e.target.value)}
                      placeholder="Your last name"
                      required
                    />
                  </div>

                  <Input
                    label="Email"
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />

                  <Input
                    label="Passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="4-6 characters (use to log in)"
                    maxLength={6}
                    required
                  />
                  <p className="text-snow-cream/50 text-xs -mt-2">
                    You&apos;ll use your email and this passcode to log in and check the tracker
                  </p>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button
                    type="button"
                    variant="gold"
                    onClick={() => {
                      const error = validateParentInfo()
                      if (error) {
                        setError(error)
                      } else {
                        setError(null)
                        setStep('children')
                      }
                    }}
                  >
                    Continue to Letter →
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 2: Children's Letters */}
            {step === 'children' && (
              <Card variant="glass" className="p-6 md:p-8">
                {/* Child tabs */}
                {children.length > 1 && (
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {children.map((child, index) => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => setCurrentChildIndex(index)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                          currentChildIndex === index
                            ? 'bg-gold text-midnight-blue'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {child.name || `Child ${index + 1}`}
                      </button>
                    ))}
                  </div>
                )}

                <h2 className="font-display text-xl font-semibold text-snow-cream mb-6">
                  ✉️ {children.length > 1 ? `${currentChild.name || 'Child'}'s Letter` : "Child's Letter"}
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Child's Name"
                      value={currentChild.name}
                      onChange={(e) => updateChild(currentChildIndex, 'name', e.target.value)}
                      placeholder="Child's first name"
                      required
                    />
                    <Input
                      label="Age"
                      type="number"
                      value={currentChild.age}
                      onChange={(e) => updateChild(currentChildIndex, 'age', e.target.value)}
                      placeholder="Age"
                      min={1}
                      max={17}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-snow-cream/70 mb-2">
                      Letter to Santa *
                    </label>
                    <textarea
                      value={currentChild.letterText}
                      onChange={(e) => updateChild(currentChildIndex, 'letterText', e.target.value)}
                      placeholder="Dear Santa, ..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-snow-cream placeholder-snow-cream/30 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 min-h-[150px] resize-y"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-snow-cream/70 mb-2">
                      Wishlist (optional)
                    </label>
                    <textarea
                      value={currentChild.wishlist}
                      onChange={(e) => updateChild(currentChildIndex, 'wishlist', e.target.value)}
                      placeholder="What would they like for Christmas?"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-snow-cream placeholder-snow-cream/30 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 min-h-[80px] resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-snow-cream/70 mb-2">
                      Good things they&apos;ve done (optional)
                    </label>
                    <textarea
                      value={currentChild.goodThings}
                      onChange={(e) => updateChild(currentChildIndex, 'goodThings', e.target.value)}
                      placeholder="Share some good deeds Santa should know about..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-snow-cream placeholder-snow-cream/30 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 min-h-[80px] resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-snow-cream/70 mb-2">
                      Pets & Family (optional)
                    </label>
                    <textarea
                      value={currentChild.petsAndFamily}
                      onChange={(e) => updateChild(currentChildIndex, 'petsAndFamily', e.target.value)}
                      placeholder="Tell Santa about pets, siblings, or family members..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-snow-cream placeholder-snow-cream/30 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 min-h-[80px] resize-y"
                    />
                  </div>
                </div>

                {/* Add/remove children */}
                <div className="mt-6 flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addChild}
                  >
                    + Add Another Child
                  </Button>
                  {children.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeChild(currentChildIndex)}
                      className="text-santa-red border-santa-red/50 hover:bg-santa-red/10"
                    >
                      Remove This Child
                    </Button>
                  )}
                </div>

                {children.length > 1 && (
                  <p className="mt-2 text-snow-cream/50 text-sm">
                    +${PRICING[tier].extraChildPrice.toFixed(2)} per additional child
                  </p>
                )}

                <div className="mt-8 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('parent')}
                  >
                    ← Back
                  </Button>
                  <Button
                    type="button"
                    variant="gold"
                    onClick={() => {
                      // Validate all children
                      for (let i = 0; i < children.length; i++) {
                        const childError = validateChildInfo(children[i])
                        if (childError) {
                          setError(`Child ${i + 1}: ${childError}`)
                          setCurrentChildIndex(i)
                          return
                        }
                      }
                      setError(null)
                      setStep('review')
                    }}
                  >
                    Review Order →
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 3: Review */}
            {step === 'review' && (
              <Card variant="glass" className="p-6 md:p-8">
                <h2 className="font-display text-xl font-semibold text-snow-cream mb-6">
                  📋 Review Your Order
                </h2>

                {/* Parent info summary */}
                <div className="mb-6 p-4 bg-white/5 rounded-xl">
                  <h3 className="font-semibold text-snow-cream mb-2">Parent Information</h3>
                  <p className="text-snow-cream/70 text-sm">
                    {parentFirstName} {parentLastName}
                  </p>
                  <p className="text-snow-cream/70 text-sm">{parentEmail}</p>
                </div>

                {/* Children summary */}
                <div className="mb-6">
                  <h3 className="font-semibold text-snow-cream mb-3">Letters ({children.length})</h3>
                  <div className="space-y-3">
                    {children.map((child, index) => (
                      <div key={child.id} className="p-4 bg-white/5 rounded-xl">
                        <p className="font-medium text-snow-cream">
                          {child.name}, age {child.age}
                        </p>
                        <p className="text-snow-cream/50 text-sm mt-1 line-clamp-2">
                          {child.letterText}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order summary */}
                <div className="border-t border-white/10 pt-6">
                  <h3 className="font-semibold text-snow-cream mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-snow-cream/70">
                      <span>{PRICING[tier].name}</span>
                      <span>{formatPrice(PRICING[tier].price)}</span>
                    </div>
                    {children.length > 1 && (
                      <div className="flex justify-between text-snow-cream/70">
                        <span>Extra Children ({children.length - 1})</span>
                        <span>{formatPrice(PRICING[tier].extraChildPrice * (children.length - 1))}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold text-gold pt-2 border-t border-white/10">
                      <span>Total</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('children')}
                  >
                    ← Back
                  </Button>
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    isLoading={isSubmitting}
                  >
                    {tier === 'FREE' 
                      ? 'Send Letter to Santa 🎅' 
                      : `Continue to Payment - ${formatPrice(totalPrice)}`
                    }
                  </Button>
                </div>
              </Card>
            )}
          </form>

          {/* Back to home */}
          <div className="mt-8 text-center">
            <Link href="/" className="text-snow-cream/50 hover:text-snow-cream text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </SectionContainer>
    </div>
  )
}
