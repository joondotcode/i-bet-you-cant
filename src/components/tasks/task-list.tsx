'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTasks, useTaskStore } from '@/lib/stores/task-store'

export function TaskList() {
  const tasks = useTasks()
  const toggleTask = useTaskStore((state) => state.toggleTask)

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-muted-foreground">
          No tasks yet. Add one above to get started.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between rounded-lg p-2 hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={task.status === 'completed'}
                onChange={() => toggleTask(task.id)}
              />
              <div>
                <p
                  className={`font-medium ${
                    task.status === 'completed'
                      ? 'line-through text-muted-foreground'
                      : ''
                  }`}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-sm text-muted-foreground">
                    {task.description}
                  </p>
                )}
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
