'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressRing } from '@/components/ui/progress-ring'
import { Button } from '@/components/ui/button'

interface Challenge {
  id: string
  title: string
  description: string
  duration: number
  currentStreak: number
  stakeAmount: number
  timeZone: string
  createdAt: string
  lastCheckIn: string
  status: string
}

interface ActiveChallengeCardProps {
  challenge: Challenge
}

export function ActiveChallengeCard({ challenge }: ActiveChallengeCardProps) {
  const progress = (challenge.currentStreak / challenge.duration) * 100
  const remainingDays = challenge.duration - challenge.currentStreak
  const startDate = new Date(challenge.createdAt)
  const lastCheckIn = new Date(challenge.lastCheckIn)
  
  // Calculate days since start
  const daysSinceStart = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Current Challenge</span>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
              Active
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              ${challenge.stakeAmount} at stake
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Challenge Details */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {challenge.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {challenge.description}
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Started {startDate.toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last check-in: {lastCheckIn.toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="ml-6">
            <ProgressRing 
              progress={progress} 
              size="xl" 
              color={progress > 75 ? 'green' : progress > 50 ? 'blue' : progress > 25 ? 'yellow' : 'red'}
            />
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {challenge.currentStreak}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Days Completed
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {remainingDays}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Days Remaining
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round(progress)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Complete
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${challenge.stakeAmount}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              At Stake
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Progress Timeline</h4>
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {Array.from({ length: challenge.duration }, (_, i) => {
              const dayNumber = i + 1
              const isCompleted = dayNumber <= challenge.currentStreak
              const isCurrent = dayNumber === challenge.currentStreak + 1
              const isFuture = dayNumber > challenge.currentStreak + 1
              
              return (
                <div
                  key={i}
                  className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2
                    ${isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-white dark:bg-gray-800 border-orange-500 text-orange-500' 
                        : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                    }
                  `}
                  title={`Day ${dayNumber}${isCompleted ? ' - Completed' : isCurrent ? ' - Current' : ' - Upcoming'}`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    dayNumber
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>Start</span>
            <span>{challenge.duration} days</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" size="sm" className="flex-1">
            View Details
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
            End Challenge
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}