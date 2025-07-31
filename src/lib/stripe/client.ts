import { loadStripe } from '@stripe/stripe-js'

// Use a placeholder if Stripe is not configured to prevent build errors
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'

const stripePromise = loadStripe(publishableKey)

export default stripePromise