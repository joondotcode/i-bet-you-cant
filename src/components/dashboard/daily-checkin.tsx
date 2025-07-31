'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProgressRing } from '@/components/ui/progress-ring'

interface Challenge {
  id: string
  title: string
  duration: number
  currentStreak: number
  stakeAmount: number
}

interface DailyCheckInProps {
  challenge: Challenge
  hasCheckedIn: boolean
}

export function DailyCheckIn({ challenge, hasCheckedIn }: DailyCheckInProps) {
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [checkedIn, setCheckedIn] = useState(hasCheckedIn)

  const handleCheckIn = async () => {
    setIsCheckingIn(true)
    
    try {
      const response = await fetch(`/api/challenges/${challenge.id}/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Check-in failed:', data.error)
        // TODO: Show error toast/notification
        return
      }

      setCheckedIn(true)
      // TODO: Update challenge store with new streak data
      // challenge.currentStreak = data.currentStreak
      
    } catch (error) {
      console.error('Check-in error:', error)
      // TODO: Show error toast/notification
    } finally {
      setIsCheckingIn(false)
    }
  }

  const hoursLeft = 23 - new Date().getHours()
  const progress = ((challenge.currentStreak) / challenge.duration) * 100

  if (checkedIn) {
    return (
      <Card variant="elevated" className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">
                ✅ Checked in today!
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                Day {challenge.currentStreak} of {challenge.duration} completed. Your $15 is safe!
              </p>
            </div>
          </div>
          <ProgressRing 
            progress={progress} 
            size="md" 
            color="green"
            showPercentage={false}
          >
            <div className="text-center">
              <div className="text-sm font-bold text-green-600 dark:text-green-400">
                {challenge.currentStreak}
              </div>
              <div className="text-xs text-green-500 dark:text-green-500">
                of {challenge.duration}
              </div>
            </div>
          </ProgressRing>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="elevated" className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-red-800 dark:text-red-200">⚠️ Daily Check-in Required</span>
          <span className="text-sm font-normal text-red-600 dark:text-red-400">
            {hoursLeft} hours left
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              {challenge.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Day {challenge.currentStreak + 1} of {challenge.duration}
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
              💰 <strong>${challenge.stakeAmount} at risk</strong> - Don&apos;t let it slip away!
            </p>
          </div>
          <ProgressRing 
            progress={progress} 
            size="lg" 
            color="red"
            showPercentage={false}
          >
            <div className="text-center">
              <div className="text-lg font-bold text-red-600 dark:text-red-400">
                {challenge.currentStreak}
              </div>
              <div className="text-xs text-red-500 dark:text-red-500">
                of {challenge.duration}
              </div>
            </div>
          </ProgressRing>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <h4 className="font-medium text-foreground mb-2">Did you complete your habit today?</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Be honest - this is about building real accountability, not just clicking buttons.
          </p>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleCheckIn}
              loading={isCheckingIn}
              variant="success"
              size="lg"
              fullWidth
              className="font-semibold"
            >
              {isCheckingIn ? 'Confirming...' : '✅ Yes, I completed it!'}
            </Button>
          </div>
          
          <div className="mt-3 text-center">
            <button className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors">
              Need to report a miss? Click here (this will end your challenge)
            </button>
          </div>
        </div>

        {/* Motivation Section */}
        <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-3">
            <span className="text-yellow-500 text-lg">💪</span>
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                You&apos;ve got this!
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                You&apos;re {challenge.currentStreak} days in - that&apos;s {Math.round((challenge.currentStreak / challenge.duration) * 100)}% of the way there! 
                Your commitment is showing, and your $15 stays safe with every check-in.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}