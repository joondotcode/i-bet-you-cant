'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, CheckCircle, Edit3 } from 'lucide-react'
import type { ChallengeFormData } from '../challenge-wizard'

interface SummaryStepProps {
  data: Partial<ChallengeFormData>
  onUpdate: (updates: Partial<ChallengeFormData>) => void
  onValidation: (isValid: boolean) => void
  onNext: () => void
  onBack: () => void
  onGoToStep?: (step: number) => void
  isSubmitting?: boolean
}


export function SummaryStep({
  data,
  onUpdate,
  onValidation,
  onNext,
  onBack,
  onGoToStep,
  isSubmitting = false
}: SummaryStepProps) {
  
  useEffect(() => {
    // Always valid - this is just a review step
    onValidation(true)
  }, [onValidation])

  // Sticky banner scroll detection
  useEffect(() => {
    if (!data.title) return

    const handleScroll = () => {
      const staticBanner = document.getElementById('commitment-banner')
      const stickyBanner = document.getElementById('sticky-banner')
      
      if (staticBanner && stickyBanner) {
        const staticBannerRect = staticBanner.getBoundingClientRect()
        const threshold = 100
        const isStaticBannerOutOfView = staticBannerRect.bottom < threshold
        
        if (isStaticBannerOutOfView) {
          stickyBanner.style.opacity = '1'
          stickyBanner.style.transform = 'translateY(0)'
        } else {
          stickyBanner.style.opacity = '0'
          stickyBanner.style.transform = 'translateY(-100%)'
        }
      }
    }

    const timeoutId = setTimeout(() => {
      handleScroll()
    }, 100)
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [data.title])

  const handleNext = () => {
    onNext()
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
                
                <div className="flex items-center justify-center gap-2 text-lg">
                  <span className="text-muted-foreground">for</span>
                  <span className="text-neon-green font-semibold px-3 py-1 amy-glass rounded-lg border border-neon-green/30">
                    {data.durationDays} days
                  </span>
                  <span className="text-muted-foreground">staking</span>
                  <span className="text-neon-green font-semibold px-3 py-1 amy-glass rounded-lg border border-neon-green/30">
                    ${data.stakeAmount}
                  </span>
                </div>
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
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                <span className="text-sm text-neon-green font-medium uppercase tracking-wider">Challenge</span>
              </div>
              
              <div className="flex-1 text-center px-6">
                <div className="flex items-center justify-center gap-2 text-white">
                  <span className="font-semibold">"{data.title}"</span>
                  <span className="text-muted-foreground">for</span>
                  <span className="text-neon-green font-semibold">{data.durationDays} days</span>
                  <span className="text-muted-foreground">staking</span>
                  <span className="text-neon-green font-semibold">${data.stakeAmount}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Review Step</span>
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto space-y-8 p-8">
        {/* AMY'S HERO HEADER */}
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 amy-glass-neon rounded-full flex items-center justify-center mx-auto mb-6 amy-interactive">
              <CheckCircle className="w-12 h-12 text-neon-green drop-shadow-lg" />
            </div>
            <div className="absolute -inset-4 amy-glass rounded-full opacity-30 blur-xl"></div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground leading-tight">
              Ready to commit?
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Review your challenge details and confirm your commitment.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 amy-glass rounded-full">
              <div className="w-2 h-2 bg-neon-green rounded-full"></div>
              <span className="text-sm text-neon-green font-medium">One final review before you commit</span>
            </div>
          </div>
        </div>

        {/* PROFESSIONAL CHALLENGE SUMMARY */}
        <div className="amy-glass-neon rounded-2xl p-8 border border-slate-700/40 backdrop-blur-xl">
          
          {/* Elegant Header */}
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-3 leading-tight">
              Challenge Summary
            </h3>
            <div className="text-lg text-slate-400">
              Review your commitment details
            </div>
          </div>

          {/* Professional Details Layout */}
          <div className="space-y-6">
            
            {/* Challenge Statement */}
            <div className="amy-glass rounded-xl p-6 border border-slate-600/30 relative text-center">
              <div className="text-sm text-slate-400 font-medium mb-2">Your Commitment</div>
              <div className="text-2xl font-semibold text-white mb-2">
                "{data.title}"
              </div>
              <div className="text-slate-300">
                Complete this task daily for {data.durationDays} consecutive days
              </div>
              
              {/* Professional Edit Button */}
              {onGoToStep && (
                <button
                  onClick={() => onGoToStep(1)}
                  className="absolute top-3 right-3 w-8 h-8 amy-glass rounded-lg border border-slate-600/40 hover:border-neon-green/50 text-slate-400 hover:text-neon-green transition-all duration-200 hover:scale-105 flex items-center justify-center"
                  title="Edit commitment"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Key Details Grid - 2 columns without confusing success rate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
              
              {/* Duration */}
              <div className="amy-glass rounded-xl p-6 border border-slate-600/30 text-center relative">
                <div className="text-sm text-slate-400 font-medium mb-2">Duration</div>
                <div className="text-4xl font-bold text-white mb-1">
                  {data.durationDays}
                </div>
                <div className="text-sm text-slate-400">consecutive days</div>
                
                {/* Professional Edit Button */}
                {onGoToStep && (
                  <button
                    onClick={() => onGoToStep(2)}
                    className="absolute top-3 right-3 w-8 h-8 amy-glass rounded-lg border border-slate-600/40 hover:border-neon-green/50 text-slate-400 hover:text-neon-green transition-all duration-200 hover:scale-105 flex items-center justify-center"
                    title="Edit duration"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              
              {/* Stake */}
              <div className="amy-glass rounded-xl p-6 border border-slate-600/30 text-center relative">
                <div className="text-sm text-slate-400 font-medium mb-2">Stake Amount</div>
                <div className="text-4xl font-bold text-white mb-1">
                  ${data.stakeAmount}
                </div>
                <div className="text-sm text-slate-400">at risk</div>
                
                {/* Professional Edit Button */}
                {onGoToStep && (
                  <button
                    onClick={() => onGoToStep(3)}
                    className="absolute top-3 right-3 w-8 h-8 amy-glass rounded-lg border border-slate-600/40 hover:border-neon-green/50 text-slate-400 hover:text-neon-green transition-all duration-200 hover:scale-105 flex items-center justify-center"
                    title="Edit stake amount"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="amy-glass rounded-xl p-6 border border-slate-600/30 relative">
              {/* Professional Edit Button */}
              {onGoToStep && (
                <button
                  onClick={() => onGoToStep(2)}
                  className="absolute top-3 right-3 w-8 h-8 amy-glass rounded-lg border border-slate-600/40 hover:border-neon-green/50 text-slate-400 hover:text-neon-green transition-all duration-200 hover:scale-105 flex items-center justify-center"
                  title="Edit start date"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-sm text-slate-400 font-medium mb-2">Start Date</div>
                  <div className="text-xl font-semibold text-white">
                    {data.startDate && (() => {
                      const startDate = new Date(data.startDate)
                      const today = new Date()
                      const tomorrow = new Date(today)
                      tomorrow.setDate(tomorrow.getDate() + 1)
                      
                      const formatDate = (date: Date) => date.toISOString().split('T')[0]
                      
                      if (formatDate(startDate) === formatDate(today)) {
                        return 'Today'
                      } else if (formatDate(startDate) === formatDate(tomorrow)) {
                        return 'Tomorrow'
                      } else {
                        return startDate.toLocaleDateString('en-US', { 
                          weekday: 'long',
                          month: 'long', 
                          day: 'numeric'
                        })
                      }
                    })()}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-slate-400 font-medium mb-2">End Date</div>
                  <div className="text-xl font-semibold text-white">
                    {data.startDate && (() => {
                      const start = new Date(data.startDate)
                      const end = new Date(start)
                      end.setDate(start.getDate() + (data.durationDays || 0) - 1)
                      return end.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long', 
                        day: 'numeric'
                      })
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Terms Summary */}
            <div className="amy-glass rounded-xl p-6 border border-slate-600/30 bg-slate-900/20">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5 text-slate-400">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Terms</h4>
                  <div className="text-slate-300 leading-relaxed space-y-2">
                    <p>• Complete your task <span className="font-medium text-white">every single day</span> for {data.durationDays} consecutive days</p>
                    <p>• Miss any day and <span className="font-medium text-white">forfeit your entire ${data.stakeAmount} stake</span></p>
                    <p>• Complete all days and <span className="font-medium text-white">receive your full refund</span></p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* AMY'S NAVIGATION - CONDITIONAL BUTTON SYSTEM */}
        <div className="flex justify-between items-center pt-8">
          <button 
            onClick={onBack} 
            disabled={isSubmitting}
            className="px-6 py-3 amy-glass text-muted-foreground hover:text-foreground rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
          >
            Back
          </button>
          
          <button 
            onClick={handleNext}
            disabled={isSubmitting}
            className="px-8 py-4 rounded-xl font-bold text-lg min-w-48 transition-all duration-300 relative overflow-hidden amy-glass-neon text-neon-green hover:amy-glass-hover"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? 'Processing...' : 'Confirm & Pay'}
              {!isSubmitting && <ArrowRight className="w-5 h-5" />}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-green/10 to-neon-blue/10" />
          </button>
        </div>
      </div>
    </>
  )
}