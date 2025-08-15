import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, response?: NextResponse) {
  let supabaseResponse = response || NextResponse.next({
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
  
  // Extract locale-agnostic pathname (remove /en or /ko prefix)
  const pathSegments = pathname.split('/').filter(Boolean)
  const locales = ['en', 'ko']
  const isLocaleRoute = locales.includes(pathSegments[0])
  const basePathname = isLocaleRoute ? `/${pathSegments.slice(1).join('/')}` : pathname
  const locale = isLocaleRoute ? pathSegments[0] : 'en'

  try {
    // refreshing the auth token and getting user
    const { data: { user }, error } = await supabase.auth.getUser()

    // Log auth state for debugging
    if (error) {
      console.warn('Middleware auth error:', error.message)
    }
    
    // Handle OAuth codes that land on home page (redirect to proper callback)
    if (basePathname === '/' && url.searchParams.get('code')) {
      console.log('OAuth code detected on home page, redirecting to callback:', url.searchParams.get('code'))
      const redirectTo = url.searchParams.get('redirectTo') || `/${locale}/dashboard`
      url.pathname = `/${locale}/auth/callback`
      url.searchParams.set('redirectTo', redirectTo)
      return NextResponse.redirect(url)
    }

    // Protected routes that require authentication
    if (basePathname.startsWith('/dashboard')) {
      if (!user) {
        url.pathname = `/${locale}/auth/login`
        url.searchParams.set('redirectTo', pathname)
        return NextResponse.redirect(url)
      }
    }

    // Guest routes that redirect if already authenticated
    if (basePathname.startsWith('/auth/') && basePathname !== '/auth/callback' && basePathname !== '/auth/error') {
      if (user) {
        const redirectTo = url.searchParams.get('redirectTo') || `/${locale}/dashboard`
        url.pathname = redirectTo
        url.search = ''
        return NextResponse.redirect(url)
      }
    }

    // Redirect authenticated users from home page to dashboard
    if (basePathname === '/' && user) {
      url.pathname = `/${locale}/dashboard`
      return NextResponse.redirect(url)
    }

  } catch (error) {
    console.error('Middleware error:', error)
    // Continue with the request even if auth check fails
  }

  return supabaseResponse
}