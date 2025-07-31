import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import stripe from '@/lib/stripe/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  // Skip webhook processing if Stripe is not configured
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe webhook not configured' }, { status: 400 })
  }
  const body = await request.text()
  const signature = headers().get('stripe-signature') as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log('Payment succeeded:', paymentIntent.id)

        // Update challenge status to active
        const { error: challengeError } = await supabase
          .from('challenges')
          .update({ 
            status: 'active',
            payment_status: 'succeeded',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        if (challengeError) {
          console.error('Error updating challenge status:', challengeError)
        }

        // Update payment record
        const { error: paymentError } = await supabase
          .from('payments')
          .update({ 
            status: 'succeeded',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_payment_intent_id', paymentIntent.id)

        if (paymentError) {
          console.error('Error updating payment status:', paymentError)
        }

        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        console.log('Payment failed:', failedPayment.id)

        // Update payment record
        const { error: failedPaymentError } = await supabase
          .from('payments')
          .update({ 
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_payment_intent_id', failedPayment.id)

        if (failedPaymentError) {
          console.error('Error updating failed payment status:', failedPaymentError)
        }

        // Update challenge status
        const { error: failedChallengeError } = await supabase
          .from('challenges')
          .update({ 
            payment_status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_payment_intent_id', failedPayment.id)

        if (failedChallengeError) {
          console.error('Error updating challenge payment status:', failedChallengeError)
        }

        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}