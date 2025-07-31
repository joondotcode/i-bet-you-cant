import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const createChallengeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  durationDays: z.number().refine(val => [7, 14, 30].includes(val), 'Duration must be 7, 14, or 30 days'),
  stakeAmount: z.number().min(15).max(100).default(15),
  startDate: z.string().refine(val => {
    const date = new Date(val)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today
  }, 'Start date must be today or in the future')
})

// GET /api/challenges - Get user's challenges
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    if (!supabase) {
      console.error('Failed to create Supabase client')
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
    
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const { data: challenges, error } = await supabase
      .from('challenges')
      .select(`
        *,
        checkins (
          id,
          checkin_date,
          completed_at
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching challenges:', error)
      return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 })
    }

    // Calculate current streak for each challenge
    const challengesWithStreak = challenges?.map(challenge => {
      const checkins = challenge.checkins || []
      const startDate = new Date(challenge.start_date)
      const today = new Date()
      
      // Calculate current streak
      let currentStreak = 0
      if (challenge.status === 'active') {
        const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        currentStreak = Math.min(checkins.length, daysSinceStart + 1)
      } else if (challenge.status === 'completed') {
        currentStreak = challenge.duration_days
      }
      
      // Check if today's check-in exists
      const todayStr = today.toISOString().split('T')[0]
      const hasCheckedInToday = checkins.some(checkin => 
        checkin.checkin_date === todayStr
      )

      return {
        ...challenge,
        currentStreak,
        hasCheckedInToday,
        checkins: undefined // Remove checkins from response for cleaner data
      }
    })

    return NextResponse.json({ challenges: challengesWithStreak })
  } catch (error) {
    console.error('Challenges API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/challenges - Create new challenge
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    if (!supabase) {
      console.error('Failed to create Supabase client')
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
    
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate request body
    const validationResult = createChallengeSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationResult.error.errors 
      }, { status: 400 })
    }

    const { title, description, durationDays, stakeAmount, startDate } = validationResult.data

    // Check if user already has an active challenge (MVP constraint)
    const { data: existingChallenges, error: checkError } = await supabase
      .from('challenges')
      .select('id')
      .eq('user_id', user.id)
      .in('status', ['pending', 'active'])

    if (checkError) {
      console.error('Error checking existing challenges:', checkError)
      return NextResponse.json({ error: 'Failed to check existing challenges' }, { status: 500 })
    }

    if (existingChallenges && existingChallenges.length > 0) {
      return NextResponse.json({ 
        error: 'You already have an active challenge. Complete or cancel it before creating a new one.' 
      }, { status: 409 })
    }

    // Calculate end date
    const start = new Date(startDate)
    const end = new Date(start)
    end.setDate(start.getDate() + durationDays - 1)

    // Create challenge
    const { data: challenge, error: createError } = await supabase
      .from('challenges')
      .insert({
        user_id: user.id,
        title,
        description,
        duration_days: durationDays,
        stake_amount: stakeAmount,
        start_date: start.toISOString().split('T')[0],
        end_date: end.toISOString().split('T')[0],
        status: 'pending'
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating challenge:', createError)
      return NextResponse.json({ error: 'Failed to create challenge' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Challenge created successfully',
      challenge: {
        ...challenge,
        currentStreak: 0,
        hasCheckedInToday: false
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Challenge creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}