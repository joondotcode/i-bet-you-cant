'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Lightbulb, Target, Clock, Zap, Search, Sparkles, TrendingUp, CheckCircle2, Info, Star, AlertCircle } from 'lucide-react'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import type { ChallengeFormData } from '../challenge-wizard'

interface HabitDefinitionStepProps {
  data: Partial<ChallengeFormData>
  onUpdate: (updates: Partial<ChallengeFormData>) => void
  onValidation: (isValid: boolean) => void
  onNext: () => void
  onBack?: () => void
  isSubmitting?: boolean
}

const POPULAR_HABITS = [
  { 
    title: 'Daily Meditation', 
    description: '10-15 minutes of mindfulness practice each morning',
    category: 'wellness',
    icon: '🧘',
    successRate: 78,
    difficulty: 'Easy',
    avgDuration: '12 min',
    gradient: 'from-purple-500/10 to-indigo-500/10',
    borderColor: 'border-purple-200 dark:border-purple-800',
    tips: 'Start with just 5 minutes and use a meditation app'
  },
  { 
    title: 'Morning Workout', 
    description: '30 minutes of exercise before 9 AM',
    category: 'fitness',
    icon: '💪',
    successRate: 65,
    difficulty: 'Medium',
    avgDuration: '35 min',
    gradient: 'from-red-500/10 to-orange-500/10',
    borderColor: 'border-red-200 dark:border-red-800',
    tips: 'Prepare workout clothes the night before'
  },
  { 
    title: 'Read for 20 Minutes', 
    description: 'Read at least 20 minutes of books or educational content daily',
    category: 'learning',
    icon: '📚',
    successRate: 82,
    difficulty: 'Easy',
    avgDuration: '22 min',
    gradient: 'from-green-500/10 to-emerald-500/10',
    borderColor: 'border-green-200 dark:border-green-800',
    tips: 'Keep a book by your bedside or use audiobooks'
  },
  { 
    title: 'No Social Media', 
    description: 'Avoid all social media platforms for the entire day',
    category: 'digital-wellness',
    icon: '📱',
    successRate: 45,
    difficulty: 'Hard',
    avgDuration: 'All day',
    gradient: 'from-slate-500/10 to-gray-500/10',
    borderColor: 'border-slate-200 dark:border-slate-800',
    tips: 'Use app blockers and remove apps from home screen'
  },
  { 
    title: 'Write 300 Words', 
    description: 'Write at least 300 words in journal or creative work',
    category: 'creativity',
    icon: '✍️',
    successRate: 71,
    difficulty: 'Medium',
    avgDuration: '15 min',
    gradient: 'from-amber-500/10 to-yellow-500/10',
    borderColor: 'border-amber-200 dark:border-amber-800',
    tips: 'Set a timer and write without editing'
  },
  { 
    title: '8,000 Steps Daily', 
    description: 'Walk at least 8,000 steps every day',
    category: 'fitness',
    icon: '🚶',
    successRate: 74,
    difficulty: 'Easy',
    avgDuration: '60 min',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-200 dark:border-blue-800',
    tips: 'Take stairs, park farther, or walk during calls'
  },
  { 
    title: 'Practice Gratitude', 
    description: 'Write down 3 things you\'re grateful for each day',
    category: 'wellness',
    icon: '🙏',
    successRate: 85,
    difficulty: 'Easy',
    avgDuration: '5 min',
    gradient: 'from-pink-500/10 to-rose-500/10',
    borderColor: 'border-pink-200 dark:border-pink-800',
    tips: 'Do this first thing in the morning or before bed'
  },
  { 
    title: 'Learn New Language', 
    description: '15 minutes of language study using apps or books',
    category: 'learning',
    icon: '🌍',
    successRate: 68,
    difficulty: 'Medium',
    avgDuration: '18 min',
    gradient: 'from-teal-500/10 to-green-500/10',
    borderColor: 'border-teal-200 dark:border-teal-800',
    tips: 'Use spaced repetition and practice speaking daily'
  }
]

const SUCCESS_TIPS = [
  {
    icon: <Target className="w-5 h-5" />,
    title: 'Be Specific',
    description: '"Exercise for 30 minutes" not just "exercise"',
    example: '✓ "Run 2 miles" vs ✗ "Get fit"'
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Include Timing',
    description: '"Every morning" or "before bed" helps create routine',
    example: '✓ "Meditate at 7 AM" vs ✗ "Meditate sometime"'
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Start Realistic',
    description: 'Choose something you can do even on your worst days',
    example: '✓ "Read 1 page" vs ✗ "Read 50 pages"'
  },
  {
    icon: <Lightbulb className="w-5 h-5" />,
    title: 'Make it Measurable',
    description: 'Define exactly what "completion" means',
    example: '✓ "Write 200 words" vs ✗ "Write more"'
  }
]

