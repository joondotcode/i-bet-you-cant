'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PaymentStepProps {
  data: {
    title: string
    description: string
    duration: 7 | 14 | 21 | 30
    stakeAmount: number
  }
  onBack: () => void
}

export function PaymentStep({ data, onBack }: PaymentStepProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const handleStartPayment = () => {
    setShowPaymentForm(true)
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // In real implementation, integrate with Stripe
    // const stripe = await stripePromise
    // const result = await stripe.redirectToCheckout({ sessionId })
    
    setIsProcessing(false)
    
    // Redirect to success page or dashboard
    window.location.href = '/dashboard?challenge=created'
  }

  if (showPaymentForm) {
    return (
      <div className="space-y-6">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Secure Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Payment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Challenge Stake:</span>
                  <span className="font-semibold">${data.stakeAmount}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${data.stakeAmount}.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mock Payment Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="font-semibold text-foreground">Powered by Stripe</span>
                <div className="flex gap-1 ml-auto">
                  <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                  <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                  <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">AMEX</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    disabled={isProcessing}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      disabled={isProcessing}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200">Secure Payment</h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Your payment is processed securely by Stripe. Your card information is encrypted and never stored on our servers. 
                    Your ${data.stakeAmount} will be held in escrow and returned to you immediately upon successful completion of your challenge.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={onBack} disabled={isProcessing}>
                Back to Review
              </Button>
              <Button 
                onClick={handlePayment}
                loading={isProcessing}
                variant="challenge"
                size="lg"
                className="font-bold"
              >
                {isProcessing ? 'Processing Payment...' : `Pay $${data.stakeAmount} & Start Challenge`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Final Challenge Summary */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Ready to Commit?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Your {data.duration}-Day Challenge
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              {data.title}
            </p>
            
            <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-6 border border-red-200 dark:border-red-800 inline-block">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">
                  ${data.stakeAmount}
                </div>
                <div className="text-sm text-red-700 dark:text-red-300">
                  Your money on the line
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{data.duration}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Days to Complete</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-foreground">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Allowed Misses</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-green-600">$15</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">If You Succeed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Money-Back Guarantee */}
      <Card variant="outlined" className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">100% Money-Back Guarantee</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Complete every day of your challenge and get your full ${data.stakeAmount} back immediately. 
                Your money is held securely by Stripe and released automatically upon completion. 
                We never touch your funds - they go directly from Stripe back to your original payment method.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card variant="outlined">
        <CardHeader>
          <CardTitle className="text-base">How Payment Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-600 dark:text-blue-400">1</div>
              <div>
                <h4 className="font-medium text-foreground">Secure Payment</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your ${data.stakeAmount} is processed securely by Stripe (not stored by us)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-600 dark:text-blue-400">2</div>
              <div>
                <h4 className="font-medium text-foreground">Escrow Hold</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Money is held in secure escrow during your {data.duration}-day challenge</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-600 dark:text-blue-400">3</div>
              <div>
                <h4 className="font-medium text-foreground">Automatic Return</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Complete all days = instant refund. Miss one day = permanent loss</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Review
        </Button>
        <Button 
          onClick={handleStartPayment}
          variant="challenge"
          size="lg"
          className="font-bold"
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  )
}