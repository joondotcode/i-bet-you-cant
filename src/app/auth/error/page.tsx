import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Suspense } from 'react'

function ErrorContent({ searchParams }: { searchParams: { message?: string } }) {
  const errorMessage = searchParams.message

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-red-600">Authentication Error</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{decodeURIComponent(errorMessage)}</p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            There was a problem signing you in. This could be due to:
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• The authorization was cancelled</li>
              <li>• An error occurred during the OAuth process</li>
              <li>• Your email is not verified</li>
              <li>• Session expired or was lost</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/auth/login">
              Try Again
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/signup">
              Create New Account
            </Link>
          </Button>
          
          <Button asChild variant="ghost" className="w-full">
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          If the problem persists, please contact support.
        </p>
      </CardContent>
    </Card>
  )
}

export default function AuthErrorPage({ 
  searchParams 
}: { 
  searchParams: { message?: string } 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="text-center">Loading...</div>
          </CardContent>
        </Card>
      }>
        <ErrorContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}