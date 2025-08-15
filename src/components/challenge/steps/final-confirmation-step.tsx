'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle2, 
  AlertTriangle, 
  Shield, 
  Target, 
  Calendar,
  DollarSign,
  Lock
} from 'lucide-react'
import type { ChallengeFormData } from '../challenge-wizard'

interface FinalConfirmationStepProps {
  data: Partial<ChallengeFormData>
  onUpdate: (updates: Partial<ChallengeFormData>) => void
  onValidation: (isValid: boolean) => void
  onNext: () => void
  onBack: () => void
  onCreateChallenge: () => Promise<any>
  onChallengeCreated: (challenge: any) => void
  isSubmitting?: boolean
}

export function FinalConfirmationStep({
  data,
  onUpdate,
  onValidation,
  onNext,
  onBack,
  onCreateChallenge,
  onChallengeCreated,
  isSubmitting = false
}: FinalConfirmationStepProps) {
  const [hasAgreed, setHasAgreed] = useState(false)
  const [isCreatingChallenge, setIsCreatingChallenge] = useState(false)

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

  const getEndDate = () => {
    if (!data.startDate || !data.durationDays) return ''
    const start = new Date(data.startDate)
    const end = new Date(start)
    end.setDate(start.getDate() + data.durationDays - 1)
    return end.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Final Confirmation
        </h1>
        <p className="text-muted-foreground">
          Review your commitment. Once you proceed to payment, your challenge begins.
        </p>
      </div>

      {/* Challenge Summary */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Your Challenge
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-lg">🎯</span>
                </div>
                <div>
                  <div className="font-medium text-sm text-muted-foreground">DAILY HABIT</div>
                  <div className="font-semibold text-lg">{data.title}</div>
                  {data.description && (
                    <div className="text-sm text-muted-foreground">{data.description}</div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="font-medium text-sm text-muted-foreground">DURATION</div>
                  <div className="font-semibold">{data.durationDays} consecutive days</div>
                  <div className="text-sm text-muted-foreground">
                    {data.startDate && new Date(data.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {getEndDate()}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <div className="font-medium text-sm text-muted-foreground">STAKE AMOUNT</div>
                  <div className="font-bold text-2xl text-red-600 dark:text-red-400">${data.stakeAmount}</div>
                  <div className="text-sm text-muted-foreground">Lost if you miss any day</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="font-medium text-sm text-muted-foreground">GUARANTEE</div>
                  <div className="font-semibold text-green-600 dark:text-green-400">100% refund if completed</div>
                  <div className="text-sm text-muted-foreground">Secure escrow by Stripe</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Warning */}
      <Card className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-900 dark:text-red-100 mb-2">
                Zero Tolerance Policy
              </h4>
              <div className="text-sm text-red-800 dark:text-red-200 space-y-2">
                <p>
                  <strong>Missing even ONE day = losing your entire ${data.stakeAmount}.</strong>
                </p>
                <p>
                  No exceptions for sickness, travel, emergencies, or forgetting to check in. 
                  This system is designed to be unforgiving to maximize your commitment.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms Agreement */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <button
              onClick={() => setHasAgreed(!hasAgreed)}
              className={`
                flex items-start gap-4 w-full text-left transition-all duration-200
                hover:bg-muted/50 p-3 rounded-lg
              `}
            >
              <div className={`
                flex-shrink-0 w-6 h-6 border-2 rounded transition-all duration-200
                ${hasAgreed 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'border-muted-foreground hover:border-primary'
                }
              `}>
                {hasAgreed && <CheckCircle2 className="w-4 h-4 m-0.5" />}
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">
                  I understand and agree to these terms
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• I will complete "{data.title}" every single day for {data.durationDays} consecutive days</li>
                  <li>• I will check in to the app each day to confirm completion</li>
                  <li>• Missing any day results in losing my entire ${data.stakeAmount} stake</li>
                  <li>• There are no exceptions, extensions, or partial refunds</li>
                  <li>• Completing all days results in a full refund to my payment method</li>
                </ul>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Security Note */}
      <div className="text-center text-xs text-muted-foreground space-y-1">
        <div className="flex items-center justify-center gap-4">
          <span>🔒 SSL Secured</span>
          <span>💳 Stripe Protected</span>
          <span>🛡️ Escrow Safe</span>
        </div>
        <p>Your payment is secure and will be held in escrow until challenge completion</p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting || isCreatingChallenge}>
          Back
        </Button>
        
        <Button 
          onClick={handleCreateChallenge}
          disabled={!hasAgreed || isSubmitting || isCreatingChallenge}
          loading={isCreatingChallenge}
          size="lg"
          className="min-w-48"
        >
          {isCreatingChallenge ? 'Creating Challenge...' : `Proceed to Payment ($${data.stakeAmount})`}
        </Button>
      </div>
    </div>
  )
}