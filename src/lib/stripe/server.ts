import Stripe from 'stripe'

// Use a placeholder if Stripe is not configured to prevent build errors
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-04-10',
  typescript: true,
})

export default stripe