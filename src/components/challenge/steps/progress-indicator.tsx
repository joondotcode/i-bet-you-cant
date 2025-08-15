'use client'

import { Check } from 'lucide-react'

interface WizardStep {
  id: number
  title: string
  description: string
  isOptional?: boolean
}

interface ProgressIndicatorProps {
  steps: WizardStep[]
  currentStep: number
  completedSteps: Set<number>
  onStepClick?: (stepId: number) => void
}

export function ProgressIndicator({ 
  steps, 
  currentStep, 
  completedSteps, 
  onStepClick 
}: ProgressIndicatorProps) {
  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 z-0" />
        
        {/* Progress line */}
        <div 
          className="absolute top-5 left-0 h-0.5 bg-primary z-10 transition-all duration-500 ease-out"
          style={{ 
            width: `${((Math.max(0, currentStep - 1)) / (steps.length - 1)) * 100}%` 
          }}
        />

        {/* Step circles */}
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id)
          const isCurrent = currentStep === step.id
          const isPast = step.id < currentStep
          const isClickable = onStepClick && (isCompleted || isPast || step.id === currentStep + 1)

          return (
            <button
              key={step.id}
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={`
                relative z-20 flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold text-sm
                transition-all duration-300 ease-out transform hover:scale-105
                ${isCompleted || isPast
                  ? 'bg-primary border-primary text-primary-foreground shadow-lg' 
                  : isCurrent
                  ? 'bg-background border-primary text-primary ring-4 ring-primary/20 shadow-md' 
                  : 'bg-background border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                }
                ${isClickable 
                  ? 'cursor-pointer hover:shadow-lg' 
                  : 'cursor-not-allowed'
                }
              `}
              aria-label={`Step ${step.id}: ${step.title}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
            >
              {isCompleted || isPast ? (
                <Check className="w-5 h-5" />
              ) : (
                step.id
              )}
            </button>
          )
        })}
      </div>

      {/* Current Step Info */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            Step {currentStep}: {steps[currentStep - 1]?.title}
          </h2>
          {steps[currentStep - 1]?.isOptional && (
            <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
              Optional
            </span>
          )}
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {steps[currentStep - 1]?.description}
        </p>
      </div>

      {/* Step Labels - Desktop Only */}
      <div className="hidden md:flex items-start justify-between text-center">
        {steps.map((step) => {
          const isCompleted = completedSteps.has(step.id)
          const isCurrent = currentStep === step.id
          const isPast = step.id < currentStep

          return (
            <div 
              key={step.id}
              className={`
                flex-1 max-w-32 transition-opacity duration-300
                ${isCompleted || isCurrent || isPast ? 'opacity-100' : 'opacity-50'}
              `}
            >
              <h3 className={`
                text-sm font-medium mb-1 transition-colors duration-300
                ${isCurrent 
                  ? 'text-primary' 
                  : isCompleted || isPast
                  ? 'text-foreground'
                  : 'text-muted-foreground'
                }
              `}>
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-tight">
                {step.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}