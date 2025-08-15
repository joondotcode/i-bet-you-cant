'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Calendar, TrendingUp, AlertTriangle, CheckCircle2, Clock, Target, Zap, Trophy, Info } from 'lucide-react'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import type { ChallengeFormData } from '../challenge-wizard'

interface DurationSelectionStepProps {
  data: Partial<ChallengeFormData>
  onUpdate: (updates: Partial<ChallengeFormData>) => void
  onValidation: (isValid: boolean) => void
  onNext: () => void
  onBack: () => void
  isSubmitting?: boolean
}

const DURATION_OPTIONS = [
  {
    days: 7,
    label: '7 Days',
    title: 'Week Challenge',
    description: 'Perfect for testing a new habit',
    successRate: 78,
    difficulty: 'Beginner',
    color: 'green',
    icon: '🌱',
    gradient: 'from-green-500/10 to-green-600/10',
    borderColor: 'border-green-200 dark:border-green-800',
    textColor: 'text-green-700 dark:text-green-300',
    benefits: ['Low commitment pressure', 'Quick results', 'Perfect for beginners', 'High completion rate'],
    considerations: ['May not form lasting habits', 'Less impressive achievement'],
    stats: {
      averageCompletionTime: '6.2 days',
      commonFailureDay: 'Day 5',
      peakMotivationDrop: 'Day 4'
    }
  },
  {
    days: 14,
    label: '14 Days',
    title: 'Two Week Challenge',
    description: 'Strengthen your commitment',
    successRate: 65,
    difficulty: 'Intermediate',
    color: 'blue',
    icon: '💪',
    gradient: 'from-blue-500/10 to-blue-600/10',
    borderColor: 'border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-700 dark:text-blue-300',
    recommended: true,
    benefits: ['Balanced commitment', 'Starting to build routine', 'Good momentum builder', 'Solid achievement'],
    considerations: ['Requires consistent motivation', 'Mid-point can be challenging'],
    stats: {
      averageCompletionTime: '12.8 days',
      commonFailureDay: 'Day 9',
      peakMotivationDrop: 'Day 8-10'
    }
  },
  {
    days: 30,
    label: '30 Days',
    title: 'Month Challenge',
    description: 'Transform your routine completely',
    successRate: 45,
    difficulty: 'Advanced',
    color: 'purple',
    icon: '🏆',
    gradient: 'from-purple-500/10 to-purple-600/10',
    borderColor: 'border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-700 dark:text-purple-300',
    benefits: ['Forms lasting habits', 'Major achievement', 'Significant life impact', 'True transformation'],
    considerations: ['High commitment required', 'Requires strong willpower', 'Higher failure risk'],
    stats: {
      averageCompletionTime: '24.1 days',
      commonFailureDay: 'Day 18',
      peakMotivationDrop: 'Day 15-20'
    }
  }
]

