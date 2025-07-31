'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Mail, 
  CheckCircle, 
  AlertCircle,
  Crown,
  ArrowRight,
  RefreshCw,
  Clock
} from 'lucide-react'

interface VerificationState {
  email: string
  isVerified: boolean
  canResend: boolean
  countdown: number
  error: string | null
  loading: boolean
}

export function EmailVerification() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  
  const [state, setState] = useState<VerificationState>({
    email,
    isVerified: false,
    canResend: false,
    countdown: 60,
    error: null,
    loading: false
  })

  // Countdown timer for resend button
  useEffect(() => {
    if (state.countdown > 0 && !state.canResend) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, countdown: prev.countdown - 1 }))
      }, 1000)
      return () => clearTimeout(timer)
    } else if (state.countdown === 0) {
      setState(prev => ({ ...prev, canResend: true }))
    }
  }, [state.countdown, state.canResend])

  const handleResendEmail = async () => {
    if (!state.canResend || state.loading) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state.email })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to resend verification email')
      }

      setState(prev => ({ 
        ...prev, 
        canResend: false, 
        countdown: 60,
        error: null
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to resend email'
      }))
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const handleContinue = () => {
    router.push('/auth/login?verified=true')
  }

  const handleEditEmail = () => {
    router.push('/auth/signup')
  }

  if (state.isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden flex items-center justify-center p-4">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl"></div>
        
        <Card className="w-full max-w-md glass border-white/20 shadow-2xl animate-fade-up">
          <CardContent className="p-8 text-center space-y-6">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>

            {/* Success Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Email Verified!</h1>
              <p className="text-muted-foreground text-sm">
                Your account has been successfully verified. You can now start creating challenges.
              </p>
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              className="w-full h-12"
              variant="gradient"
            >
              Continue to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
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

              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-blue-500" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
                <p className="text-muted-foreground text-sm">
                  We've sent a verification link to
                </p>
                <p className="font-medium text-foreground">{state.email}</p>
              </div>
            </div>

            {/* Error Message */}
            {state.error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800 dark:text-red-300 text-sm">{state.error}</p>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Next steps:
                </h3>
                <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
                  <li>Check your email inbox (and spam folder)</li>
                  <li>Click the verification link in the email</li>
                  <li>Return here to continue</li>
                </ol>
              </div>

              {/* Resend Email */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Didn't receive the email?
                </p>
                
                {state.canResend ? (
                  <Button
                    onClick={handleResendEmail}
                    loading={state.loading}
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Resend Verification Email
                  </Button>
                ) : (
                  <Button
                    disabled
                    variant="outline"
                    className="w-full"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Resend in {state.countdown}s
                  </Button>
                )}
              </div>
            </div>

            {/* Alternative Actions */}
            <div className="space-y-4 pt-6 border-t border-border">
              <Button
                onClick={handleEditEmail}
                variant="ghost"
                className="w-full"
              >
                Use a different email address
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already verified?{' '}
                  <button
                    type="button"
                    onClick={() => router.push('/auth/login')}
                    className="font-medium text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>

            {/* Support */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Still having trouble?{' '}
                <a href="/support" className="text-primary hover:underline">
                  Contact support
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}