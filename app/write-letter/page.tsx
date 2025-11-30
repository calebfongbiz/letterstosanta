/**
 * Write Letter Page
 * 
 * Multi-child letter submission form with family account creation.
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
  const [tier, setTier] = useState<LetterTier>('TRACKER')
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
    if (!passcode) {
      newErrors.passcode = 'Passcode is required'
    } else if (!isValidPasscode(passcode)) {
      newErrors.passcode = 'Passcode must be 4-6 alphanumeric characters'
    }
    if (passcode !== passcodeConfirm) {
      newErrors.passcodeConfirm = 'Passcodes do not match'
    }

    // Children validation
    children.forEach((child, index) => {
      if (!child.name.trim()) {
        newErrors[`child_${child.id}_name`] = 'Child name is required'
      }
      if (!child.age || parseInt(child.age) < 1 || parseInt(child.age) > 18) {
        newErrors[`child_${child.id}_age`] = 'Please enter a valid age (1-18)'
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

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentFirstName,
          parentLastName,
          parentEmail,
          passcode,
          tier,
          children: children.map((c) => ({
            name: c.name,
            age: parseInt(c.age),
            letterText: c.letterText,
            wishlist: c.wishlist || null,
            goodThings: c.goodThings || null,
            petsAndFamily: c.petsAndFamily || null,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit order')
      }

      // Redirect to thank you page
      router.push('/thank-you')
    } catch (error) {
      console.error('Submission error:', error)
      setErrors({
        submit: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
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
                    Add extra children for just $2.99 each.
                  </p>
                )}
                {tier === 'EXPERIENCE' && (
                  <p className="text-snow-cream/70 text-sm">
                    🎅 The complete package! Track your letter&apos;s journey AND receive a personalized 
                    Santa letter with Nice List Certificate. Add extra children for $2.99 each.
                  </p>
                )}
              </div>
            </FormSection>

            {/* Parent Info */}
            <FormSection
              title="Parent Information"
              description="Your details for account creation and updates"
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
                placeholder="your@email.com"
                error={errors.parentEmail}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Create Passcode"
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="4-6 characters"
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
              <p className="text-snow-cream/50 text-xs">
                You&apos;ll use your last name and passcode to log in and track your letters.
              </p>
            </FormSection>

            {/* Children */}
            {children.map((child, index) => (
              <FormSection
                key={child.id}
                title={`Child ${index + 1}${child.name ? `: ${child.name}` : ''}`}
                description={index === 0 ? "Tell us about your child and their letter to Santa" : undefined}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Child's Name"
                      value={child.name}
                      onChange={(e) => updateChild(child.id, 'name', e.target.value)}
                      placeholder="First name"
                      error={errors[`child_${child.id}_name`]}
                    />
                    <Input
                      label="Age"
                      type="number"
                      min="1"
                      max="18"
                      value={child.age}
                      onChange={(e) => updateChild(child.id, 'age', e.target.value)}
                      placeholder="Age"
                      error={errors[`child_${child.id}_age`]}
                    />
                  </div>

                  <Textarea
                    label="Letter to Santa"
                    value={child.letterText}
                    onChange={(e) => updateChild(child.id, 'letterText', e.target.value)}
                    placeholder="Dear Santa, ..."
                    error={errors[`child_${child.id}_letterText`]}
                    rows={5}
                  />

                  <Textarea
                    label="Christmas Wishlist (Optional)"
                    value={child.wishlist}
                    onChange={(e) => updateChild(child.id, 'wishlist', e.target.value)}
                    placeholder="What would they like for Christmas?"
                    rows={3}
                  />

                  <Textarea
                    label="Good Things They've Done (Optional)"
                    value={child.goodThings}
                    onChange={(e) => updateChild(child.id, 'goodThings', e.target.value)}
                    placeholder="Tell Santa about the kind things they've done this year..."
                    rows={3}
                  />

                  <Textarea
                    label="Pets & Family (Optional)"
                    value={child.petsAndFamily}
                    onChange={(e) => updateChild(child.id, 'petsAndFamily', e.target.value)}
                    placeholder="Do they have any pets or siblings Santa should know about?"
                    rows={2}
                  />

                  {/* TODO: File upload for handwritten letter photo */}
                  {/* <FileInput
                    label="Photo of Handwritten Letter (Optional)"
                    accept="image/*"
                    helperText="Upload a photo of their handwritten letter for extra magic!"
                  /> */}

                  {/* Remove child button */}
                  {children.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChild(child.id)}
                      className="text-santa-red-light text-sm hover:underline"
                    >
                      Remove this child
                    </button>
                  )}
                </div>
              </FormSection>
            ))}

            {/* Add Child Button */}
            {canAddChildren && (
              <button
                type="button"
                onClick={addChild}
                className="w-full p-4 rounded-xl border-2 border-dashed border-white/20 text-snow-cream/70 hover:border-gold/50 hover:text-gold transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Another Child (+$2.99)
              </button>
            )}

            {!canAddChildren && (
              <p className="text-center text-snow-cream/50 text-sm p-4 bg-white/5 rounded-xl">
                💡 Upgrade to a paid plan to add multiple children to your account
              </p>
            )}

            {/* Order Summary */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-forest-green/20 to-santa-red/20 border border-white/10">
              <h3 className="font-display font-semibold text-lg text-snow-cream mb-4">
                Order Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-snow-cream/70">
                  <span>{PRICING[tier].name}</span>
                  <span>{formatPrice(PRICING[tier].price)}</span>
                </div>
                {children.length > 1 && tier !== 'FREE' && (
                  <div className="flex justify-between text-snow-cream/70">
                    <span>Extra children ({children.length - 1} × $2.99)</span>
                    <span>${((children.length - 1) * 2.99).toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 mt-2 border-t border-white/10 flex justify-between font-semibold text-snow-cream">
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
              size="xl"
              className="w-full"
              isLoading={isSubmitting}
            >
              {totalPrice === 0 ? 'Send Letter to Santa ✨' : `Complete Order - ${formatPrice(totalPrice)}`}
            </Button>

            {/* Note about payment */}
            {totalPrice > 0 && (
              <p className="text-center text-snow-cream/40 text-xs">
                🔒 Payment integration coming soon. For now, all orders are processed as demo orders.
              </p>
            )}
          </Card>
        </form>
      </div>
    </SectionContainer>
  )
}
