'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Calendar, ArrowRight, Clock } from 'lucide-react'
import { DatePicker } from '@/components/ui/date-picker'
import type { ChallengeFormData } from '../challenge-wizard'

interface SimpleDurationStepProps {
  data: Partial<ChallengeFormData>
  onUpdate: (updates: Partial<ChallengeFormData>) => void
  onValidation: (isValid: boolean) => void
  onNext: () => void
  onBack: () => void
  isSubmitting?: boolean
  returnToStep?: number | null
}

const DURATION_OPTIONS = [
  {
    days: 7,
    label: '1 Week',
    subtitle: 'Test the waters',
    recommended: false,
    successRate: 78
  },
  {
    days: 14,
    label: '2 Weeks', 
    subtitle: 'Build momentum',
    recommended: true,
    successRate: 65
  },
  {
    days: 30,
    label: '1 Month',
    subtitle: 'Real transformation',
    recommended: false,
    successRate: 45
  }
]

export function SimpleDurationStep({
  data,
  onUpdate,
  onValidation,
  onNext,
  onBack,
  isSubmitting = false,
  returnToStep = null
}: SimpleDurationStepProps) {
  const [selectedDuration, setSelectedDuration] = useState<number>(data.durationDays || 0)
  
  // Use local timezone for proper date handling
  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  const todayDate = new Date()
  const today = getLocalDateString(todayDate)
  const tomorrowDate = new Date(todayDate)
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)
  const tomorrowStr = getLocalDateString(tomorrowDate)
  
  const [startDate, setStartDate] = useState(today)

  useEffect(() => {
    const isValid = selectedDuration > 0 && Boolean(startDate);
    onValidation(isValid)
  }, [selectedDuration, startDate, onValidation])

  // Sticky banner scroll detection
  useEffect(() => {
    if (!data.title) return

    const handleScroll = () => {
      const staticBanner = document.getElementById('commitment-banner')
      const stickyBanner = document.getElementById('sticky-banner')
      
      if (staticBanner && stickyBanner) {
        const staticBannerRect = staticBanner.getBoundingClientRect()
        // Consider banner "out of view" when its bottom is above the viewport top + some threshold
        const threshold = 100 // Give some buffer space
        const isStaticBannerOutOfView = staticBannerRect.bottom < threshold
        
        if (isStaticBannerOutOfView) {
          // Static banner is out of view, show sticky banner
          stickyBanner.style.opacity = '1'
          stickyBanner.style.transform = 'translateY(0)'
        } else {
          // Static banner is visible, hide sticky banner
          stickyBanner.style.opacity = '0'
          stickyBanner.style.transform = 'translateY(-100%)'
        }
      }
    }

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      handleScroll()
    }, 100)
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Cleanup
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [data.title, selectedDuration])

  const handleDurationSelect = (days: number) => {
    setSelectedDuration(days)
    onUpdate({ durationDays: days })
  }

  const handleStartDateChange = (date: string) => {
    setStartDate(date)
    onUpdate({ startDate: date })
  }

  const handleNext = () => {
    if (selectedDuration > 0 && startDate) {
      onNext()
    }
  }

  const getEndDate = () => {
    if (!startDate || !selectedDuration) return ''
    const start = new Date(startDate)
    const end = new Date(start)
    end.setDate(start.getDate() + selectedDuration - 1)
    return end.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <>
      {/* Elegant Commitment Banner - Static version */}
      {data.title && (
        <div id="commitment-banner" className="max-w-4xl mx-auto mb-8 px-8">
          <div className="amy-glass-neon rounded-2xl p-6 border border-neon-green/20 shadow-lg shadow-neon-green/5">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                <span className="text-sm text-neon-green font-medium uppercase tracking-wider">Your Challenge</span>
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white leading-tight">
                  "{data.title}"
                </div>
                
                {selectedDuration > 0 ? (
                  <div className="flex items-center justify-center gap-2 text-lg">
                    <span className="text-muted-foreground">for</span>
                    <span className="text-neon-green font-semibold px-3 py-1 amy-glass rounded-lg border border-neon-green/30">
                      {selectedDuration} days
                    </span>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    Choose your duration below
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Commitment Banner - Shows when scrolled out of view */}
      {data.title && (
        <div 
          className="fixed top-16 left-0 right-0 z-40 amy-glass border-b border-border/20 backdrop-blur-md shadow-lg shadow-black/20 transform transition-all duration-300 ease-out" 
          id="sticky-banner"
          style={{ opacity: 0, transform: 'translateY(-100%)' }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              {/* Left: Challenge indicator */}
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                <span className="text-sm text-neon-green font-medium uppercase tracking-wider">Challenge</span>
              </div>
              
              {/* Center: Challenge title and duration */}
              <div className="flex-1 text-center px-6">
                <div className="flex items-center justify-center gap-2 text-white">
                  <span className="font-semibold">"{data.title}"</span>
                  {selectedDuration > 0 && (
                    <>
                      <span className="text-muted-foreground">for</span>
                      <span className="text-neon-green font-semibold">{selectedDuration} days</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Right: Step indicator */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Duration Step</span>
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto space-y-8 p-8">
      {/* AMY'S HERO HEADER - MATCHING HABIT CHOICE STEP */}
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-24 h-24 amy-glass-neon rounded-full flex items-center justify-center mx-auto mb-6 amy-interactive">
            <Calendar className="w-12 h-12 text-neon-green drop-shadow-lg" />
          </div>
          <div className="absolute -inset-4 amy-glass rounded-full opacity-30 blur-xl"></div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground leading-tight">
            How long will you commit?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Choose your challenge duration. Longer = harder but more transformative.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 amy-glass rounded-full">
            <div className="w-2 h-2 bg-neon-green rounded-full"></div>
            <span className="text-sm text-neon-green font-medium">Longer = harder but more rewarding</span>
          </div>
        </div>
      </div>

      {/* AMY'S PREMIUM DURATION CARDS - EMERGENCY GLASSMORPHISM FIX */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DURATION_OPTIONS.map((option) => (
          <button
            key={option.days}
            onClick={() => handleDurationSelect(option.days)}
            className={`
              group text-left relative overflow-hidden rounded-2xl p-6
              transition-all duration-500 ease-out
              ${selectedDuration === option.days
                ? 'amy-glass border-2 border-neon-green/60 bg-gradient-to-br from-slate-900/80 to-slate-800/60 shadow-2xl shadow-neon-green/20' 
                : option.recommended 
                  ? 'amy-glass border-2 border-amber-400/50 bg-gradient-to-br from-amber-900/20 to-amber-800/10 shadow-xl shadow-amber-400/10 hover:shadow-amber-400/20 relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-amber-400/5 before:to-transparent before:rounded-2xl'
                  : 'amy-glass border border-slate-700/50 hover:border-neon-green/40 hover:bg-gradient-to-br hover:from-slate-900/60 hover:to-slate-800/40 hover:shadow-lg hover:shadow-neon-green/10'
              }
            `}
          >
            {/* OPTION 3: Hide recommended chip when card is selected */}
            {option.recommended && selectedDuration !== option.days && (
              <div className="absolute top-3 right-3 z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-400/20 to-amber-500/20 border border-amber-400/30 rounded-full backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Recommended</span>
                </div>
              </div>
            )}

            {/* Main content - consistent spacing for all cards */}
            <div className="flex flex-col h-full justify-between pt-8 pb-6">
              {/* Primary: Large Duration Number - Fixed position */}
              <div className="text-center mb-8">
                <div className={`text-6xl font-black transition-all duration-300 ${
                  selectedDuration === option.days
                    ? 'text-neon-green drop-shadow-[0_0_12px_rgba(34,197,94,0.4)]' 
                    : 'text-white group-hover:text-neon-green/90'
                }`}>
                  {option.days}
                </div>
                <div className={`text-lg font-medium tracking-wide transition-colors duration-300 ${
                  selectedDuration === option.days
                    ? 'text-neon-green/80' 
                    : 'text-slate-300 group-hover:text-neon-green/70'
                }`}>
                  days
                </div>
              </div>

              {/* Secondary: Card content - Fixed spacing */}
              <div className="text-center space-y-3 flex-1">
                <h3 className={`text-xl font-semibold transition-all duration-300 ${
                  selectedDuration === option.days
                    ? 'text-white' 
                    : 'text-slate-200 group-hover:text-white'
                }`}>
                  {option.label}
                </h3>
                
                <p className={`text-sm transition-colors duration-300 ${
                  selectedDuration === option.days
                    ? 'text-slate-300' 
                    : 'text-slate-400 group-hover:text-slate-300'
                }`}>
                  {option.subtitle}
                </p>
                
                <div className={`text-xs font-medium transition-colors duration-300 ${
                  selectedDuration === option.days
                    ? 'text-neon-green/70' 
                    : 'text-slate-500 group-hover:text-slate-400'
                }`}>
                  {option.successRate}% complete this challenge
                </div>
              </div>
            </div>

            {/* Sophisticated Selection Indicator */}
            {selectedDuration === option.days && (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-neon-green/[0.03] via-transparent to-neon-green/[0.02] pointer-events-none rounded-2xl" />
                <div className="absolute top-4 right-4">
                  <div className="w-5 h-5 bg-neon-green rounded-full flex items-center justify-center shadow-lg shadow-neon-green/50">
                    <svg className="w-2.5 h-2.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </>
            )}
          </button>
        ))}
      </div>

      {/* AMY'S START DATE SECTION - GLASSMORPHISM STYLE */}
      <div className="amy-glass-neon rounded-2xl p-8 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 justify-center">
            <div className="w-8 h-8 amy-glass rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-neon-green" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">When will you start?</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleStartDateChange(today)}
              className={`
                group relative p-4 rounded-xl text-center transition-all duration-200 amy-glass
                ${startDate === today
                  ? 'border-2 border-neon-green/60 bg-neon-green/5' 
                  : 'border-2 border-transparent hover:border-neon-green/30 hover:bg-neon-green/5'
                }
              `}
            >
              <div className={`font-semibold text-lg transition-colors duration-200 ${
                startDate === today ? 'text-neon-green' : 'text-foreground group-hover:text-neon-green'
              }`}>
                Today
              </div>
              <div className="text-sm text-muted-foreground mt-1">Start immediately</div>
              
              {/* Always rendered indicator - just opacity change */}
              <div className={`absolute top-3 right-3 transition-opacity duration-200 ${
                startDate === today ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="w-4 h-4 bg-neon-green rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-background rounded-full" />
                </div>
              </div>
            </button>
            
            <button
              onClick={() => handleStartDateChange(tomorrowStr)}
              className={`
                group relative p-4 rounded-xl text-center transition-all duration-200 amy-glass
                ${startDate === tomorrowStr
                  ? 'border-2 border-neon-green/60 bg-neon-green/5' 
                  : 'border-2 border-transparent hover:border-neon-green/30 hover:bg-neon-green/5'
                }
              `}
            >
              <div className={`font-semibold text-lg transition-colors duration-200 ${
                startDate === tomorrowStr ? 'text-neon-green' : 'text-foreground group-hover:text-neon-green'
              }`}>
                Tomorrow
              </div>
              <div className="text-sm text-muted-foreground mt-1">Recommended</div>
              
              {/* Always rendered indicator - just opacity change */}
              <div className={`absolute top-3 right-3 transition-opacity duration-200 ${
                startDate === tomorrowStr ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="w-4 h-4 bg-neon-green rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-background rounded-full" />
                </div>
              </div>
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">Or choose a different date</div>
            <span>{today}</span>
            <DatePicker
              value={startDate}
              onChange={handleStartDateChange}
              minDate={today}
              placeholder="Select your start date"
            />
          </div>
        </div>
      </div>


      {/* AMY'S NAVIGATION - OPTION A IMPLEMENTATION */}
      <div className="flex justify-between items-center pt-8">
        <button 
          onClick={onBack} 
          disabled={isSubmitting}
          className="px-6 py-3 amy-glass text-muted-foreground hover:text-foreground rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
        >
          Back
        </button>
        
        {/* OPTION A: Only show button when conditions are met */}
        {selectedDuration && startDate && !isSubmitting ? (
          <button 
            onClick={handleNext}
            className="px-8 py-4 rounded-xl font-bold text-lg min-w-48 transition-all duration-300 relative overflow-hidden amy-glass-neon text-neon-green hover:amy-glass-hover"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {returnToStep ? 'Return to Summary' : 'Set Stake'}
              <ArrowRight className="w-5 h-5" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-green/10 to-neon-blue/10" />
          </button>
        ) : <></>}
      </div>
      </div>
    </>
  )
}