const CATEGORY_INFO = {
  wellness: { icon: '🧘', color: 'purple', label: 'Wellness' },
  fitness: { icon: '💪', color: 'red', label: 'Fitness' },
  learning: { icon: '📚', color: 'green', label: 'Learning' },
  'digital-wellness': { icon: '📱', color: 'slate', label: 'Digital Wellness' },
  creativity: { icon: '✍️', color: 'amber', label: 'Creativity' }
}

export function HabitDefinitionStep({
  data,
  onUpdate,
  onValidation,
  onNext,
  onBack,
  isSubmitting = false
}: HabitDefinitionStepProps) {
  const [title, setTitle] = useState(data.title || '')
  const [description, setDescription] = useState(data.description || '')
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({})
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [hoveredHabit, setHoveredHabit] = useState<string | null>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')

  // Validation effect
  useEffect(() => {
    const isValid = validateFields()
    onValidation(isValid)
  }, [title, description, onValidation])

  const validateFields = (): boolean => {
    const newErrors: { title?: string; description?: string } = {}

    if (!title.trim()) {
      newErrors.title = 'Habit title is required'
    } else if (title.trim().length < 3) {
      newErrors.title = 'Habit title must be at least 3 characters'
    } else if (title.trim().length > 100) {
      newErrors.title = 'Habit title must be less than 100 characters'
    }

    if (description && description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    onUpdate({ title: value.trim() })
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: undefined }))
    }
  }

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    onUpdate({ description: value.trim() || undefined })
    if (errors.description) {
      setErrors(prev => ({ ...prev, description: undefined }))
    }
  }

  const selectPresetHabit = (habit: typeof POPULAR_HABITS[0]) => {
    setTitle(habit.title)
    setDescription(habit.description)
    setSelectedCategory(habit.category)
    onUpdate({ 
      title: habit.title, 
      description: habit.description 
    })
    setErrors({})
  }

  const handleNext = () => {
    if (validateFields()) {
      onNext()
    }
  }

  // Filter habits based on search query
  const filteredHabits = POPULAR_HABITS.filter(habit =>
    habit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    habit.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    habit.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group habits by category
  const habitsByCategory = filteredHabits.reduce((acc, habit) => {
    if (!acc[habit.category]) {
      acc[habit.category] = []
    }
    acc[habit.category].push(habit)
    return acc
  }, {} as Record<string, typeof POPULAR_HABITS>)

  return (
    <TooltipProvider>
      <div className={cn("space-y-6", isMobile ? "p-4" : "p-6")}>
        {/* Enhanced Header */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-background to-muted/20">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Define Your Daily Habit</h2>
                <p className="text-base text-muted-foreground font-normal mt-1">
                  What will you commit to doing every single day?
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Action Toggle */}
            <div className="flex gap-2 mb-6">
              <Button
                variant={!showCustomForm ? "default" : "outline"}
                onClick={() => setShowCustomForm(false)}
                className="flex-1"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Choose Popular Habit
              </Button>
              <Button
                variant={showCustomForm ? "default" : "outline"}
                onClick={() => setShowCustomForm(true)}
                className="flex-1"
              >
                <Target className="w-4 h-4 mr-2" />
                Create Custom Habit
              </Button>
            </div>

            {showCustomForm ? (
              /* Custom Habit Form */
              <div className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertTitle className="text-blue-900 dark:text-blue-100">Creating a Custom Habit</AlertTitle>
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    Be specific and realistic. Successful habits are clear, measurable, and achievable daily.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <Input
                      label="Habit Title"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g., Read 20 minutes daily, Do 50 push-ups"
                      error={errors.title}
                      required
                      maxLength={100}
                      className="text-lg"
                    />
                    <div className="flex justify-between mt-1">
                      {errors.title && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{errors.title}</AlertDescription>
                        </Alert>
                      )}
                      <p className="text-xs text-muted-foreground ml-auto">
                        {title.length}/100 characters
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Detailed Description <span className="text-muted-foreground">(Optional)</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      placeholder="Be specific: what exactly will you do, when, and for how long?"
                      className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      rows={4}
                      maxLength={500}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.description && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{errors.description}</AlertDescription>
                        </Alert>
                      )}
                      <p className="text-xs text-muted-foreground ml-auto">
                        {description.length}/500 characters
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Enhanced Popular Habits with Search */
              <div className="space-y-6">
                {/* Smart Search */}
                <Command className="rounded-lg border shadow-md">
                  <CommandInput 
                    placeholder="Search habits by name, category, or description..." 
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList className="max-h-[400px]">
                    <CommandEmpty>
                      <div className="text-center py-6">
                        <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No habits found matching your search.</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => setShowCustomForm(true)}
                        >
                          Create Custom Habit
                        </Button>
                      </div>
                    </CommandEmpty>
                    
                    {Object.entries(habitsByCategory).map(([category, habits]) => (
                      <CommandGroup key={category} heading={
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{CATEGORY_INFO[category as keyof typeof CATEGORY_INFO]?.icon}</span>
                          <span className="capitalize font-medium">
                            {CATEGORY_INFO[category as keyof typeof CATEGORY_INFO]?.label || category.replace('-', ' ')}
                          </span>
                          <Badge variant="secondary" className="ml-auto">
                            {habits.length} habits
                          </Badge>
                        </div>
                      }>
                        {habits.map((habit, index) => (
                          <HoverCard key={index} openDelay={300}>
                            <HoverCardTrigger asChild>
                              <CommandItem
                                onSelect={() => selectPresetHabit(habit)}
                                className={cn(
                                  "flex items-center gap-4 p-4 cursor-pointer rounded-lg transition-all duration-200",
                                  "hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]",
                                  title === habit.title && "bg-primary/10 border-2 border-primary/30"
                                )}
                                onMouseEnter={() => setHoveredHabit(habit.title)}
                                onMouseLeave={() => setHoveredHabit(null)}
                              >
                                {/* Habit Icon */}
                                <div className="text-3xl flex-shrink-0">{habit.icon}</div>
                                
                                {/* Main Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <h4 className="font-semibold text-lg text-foreground">
                                      {habit.title}
                                    </h4>
                                    {title === habit.title && (
                                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                                    {habit.description}
                                  </p>
                                  
                                  {/* Stats Row */}
                                  <div className="flex items-center gap-4 text-xs">
                                    <div className="flex items-center gap-1">
                                      <TrendingUp className="w-3 h-3 text-green-600" />
                                      <span className="font-medium text-green-600">
                                        {habit.successRate}% success
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-blue-600" />
                                      <span className="text-muted-foreground">{habit.avgDuration}</span>
                                    </div>
                                    <Badge 
                                      variant={habit.difficulty === 'Easy' ? 'default' : habit.difficulty === 'Medium' ? 'secondary' : 'destructive'}
                                      size="sm"
                                    >
                                      {habit.difficulty}
                                    </Badge>
                                  </div>
                                </div>
                              </CommandItem>
                            </HoverCardTrigger>
                            
                            {/* Enhanced Hover Card */}
                            <HoverCardContent className="w-80" side={isMobile ? "top" : "right"}>
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className="text-2xl">{habit.icon}</div>
                                  <div>
                                    <h4 className="font-semibold text-lg">{habit.title}</h4>
                                    <p className="text-sm text-muted-foreground capitalize">
                                      {CATEGORY_INFO[habit.category as keyof typeof CATEGORY_INFO]?.label}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="space-y-3">
                                  <div>
                                    <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                                      <Star className="w-4 h-4 text-yellow-500" />
                                      Success Statistics
                                    </h5>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div className="bg-green-50 dark:bg-green-950/20 rounded p-2">
                                        <div className="font-medium text-green-700 dark:text-green-300">Success Rate</div>
                                        <div className="text-green-600 dark:text-green-400 font-bold">{habit.successRate}%</div>
                                      </div>
                                      <div className="bg-blue-50 dark:bg-blue-950/20 rounded p-2">
                                        <div className="font-medium text-blue-700 dark:text-blue-300">Avg Duration</div>
                                        <div className="text-blue-600 dark:text-blue-400 font-bold">{habit.avgDuration}</div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                                      <Lightbulb className="w-4 h-4 text-amber-500" />
                                      Pro Tip
                                    </h5>
                                    <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
                                      {habit.tips}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        ))}
                      </CommandGroup>
                    ))}
                  </CommandList>
                </Command>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Success Tips */}
        <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/10 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-blue-900 dark:text-blue-100">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Tips for Habit Success</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-normal">
                  Follow these proven strategies to maximize your chances
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SUCCESS_TIPS.map((tip, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div className="group flex items-start gap-4 p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all duration-200">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200">
                        {tip.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          {tip.title}
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                          {tip.description}
                        </p>
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-mono bg-blue-50 dark:bg-blue-950/30 rounded px-2 py-1">
                          {tip.example}
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to see examples</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          {onBack ? (
            <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
              Back
            </Button>
          ) : (
            <div />
          )}
          
          <Button 
            onClick={handleNext} 
            disabled={!title.trim() || Object.keys(errors).length > 0 || isSubmitting}
            size="lg"
            className="min-w-32"
          >
            Continue to Duration
          </Button>
        </div>
      </div>
    </TooltipProvider>
  )
}