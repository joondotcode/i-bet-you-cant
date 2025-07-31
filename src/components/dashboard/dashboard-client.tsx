'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ActiveChallengeCard } from '@/components/dashboard/active-challenge-card'
import { StatsGrid } from '@/components/dashboard/stats-grid'
import { ChallengeHistory } from '@/components/dashboard/challenge-history'
import { DailyCheckIn } from '@/components/dashboard/daily-checkin'
import { useChallengeStore, useCurrentChallenge, useChallenges, useChallengeLoading, useChallengeError } from '@/lib/stores/challenge-store'
import Link from 'next/link'

interface DashboardClientProps {
  user: any
  profile: any
}

export function DashboardClient({ user, profile }: DashboardClientProps) {
  const { fetchChallenges } = useChallengeStore()
  const currentChallenge = useCurrentChallenge()
  const challenges = useChallenges()
  const isLoading = useChallengeLoading()
  const error = useChallengeError()

  // Fetch challenges on mount
  useEffect(() => {
    if (user?.id) {
      fetchChallenges()
    }
  }, [user?.id, fetchChallenges])

  // Calculate stats
  const stats = {
    totalChallenges: challenges.length,
    completed: challenges.filter(c => c.status === 'completed').length,
    failed: challenges.filter(c => c.status === 'failed').length,
    currentStreak: currentChallenge?.currentStreak || 0,
    totalStaked: challenges.reduce((sum, c) => sum + c.stake_amount, 0),
    totalEarned: challenges.filter(c => c.status === 'completed').reduce((sum, c) => sum + c.stake_amount, 0)
  }

  // Get completed challenges for history
  const completedChallenges = challenges.filter(c => c.status === 'completed' || c.status === 'failed')

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}. Track your progress and stay committed!
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mb-6 flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading your challenges...</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-8">
          {/* Daily Check-in Card */}
          {currentChallenge && currentChallenge.status === 'active' && (
            <DailyCheckIn
              challenge={{
                id: currentChallenge.id,
                title: currentChallenge.title,
                duration: currentChallenge.duration_days,
                currentStreak: currentChallenge.currentStreak,
                stakeAmount: currentChallenge.stake_amount
              }}
              hasCheckedIn={currentChallenge.hasCheckedInToday}
            />
          )}

          {/* Active Challenge */}
          {currentChallenge ? (
            <ActiveChallengeCard challenge={{
              id: currentChallenge.id,
              title: currentChallenge.title,
              description: currentChallenge.description || '',
              duration: currentChallenge.duration_days,
              currentStreak: currentChallenge.currentStreak,
              stakeAmount: currentChallenge.stake_amount,
              timeZone: 'UTC', // TODO: Use user's timezone from profile
              createdAt: currentChallenge.created_at,
              lastCheckIn: currentChallenge.updated_at,
              status: currentChallenge.status
            }} />
          ) : (
            <Card variant="elevated">
              <CardContent className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 003.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Ready for a Challenge?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Create your first challenge and put your commitment to the test. 
                  Remember: $15 on the line, complete every day or lose it all!
                </p>
                <Button asChild variant="challenge" size="lg">
                  <Link href="/dashboard/challenges/new">
                    Create Your First Challenge
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Challenge History */}
          <ChallengeHistory challenges={completedChallenges.map(c => ({
            id: c.id,
            title: c.title,
            description: c.description || '',
            duration: c.duration_days,
            completedDays: c.status === 'completed' ? c.duration_days : c.currentStreak,
            stakeAmount: c.stake_amount,
            result: c.status === 'completed' ? 'success' : 'failed',
            completedAt: c.updated_at,
            earnings: c.status === 'completed' ? c.stake_amount : 0
          }))} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats Grid */}
          <StatsGrid stats={stats} />

          {/* Motivation Card */}
          <Card variant="elevated" className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100">
                💡 Daily Motivation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="text-sm text-blue-800 dark:text-blue-200 italic">
                "The difference between who you are and who you want to be is what you do."
              </blockquote>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">— Anonymous</p>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card variant="outlined">
            <CardHeader>
              <CardTitle className="text-sm">Success Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set reminders for your check-ins
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start with shorter challenges (7 days)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Make your habit specific and measurable
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}