'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Plus, Target } from 'lucide-react'
import { HABIT_ICONS, type HabitTitle } from '@/components/icons/habit-icons'
import type { ChallengeFormData } from '../challenge-wizard'

interface HabitChoiceStepProps {
  data: Partial<ChallengeFormData>
  onUpdate: (updates: Partial<ChallengeFormData>) => void
  onValidation: (isValid: boolean) => void
  onNext: () => void
  onBack?: () => void
  isSubmitting?: boolean
  returnToStep?: number | null
}

// AMY'S CURATED POPULAR HABITS - Most effective with professional icons
const POPULAR_HABITS = [
  { 
    title: 'Daily Meditation' as HabitTitle, 
    description: '10 minutes of mindfulness daily',
    difficulty: 'Easy',
    color: 'purple'
  },
  { 
    title: 'Morning Workout' as HabitTitle, 
    description: '30 minutes of exercise',
    difficulty: 'Medium',
    color: 'red'
  },
  { 
    title: 'Read 20 Minutes' as HabitTitle, 
    description: 'Educational content daily',
    difficulty: 'Easy',
    color: 'blue'
  },
  { 
    title: 'Write 300 Words' as HabitTitle, 
    description: 'Journal or creative writing',
    difficulty: 'Medium',
    color: 'green'
  },
  { 
    title: '8,000 Steps' as HabitTitle, 
    description: 'Daily walking or movement goal',
    difficulty: 'Easy',
    color: 'orange'
  },
  { 
    title: 'Practice Gratitude' as HabitTitle, 
    description: 'Write 3 things you\'re grateful for',
    difficulty: 'Easy',
    color: 'pink'
  }
]

