'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TrustIndicator } from '@/components/ui/trust-indicator'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle,
  CheckCircle,
  Crown,
  Sparkles,
  User,
  Eye,
  EyeOff
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoginFormProps {
  redirectTo?: string
  onSuccess?: () => void
}

interface FormData {
  email: string
  password: string
  rememberMe: boolean
}

interface FormErrors {
  [key: string]: string
}

export function EnhancedLogin({ redirectTo = '/dashboard', onSuccess }: LoginFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: true
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const router = useRouter()

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!showForgotPassword && !formData.password) {
      newErrors.password = 'Password is required'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formErrors = validateForm()
    setErrors(formErrors)

    if (Object.keys(formErrors).length > 0) return

    setLoading(true)

    try {
      if (showForgotPassword) {
        // Handle password reset
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to send reset email')
        }

        setResetEmailSent(true)
      } else {
        // Handle login
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            rememberMe: formData.rememberMe
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Sign in failed')
        }

        if (onSuccess) {
          onSuccess()
        } else {
          router.push(redirectTo)
          router.refresh()
        }
      }
    } catch (error) {
      setErrors({ 
        general: error instanceof Error ? error.message : 'An error occurred' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/auth/google?redirectTo=${encodeURIComponent(redirectTo)}`, {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      setErrors({ 
        general: 'Failed to sign in with Google' 
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

  if (resetEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass border-white/20 shadow-2xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Check your email</h2>
              <p className="text-muted-foreground text-sm">
                We've sent a password reset link to <br/>
                <span className="font-medium text-foreground">{formData.email}</span>
              </p>
            </div>
            <Button
              onClick={() => {
                setShowForgotPassword(false)
                setResetEmailSent(false)
                setFormData(prev => ({ ...prev, password: '' }))
              }}
              variant="outline"
              className="w-full"
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md glass border-white/20 shadow-2xl animate-fade-up">
          <CardContent className="p-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Crown className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  I Bet You Can't
                </span>
              </div>

              {showForgotPassword ? (
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
                  <p className="text-muted-foreground text-sm">
                    Enter your email and we'll send you a reset link
                  </p>
                </div>
              ) : (
                <div>
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm border border-violet-500/20 rounded-full px-4 py-2 mb-4">
                    <Sparkles className="w-4 h-4 text-violet-500" />
                    <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                      Welcome Back
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-foreground">Sign In</h1>
                  <p className="text-muted-foreground text-sm">
                    Continue your habit transformation journey
                  </p>
                </div>
              )}
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800 dark:text-red-300 text-sm">{errors.general}</p>
                </div>
              </div>
            )}

            {!showForgotPassword && (
              <>
                {/* Social Login */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12"
                  onClick={handleGoogleSignIn}
                  loading={loading}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-card px-4 text-muted-foreground">Or continue with email</span>
                  </div>
                </div>
              </>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                error={errors.email}
                placeholder="Enter your email"
                icon={<Mail className="w-4 h-4" />}
                required
              />

              {!showForgotPassword && (
                <>
                  <Input
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    error={errors.password}
                    placeholder="Enter your password"
                    required
                  />

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={(e) => updateFormData('rememberMe', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-muted-foreground">Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full h-12"
                loading={loading}
                variant={showForgotPassword ? "outline" : "gradient"}
              >
                {showForgotPassword ? (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Reset Link
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {showForgotPassword && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowForgotPassword(false)}
                className="w-full"
              >
                Back to Sign In
              </Button>
            )}

            {!showForgotPassword && (
              <>
                {/* Trust Indicators */}
                <TrustIndicator showStats={false} className="pt-6 border-t border-border" />

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => router.push('/auth/signup')}
                      className="font-medium text-primary hover:underline"
                    >
                      Create account
                    </button>
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}