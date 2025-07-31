'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

export function OAuthHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get('code')
      const error = searchParams.get('error')
      
      if (error) {
        console.error('OAuth error:', error)
        router.push('/auth/error?message=' + encodeURIComponent(error))
        return
      }

      if (code) {
        console.log('OAuth code detected on home page, processing...')
        setIsProcessing(true)
        
        try {
          // Exchange the code for a session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            console.error('Code exchange error:', exchangeError)
            router.push('/auth/error?message=' + encodeURIComponent(exchangeError.message))
            return
          }

          if (data.user && data.session) {
            console.log('OAuth success, redirecting to dashboard')
            
            // Create or update user profile
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: data.user.id,
                email: data.user.email,
                full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || null,
                timezone: 'UTC',
                updated_at: new Date().toISOString(),
              })

            if (profileError) {
              console.error('Profile upsert error:', profileError)
              // Don't fail the auth flow for profile errors
            }

            // Clear the URL parameters and redirect
            window.history.replaceState({}, '', '/')
            router.push('/dashboard')
          }
        } catch (error) {
          console.error('OAuth processing error:', error)
          router.push('/auth/error?message=Authentication failed')
        }
      }
    }

    handleOAuthCallback()
  }, [searchParams, router, supabase])

  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-900 dark:text-gray-100">Completing sign in...</span>
          </div>
        </div>
      </div>
    )
  }

  return null
}