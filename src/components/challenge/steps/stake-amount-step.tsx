'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, ArrowRight, TrendingUp, Shield } from 'lucide-react'
import type { ChallengeFormData } from '../challenge-wizard'

interface StakeAmountStepProps {
  data: Partial<ChallengeFormData>
  onUpdate: (updates: Partial<ChallengeFormData>) => void
  onValidation: (isValid: boolean) => void
  onNext: () => void
  onBack: () => void
  isSubmitting?: boolean
  returnToStep?: number | null
}

const STAKE_OPTIONS = [
  {
    amount: 15,
    label: '$15',
    subtitle: 'Standard stake',
    popular: false,
    motivation: 'Good motivation',
    completionRate: 72
  },
  {
    amount: 25,
    label: '$25',
    subtitle: 'Higher stakes',
    popular: true,
    motivation: 'Strong motivation',
    completionRate: 84
  },
  {
    amount: 50,
    label: '$50',
    subtitle: 'Serious commitment',
    popular: false,
    motivation: 'Maximum motivation',
    completionRate: 91
  }
]

export function StakeAmountStep({
  data,
  onUpdate,
  onValidation,
  onNext,
  onBack,
  isSubmitting = false,
  returnToStep = null
}: StakeAmountStepProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(data.stakeAmount || 15)

  useEffect(() => {
    onValidation(selectedAmount >= 15)
  }, [selectedAmount, onValidation])

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
  }, [data.title, selectedAmount])

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    onUpdate({ stakeAmount: amount })
  }

  const handleNext = () => {
    if (selectedAmount >= 15) {
      onNext()
    }
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
                    ${selectedAmount}
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
                  <span className="text-neon-green font-semibold">${selectedAmount}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Stake Step</span>
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto space-y-8 p-8">
      {/* AMY'S HERO HEADER - PREMIUM GLASSMORPHISM */}
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-24 h-24 amy-glass-neon rounded-full flex items-center justify-center mx-auto mb-6 amy-interactive">
            <DollarSign className="w-12 h-12 text-neon-green drop-shadow-lg" />
          </div>
          <div className="absolute -inset-4 amy-glass rounded-full opacity-30 blur-xl"></div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground leading-tight">
            How much will you stake?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Put your money where your commitment is. Higher stakes = stronger motivation.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 amy-glass rounded-full">
            <div className="w-2 h-2 bg-neon-green rounded-full"></div>
            <span className="text-sm text-neon-green font-medium">Higher stakes = higher completion rates</span>
          </div>
        </div>
      </div>

      {/* AMY'S PREMIUM STAKE CARDS - GLASSMORPHISM STYLE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STAKE_OPTIONS.map((option) => (
          <button
            key={option.amount}
            onClick={() => handleAmountSelect(option.amount)}
            className={`
              group text-left relative overflow-hidden rounded-2xl p-6
              transition-all duration-500 ease-out
              ${selectedAmount === option.amount
                ? 'amy-glass border-2 border-neon-green/60 bg-gradient-to-br from-slate-900/80 to-slate-800/60 shadow-2xl shadow-neon-green/20' 
                : option.popular 
                  ? 'amy-glass border-2 border-amber-400/50 bg-gradient-to-br from-amber-900/20 to-amber-800/10 shadow-xl shadow-amber-400/10 hover:shadow-amber-400/20 relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-amber-400/5 before:to-transparent before:rounded-2xl'
                  : 'amy-glass border border-slate-700/50 hover:border-neon-green/40 hover:bg-gradient-to-br hover:from-slate-900/60 hover:to-slate-800/40 hover:shadow-lg hover:shadow-neon-green/10'
              }
            `}
          >
            {/* Popular badge when card is not selected */}
            {option.popular && selectedAmount !== option.amount && (
              <div className="absolute top-3 right-3 z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-400/20 to-amber-500/20 border border-amber-400/30 rounded-full backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Popular</span>
                </div>
              </div>
            )}

            {/* Main content */}
            <div className="flex flex-col h-full justify-between pt-8 pb-6">
              {/* Primary: Large Stake Amount */}
              <div className="text-center mb-8">
                <div className={`text-6xl font-black transition-all duration-300 ${
                  selectedAmount === option.amount
                    ? 'text-neon-green drop-shadow-[0_0_12px_rgba(34,197,94,0.4)]' 
                    : 'text-white group-hover:text-neon-green/90'
                }`}>
                  ${option.amount}
                </div>
                <div className={`text-lg font-medium tracking-wide transition-colors duration-300 ${
                  selectedAmount === option.amount
                    ? 'text-neon-green/80' 
                    : 'text-slate-300 group-hover:text-neon-green/70'
                }`}>
                  stake
                </div>
              </div>

              {/* Secondary: Card content */}
              <div className="text-center space-y-3 flex-1">
                <h3 className={`text-xl font-semibold transition-all duration-300 ${
                  selectedAmount === option.amount
                    ? 'text-white' 
                    : 'text-slate-200 group-hover:text-white'
                }`}>
                  {option.subtitle}
                </h3>
                
                <p className={`text-sm transition-colors duration-300 ${
                  selectedAmount === option.amount
                    ? 'text-slate-300' 
                    : 'text-slate-400 group-hover:text-slate-300'
                }`}>
                  {option.motivation}
                </p>
                
                <div className={`text-xs font-medium transition-colors duration-300 ${
                  selectedAmount === option.amount
                    ? 'text-neon-green/70' 
                    : 'text-slate-500 group-hover:text-slate-400'
                }`}>
                  {option.completionRate}% completion rate
                </div>
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedAmount === option.amount && (
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

      {/* Psychology Explanation - AMY GLASS STYLE */}
      <div className="amy-glass-neon rounded-2xl p-6 border border-neon-blue/20 shadow-lg shadow-neon-blue/5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1">
            <TrendingUp className="w-5 h-5 text-neon-blue" />
          </div>
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">
              Why stakes work
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Loss aversion is powerful. People are 2x more motivated to avoid losing money than gaining it. 
              Your stake creates real consequences that keep you committed when motivation fades.
            </p>
          </div>
        </div>
      </div>

      {/* Money-Back Promise - AMY GLASS STYLE */}
      <div className="amy-glass-neon rounded-2xl p-6 border border-neon-green/20 shadow-lg shadow-neon-green/5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1">
            <Shield className="w-5 h-5 text-neon-green" />
          </div>
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white">
              100% Money-Back Guarantee
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Complete all {data.durationDays} days and get your full ${selectedAmount} back. 
              We hold your money in secure escrow - you either succeed and get it back, or lose it for missing a day.
            </p>
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
        
        {/* Only show button when conditions are met */}
        {selectedAmount >= 15 && !isSubmitting ? (
          <button 
            onClick={handleNext}
            className="px-8 py-4 rounded-xl font-bold text-lg min-w-48 transition-all duration-300 relative overflow-hidden amy-glass-neon text-neon-green hover:amy-glass-hover"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {returnToStep ? 'Return to Summary' : 'Review Challenge'}
              <ArrowRight className="w-5 h-5" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-green/10 to-neon-blue/10" />
          </button>
        ) : <></> }
      </div>
      </div>
    </>
  )
}