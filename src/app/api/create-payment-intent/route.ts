import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import stripe from '@/lib/stripe/server'

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { challengeId } = await request.json()

    if (!challengeId) {
      return NextResponse.json({ error: 'Challenge ID is required' }, { status: 400 })
    }

    // Get challenge details
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .eq('user_id', user.id)
      .single()

    if (challengeError || !challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    // Check if challenge already has a payment intent
    if (challenge.stripe_payment_intent_id) {
      return NextResponse.json({ 
        error: 'Challenge already has a payment intent' 
      }, { status: 409 })
    }

    // Get user profile for metadata
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(challenge.stake_amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        challengeId: challenge.id,
        userId: user.id,
        userEmail: profile?.email || user.email || '',
        challengeTitle: challenge.title
      },
      description: `Stake for challenge: ${challenge.title}`,
      receipt_email: profile?.email || user.email || undefined,
    })

    // Update challenge with payment intent ID
    const { error: updateError } = await supabase
      .from('challenges')
      .update({ 
        stripe_payment_intent_id: paymentIntent.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', challengeId)

    if (updateError) {
      console.error('Error updating challenge with payment intent:', updateError)
      // Cancel the payment intent if we can't update the challenge
      await stripe.paymentIntents.cancel(paymentIntent.id)
      return NextResponse.json({ error: 'Failed to update challenge' }, { status: 500 })
    }

    // Create payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        challenge_id: challengeId,
        user_id: user.id,
        stripe_payment_intent_id: paymentIntent.id,
        amount: challenge.stake_amount,
        status: 'pending'
      })

    if (paymentError) {
      console.error('Error creating payment record:', paymentError)
      // This is not critical - the payment intent is created
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })

  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}