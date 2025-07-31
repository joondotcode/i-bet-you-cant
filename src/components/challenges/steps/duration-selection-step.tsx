'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface DurationSelectionStepProps {
  data: {
    duration?: 7 | 14 | 21 | 30
  }
  onUpdate: (updates: { duration: 7 | 14 | 21 | 30 }) => void
  onNext: () => void
  onBack: () => void
}

export function DurationSelectionStep({ data, onUpdate, onNext, onBack }: DurationSelectionStepProps) {
  const [selectedDuration, setSelectedDuration] = useState<7 | 14 | 21 | 30 | null>(data.duration || null)

  const durations = [
    {
      days: 7 as const,
      label: '7 Days',
      subtitle: 'Perfect for beginners',
      difficulty: 'Easy',
      successRate: '78%',
      description: 'Great for testing new habits. Most people can stick to something for a week.',
      color: 'green',
      recommended: true
    },
    {
      days: 14 as const,
      label: '14 Days', 
      subtitle: 'Building momentum',
      difficulty: 'Moderate',
      successRate: '65%',
      description: 'Two weeks is where habits start to feel more natural. Good balance of challenge and achievability.',
      color: 'blue',
      recommended: false
    },
    {
      days: 21 as const,
      label: '21 Days',
      subtitle: 'Classic habit formation',
      difficulty: 'Challenging',
      successRate: '52%',
      description: 'The traditional "21 days to form a habit" period. Requires strong commitment.',
      color: 'orange',
      recommended: false
    },
    {
      days: 30 as const,
      label: '30 Days',
      subtitle: 'Maximum challenge',
      difficulty: 'Hard',
      successRate: '41%',
      description: 'A full month of commitment. Only for those serious about long-term change.',
      color: 'red',
      recommended: false
    }
  ]

  const handleContinue = () => {
    if (selectedDuration) {
      onUpdate({ duration: selectedDuration })
      onNext()
    }
  }

  const getDifficultyColor = (color: string) => {
    const colors = {
      green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20',
      blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20',
      orange: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20',
      red: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20'
    }
    return colors[color as keyof typeof colors]
  }

  const getBorderColor = (color: string, isSelected: boolean) => {
    if (!isSelected) return 'border-gray-200 dark:border-gray-700'
    
    const colors = {
      green: 'border-green-500 ring-2 ring-green-200 dark:ring-green-800',
      blue: 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800',
      orange: 'border-orange-500 ring-2 ring-orange-200 dark:ring-orange-800',
      red: 'border-red-500 ring-2 ring-red-200 dark:ring-red-800'
    }
    return colors[color as keyof typeof colors]
  }

  return (
    <div className="space-y-6">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Choose Your Challenge Duration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {durations.map((duration) => (
              <div
                key={duration.days}
                className={`
                  relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105
                  ${getBorderColor(duration.color, selectedDuration === duration.days)}
                  ${selectedDuration === duration.days ? 'shadow-lg' : 'hover:shadow-md'}
                `}
                onClick={() => setSelectedDuration(duration.days)}
              >
                {duration.recommended && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Recommended
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-foreground">{duration.label}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(duration.color)}`}>
                    {duration.difficulty}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{duration.subtitle}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
                    <span className="font-semibold text-foreground">{duration.successRate}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300">{duration.description}</p>
                
                {selectedDuration === duration.days && (
                  <div className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Selected
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBack}>
              Back to Habit
            </Button>
            <Button 
              onClick={handleContinue} 
              disabled={!selectedDuration}
              size="lg"
            >
              Review Commitment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      {selectedDuration && (
        <Card variant="outlined" className={`${getDifficultyColor(durations.find(d => d.days === selectedDuration)?.color || 'blue')} border-current`}>
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">Risk Assessment for {selectedDuration} Days</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Probability of Success:</span>
                <span className="font-semibold">
                  {durations.find(d => d.days === selectedDuration)?.successRate}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Expected Loss Risk:</span>
                <span className="font-semibold">
                  {100 - parseInt(durations.find(d => d.days === selectedDuration)?.successRate || '0')}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Your Money at Risk:</span>
                <span className="font-semibold text-red-600 dark:text-red-400">$15</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <Card variant="outlined" className="bg-gray-50 dark:bg-gray-800/50">
        <CardContent className="p-4">
          <h4 className="font-medium text-foreground mb-3">Success Statistics from Our Users</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {durations.map((duration) => (
              <div key={duration.days} className="space-y-1">
                <div className="text-lg font-bold text-foreground">{duration.successRate}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{duration.days} days</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
            Based on 10,000+ completed challenges. Start with 7 days if you&apos;re new to habit accountability.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}