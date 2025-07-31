'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  challengeId: string
  amount: number
  onSuccess: () => void
  onError: (error: string) => void
}

function CheckoutForm({ challengeId, amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState<string>('')

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ challengeId })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment intent')
        }

        setClientSecret(data.clientSecret)
      } catch (error) {
        console.error('Error creating payment intent:', error)
        onError(error instanceof Error ? error.message : 'Failed to initialize payment')
      }
    }

    createPaymentIntent()
  }, [challengeId, onError])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      return
    }

    setIsProcessing(true)

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      })

      if (error) {
        console.error('Payment failed:', error)
        onError(error.message || 'Payment failed')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess()
      }
    } catch (error) {
      console.error('Payment error:', error)
      onError('Payment processing failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: 'system-ui, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Challenge Stake</CardTitle>
        <p className="text-sm text-muted-foreground">
          Secure your commitment with a ${amount} stake. You'll get it back when you complete all days!
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 border border-input rounded-lg">
            <CardElement options={cardElementOptions} />
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-yellow-500 text-lg">💳</span>
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Secure Payment
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Your payment is held securely. Complete your challenge to get your full ${amount} back.
                  Miss even one day and you forfeit the entire amount.
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={isProcessing || !clientSecret}
            disabled={!stripe || !clientSecret}
            className="font-semibold"
          >
            {isProcessing ? 'Processing Payment...' : `Stake $${amount} & Start Challenge`}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  )
}