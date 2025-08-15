'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { ErrorModal } from '@/components/ui/error-modal'
import { HabitChoiceStep } from './steps/habit-choice-step'
import { SimpleDurationStep } from './steps/simple-duration-step'
import { StakeAmountStep } from './steps/stake-amount-step'
import { SummaryStep } from './steps/summary-step'
import { z } from 'zod'

// Challenge data schema
const challengeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  durationDays: z.number().refine(val => [7, 14, 30].includes(val), 'Duration must be 7, 14, or 30 days'),
  stakeAmount: z.number().min(15, 'Minimum stake is $15').max(100, 'Maximum stake is $100').default(15),
  startDate: z.string().min(1, 'Start date is required').refine(val => {
    const date = new Date(val)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today
  }, 'Start date must be today or in the future')
})

export type ChallengeFormData = z.infer<typeof challengeSchema>

// Karen's Simple Constants - No more scattered magic numbers!
const TOTAL_STEPS = 4
const STEP_TITLES = ['Choose Habit', 'Set Duration', 'Set Stake', 'Review'] as const

interface ChallengeWizardProps {
  onProgressChange?: (currentStep: number, totalSteps: number, stepTitle: string, isVisible: boolean) => void
}

export function ChallengeWizard({ onProgressChange }: ChallengeWizardProps = {}) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<ChallengeFormData>>({
    stakeAmount: 15,
    startDate: new Date().toISOString().split('T')[0]
  })
  
  // State management
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showErrorModal, setShowErrorModal] = useState(false)

  // Progress tracking
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [canProceed, setCanProceed] = useState(false)
  
  // Return-to-origin navigation
  const [returnToStep, setReturnToStep] = useState<number | null>(null)

  // Karen's Simple Progress Update - One function, clear purpose
  const updateProgress = useCallback((step: number) => {
    const isVisible = step <= TOTAL_STEPS
    const stepTitle = isVisible ? STEP_TITLES[step - 1] : ''
    onProgressChange?.(step, TOTAL_STEPS, stepTitle, isVisible)
  }, [onProgressChange])

  // Simple step navigation - no useEffect bloat
  const goToStep = useCallback((step: number) => {
    setCurrentStep(step)
    updateProgress(step)
  }, [updateProgress])

  // Update form data
  const updateFormData = useCallback((updates: Partial<ChallengeFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
    // Clear any errors related to updated fields
    if (errors && Object.keys(errors).length > 0) {
      const clearedErrors = { ...errors }
      Object.keys(updates).forEach(key => {
        delete clearedErrors[key]
      })
      setErrors(clearedErrors)
    }
  }, [errors])

  // Navigation handlers - Karen's simplified version with return-to-origin logic
  const handleNext = useCallback(() => {
    if (canProceed) {
      setCompletedSteps(prev => new Set([...prev, currentStep]))
      
      // If we have a return destination, go there instead of next step
      if (returnToStep !== null) {
        goToStep(returnToStep)
        setReturnToStep(null) // Clear the return destination
      } else if (currentStep < TOTAL_STEPS) {
        goToStep(currentStep + 1)
      }
      
      setCanProceed(false) // Reset for next step validation
    }
  }, [currentStep, canProceed, goToStep, returnToStep])

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      // Clear return destination when manually navigating back
      setReturnToStep(null)
      goToStep(currentStep - 1)
      setCanProceed(true) // Allow proceeding if coming back from a completed step
    } else {
      // If on step 1, go back to dashboard
      router.push('/dashboard')
    }
  }, [currentStep, goToStep, router])

  // Smart navigation function for edit-and-return flow
  const handleGoToStepForEdit = useCallback((targetStep: number) => {
    // Set the current step as the return destination
    setReturnToStep(currentStep)
    goToStep(targetStep)
    setCanProceed(true) // Allow proceeding immediately when editing
  }, [currentStep, goToStep])

  // Handle final submission from summary step
  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // Validate final data
      const validationResult = challengeSchema.safeParse(formData)
      
      if (!validationResult.success) {
        const newErrors: Record<string, string> = {}
        validationResult.error.errors.forEach(err => {
          if (err.path && err.path.length > 0) {
            const fieldName = err.path[0] as string
            newErrors[fieldName] = err.message
          }
        })
        setErrors(newErrors)
        setShowErrorModal(true)
        setIsSubmitting(false)
        return
      }

      // Clean data for API
      const cleanFormData = {
        ...validationResult.data,
        description: validationResult.data.description?.trim() || undefined
      }

      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanFormData)
      })

      const data = await response.json()

      if (!response.ok) {
        let newErrors: Record<string, string> = {}
        
        if (response.status === 409) {
          newErrors.general = data.error || 'You already have an active challenge'
        } else if (data.details && Array.isArray(data.details)) {
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
        setIsSubmitting(false)
        return
      }

      // Success - redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Error creating challenge:', error)
      const networkError = { general: 'Network error. Please check your connection and try again.' }
      setErrors(networkError)
      setShowErrorModal(true)
      setIsSubmitting(false)
    }
  }

  // Step validation callback
  const handleStepValidation = useCallback((isValid: boolean) => {
    setCanProceed(isValid)
  }, [])

  // Render current step
  const renderCurrentStep = () => {
    const commonProps = {
      data: formData,
      onUpdate: updateFormData,
      onValidation: handleStepValidation,
      onNext: handleNext,
      onBack: handleBack,
      isSubmitting,
      returnToStep // Pass return destination info to components
    }

    switch (currentStep) {
      case 1:
        return <HabitChoiceStep {...commonProps} />
      
      case 2:
        return <SimpleDurationStep {...commonProps} />
      
      case 3:
        return <StakeAmountStep {...commonProps} />
      
      case 4:
        return (
          <SummaryStep 
            {...commonProps} 
            onGoToStep={handleGoToStepForEdit}
            onNext={handleFinalSubmit}
          />
        )
      
      default:
        return null
    }
  }

  // Initialize progress on mount  
  useEffect(() => {
    updateProgress(1) // Always start at step 1
  }, [updateProgress])

  return (
    <div className="min-h-screen amy-radial-glow amy-dot-pattern">
      {/* Main Content - No more competing sticky elements! */}
      <div className="py-8">
        {renderCurrentStep()}
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Please fix the following errors"
        description="Please correct the highlighted fields and try again."
        errors={errors}
      />

      {/* Global Warning Footer - Always Visible */}
      <Card className="bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60">
        <CardContent className="p-6">
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0 w-11 h-11 bg-slate-100 dark:bg-slate-800/80 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-[15px]">
                Zero Tolerance Commitment
              </h4>
              <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                This is a <span className="font-medium text-slate-900 dark:text-slate-100">zero-tolerance system</span>. Missing even one single day will result in 
                immediate challenge failure and loss of your entire <span className="font-medium">${formData.stakeAmount || 15}</span> stake. 
                There are no exceptions, extensions, or refunds for missed days.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}