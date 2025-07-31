import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          // In Server Components, we can't set cookies directly.
          // The middleware will handle session refresh and cookie setting.
          // This is a no-op in Server Components, which is expected behavior.
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                httpOnly: true,
              })
            })
          } catch {
            // Silently ignore - expected in Server Components
            // Session management is handled by middleware
          }
        },
      },
      auth: {
        persistSession: false, // Don't persist in server components
        detectSessionInUrl: false, // Let middleware handle URL detection
        autoRefreshToken: false, // Middleware handles token refresh
        flowType: 'pkce'
      }
    }
  )
}

// For use in Server Actions and Route Handlers where cookie setting is allowed
export async function createClientForActions() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, {
              ...options,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              httpOnly: true,
            })
          })
        },
      },
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
        autoRefreshToken: true,
        flowType: 'pkce'
      }
    }
  )
}