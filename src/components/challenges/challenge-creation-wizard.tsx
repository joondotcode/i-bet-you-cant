'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HabitDefinitionStep } from './steps/habit-definition-step'
import { DurationSelectionStep } from './steps/duration-selection-step'
import { CommitmentReviewStep } from './steps/commitment-review-step'
import { PaymentStep } from './steps/payment-step'

interface ChallengeData {
  title: string
  description: string
  duration: 7 | 14 | 21 | 30
  stakeAmount: number
  timeZone: string
  reminderTime?: string
}

export function ChallengeCreationWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [challengeData, setChallengeData] = useState<Partial<ChallengeData>>({
    stakeAmount: 15, // Fixed stake amount
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  })

  const steps = [
    { id: 1, title: 'Define Your Habit', description: 'What will you commit to doing daily?' },
    { id: 2, title: 'Choose Duration', description: 'How long will you maintain this habit?' },
    { id: 3, title: 'Review Commitment', description: 'Understand the stakes and consequences' },
    { id: 4, title: 'Secure Payment', description: 'Put your money where your commitment is' }
  ]

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateChallengeData = (updates: Partial<ChallengeData>) => {
    setChallengeData(prev => ({ ...prev, ...updates }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <HabitDefinitionStep
            data={challengeData}
            onUpdate={updateChallengeData}
            onNext={handleNext}
          />
        )
      case 2:
        return (
          <DurationSelectionStep
            data={challengeData}
            onUpdate={updateChallengeData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 3:
        return (
          <CommitmentReviewStep
            data={challengeData as ChallengeData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case 4:
        return (
          <PaymentStep
            data={challengeData as ChallengeData}
            onBack={handleBack}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold text-sm
              ${currentStep >= step.id 
                ? 'bg-blue-500 border-blue-500 text-white' 
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
              }
            `}>
              {currentStep > step.id ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                step.id
              )}
            </div>
            
            {index < steps.length - 1 && (
              <div className={`w-16 h-1 mx-4 ${
                currentStep > step.id ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Info */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Step {currentStep}: {steps[currentStep - 1].title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {steps[currentStep - 1].description}
        </p>
      </div>

      {/* Step Content */}
      {renderStep()}

      {/* Warning Footer */}
      <Card variant="outlined" className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                Important Reminder
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                This is a zero-tolerance system. Missing even <strong>one single day</strong> will result in immediate 
                challenge failure and loss of your $15 stake. There are no exceptions, extensions, or refunds for missed days.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}