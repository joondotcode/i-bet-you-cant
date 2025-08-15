'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ActiveChallengeCard } from '@/components/dashboard/active-challenge-card'
import { StatsGrid } from '@/components/dashboard/stats-grid'
import { ChallengeHistory } from '@/components/dashboard/challenge-history'
import { DailyCheckIn } from '@/components/dashboard/daily-checkin'
import { useChallengeStore, useCurrentChallenge, useChallenges, useChallengeLoading, useChallengeError } from '@/lib/stores/challenge-store'
import { Target, Zap, Trophy, TrendingUp } from 'lucide-react'
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
    <div className="min-h-screen amy-radial-glow amy-dot-pattern">
      {/* AMY'S MISSION CONTROL HERO HEADER */}
      <div className="relative py-12 mb-8">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 amy-glass-neon rounded-full flex items-center justify-center mx-auto mb-6 amy-interactive">
              <Target className="w-10 h-10 text-neon-green drop-shadow-lg" />
            </div>
            <div className="absolute -inset-4 amy-glass rounded-full opacity-20 blur-xl"></div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-foreground leading-tight">
              Mission Control
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}. Your commitment journey continues here.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 amy-glass rounded-full">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
              <span className="text-sm text-neon-green font-medium">System Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* AMY'S ERROR DISPLAY */}
      {error && (
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="amy-glass border border-red-400/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-400 text-2xl">⚠️</span>
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-red-400">System Alert</h4>
                <p className="text-muted-foreground leading-relaxed">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AMY'S LOADING STATE */}
      {isLoading && (
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="amy-glass-neon rounded-xl p-8 text-center">
            <div className="w-16 h-16 amy-glass rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-green"></div>
            </div>
            <span className="text-neon-green font-medium">Loading mission data...</span>
          </div>
        </div>
      )}

      {/* AMY'S PREMIUM CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
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
            <div className="amy-glass-neon rounded-2xl p-12 text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 amy-glass-neon rounded-full flex items-center justify-center mx-auto amy-interactive">
                  <Trophy className="w-12 h-12 text-neon-green drop-shadow-lg" />
                </div>
                <div className="absolute -inset-4 amy-glass rounded-full opacity-20 blur-xl"></div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-foreground">
                  Ready for Battle?
                </h3>
                <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                  Deploy your first challenge and prove your commitment. 
                  <span className="text-neon-green font-semibold">$15 stakes, zero tolerance</span> – complete every day or lose it all.
                </p>
                
                <div className="pt-4">
                  <Link href="/dashboard/challenges/new">
                    <button className="px-8 py-4 amy-glass-neon text-neon-green hover:amy-glass-hover rounded-xl font-bold text-lg transition-all duration-300 amy-interactive">
                      <span className="flex items-center justify-center gap-3">
                        <Zap className="w-6 h-6" />
                        Deploy First Mission
                        <TrendingUp className="w-5 h-5" />
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
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

          {/* AMY'S COMMAND CENTER SIDEBAR */}
          <div className="space-y-8">
            {/* Stats Grid */}
            <StatsGrid stats={stats} />

            {/* AMY'S MOTIVATION MODULE */}
            <div className="amy-glass-neon rounded-2xl p-6 border border-neon-blue/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 amy-glass rounded-full flex items-center justify-center">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-xl font-bold text-neon-blue">
                  Command Wisdom
                </h3>
              </div>
              
              <blockquote className="text-sm text-muted-foreground italic leading-relaxed mb-3">
                "The difference between who you are and who you want to be is what you do."
              </blockquote>
              <p className="text-xs text-neon-blue font-medium">— Mission Protocol</p>
            </div>

            {/* AMY'S SUCCESS PROTOCOLS */}
            <div className="amy-glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-neon-green" />
                Success Protocols
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-neon-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-neon-green text-sm font-bold">✓</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Deploy reminders for daily operations
                  </p>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-neon-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-neon-green text-sm font-bold">✓</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Initiate with 7-day missions for optimal success rate
                  </p>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-neon-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-neon-green text-sm font-bold">✓</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Define specific, measurable objectives
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}