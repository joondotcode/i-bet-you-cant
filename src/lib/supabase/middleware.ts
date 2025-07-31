import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              httpOnly: true,
            })
          )
        },
      },
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    }
  )

  // Handle auth redirects
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  try {
    // refreshing the auth token and getting user
    const { data: { user }, error } = await supabase.auth.getUser()

    // Log auth state for debugging
    if (error) {
      console.warn('Middleware auth error:', error.message)
    }
    
    // Handle OAuth codes that land on home page (redirect to proper callback)
    if (pathname === '/' && url.searchParams.get('code')) {
      console.log('OAuth code detected on home page, redirecting to callback:', url.searchParams.get('code'))
      const redirectTo = url.searchParams.get('redirectTo') || '/dashboard'
      url.pathname = '/auth/callback'
      url.searchParams.set('redirectTo', redirectTo)
      return NextResponse.redirect(url)
    }

    // Protected routes that require authentication
    if (pathname.startsWith('/dashboard')) {
      if (!user) {
        url.pathname = '/auth/login'
        url.searchParams.set('redirectTo', pathname)
        return NextResponse.redirect(url)
      }
    }

    // Guest routes that redirect if already authenticated
    if (pathname.startsWith('/auth/') && pathname !== '/auth/callback' && pathname !== '/auth/error') {
      if (user) {
        const redirectTo = url.searchParams.get('redirectTo') || '/dashboard'
        url.pathname = redirectTo
        url.search = ''
        return NextResponse.redirect(url)
      }
    }

    // Redirect authenticated users from home page to dashboard
    if (pathname === '/' && user) {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

  } catch (error) {
    console.error('Middleware error:', error)
    // Continue with the request even if auth check fails
  }

  return supabaseResponse
}