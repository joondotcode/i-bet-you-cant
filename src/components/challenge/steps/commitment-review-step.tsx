'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  DollarSign, 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown,
  Shield,
  Clock
} from 'lucide-react'
import type { ChallengeFormData } from '../challenge-wizard'

interface CommitmentReviewStepProps {
  data: Partial<ChallengeFormData>
  onUpdate: (updates: Partial<ChallengeFormData>) => void
  onValidation: (isValid: boolean) => void
  onNext: () => void
  onBack: () => void
  onCreateChallenge: () => Promise<any>
  onChallengeCreated: (challenge: any) => void
  isSubmitting?: boolean
}

const FAILURE_SCENARIOS = [
  {
    scenario: 'Forgot to check-in',
    description: 'Completed the habit but forgot to log it in the app',
    consequence: 'Full stake lost',
    prevention: 'Set daily reminders and check-in immediately after completing your habit'
  },
  {
    scenario: 'Sick day',
    description: 'Got sick and couldn\'t complete the habit',
    consequence: 'Full stake lost',
    prevention: 'Choose a habit you can do even when mildly unwell, or have backup activities'
  },
  {
    scenario: 'Travel or schedule disruption',
    description: 'Unexpected travel or schedule change made habit impossible',
    consequence: 'Full stake lost',
    prevention: 'Plan how to maintain your habit during travel or disruptions'
  },
  {
    scenario: 'Lost motivation mid-challenge',
    description: 'Started strong but motivation faded after a week',
    consequence: 'Full stake lost',
    prevention: 'Focus on systems over motivation. Make the habit as easy as possible'
  }
]

