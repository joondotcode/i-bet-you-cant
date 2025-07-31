import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password, fullName } = await request.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  // Sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || null,
      },
    },
  })

  if (authError) {
    console.error('Supabase Auth Error:', authError)
    return NextResponse.json(
      { 
        error: authError.message,
        details: 'If you\'re not receiving emails, check your Supabase email configuration.'
      },
      { status: 400 }
    )
  }

  // Log successful signup for debugging
  console.log('User signed up:', { 
    userId: authData.user?.id, 
    email: authData.user?.email,
    emailConfirmed: authData.user?.email_confirmed_at 
  })

  // Create user profile if sign up was successful
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        full_name: fullName || null,
        timezone: 'UTC', // Default timezone, can be updated later
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Don't return error to user, as auth was successful
    }
  }

  return NextResponse.json({
    message: 'Sign up successful. Please check your email for verification.',
    user: authData.user,
  })
}