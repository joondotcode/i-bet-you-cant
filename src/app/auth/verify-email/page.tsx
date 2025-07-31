import { EmailVerification } from '@/components/auth/email-verification'
import { Suspense } from 'react'

function VerifyEmailContent() {
  return <EmailVerification />
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}