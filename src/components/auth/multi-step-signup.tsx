'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StepIndicator } from '@/components/ui/step-indicator'
import { FormSection } from '@/components/ui/form-section'
import { TrustIndicator } from '@/components/ui/trust-indicator'
import { Card, CardContent } from '@/components/ui/card'
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  Target,
  DollarSign,
  CheckCircle,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  acceptedTerms: boolean
  marketingOptIn: boolean
}

interface FormErrors {
  [key: string]: string
}

const steps = [
  { title: 'Create Account', description: 'Quick setup' },
  { title: 'Accept Terms', description: 'Final step' }
]

export function MultiStepSignup() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
    marketingOptIn: true
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const router = useRouter()

  // Validate current step
  useEffect(() => {
    const validateCurrentStep = () => {
      switch (currentStep) {
        case 1:
          return formData.fullName.trim().length >= 2 && 
                 formData.email.includes('@') && 
                 formData.email.includes('.') &&
                 formData.password.length >= 6 && 
                 formData.password === formData.confirmPassword
        case 2:
          return formData.acceptedTerms
        default:
          return false
      }
    }
    setIsFormValid(validateCurrentStep())
  }, [formData, currentStep])

  const validateStep = (step: number): FormErrors => {
    const newErrors: FormErrors = {}

    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required'
      } else if (formData.fullName.trim().length < 2) {
        newErrors.fullName = 'Name must be at least 2 characters'
      }

      if (!formData.email) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
      }

      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    if (step === 2) {
      if (!formData.acceptedTerms) {
        newErrors.acceptedTerms = 'You must accept the terms and conditions'
      }
    }

    return newErrors
  }

  const handleNext = () => {
    const stepErrors = validateStep(currentStep)
    setErrors(stepErrors)

    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    setErrors({})
  }

  const handleSubmit = async () => {
    const finalErrors = validateStep(2)
    setErrors(finalErrors)

    if (Object.keys(finalErrors).length > 0) return

    setLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          marketingOptIn: formData.marketingOptIn
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed')
      }

      // Success - redirect to email verification page
      router.push('/auth/verify-email?email=' + encodeURIComponent(formData.email))
    } catch (error) {
      setErrors({ 
        general: error instanceof Error ? error.message : 'An error occurred during sign up' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      setErrors({ 
        general: 'Failed to sign up with Google' 
      })
      setLoading(false)
    }
  }

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear errors for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl glass border-white/20 shadow-2xl animate-fade-up">
          <CardContent className="p-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              {/* Brand Logo/Name */}
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  I Bet You Can't
                </h1>
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm border border-violet-500/20 rounded-full px-4 py-2">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                    Turn Habits Into Reality
                  </span>
                </div>
              </div>
              
              {/* Clear, accessible heading */}
              <h2 className="text-2xl font-bold text-foreground">
                Create Your Account
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Join thousands who've transformed their habits with financial accountability
              </p>
            </div>

            {/* Step Indicator */}
            <StepIndicator steps={steps} currentStep={currentStep} />

            {/* General Error */}
            {errors.general && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800 dark:text-red-300 text-sm">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Step Content */}
            <div className="min-h-[400px]">
              {/* Step 1: Account Creation */}
              {currentStep === 1 && (
                <FormSection
                  title="Quick Account Setup"
                  description="Get started in seconds with your email and a secure password"
                  icon={<User className="w-6 h-6 text-primary" />}
                >
                  {/* Social Signup Option First */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mb-6"
                    onClick={handleGoogleSignup}
                    loading={loading}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>

                  {/* Or separator */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-muted-foreground/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-background px-4 text-muted-foreground">Or create account with email</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateFormData('fullName', e.target.value)}
                      error={errors.fullName}
                      placeholder="Enter your full name"
                      icon={<User className="w-4 h-4" />}
                      required
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      error={errors.email}
                      placeholder="Enter your email address"
                      icon={<Mail className="w-4 h-4" />}
                      required
                    />

                    <Input
                      label="Password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      error={errors.password}
                      placeholder="Create a strong password (min 6 characters)"
                      showPasswordStrength
                      required
                    />

                    <Input
                      label="Confirm Password"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      error={errors.confirmPassword}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>

                  {/* Security Notice */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        We use bank-level security to protect your account and financial stakes.
                      </p>
                    </div>
                  </div>
                </FormSection>
              )}

              {/* Step 2: Terms & Conditions */}
              {currentStep === 2 && (
                <FormSection
                  title="You're almost ready!"
                  description="Review the details and accept our terms to complete your registration"
                  icon={<CheckCircle className="w-6 h-6 text-green-500" />}
                >
                  {/* Summary */}
                  <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-foreground">Account Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="text-foreground">{formData.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="text-foreground">{formData.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.acceptedTerms}
                        onChange={(e) => updateFormData('acceptedTerms', e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        required
                      />
                      <div className="text-sm">
                        <span className="text-foreground">
                          I agree to the{' '}
                          <a href="/terms" className="text-primary hover:underline" target="_blank">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="/privacy" className="text-primary hover:underline" target="_blank">
                            Privacy Policy
                          </a>
                        </span>
                        {errors.acceptedTerms && (
                          <p className="text-red-500 mt-1">{errors.acceptedTerms}</p>
                        )}
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.marketingOptIn}
                        onChange={(e) => updateFormData('marketingOptIn', e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-muted-foreground">
                        Send me tips and updates about building better habits (optional)
                      </span>
                    </label>
                  </div>

                  {/* What happens next */}
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                      What happens next?
                    </h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• We'll send a verification email to {formData.email}</li>
                      <li>• Verify your email to activate your account</li>
                      <li>• Start your first habit challenge</li>
                    </ul>
                  </div>
                </FormSection>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
              ) : (
                <div></div>
              )}

              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!isFormValid}
                  className="flex items-center gap-2"
                  variant="gradient"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={!isFormValid}
                  className="flex items-center gap-2"
                  variant="challenge"
                >
                  Create Account
                  <Target className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Trust Indicators */}
            <TrustIndicator showStats={false} className="pt-6 border-t border-border" />

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/auth/login')}
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}