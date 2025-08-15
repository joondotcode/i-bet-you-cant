'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PaymentForm } from '../payment-form'
import { 
  CheckCircle2, 
  Shield, 
  CreditCard, 
  Lock, 
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react'

interface PaymentStepProps {
  challenge: any
  onSuccess: () => void
  onError: (error: string) => void
  onBack: () => void
}

export function PaymentStep({
  challenge,
  onSuccess,
  onError,
  onBack
}: PaymentStepProps) {
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  if (!challenge) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Loading challenge details...</p>
      </div>
    )
  }

  // Calculate end date
  const getEndDate = () => {
    const start = new Date(challenge.start_date)
    const end = new Date(start)
    end.setDate(start.getDate() + challenge.duration - 1)
    return end.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (showPaymentForm) {
    return (
      <div className="space-y-6 p-6">
        {/* Payment Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Complete Your Commitment
          </h2>
          <p className="text-muted-foreground">
            Secure your challenge with a ${challenge.stake_amount} stake
          </p>
        </div>

        {/* Payment Form Integration */}
        <PaymentForm
          challengeId={challenge.id}
          amount={challenge.stake_amount}
          onSuccess={onSuccess}
          onError={onError}
        />

        {/* Back Button */}
        <div className="text-center pt-4 border-t">
          <Button
            variant="ghost"
            onClick={() => setShowPaymentForm(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to Review
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      {/* Success Message */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Challenge Created Successfully! 🎉
          </h2>
          <p className="text-muted-foreground">
            Now secure your commitment with your financial stake
          </p>
        </div>
      </div>

      {/* Challenge Summary Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-center">Your {challenge.duration}-Day Challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-primary mb-2">
              {challenge.title}
            </h3>
            {challenge.description && (
              <p className="text-muted-foreground">
                {challenge.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-background rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-semibold text-2xl text-foreground">{challenge.duration}</span>
              </div>
              <p className="text-sm text-muted-foreground">Days to Complete</p>
            </div>
            
            <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-2xl text-red-600">0</span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-400">Allowed Misses</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-2xl text-green-600">${challenge.stake_amount}</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400">Your Reward</p>
            </div>
          </div>

          <div className="text-center pt-4 border-t space-y-2">
            <p className="text-sm text-muted-foreground">Challenge Period</p>
            <p className="font-medium">
              {new Date(challenge.start_date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} - {getEndDate()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stake Information */}
      <Card className="border-2 border-red-200 dark:border-red-800">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                ${challenge.stake_amount}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Your Financial Commitment
              </h3>
              <p className="text-muted-foreground">
                This amount will be held in escrow during your challenge. Complete all {challenge.duration} days 
                to get your money back instantly, or lose it if you miss even one day.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Trust Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Secure Payment
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Processed by Stripe with bank-level encryption. Your card details are never stored on our servers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lock className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                  Escrow Protection
                </h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Your money is held in secure escrow and automatically returned if you complete your challenge.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Accepted Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="px-3 py-2">
              <span className="font-bold text-blue-600">VISA</span>
            </Badge>
            <Badge variant="outline" className="px-3 py-2">
              <span className="font-bold text-red-600">Mastercard</span>
            </Badge>
            <Badge variant="outline" className="px-3 py-2">
              <span className="font-bold text-blue-500">American Express</span>
            </Badge>
            <Badge variant="outline" className="px-3 py-2">
              <span className="font-bold text-orange-600">Discover</span>
            </Badge>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-3">
            All major credit and debit cards accepted
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack}>
          ← Back to Review
        </Button>
        
        <Button 
          onClick={() => setShowPaymentForm(true)}
          size="lg"
          className="min-w-48 font-semibold"
        >
          Proceed to Secure Payment
        </Button>
      </div>
    </div>
  )
}