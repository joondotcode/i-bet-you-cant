import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// DEBUG ENDPOINT - Remove this in production!
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to create Supabase client' }, { status: 500 })
    }
    
    // Test 1: Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Auth failed',
        authError: authError?.message,
        hasUser: !!user
      }, { status: 401 })
    }

    // Test 2: Check if tables exist by trying to query them
    const tests = {
      auth_works: true,
      user_id: user.id,
      user_email: user.email,
      profiles_table: null,
      challenges_table: null,
      rls_test: null
    }

    // Test profiles table
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
      
      tests.profiles_table = {
        exists: !profileError,
        error: profileError?.message,
        count: profileData?.length || 0
      }
    } catch (e) {
      tests.profiles_table = { exists: false, error: e.message }
    }

    // Test challenges table
    try {
      const { data: challengeData, error: challengeError } = await supabase
        .from('challenges')
        .select('id')
        .limit(1)
      
      tests.challenges_table = {
        exists: !challengeError,
        error: challengeError?.message,
        count: challengeData?.length || 0
      }
    } catch (e) {
      tests.challenges_table = { exists: false, error: e.message }
    }

    // Test RLS with user-specific query
    try {
      const { data: userChallenges, error: rlsError } = await supabase
        .from('challenges')
        .select('id, status')
        .eq('user_id', user.id)
        .limit(1)
      
      tests.rls_test = {
        works: !rlsError,
        error: rlsError?.message,
        count: userChallenges?.length || 0
      }
    } catch (e) {
      tests.rls_test = { works: false, error: e.message }
    }

    return NextResponse.json({ 
      message: 'Database diagnostics complete',
      tests 
    })

  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json({ 
      error: 'Debug endpoint failed', 
      details: error.message 
    }, { status: 500 })
  }
}