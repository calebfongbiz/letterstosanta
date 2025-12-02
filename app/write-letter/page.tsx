/**
 * Write Letter Page
 * 
 * Multi-child letter submission form with family account creation.
 * Integrates with Stripe for paid tiers.
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Button,
  Card,
  Input,
  Textarea,
  Select,
  FileInput,
  FormSection,
  SectionContainer,
} from '@/components'
import { PRICING, calculateOrderPrice, type LetterTier } from '@/lib/types'
import { formatPrice, isValidEmail, isValidPasscode } from '@/lib/utils'

// Child form state
interface ChildForm {
  id: string
  name: string
  age: string
  letterText: string
  wishlist: string
  goodThings: string
  petsAndFamily: string
}

// Initial empty child form
const createEmptyChild = (): ChildForm => ({
  id: Math.random().toString(36).substring(7),
  name: '',
  age: '',
  letterText: '',
  wishlist: '',
  goodThings: '',
  petsAndFamily: '',
})

export default function WriteLetterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Form state
  const [parentFirstName, setParentFirstName] = useState('')
  const [parentLastName, setParentLastName] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [passcode, setPasscode] = useState('')
  const [passcodeConfirm, setPasscodeConfirm] = useState('')
  const [tier, setTier] = useState<LetterTier>('EXPERIENCE')
  const [children, setChildren] = useState<ChildForm[]>([createEmptyChild()])

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Get tier from URL params
  useEffect(() => {
    const tierParam = searchParams.get('tier')
    if (tierParam && ['FREE', 'TRACKER', 'EXPERIENCE'].includes(tierParam)) {
      setTier(tierParam as LetterTier)
    }
  }, [searchParams])

  // Calculate pricing
  const totalPrice = calculateOrderPrice(tier, children.length)
  const canAddChildren = tier !== 'FREE'

  // Add a new child
  const addChild = () => {
    if (canAddChildren) {
      setChildren([...children, createEmptyChild()])
    }
  }

  // Remove a child
  const removeChild = (id: string) => {
    if (children.length > 1) {
      setChildren(children.filter((c) => c.id !== id))
    }
  }

  // Update child field
  const updateChild = (id: string, field: keyof ChildForm, value: string) => {
    setChildren(
      children.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    )
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Parent validation
    if (!parentFirstName.trim()) {
      newErrors.parentFirstName = 'First name is required'
    }
    if (!parentLastName.trim()) {
      newErrors.parentLastName = 'Last name is required'
    }
    if (!parentEmail.trim()) {
      newErrors.parentEmail = 'Email is required'
    } else if (!isValidEmail(parentEmail)) {
      newErrors.parentEmail = 'Please enter a valid email'
    }
    if (!passcode.trim()) {
      newErrors.passcode = 'Passcode is required'
    } else if (!isValidPasscode(passcode)) {
      newErrors.passcode = 'Passcode must be 4-6 characters'
    }
    if (passcode !== passcodeConfirm) {
      newErrors.passcodeConfirm = 'Passcodes do not match'
    }

    // Children validation
    children.forEach((child) => {
      if (!child.name.trim()) {
        newErrors[`child_${child.id}_name`] = "Child's name is required"
      }
      if (!child.age.trim()) {
        newErrors[`child_${child.id}_age`] = "Child's age is required"
      }
      if (!child.letterText.trim()) {
        newErrors[`child_${child.id}_letterText`] = 'Letter content is required'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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
        age: c.age,
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
          throw new Error(data.error || 'Failed to submit order')
        }

        router.push('/thank-you')
        return
      }

      // For paid tiers, redirect to Stripe Checkout
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
    } catch (error) {
      console.error('Submission error:', error)
      setErrors({
        submit: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] pt-20">
    <SectionContainer size="md">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-5xl mb-4 block">✉️</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-snow-cream mb-4">
            Write Your Letter to Santa
          </h1>
          <p className="text-snow-cream/70 text-lg">
            Fill out the form below to begin your magical journey to the North Pole
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card variant="glass" className="p-6 md:p-8 space-y-8">
            {/* Tier Selection */}
            <FormSection
              title="Choose Your Experience"
              description="Select the magical tier that's right for your family"
            >
              <Select
                label="Experience Tier"
                value={tier}
                onChange={(e) => setTier(e.target.value as LetterTier)}
                options={[
                  { value: 'FREE', label: `${PRICING.FREE.name} - FREE` },
                  { value: 'TRACKER', label: `${PRICING.TRACKER.name} - $${PRICING.TRACKER.price}` },
                  { value: 'EXPERIENCE', label: `${PRICING.EXPERIENCE.name} - $${PRICING.EXPERIENCE.price}` },
                ]}
              />

              {/* Tier info */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 mt-4">
                {tier === 'FREE' && (
                  <p className="text-snow-cream/70 text-sm">
                    📧 You&apos;ll receive daily elf story emails about your letter&apos;s journey. 
                    Tracker access is not included in the free tier.
                  </p>
                )}
                {tier === 'TRACKER' && (
                  <p className="text-snow-cream/70 text-sm">
                    ✈️ Watch your letter travel through 6 magical locations with our flight-style tracker! 
                    Add extra children for +$2.99 each.
                  </p>
                )}
                {tier === 'EXPERIENCE' && (
                  <p className="text-snow-cream/70 text-sm">
                    🎅 The complete magical experience! Includes tracker, personalized Santa letter, 
                    Nice List Certificate, and more. Add extra children for +$2.99 each.
                  </p>
                )}
              </div>
            </FormSection>

            {/* Parent Information */}
            <FormSection
              title="Parent Information"
              description="Used for account creation and updates"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={parentFirstName}
                  onChange={(e) => setParentFirstName(e.target.value)}
                  placeholder="Your first name"
                  error={errors.parentFirstName}
                />
                <Input
                  label="Last Name"
                  value={parentLastName}
                  onChange={(e) => setParentLastName(e.target.value)}
                  placeholder="Your last name"
                  error={errors.parentLastName}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="you@example.com"
                error={errors.parentEmail}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Create Passcode"
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="4-6 characters (use to log in)"
                  error={errors.passcode}
                />
                <Input
                  label="Confirm Passcode"
                  type="password"
                  value={passcodeConfirm}
                  onChange={(e) => setPasscodeConfirm(e.target.value)}
                  placeholder="Confirm passcode"
                  error={errors.passcodeConfirm}
                />
              </div>
            </FormSection>

            {/* Children's Letters */}
            <FormSection
              title="Children's Letters"
              description="Write a magical letter for each child"
            >
              {children.map((child, index) => (
                <div
                  key={child.id}
                  className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-display font-semibold text-snow-cream">
                      {index === 0 ? '👧 First Child' : `👧 Child ${index + 1}`}
                    </h4>
                    {children.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeChild(child.id)}
                        className="text-snow-cream/40 hover:text-santa-red transition-colors text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Child's Name"
                      value={child.name}
                      onChange={(e) => updateChild(child.id, 'name', e.target.value)}
                      placeholder="Child's first name"
                      error={errors[`child_${child.id}_name`]}
                    />
                    <Select
                      label="Child's Age"
                      value={child.age}
                      onChange={(e) => updateChild(child.id, 'age', e.target.value)}
                      options={[
                        { value: '', label: 'Select age' },
                        ...Array.from({ length: 13 }, (_, i) => ({
                          value: String(i + 1),
                          label: `${i + 1} year${i === 0 ? '' : 's'} old`,
                        })),
                      ]}
                      error={errors[`child_${child.id}_age`]}
                    />
                  </div>

                  <Textarea
                    label="Letter to Santa"
                    value={child.letterText}
                    onChange={(e) => updateChild(child.id, 'letterText', e.target.value)}
                    placeholder="Dear Santa, I have been very good this year..."
                    rows={5}
                    error={errors[`child_${child.id}_letterText`]}
                  />

                  <Input
                    label="Wishlist (Optional)"
                    value={child.wishlist}
                    onChange={(e) => updateChild(child.id, 'wishlist', e.target.value)}
                    placeholder="Toy car, doll, books..."
                  />

                  <Input
                    label="Good Things I've Done (Optional)"
                    value={child.goodThings}
                    onChange={(e) => updateChild(child.id, 'goodThings', e.target.value)}
                    placeholder="Helped with chores, was kind to sibling..."
                  />

                  <Input
                    label="Pets & Family Members (Optional)"
                    value={child.petsAndFamily}
                    onChange={(e) => updateChild(child.id, 'petsAndFamily', e.target.value)}
                    placeholder="Dog named Max, little sister Emma..."
                  />
                </div>
              ))}

              {/* Add Child Button */}
              {canAddChildren && (
                <button
                  type="button"
                  onClick={addChild}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-white/20 text-snow-cream/60 hover:border-gold/50 hover:text-gold transition-all flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Another Child (+$2.99)
                </button>
              )}
            </FormSection>

            {/* Order Summary */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-forest-green/20 to-santa-red/20 border border-white/10">
              <h3 className="font-display font-semibold text-snow-cream mb-4">
                Order Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-snow-cream/70">
                  <span>{PRICING[tier].name}</span>
                  <span>{formatPrice(PRICING[tier].price)}</span>
                </div>
                {children.length > 1 && tier !== 'FREE' && (
                  <div className="flex justify-between text-snow-cream/70">
                    <span>Extra Children ({children.length - 1})</span>
                    <span>{formatPrice(PRICING[tier].extraChildPrice * (children.length - 1))}</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-2 mt-2 flex justify-between font-semibold text-snow-cream">
                  <span>Total</span>
                  <span className="text-gold">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 rounded-xl bg-santa-red/20 border border-santa-red/30 text-snow-cream">
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
            >
              {tier === 'FREE' ? 'Submit Your Letter' : `Continue to Payment - ${formatPrice(totalPrice)}`}
            </Button>

            {/* Payment notice */}
            {totalPrice > 0 && (
              <p className="text-center text-snow-cream/40 text-xs">
                🔒 Secure payment powered by Stripe
              </p>
            )}
          </Card>
        </form>
      </div>
    </SectionContainer>
    </div>
  )
}
