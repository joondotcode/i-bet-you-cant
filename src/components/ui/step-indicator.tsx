'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  title: string
  description?: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep
          const isUpcoming = stepNumber > currentStep

          return (
            <div key={index} className="flex items-center">
              {/* Step Circle */}
              <div className="relative flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                    isCompleted && "bg-green-500 border-green-500 text-white",
                    isActive && "bg-primary border-primary text-primary-foreground animate-pulse-glow",
                    isUpcoming && "bg-muted border-muted-foreground/20 text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{stepNumber}</span>
                  )}
                </div>

                {/* Step Info */}
                <div className="mt-3 text-center max-w-[100px]">
                  <div
                    className={cn(
                      "text-sm font-medium transition-colors duration-200",
                      isActive && "text-foreground",
                      isCompleted && "text-green-600",
                      isUpcoming && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-muted-foreground mt-1 hidden sm:block">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors duration-300",
                    stepNumber < currentStep ? "bg-green-500" : "bg-muted"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}