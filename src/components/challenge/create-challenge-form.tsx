'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ErrorModal } from '@/components/ui/error-modal'
import { PaymentForm } from './payment-form'
import { z } from 'zod'

const challengeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  durationDays: z.number().refine(val => [7, 14, 30].includes(val), 'Duration must be 7, 14, or 30 days'),
  stakeAmount: z.number().min(15, 'Minimum stake is $15').max(100, 'Maximum stake is $100'),
  startDate: z.string().min(1, 'Start date is required').refine(val => {
    const date = new Date(val)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today
  }, 'Start date must be today or in the future')
})

type ChallengeFormData = z.infer<typeof challengeSchema>

export function CreateChallengeForm() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'payment'>('form')
  const [createdChallenge, setCreatedChallenge] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [formData, setFormData] = useState<ChallengeFormData>({
    title: '',
    description: '',
    durationDays: 7,
    stakeAmount: 15,
    startDate: new Date().toISOString().split('T')[0] // Today's date
  })


  const handleInputChange = (field: keyof ChallengeFormData, value: string | number) => {
    // Validate input parameters
    if (!field || (value === null || value === undefined)) {
      console.warn('Invalid input change parameters:', { field, value })
      return
    }
    
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    try {
      // Validate that formData exists and has required structure
      if (!formData || typeof formData !== 'object') {
        console.error('Invalid form data structure:', formData)
        const errorMsg = { general: 'Form data is corrupted. Please refresh the page.' }
        setErrors(errorMsg)
        setShowErrorModal(true)
        return false
      }
      
      // Create a clean copy of formData for validation
      const validationData = {
        ...formData,
        // Ensure description is either string or undefined (not empty string)
        description: formData.description?.trim() || undefined
      }
      
      // Use safeParse to avoid throwing errors
      const result = challengeSchema.safeParse(validationData)
      
      if (!result.success) {
        // Handle validation errors
        const newErrors: Record<string, string> = {}
        
        if (result.error && result.error.errors && Array.isArray(result.error.errors)) {
          result.error.errors.forEach(err => {
            if (err.path && Array.isArray(err.path) && err.path.length > 0) {
              const fieldName = err.path[0] as string
              newErrors[fieldName] = err.message || 'Validation error'
            }
          })
        }
        
        // If no specific field errors, add a general error
        if (Object.keys(newErrors).length === 0) {
          newErrors.general = 'Please fill in all required fields correctly.'
        }
        
        setErrors(newErrors)
        setShowErrorModal(true)
        return false
      }
      
      // Validation successful
      setErrors({})
      return true
    } catch (error) {
      // This should rarely happen now that we use safeParse
      if (process.env.NODE_ENV === 'development') {
        console.error('Unexpected validation error:', error)
      }
      
      const errorMsg = { general: 'An unexpected error occurred. Please try again.' }
      setErrors(errorMsg)
      setShowErrorModal(true)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Form submission started with data:', formData)
    }
    
    // Validate form - this will show error modal if validation fails
    if (!validateForm()) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Form validation failed')
      }
      return
    }

    setIsSubmitting(true)

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Sending request to API...')
      }
      // Clean the data before sending to API
      const cleanFormData = {
        ...formData,
        description: formData.description?.trim() || undefined
      }
      
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanFormData)
      })

      if (process.env.NODE_ENV === 'development') {
        console.log('API response status:', response.status)
      }
      const data = await response.json()
      if (process.env.NODE_ENV === 'development') {
        console.log('API response data:', data)
      }

      if (!response.ok) {
        let newErrors: Record<string, string> = {}
        
        if (response.status === 409) {
          newErrors.general = data.error || 'You already have an active challenge'
        } else if (data.details && Array.isArray(data.details)) {
          // Handle validation errors from API
          data.details.forEach((error: any) => {
            if (error.path && error.path[0]) {
              newErrors[error.path[0]] = error.message
            }
          })
        } else {
          newErrors.general = data.error || 'Failed to create challenge'
        }
        
        setErrors(newErrors)
        setShowErrorModal(true)
        return
      }

      // Success! Move to payment step
      if (process.env.NODE_ENV === 'development') {
        console.log('Challenge created successfully, moving to payment step')
      }
      setCreatedChallenge(data.challenge)
      setStep('payment')

    } catch (error) {
      console.error('Error creating challenge:', error)
      const networkError = { general: 'Network error. Please check your connection and try again.' }
      setErrors(networkError)
      setShowErrorModal(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentSuccess = () => {
    // Payment successful, redirect to dashboard
    router.push('/dashboard')
    router.refresh()
  }

  const handlePaymentError = (error: string) => {
    setErrors({ general: error })
    setShowErrorModal(true)
  }

  const handleBackToForm = () => {
    setStep('form')
    setCreatedChallenge(null)
  }

  // If we're on the payment step, show the payment form
  if (step === 'payment' && createdChallenge) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Challenge Created! 🎉
          </h2>
          <p className="text-muted-foreground">
            Now complete your commitment by staking ${createdChallenge.stake_amount}
          </p>
        </div>

        {errors.general && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        <PaymentForm
          challengeId={createdChallenge.id}
          amount={createdChallenge.stake_amount}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={handleBackToForm}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to Edit Challenge
          </Button>
        </div>
      </div>
    )
  }

  const durationOptions = [
    { value: 7, label: '7 days', description: 'Perfect for building a new habit' },
    { value: 14, label: '14 days', description: 'Strengthen your commitment' },
    { value: 30, label: '30 days', description: 'Transform your routine' }
  ]

  const today = new Date().toISOString().split('T')[0]
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 30)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Create Your Challenge</CardTitle>
        <p className="text-center text-muted-foreground">
          Stake $15 to commit to your goal. Complete every day to get your money back!
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Challenge Title */}
          <div>
            <Input
              label="Challenge Title"
              placeholder="e.g., Exercise for 30 minutes daily"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={errors.title}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description (Optional)
            </label>
            <textarea
              className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              placeholder="Add more details about your challenge..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              maxLength={500}
            />
            <div className="flex justify-between mt-1">
              {errors.description && (
                <p className="text-red-500 text-xs">{errors.description}</p>
              )}
              <p className="text-xs text-muted-foreground ml-auto">
                {formData.description?.length || 0}/500
              </p>
            </div>
          </div>

          {/* Duration Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Challenge Duration
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {durationOptions.map((option) => (
                <div
                  key={option.value}
                  className={`relative cursor-pointer rounded-lg border p-4 transition-all ${
                    formData.durationDays === option.value
                      ? 'border-primary bg-primary/5 ring-2 ring-primary'
                      : 'border-input hover:border-primary/50'
                  }`}
                  onClick={() => handleInputChange('durationDays', option.value)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{option.label}</h3>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.durationDays === option.value
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    }`}>
                      {formData.durationDays === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
              ))}
            </div>
            {errors.durationDays && (
              <p className="text-red-500 text-xs mt-1">{errors.durationDays}</p>
            )}
          </div>

          {/* Start Date */}
          <div>
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              error={errors.startDate}
              min={today}
              max={maxDateStr}
              required
            />
          </div>

          {/* Stake Amount */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Stake Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <input
                type="number"
                min="15"
                max="100"
                step="5"
                value={formData.stakeAmount}
                onChange={(e) => handleInputChange('stakeAmount', parseInt(e.target.value) || 15)}
                className="flex h-12 w-full rounded-lg border border-input bg-background pl-8 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Minimum $15, maximum $100. You'll get this back if you complete all days!
            </p>
            {errors.stakeAmount && (
              <p className="text-red-500 text-xs mt-1">{errors.stakeAmount}</p>
            )}
          </div>

          {/* Risk Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-yellow-500 text-lg">⚠️</span>
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Important Commitment
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  By creating this challenge, you agree to stake ${formData.stakeAmount}. If you miss even one day, 
                  you'll forfeit your entire stake. This is designed to leverage loss aversion psychology 
                  to help you build consistent habits.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={isSubmitting}
            className="font-semibold"
          >
            {isSubmitting ? 'Creating Challenge...' : `Create Challenge & Stake $${formData.stakeAmount}`}
          </Button>
        </form>
      </CardContent>
      
      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Please fix the following errors"
        description="Please correct the highlighted fields and try again."
        errors={errors}
      />
    </Card>
  )
}