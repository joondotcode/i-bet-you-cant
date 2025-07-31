'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface CommitmentReviewStepProps {
  data: {
    title: string
    description: string
    duration: 7 | 14 | 21 | 30
    stakeAmount: number
  }
  onNext: () => void
  onBack: () => void
}

export function CommitmentReviewStep({ data, onNext, onBack }: CommitmentReviewStepProps) {
  const [hasAgreed, setHasAgreed] = useState(false)
  const [showConsequences, setShowConsequences] = useState(false)

  const endDate = new Date()
  endDate.setDate(endDate.getDate() + data.duration)

  const riskPercentage = {
    7: 22,
    14: 35, 
    21: 48,
    30: 59
  }[data.duration]

  const handleAcceptChallenge = () => {
    if (hasAgreed) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      {/* Challenge Summary */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Review Your Commitment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Challenge Summary</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Your Habit</label>
                <p className="text-lg font-semibold text-foreground">{data.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{data.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Duration</label>
                  <p className="text-lg font-semibold text-foreground">{data.duration} Days</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Stake Amount</label>
                  <p className="text-lg font-semibold text-red-600 dark:text-red-400">${data.stakeAmount}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Start Date</label>
                  <p className="text-lg font-semibold text-foreground">Today</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">End Date</label>
                  <p className="text-lg font-semibold text-foreground">{endDate.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card variant="outlined" className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-800 dark:text-red-200 flex items-center gap-2">
            ⚠️ Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-700">
            <div>
              <h4 className="font-semibold text-foreground">Probability of Losing Your Money</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Based on historical data for {data.duration}-day challenges</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{riskPercentage}%</div>
              <div className="text-sm text-red-500 dark:text-red-400">Risk Level</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-red-800 dark:text-red-200">What This Means:</h4>
            <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Out of 100 people who start a {data.duration}-day challenge, approximately {riskPercentage} lose their money</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Missing even ONE day means immediate failure and loss of your ${data.stakeAmount}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>No exceptions, no extensions, no refunds for any reason</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Consequences Breakdown */}
      <Card variant="outlined">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Understand the Consequences</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowConsequences(!showConsequences)}
            >
              {showConsequences ? 'Hide' : 'Show'} Details
            </Button>
          </CardTitle>
        </CardHeader>
        {showConsequences && (
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ If You Succeed</h4>
                <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                  <li>• Get your ${data.stakeAmount} back immediately</li>
                  <li>• Build a lasting habit</li>
                  <li>• Prove your commitment to yourself</li>
                  <li>• Join our Hall of Fame</li>
                </ul>
              </div>
              
              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">❌ If You Fail</h4>
                <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
                  <li>• Lose your ${data.stakeAmount} completely</li>
                  <li>• Cannot start a new challenge for 7 days</li>
                  <li>• Challenge marked as failed in your history</li>
                  <li>• No refunds or second chances</li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Common Failure Scenarios</h4>
              <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                <li>• "I was sick" - Not accepted, plan ahead</li>
                <li>• "I forgot" - Not accepted, set reminders</li>
                <li>• "I was traveling" - Not accepted, challenges continue everywhere</li>
                <li>• "Family emergency" - Not accepted, consider shorter challenges</li>
                <li>• "I was too busy" - Not accepted, choose realistic habits</li>
              </ul>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Final Agreement */}
      <Card variant="elevated" className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <input
              id="agreement"
              type="checkbox"
              checked={hasAgreed}
              onChange={(e) => setHasAgreed(e.target.checked)}
              className="mt-1 w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="agreement" className="text-sm text-blue-900 dark:text-blue-100">
              <strong>I understand and accept all terms:</strong>
              <br />
              I acknowledge that I have a {riskPercentage}% historical risk of losing my ${data.stakeAmount}. 
              I understand that missing even one day will result in immediate failure and complete loss of my stake. 
              I agree there are no exceptions, extensions, or refunds under any circumstances.
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Duration
        </Button>
        <Button 
          onClick={handleAcceptChallenge}
          disabled={!hasAgreed}
          variant="challenge"
          size="lg"
          className="font-bold"
        >
          I Accept This Challenge
        </Button>
      </div>
    </div>
  )
}