import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  if (code) {
    const supabase = await createClient()
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth exchange error:', error)
        return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent(error.message)}`)
      }

      if (data.user && data.session) {
        console.log('OAuth success:', { userId: data.user.id, email: data.user.email })
        
        // Create or update user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || null,
            timezone: 'UTC', // Default timezone
            updated_at: new Date().toISOString(),
          })

        if (profileError) {
          console.error('Profile upsert error:', profileError)
          // Don't fail the auth flow for profile errors
        }

        // Create a redirect response that preserves the session
        const redirectResponse = NextResponse.redirect(`${origin}${redirectTo}`)
        
        // The session should already be set by the Supabase client through the cookie handlers
        // Just return the redirect response - the middleware will handle session persistence
        return redirectResponse
      }
    } catch (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(`${origin}/auth/error?message=Authentication failed`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error?message=No authorization code provided`)
}