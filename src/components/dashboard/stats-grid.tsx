import { Card, CardContent } from '@/components/ui/card'

interface StatsGridProps {
  stats: {
    totalChallenges: number
    completed: number
    failed: number
    currentStreak: number
    totalStaked: number
    totalEarned: number
  }
}

export function StatsGrid({ stats }: StatsGridProps) {
  const completionRate = stats.totalChallenges > 0 ? (stats.completed / stats.totalChallenges) * 100 : 0

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Your Stats</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <Card variant="outlined">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {stats.totalChallenges}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Total Challenges
            </div>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {stats.completed}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Completed
            </div>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
              {stats.failed}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Failed
            </div>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {stats.currentStreak}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Current Streak
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completion Rate Card */}
      <Card variant="elevated" className={`${
        completionRate >= 70 
          ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
          : completionRate >= 40
            ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800'
            : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Success Rate</span>
            <span className={`text-lg font-bold ${
              completionRate >= 70 
                ? 'text-green-600 dark:text-green-400' 
                : completionRate >= 40
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-red-600 dark:text-red-400'
            }`}>
              {completionRate.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                completionRate >= 70 
                  ? 'bg-green-500' 
                  : completionRate >= 40
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Financial Stats */}
      <Card variant="outlined">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Staked</span>
            <span className="font-semibold text-foreground">${stats.totalStaked}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Money Earned Back</span>
            <span className="font-semibold text-green-600 dark:text-green-400">${stats.totalEarned}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-foreground">Net Impact</span>
            <span className={`font-bold ${
              stats.totalEarned >= stats.totalStaked 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              ${stats.totalEarned >= stats.totalStaked ? '+' : '-'}${Math.abs(stats.totalEarned - stats.totalStaked)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}