export function CommitmentReviewStep({
  data,
  onUpdate,
  onValidation,
  onNext,
  onBack,
  onCreateChallenge,
  onChallengeCreated,
  isSubmitting = false
}: CommitmentReviewStepProps) {
  const [hasAgreed, setHasAgreed] = useState(false)
  const [isCreatingChallenge, setIsCreatingChallenge] = useState(false)

  // Validation effect
  useEffect(() => {
    onValidation(hasAgreed)
  }, [hasAgreed, onValidation])

  const handleCreateChallenge = async () => {
    if (!hasAgreed) return

    setIsCreatingChallenge(true)
    try {
      const challenge = await onCreateChallenge()
      if (challenge) {
        onChallengeCreated(challenge)
        onNext()
      }
    } finally {
      setIsCreatingChallenge(false)
    }
  }

  // Calculate end date
  const getEndDate = () => {
    if (!data.startDate || !data.durationDays) return ''
    const start = new Date(data.startDate)
    const end = new Date(start)
    end.setDate(start.getDate() + data.durationDays - 1)
    return end.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Calculate success rate based on duration
  const getSuccessRate = () => {
    switch (data.durationDays) {
      case 7: return 78
      case 14: return 65
      case 30: return 45
      default: return 50
    }
  }

  const successRate = getSuccessRate()

  return (
    <div className="space-y-8 p-6">
      {/* Unified Challenge Summary - Single Card Design */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-background/95 via-background to-background/95 backdrop-blur-xl border border-primary/10 shadow-2xl shadow-primary/5">
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary/5 pointer-events-none" />
        
        <CardContent className="relative p-12 space-y-10">
          {/* Hero Section - 5-Second Scannable */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Your Challenge</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-6xl font-bold text-primary leading-tight tracking-tight">{data.title}</h1>
              {data.description && (
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">{data.description}</p>
              )}
            </div>
          </div>

          {/* Key Metrics - Visual Hierarchy */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Duration - Primary KPI */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-background to-muted/20 rounded-xl p-8 border border-primary/20 text-center space-y-4">
                <div className="w-20 h-20 bg-primary/15 rounded-2xl flex items-center justify-center mx-auto">
                  <Calendar className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <p className="text-7xl font-black text-primary mb-2">{data.durationDays}</p>
                  <p className="text-lg font-bold text-foreground uppercase tracking-wider">Days</p>
                  <p className="text-sm text-muted-foreground">Every single day counts</p>
                </div>
              </div>
            </div>

            {/* Stake - High Risk Emphasis */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-red-400/10 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-red-50/50 to-red-100/30 dark:from-red-950/30 dark:to-red-900/20 rounded-xl p-8 border-2 border-red-200 dark:border-red-800 text-center space-y-4">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-950/50 rounded-2xl flex items-center justify-center mx-auto ring-4 ring-red-200/50 dark:ring-red-800/50">
                  <DollarSign className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-8xl font-black text-red-600 dark:text-red-400 mb-2">${data.stakeAmount}</p>
                  <p className="text-lg font-bold text-red-700 dark:text-red-300 uppercase tracking-wider">At Risk</p>
                  <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-red-200 dark:bg-red-900/50 rounded-full">
                    <AlertTriangle className="w-4 h-4 text-red-700 dark:text-red-300" />
                    <p className="text-sm font-semibold text-red-700 dark:text-red-300">All or nothing</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Rate - Contextual Insight */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-green-400/10 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/30 dark:to-green-900/20 rounded-xl p-8 border border-green-200 dark:border-green-800 text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-950/50 rounded-2xl flex items-center justify-center mx-auto">
                  <TrendingDown className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-7xl font-black text-green-600 dark:text-green-400 mb-2">{successRate}%</p>
                  <p className="text-lg font-bold text-green-700 dark:text-green-300 uppercase tracking-wider">Success Rate</p>
                  <Badge 
                    variant={successRate >= 70 ? 'default' : successRate >= 50 ? 'secondary' : 'destructive'}
                    className="mt-2 text-sm font-semibold px-4 py-1"
                  >
                    {successRate >= 70 ? 'High Probability' : successRate >= 50 ? 'Moderate Risk' : 'High Challenge'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline - Clean & Minimal */}
          <div className="bg-gradient-to-r from-muted/30 via-muted/10 to-muted/30 rounded-2xl p-8 border border-muted/30">
            <div className="flex items-center justify-between">
              <div className="text-center space-y-2">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Starts</p>
                <p className="text-2xl font-bold text-foreground">
                  {data.startDate && new Date(data.startDate).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              <div className="flex-1 mx-12 relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary transform -translate-y-1/2 rounded-full"></div>
                <div className="flex justify-between items-center relative">
                  <div className="w-5 h-5 bg-primary rounded-full border-4 border-background shadow-lg"></div>
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap">
                      {data.durationDays} days straight
                    </div>
                  </div>
                  <div className="w-5 h-5 bg-primary rounded-full border-4 border-background shadow-lg"></div>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Finishes</p>
                <p className="text-2xl font-bold text-foreground">
                  {getEndDate().split(',')[0]}
                </p>
              </div>
            </div>
          </div>

          {/* Contextual Insight */}
          <div className="bg-gradient-to-r from-amber-50/50 to-amber-100/30 dark:from-amber-950/30 dark:to-amber-900/20 rounded-2xl p-8 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-amber-800 dark:text-amber-200">What This Means</h3>
                <p className="text-amber-700 dark:text-amber-300 text-lg leading-relaxed">
                  Based on our data, <strong>{100 - successRate}% of people fail</strong> this exact challenge. 
                  The most common failure point is around day {Math.floor(data.durationDays / 3)}. 
                  Your biggest advantage: <strong>knowing this upfront</strong>.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Failure Prevention & Guarantee - Integrated Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Common Failures - Streamlined */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-red-50/30 to-red-100/20 dark:from-red-950/20 dark:to-red-900/10 border border-red-200/50 dark:border-red-800/50">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-800 dark:text-red-200">Avoid Common Pitfalls</h3>
                <p className="text-sm text-red-600 dark:text-red-400">Why {100 - successRate}% fail</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {FAILURE_SCENARIOS.slice(0, 2).map((item, index) => (
                <div key={index} className="bg-red-100/50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200/50 dark:border-red-800/50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-red-900 dark:text-red-100 text-sm">{item.scenario}</h4>
                    <Badge variant="destructive" className="text-xs px-2 py-0.5">Lost</Badge>
                  </div>
                  <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">{item.prevention}</p>
                </div>
              ))}
              <div className="text-center pt-2">
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">Plan ahead. No exceptions.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Money-Back Guarantee - Simplified */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50/30 to-green-100/20 dark:from-green-950/20 dark:to-green-900/10 border border-green-200/50 dark:border-green-800/50">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-800 dark:text-green-200">Complete = Refund</h3>
                <p className="text-sm text-green-600 dark:text-green-400">100% money-back guarantee</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-100/50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200/50 dark:border-green-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center text-xs font-bold text-green-700 dark:text-green-200">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200 text-sm">Secure Processing</h4>
                    <p className="text-xs text-green-600 dark:text-green-400">Stripe handles your ${data.stakeAmount}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-100/50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200/50 dark:border-green-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center text-xs font-bold text-green-700 dark:text-green-200">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200 text-sm">Automatic Refund</h4>
                    <p className="text-xs text-green-600 dark:text-green-400">Complete all {data.durationDays} days → instant return</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Final Agreement - Refined */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 border-2 border-primary/20 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-primary/3 pointer-events-none" />
        
        <CardContent className="relative p-8">
          <div className="flex items-start gap-6">
            <button
              onClick={() => setHasAgreed(!hasAgreed)}
              className={`
                flex-shrink-0 w-8 h-8 border-2 rounded-xl transition-all duration-300 hover:scale-105
                ${hasAgreed 
                  ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'border-muted-foreground hover:border-primary bg-background'
                }
              `}
            >
              {hasAgreed && <CheckCircle2 className="w-5 h-5 m-0.5" />}
            </button>
            <div className="space-y-4 flex-1">
              <div>
                <h4 className="text-xl font-bold text-foreground mb-2">
                  I understand the commitment terms
                </h4>
                <p className="text-muted-foreground">
                  By checking this box, you're agreeing to the all-or-nothing challenge structure.
                </p>
              </div>
              
              <div className="bg-muted/30 rounded-xl p-6 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-foreground">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      Complete <strong>"{data.title}"</strong> for {data.durationDays} days
                    </p>
                    <p className="flex items-center gap-2 text-foreground">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      Check-in daily to confirm completion
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Miss one day = lose entire ${data.stakeAmount} stake
                    </p>
                    <p className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Complete all = full refund guaranteed
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-muted/50 pt-3 mt-4">
                  <p className="text-xs text-muted-foreground text-center font-medium">
                    No exceptions • No extensions • No partial refunds
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting || isCreatingChallenge}>
          Back to Duration
        </Button>
        
        <Button 
          onClick={handleCreateChallenge}
          disabled={!hasAgreed || isSubmitting || isCreatingChallenge}
          loading={isCreatingChallenge}
          size="lg"
          className="min-w-48"
        >
          {isCreatingChallenge ? 'Creating Challenge...' : `Create Challenge & Proceed to Payment`}
        </Button>
      </div>
    </div>
  )
}