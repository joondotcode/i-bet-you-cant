'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface HabitDefinitionStepProps {
  data: {
    title?: string
    description?: string
  }
  onUpdate: (updates: { title?: string; description?: string }) => void
  onNext: () => void
}

export function HabitDefinitionStep({ data, onUpdate, onNext }: HabitDefinitionStepProps) {
  const [title, setTitle] = useState(data.title || '')
  const [description, setDescription] = useState(data.description || '')
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({})

  const popularHabits = [
    { title: 'Daily Meditation', description: '10 minutes of mindfulness practice each morning' },
    { title: 'Morning Workout', description: '30 minutes of exercise before 9 AM' },
    { title: 'Read for 30 Minutes', description: 'Read at least 30 minutes of books or articles daily' },
    { title: 'No Social Media', description: 'Avoid all social media platforms for the entire day' },
    { title: 'Write 500 Words', description: 'Write at least 500 words in journal or creative work' },
    { title: '10,000 Steps', description: 'Walk at least 10,000 steps every day' },
    { title: 'Practice Gratitude', description: 'Write down 3 things I\'m grateful for each day' },
    { title: 'Learn New Language', description: '20 minutes of language study using apps or books' }
  ]

  const validateAndProceed = () => {
    const newErrors: { title?: string; description?: string } = {}

    if (!title.trim()) {
      newErrors.title = 'Habit title is required'
    } else if (title.trim().length < 3) {
      newErrors.title = 'Habit title must be at least 3 characters'
    } else if (title.trim().length > 50) {
      newErrors.title = 'Habit title must be less than 50 characters'
    }

    if (!description.trim()) {
      newErrors.description = 'Habit description is required'
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    } else if (description.trim().length > 200) {
      newErrors.description = 'Description must be less than 200 characters'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onUpdate({ title: title.trim(), description: description.trim() })
      onNext()
    }
  }

  const selectPresetHabit = (habit: { title: string; description: string }) => {
    setTitle(habit.title)
    setDescription(habit.description)
    setErrors({})
  }

  return (
    <div className="space-y-6">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Define Your Daily Habit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Custom Habit Form */}
          <div className="space-y-4">
            <div>
              <label htmlFor="habit-title" className="block text-sm font-medium text-foreground mb-2">
                Habit Title *
              </label>
              <Input
                id="habit-title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (errors.title) setErrors(prev => ({ ...prev, title: undefined }))
                }}
                placeholder="e.g., Daily Meditation, Morning Workout"
                className={errors.title ? 'border-red-500 focus:ring-red-500' : ''}
                maxLength={50}
              />
              {errors.title && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.title}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {title.length}/50 characters
              </p>
            </div>

            <div>
              <label htmlFor="habit-description" className="block text-sm font-medium text-foreground mb-2">
                Detailed Description *
              </label>
              <textarea
                id="habit-description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  if (errors.description) setErrors(prev => ({ ...prev, description: undefined }))
                }}
                placeholder="Be specific about what you'll do, when, and for how long..."
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white resize-none ${
                  errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                rows={3}
                maxLength={200}
              />
              {errors.description && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.description}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {description.length}/200 characters
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={validateAndProceed} size="lg">
              Continue to Duration
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Popular Habits */}
      <Card variant="outlined">
        <CardHeader>
          <CardTitle className="text-base">Or Choose from Popular Habits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {popularHabits.map((habit, index) => (
              <button
                key={index}
                onClick={() => selectPresetHabit(habit)}
                className="text-left p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
              >
                <h4 className="font-medium text-foreground mb-1">{habit.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{habit.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card variant="outlined" className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">💡 Tips for Success</h4>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span><strong>Be specific:</strong> "Exercise for 30 minutes" not just "exercise"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span><strong>Make it measurable:</strong> Define exactly what "completion" means</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span><strong>Start realistic:</strong> Choose something you can do even on your worst days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span><strong>Include timing:</strong> "Every morning" or "before bed" helps create routine</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}