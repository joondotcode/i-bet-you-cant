import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client failed' }, { status: 500 })
    }
    
    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      return NextResponse.json({ 
        error: 'Auth failed', 
        details: authError.message 
      }, { status: 401 })
    }
    
    if (!user) {
      return NextResponse.json({ error: 'No authenticated user' }, { status: 401 })
    }

    // Check if profiles table exists and user has profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('id', user.id)
      .single()

    // Check if challenges table exists
    const { data: challenges, error: challengesError } = await supabase
      .from('challenges')
      .select('id, status')
      .eq('user_id', user.id)
      .limit(1)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email
      },
      profile: {
        data: profile,
        error: profileError?.message
      },
      challenges: {
        data: challenges,
        error: challengesError?.message
      }
    })

  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}