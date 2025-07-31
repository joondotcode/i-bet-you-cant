import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/challenges/[id]/checkin - Record daily check-in
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const challengeId = params.id
    const body = await request.json()
    const { notes } = body

    // Verify challenge exists and belongs to user
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .eq('user_id', user.id)
      .single()

    if (challengeError || !challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    // Check if challenge is active
    if (challenge.status !== 'active') {
      return NextResponse.json({ 
        error: 'Challenge is not active. Only active challenges allow check-ins.' 
      }, { status: 400 })
    }

    // Get today's date in user's timezone (for now, using UTC)
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    // Check if already checked in today
    const { data: existingCheckin, error: checkinCheckError } = await supabase
      .from('checkins')
      .select('id')
      .eq('challenge_id', challengeId)
      .eq('checkin_date', todayStr)
      .single()

    if (existingCheckin) {
      return NextResponse.json({ 
        error: 'Already checked in today' 
      }, { status: 409 })
    }

    // Verify check-in is within valid date range
    const startDate = new Date(challenge.start_date)
    const endDate = new Date(challenge.end_date)
    const currentDate = new Date(todayStr)

    if (currentDate < startDate || currentDate > endDate) {
      return NextResponse.json({ 
        error: 'Check-in date is outside challenge period' 
      }, { status: 400 })
    }

    // Create check-in record
    const { data: checkin, error: createError } = await supabase
      .from('checkins')
      .insert({
        challenge_id: challengeId,
        user_id: user.id,
        checkin_date: todayStr,
        notes: notes || null,
        completed_at: today.toISOString()
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating check-in:', createError)
      return NextResponse.json({ error: 'Failed to record check-in' }, { status: 500 })
    }

    // Get total check-ins for this challenge to calculate current streak
    const { data: allCheckins, error: checkinsError } = await supabase
      .from('checkins')
      .select('checkin_date')
      .eq('challenge_id', challengeId)
      .order('checkin_date', { ascending: true })

    if (checkinsError) {
      console.error('Error fetching check-ins:', checkinsError)
      return NextResponse.json({ error: 'Failed to calculate streak' }, { status: 500 })
    }

    const currentStreak = allCheckins?.length || 0

    // Check if challenge is complete
    if (currentStreak >= challenge.duration_days) {
      // Update challenge status to completed
      const { error: updateError } = await supabase
        .from('challenges')
        .update({ 
          status: 'completed',
          updated_at: today.toISOString()
        })
        .eq('id', challengeId)

      if (updateError) {
        console.error('Error updating challenge status:', updateError)
        // Don't fail the check-in if status update fails
      }
    }

    return NextResponse.json({ 
      message: 'Check-in recorded successfully',
      checkin,
      currentStreak,
      isComplete: currentStreak >= challenge.duration_days
    })

  } catch (error) {
    console.error('Check-in API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}