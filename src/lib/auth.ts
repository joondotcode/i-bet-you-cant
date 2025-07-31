import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getUser() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      // Only log actual authentication errors, not session missing errors
      if (error.message !== 'Auth session missing!') {
        console.error('Auth error:', error)
      }
      return null
    }
    
    return user
  } catch (error) {
    console.error('Unexpected auth error:', error)
    return null
  }
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect('/auth/login')
  }
  return user
}

export async function requireGuest() {
  const user = await getUser()
  if (user) {
    redirect('/dashboard')
  }
}

export async function signOut() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Sign out error:', error)
    throw error
  }
  
  redirect('/auth/login')
}