export function HabitChoiceStep({
  data,
  onUpdate,
  onValidation,
  onNext,
  onBack,
  isSubmitting = false,
  returnToStep = null
}: HabitChoiceStepProps) {
  const [showCustom, setShowCustom] = useState(false)
  const [customTitle, setCustomTitle] = useState(data.title || '')
  const [selectedHabit, setSelectedHabit] = useState<string>(data.title || '')

  useEffect(() => {
    const isValid = selectedHabit.trim().length >= 3
    onValidation(isValid)
  }, [selectedHabit, onValidation])

  const handleHabitSelect = (habit: typeof POPULAR_HABITS[0]) => {
    setSelectedHabit(habit.title)
    setCustomTitle('')
    setShowCustom(false)
    onUpdate({ 
      title: habit.title, 
      description: habit.description 
    })
  }

  const handleCustomChange = (value: string) => {
    setCustomTitle(value)
    setSelectedHabit(value)
    onUpdate({ title: value.trim(), description: undefined })
  }

  const handleNext = () => {
    if (selectedHabit.trim().length >= 3) {
      onNext()
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-8">
      {/* AMY'S HERO HEADER */}
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-24 h-24 amy-glass-neon rounded-full flex items-center justify-center mx-auto mb-6 amy-interactive">
            <Target className="w-12 h-12 text-neon-green drop-shadow-lg" />
          </div>
          <div className="absolute -inset-4 amy-glass rounded-full opacity-30 blur-xl"></div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground leading-tight">
            What will you do daily?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Choose a habit you'll commit to for the next week, 2 weeks, or month.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 amy-glass rounded-full">
            <div className="w-2 h-2 bg-neon-green rounded-full"></div>
            <span className="text-sm text-neon-green font-medium">Choose what you can do daily</span>
          </div>
        </div>
      </div>

      {/* AMY'S CHOICE TOGGLE */}
      <div className="flex gap-4 max-w-md mx-auto">
        <button
          onClick={() => setShowCustom(false)}
          className={`flex-1 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
            !showCustom 
              ? 'amy-glass-neon text-neon-green' 
              : 'amy-glass text-muted-foreground hover:text-foreground'
          }`}
        >
          Popular Habits
        </button>
        <button
          onClick={() => setShowCustom(true)}
          className={`flex-1 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
            showCustom 
              ? 'amy-glass-neon text-neon-green' 
              : 'amy-glass text-muted-foreground hover:text-foreground'
          }`}
        >
          <Plus className="w-5 h-5 mr-2 inline" />
          Custom Habit
        </button>
      </div>

      {showCustom ? (
        /* AMY'S CUSTOM HABIT INPUT */
        <div className="amy-glass-neon rounded-2xl p-8 space-y-6">
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-foreground">
              Your Daily Habit
            </label>
            <input
              value={customTitle}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder="e.g., Drink 8 glasses of water, Practice guitar 30 minutes"
              maxLength={100}
              className="w-full px-4 py-4 text-lg bg-background/50 border border-border rounded-xl focus:border-neon-green focus:ring-4 focus:ring-neon-green/25 focus:bg-background/80 focus:shadow-lg focus:shadow-neon-green/10 transition-all duration-200 amy-focus-input"
              autoFocus
            />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Be specific and realistic (minimum 3 characters)
              </span>
              <span className={`font-medium ${
                customTitle.length >= 3 
                  ? 'text-neon-green' 
                  : customTitle.length > 0 
                    ? 'text-yellow-400' 
                    : 'text-muted-foreground'
              }`}>
                {customTitle.length}/100
              </span>
            </div>
          </div>
          
          {/* AMY'S CLEAR VALIDATION FEEDBACK */}
          {customTitle.length > 0 && customTitle.length < 3 ? (
            <div className="amy-glass border border-yellow-400/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-yellow-400 text-sm font-bold">!</span>
                </div>
                <p className="text-yellow-400 font-medium">
                  Please enter at least 3 characters for your habit description.
                </p>
              </div>
            </div>
          ) : customTitle.length >= 3 ? (
            <div className="amy-glass border border-neon-green/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-neon-green rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-background text-sm font-bold">✓</span>
                </div>
                <p className="text-neon-green font-medium">
                  Good! Make sure you can do this even on your worst days.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        /* AMY'S PREMIUM HABIT CARDS WITH PROFESSIONAL ICONS */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {POPULAR_HABITS.map((habit, index) => {
            const IconComponent = HABIT_ICONS[habit.title]
            
            return (
              <button
                key={index}
                onClick={() => handleHabitSelect(habit)}
                className={`
                  group amy-interactive text-left relative overflow-hidden rounded-2xl
                  transition-[transform,box-shadow] duration-300
                  ${selectedHabit === habit.title
                    ? 'amy-glass-hover border-neon-green/50' 
                    : 'amy-glass hover:amy-glass-hover border-transparent'
                  }
                `}
              >
                <div className="p-6 relative z-10">
                  <div className="flex items-start gap-5">
                    {/* AMY'S PROFESSIONAL ICONS */}
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-[transform] duration-300 ${
                        selectedHabit === habit.title
                          ? 'amy-glass-neon scale-110' 
                          : 'amy-glass group-hover:amy-glass-neon group-hover:scale-105'
                      }`}>
                        <IconComponent 
                          size={28} 
                          className={`transition-colors duration-200 ${
                            selectedHabit === habit.title
                              ? 'text-neon-green' 
                              : 'text-muted-foreground group-hover:text-neon-green'
                          }`}
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <h3 className={`text-xl font-bold transition-colors duration-200 ${
                        selectedHabit === habit.title
                          ? 'text-neon-green' 
                          : 'text-foreground group-hover:text-neon-green'
                      }`}>
                        {habit.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {habit.description}
                      </p>
                      
                      {/* AMY'S INSTANT-RESPONSE DIFFICULTY BADGE */}
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                        habit.difficulty === 'Easy' 
                          ? selectedHabit === habit.title
                            ? 'bg-neon-green text-background'
                            : 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                          : selectedHabit === habit.title
                            ? 'bg-neon-blue text-background'
                            : 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                      }`}>
                        {habit.difficulty}
                      </div>
                    </div>
                    
                    {/* AMY'S SELECTION INDICATOR */}
                    {selectedHabit === habit.title && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 bg-neon-green rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-background rounded-full" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* AMY'S SUBTLE GLOW OVERLAY */}
                {selectedHabit === habit.title && (
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 via-transparent to-neon-blue/5 pointer-events-none rounded-2xl" />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* AMY'S WARNING SECTION */}
      <div className="relative">
        <div className="amy-glass border border-yellow-400/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-yellow-400 text-2xl">⚠️</span>
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-yellow-400">
                Zero Tolerance System
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                Missing even one day means losing your entire stake. Choose something you can do consistently.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AMY'S NAVIGATION */}
      <div className="flex justify-between items-center pt-8">
        {onBack ? (
          <button 
            onClick={onBack} 
            disabled={isSubmitting}
            className="px-6 py-3 amy-glass text-muted-foreground hover:text-foreground rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
          >
            Back
          </button>
        ) : (
          <div />
        )}
        
        <button 
          onClick={handleNext}
          disabled={selectedHabit.trim().length < 3 || isSubmitting}
          className={`
            px-8 py-4 rounded-xl font-bold text-lg min-w-48 transition-all duration-300 relative overflow-hidden
            ${selectedHabit.trim().length >= 3 && !isSubmitting
              ? 'amy-glass-neon text-neon-green hover:amy-glass-hover'
              : 'amy-glass text-muted-foreground cursor-not-allowed opacity-50'
            }
          `}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {returnToStep ? 'Return to Summary' : 'Choose Duration'}
            <ArrowRight className="w-5 h-5" />
          </span>
          {selectedHabit.trim().length >= 3 && !isSubmitting && (
            <div className="absolute inset-0 bg-gradient-to-r from-neon-green/10 to-neon-blue/10" />
          )}
        </button>
      </div>
    </div>
  )
}