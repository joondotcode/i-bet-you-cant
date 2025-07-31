import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams, origin } = new URL(request.url)
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  // Use the request origin as fallback if NEXT_PUBLIC_APP_URL is not set
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || origin
  const callbackUrl = `${appUrl}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`
  
  console.log('Google OAuth redirect URL:', callbackUrl)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl,
    },
  })

  if (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json({
    url: data.url,
  })
}