export function DurationSelectionStep({
  data,
  onUpdate,
  onValidation,
  onNext,
  onBack,
  isSubmitting = false
}: DurationSelectionStepProps) {
  const [selectedDuration, setSelectedDuration] = useState<number>(data.durationDays || 0)
  const [startDate, setStartDate] = useState(data.startDate || new Date().toISOString().split('T')[0])
  const [errors, setErrors] = useState<{ duration?: string; startDate?: string }>({})
  const [hoveredOption, setHoveredOption] = useState<number | null>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')

  // Calculate date constraints
  const today = new Date().toISOString().split('T')[0]
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 30)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  // Validation effect
  useEffect(() => {
    const isValid = validateFields()
    onValidation(isValid)
  }, [selectedDuration, startDate, onValidation])

  const validateFields = (): boolean => {
    const newErrors: { duration?: string; startDate?: string } = {}

    if (!selectedDuration || ![7, 14, 30].includes(selectedDuration)) {
      newErrors.duration = 'Please select a challenge duration'
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required'
    } else {
      const selectedDate = new Date(startDate)
      const todayDate = new Date()
      todayDate.setHours(0, 0, 0, 0)
      
      if (selectedDate < todayDate) {
        newErrors.startDate = 'Start date must be today or in the future'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleDurationSelect = (days: number) => {
    setSelectedDuration(days)
    onUpdate({ durationDays: days })
    if (errors.duration) {
      setErrors(prev => ({ ...prev, duration: undefined }))
    }
  }

  const handleStartDateChange = (date: string) => {
    setStartDate(date)
    onUpdate({ startDate: date })
    if (errors.startDate) {
      setErrors(prev => ({ ...prev, startDate: undefined }))
    }
  }

  const handleNext = () => {
    if (validateFields()) {
      onNext()
    }
  }

  const getEndDate = (startDate: string, duration: number) => {
    const start = new Date(startDate)
    const end = new Date(start)
    end.setDate(start.getDate() + duration - 1)
    return end.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const selectedOption = DURATION_OPTIONS.find(opt => opt.days === selectedDuration)

  return (
    <TooltipProvider>
      <div className={cn("space-y-6", isMobile ? "p-4" : "p-6")}>
        {/* Enhanced Duration Selection */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-background to-muted/20">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Choose Your Challenge Duration</h2>
                <p className="text-base text-muted-foreground font-normal mt-1">
                  Select the length that matches your commitment level
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Warning Alert */}
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Zero Tolerance Policy</AlertTitle>
              <AlertDescription>
                Missing even <strong>one single day</strong> means losing your entire stake. Choose wisely based on your confidence level.
              </AlertDescription>
            </Alert>

            <div className={cn(
              "grid gap-6",
              isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
            )}>
              {DURATION_OPTIONS.map((option) => (
                <HoverCard key={option.days} openDelay={300}>
                  <HoverCardTrigger asChild>
                    <button
                      onClick={() => handleDurationSelect(option.days)}
                      onMouseEnter={() => setHoveredOption(option.days)}
                      onMouseLeave={() => setHoveredOption(null)}
                      className={cn(
                        "group text-left relative overflow-hidden rounded-2xl p-6",
                        "transition-all duration-500 ease-out",
                        "hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]",
                        "focus:outline-none focus:ring-4 focus:ring-primary/20",
                        selectedDuration === option.days
                          ? 'amy-glass border-2 border-neon-green/60 bg-gradient-to-br from-slate-900/80 to-slate-800/60 shadow-2xl shadow-neon-green/20'
                          : option.recommended
                            ? 'amy-glass border-2 border-amber-400/50 bg-gradient-to-br from-amber-900/20 to-amber-800/10 shadow-xl shadow-amber-400/10 hover:shadow-amber-400/20 relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-amber-400/5 before:to-transparent before:rounded-2xl'
                            : 'amy-glass border border-slate-700/50 hover:border-neon-green/40 hover:bg-gradient-to-br hover:from-slate-900/60 hover:to-slate-800/40 hover:shadow-lg hover:shadow-neon-green/10'
                      )}
                      aria-pressed={selectedDuration === option.days}
                      aria-describedby={`duration-${option.days}-description`}
                    >
                      {/* Animated background */}
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300",
                        option.gradient,
                        hoveredOption === option.days && "opacity-100"
                      )} />
                      
                      {/* Selection indicator */}
                      <div className={cn(
                        "absolute top-4 right-4 w-7 h-7 rounded-full border-2 transition-all duration-200 flex items-center justify-center",
                        selectedDuration === option.days
                          ? 'border-primary bg-primary shadow-lg'
                          : 'border-muted-foreground group-hover:border-primary'
                      )}>
                        {selectedDuration === option.days && (
                          <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                        )}
                      </div>

                      {/* Enhanced Content */}
                      <div className="relative z-10 space-y-4">
                        {/* Header */}
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">{option.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-bold text-xl">{option.title}</h3>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                        </div>

                        {/* Enhanced Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                Success
                              </span>
                              <Badge variant={
                                option.successRate >= 70 ? 'default' :
                                option.successRate >= 50 ? 'secondary' : 'destructive'
                              } size="sm">
                                {option.successRate}%
                              </Badge>
                            </div>
                            {/* Animated progress bar */}
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className={cn(
                                  "h-2 rounded-full transition-all duration-1000 ease-out",
                                  option.successRate >= 70 ? 'bg-green-500' :
                                  option.successRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                )}
                                style={{ 
                                  width: hoveredOption === option.days ? `${option.successRate}%` : '0%'
                                }}
                              />
                            </div>
                          </div>
                          
                          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                Level
                              </span>
                              <Badge variant="outline" size="sm">
                                {option.difficulty}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {option.days} consecutive days
                            </div>
                          </div>
                        </div>

                        {/* Quick benefits preview */}
                        <div className="text-xs text-muted-foreground">
                          <strong className={option.textColor}>Key benefit:</strong> {option.benefits[0]}
                        </div>
                      </div>

                      {/* Sophisticated recommendation indicator */}
                      {option.recommended && (
                        <div className="mt-4 text-center">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-400/20 to-amber-500/20 border border-amber-400/30 rounded-full">
                            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Recommended</span>
                          </div>
                        </div>
                      )}
                    </button>
                  </HoverCardTrigger>
                  
                  {/* Enhanced Hover Card with Statistics */}
                  <HoverCardContent className="w-80" side={isMobile ? "top" : "right"}>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{option.icon}</div>
                        <div>
                          <h4 className="font-semibold text-lg">{option.title}</h4>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                      
                      {/* Detailed Statistics */}
                      <div className="space-y-3">
                        <h5 className="font-medium text-sm flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          Detailed Statistics
                        </h5>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-muted/50 rounded p-2">
                            <div className="font-medium">Avg. Completion</div>
                            <div className="text-muted-foreground">{option.stats.averageCompletionTime}</div>
                          </div>
                          <div className="bg-muted/50 rounded p-2">
                            <div className="font-medium">Common Failure</div>
                            <div className="text-muted-foreground">{option.stats.commonFailureDay}</div>
                          </div>
                          <div className="bg-muted/50 rounded p-2 col-span-2">
                            <div className="font-medium">Motivation Drop</div>
                            <div className="text-muted-foreground">{option.stats.peakMotivationDrop}</div>
                          </div>
                        </div>
                      </div>

                      {/* Quick comparison */}
                      <div className="pt-2 border-t space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h6 className="font-medium text-xs text-green-600 dark:text-green-400 mb-1">
                              ✓ Benefits
                            </h6>
                            <ul className="text-xs space-y-0.5">
                              {option.benefits.slice(0, 2).map((benefit, i) => (
                                <li key={i} className="text-muted-foreground">• {benefit}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h6 className="font-medium text-xs text-amber-600 dark:text-amber-400 mb-1">
                              ⚠ Consider
                            </h6>
                            <ul className="text-xs space-y-0.5">
                              {option.considerations.slice(0, 2).map((consideration, i) => (
                                <li key={i} className="text-muted-foreground">• {consideration}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
            ))}
          </div>

          {errors.duration && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Validation Error</AlertTitle>
              <AlertDescription>{errors.duration}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Selected Duration Details */}
      {selectedOption && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <TrendingUp className="w-5 h-5" />
              {selectedOption.title} Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Benefits
                </h4>
                <ul className="space-y-1">
                  {selectedOption.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                      <span className="w-1 h-1 bg-green-600 rounded-full" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Considerations
                </h4>
                <ul className="space-y-1">
                  {selectedOption.considerations.map((consideration, index) => (
                    <li key={index} className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                      <span className="w-1 h-1 bg-amber-600 rounded-full" />
                      {consideration}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Start Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle>When will you start?</CardTitle>
          <p className="text-muted-foreground">
            Choose your start date. We recommend starting tomorrow to give yourself time to prepare.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enhanced Date Selection Options */}
          <div className="space-y-4">
            {/* Quick Selection Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant={startDate === today ? "default" : "outline"}
                onClick={() => handleStartDateChange(today)}
                className={cn(
                  "flex-1 h-14 text-left justify-start gap-3",
                  startDate === today && "bg-neon-green/20 border-neon-green/50 text-neon-green hover:bg-neon-green/30"
                )}
              >
                <div className="w-3 h-3 bg-neon-green rounded-full" />
                <div>
                  <div className="font-semibold">Today</div>
                  <div className="text-xs opacity-70">Start immediately</div>
                </div>
              </Button>
              
              <Button
                type="button"
                variant={startDate === new Date(Date.now() + 86400000).toISOString().split('T')[0] ? "default" : "outline"}
                onClick={() => {
                  const tomorrow = new Date()
                  tomorrow.setDate(tomorrow.getDate() + 1)
                  handleStartDateChange(tomorrow.toISOString().split('T')[0])
                }}
                className={cn(
                  "flex-1 h-14 text-left justify-start gap-3",
                  startDate === new Date(Date.now() + 86400000).toISOString().split('T')[0] && "bg-amber-400/20 border-amber-400/50"
                )}
              >
                <div className="w-3 h-3 bg-amber-400 rounded-full" />
                <div>
                  <div className="font-semibold">Tomorrow</div>
                  <div className="text-xs opacity-70">Recommended</div>
                </div>
              </Button>
            </div>
            
            {/* Or choose different date */}
            <div className="text-center text-sm text-muted-foreground">
              Or choose a different date
            </div>
            
            {/* Custom Date Input with Icon */}
            <div className="max-w-md mx-auto">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                min={today}
                max={maxDateStr}
                error={errors.startDate}
                icon={<Calendar className="w-4 h-4" />}
                className="text-center"
                required
              />
            </div>
          </div>

          {/* Date Preview */}
          {selectedDuration > 0 && startDate && !errors.startDate && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Challenge Start:</span>
                    <span>{new Date(startDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Challenge End:</span>
                    <span>{getEndDate(startDate, selectedDuration)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-primary">
                    <span>Total Duration:</span>
                    <span>{selectedDuration} consecutive days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
          Back to Habit
        </Button>
        
        <Button 
          onClick={handleNext}
          disabled={!selectedDuration || !startDate || Object.keys(errors).length > 0 || isSubmitting}
          size="lg"
          className="min-w-32"
        >
          Review Commitment
        </Button>
      </div>
      </div>
    </TooltipProvider>
  )
}