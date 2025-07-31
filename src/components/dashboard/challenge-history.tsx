import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Challenge {
  id: string
  title: string
  duration: number
  completedDays: number
  status: 'completed' | 'failed' | 'active'
  startDate: string
  endDate?: string
  stakeAmount: number
}

interface ChallengeHistoryProps {
  challenges: Challenge[]
}

export function ChallengeHistory({ challenges }: ChallengeHistoryProps) {
  if (challenges.length === 0) {
    return (
      <Card variant="outlined">
        <CardHeader>
          <CardTitle>Challenge History</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="font-medium text-foreground mb-2">No Challenge History Yet</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your completed and failed challenges will appear here. Start your first challenge to begin building your history!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="outlined">
      <CardHeader>
        <CardTitle>Challenge History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenges.map((challenge) => (
          <div 
            key={challenge.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                challenge.status === 'completed' 
                  ? 'bg-green-500' 
                  : challenge.status === 'failed'
                    ? 'bg-red-500'
                    : 'bg-blue-500'
              }`} />
              
              <div>
                <h4 className="font-medium text-foreground">{challenge.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {challenge.completedDays} of {challenge.duration} days completed
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(challenge.startDate).toLocaleDateString()} - {
                    challenge.endDate ? new Date(challenge.endDate).toLocaleDateString() : 'Ongoing'
                  }
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-sm font-medium ${
                challenge.status === 'completed' 
                  ? 'text-green-600 dark:text-green-400' 
                  : challenge.status === 'failed'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-blue-600 dark:text-blue-400'
              }`}>
                {challenge.status === 'completed' 
                  ? '✅ Completed' 
                  : challenge.status === 'failed'
                    ? '❌ Failed'
                    : '🔄 Active'
                }
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                ${challenge.stakeAmount} {challenge.status === 'completed' ? 'returned' : challenge.status === 'failed' ? 'lost' : 'at stake'}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}