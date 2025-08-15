'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, ArrowRight, TrendingUp, Shield } from 'lucide-react'
import { formatCurrency, getCurrencyConfig } from '@/lib/i18n/utils'
import { routing, type Locale } from '@/i18n/routing'
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

export function StakeAmountStepI18n({
  data,
  onUpdate,
  onValidation,
  onNext,
  onBack,
  isSubmitting = false,
  returnToStep = null
}: StakeAmountStepProps) {
  const t = useTranslations('Challenge')
  const commonT = useTranslations('Common')
  const locale = useLocale() as Locale
  const currencyConfig = getCurrencyConfig(locale)
  
  // Convert stake amounts based on locale (simplified example)
  const getLocalizedStakeOptions = () => {
    const baseAmounts = [15, 25, 50] // USD base amounts
    const conversionRate = currencyConfig.currency === 'EUR' ? 0.85 : 1 // Simplified conversion
    
    return baseAmounts.map((amount, index) => ({
      amount: Math.round(amount * conversionRate),
      originalAmount: amount,
      label: formatCurrency(amount * conversionRate, locale),
      subtitle: t(`stakeOptions.${amount}.subtitle`),
      popular: index === 1, // Second option is popular
      motivation: t(`stakeOptions.${amount}.motivation`),
      completionRate: [72, 84, 91][index]
    }))
  }

  const [stakeOptions] = useState(getLocalizedStakeOptions())
  const [selectedAmount, setSelectedAmount] = useState<number>(
    data.stakeAmount || stakeOptions[0].amount
  )

  useEffect(() => {
    onValidation(selectedAmount >= stakeOptions[0].amount)
  }, [selectedAmount, onValidation, stakeOptions])

  // Sticky banner scroll detection (same as original)
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
    if (selectedAmount >= stakeOptions[0].amount) {
      onNext()
    }
  }

  return (
    <>
      {/* Elegant Commitment Banner - Localized */}
      {data.title && (
        <div id="commitment-banner" className="max-w-4xl mx-auto mb-8 px-8">
          <div className="amy-glass-neon rounded-2xl p-6 border border-neon-green/20 shadow-lg shadow-neon-green/5">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                <span className="text-sm text-neon-green font-medium uppercase tracking-wider">
                  {t('reviewTitle')}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white leading-tight">
                  "{data.title}"
                </div>
                
                <div className="flex items-center justify-center gap-2 text-lg">
                  <span className="text-muted-foreground">{commonT('for')}</span>
                  <span className="text-neon-green font-semibold px-3 py-1 amy-glass rounded-lg border border-neon-green/30">
                    {t('durationOptions.days', { count: data.durationDays })}
                  </span>
                  <span className="text-muted-foreground">{t('staking')}</span>
                  <span className="text-neon-green font-semibold px-3 py-1 amy-glass rounded-lg border border-neon-green/30">
                    {formatCurrency(selectedAmount, locale)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8 p-8">
        {/* Header Section - Localized */}
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 amy-glass-neon rounded-full flex items-center justify-center mx-auto mb-6 amy-interactive">
              <DollarSign className="w-12 h-12 text-neon-green drop-shadow-lg" />
            </div>
            <div className="absolute -inset-4 amy-glass rounded-full opacity-30 blur-xl"></div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground leading-tight">
              {t('stakeTitle')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('stakeSubtitle')}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 amy-glass rounded-full">
              <div className="w-2 h-2 bg-neon-green rounded-full"></div>
              <span className="text-sm text-neon-green font-medium">
                {t('higherStakesHigherCompletion')}
              </span>
            </div>
          </div>
        </div>

        {/* Stake Options - Localized */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stakeOptions.map((option, index) => (
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
              {/* Popular badge - Localized */}
              {option.popular && selectedAmount !== option.amount && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-400/20 to-amber-500/20 border border-amber-400/30 rounded-full backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
                      {t(`stakeOptions.${option.originalAmount}.popular`)}
                    </span>
                  </div>
                </div>
              )}

              {/* Main content */}
              <div className="flex flex-col h-full justify-between pt-8 pb-6">
                {/* Primary: Large Stake Amount - Localized */}
                <div className="text-center mb-8">
                  <div className={`text-6xl font-black transition-all duration-300 ${
                    selectedAmount === option.amount
                      ? 'text-neon-green drop-shadow-[0_0_12px_rgba(34,197,94,0.4)]' 
                      : 'text-white group-hover:text-neon-green/90'
                  }`}>
                    {option.label}
                  </div>
                  <div className={`text-lg font-medium tracking-wide transition-colors duration-300 ${
                    selectedAmount === option.amount
                      ? 'text-neon-green/80' 
                      : 'text-slate-300 group-hover:text-neon-green/70'
                  }`}>
                    {t('stake')}
                  </div>
                </div>

                {/* Secondary: Card content - Localized */}
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
                    {t(`stakeOptions.${option.originalAmount}.completionRate`)}
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

        {/* Psychology Explanation - Localized */}
        <div className="amy-glass-neon rounded-2xl p-6 border border-neon-blue/20 shadow-lg shadow-neon-blue/5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1">
              <TrendingUp className="w-5 h-5 text-neon-blue" />
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">
                {t('whyStakesWork')}
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {t('stakesExplanation')}
              </p>
            </div>
          </div>
        </div>

        {/* Money-Back Promise - Localized */}
        <div className="amy-glass-neon rounded-2xl p-6 border border-neon-green/20 shadow-lg shadow-neon-green/5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mt-1">
              <Shield className="w-5 h-5 text-neon-green" />
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white">
                {t('moneyBackGuarantee')}
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {t('guaranteeText', { 
                  days: data.durationDays || 7,
                  amount: formatCurrency(selectedAmount, locale)
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation - Localized */}
        <div className="flex justify-between items-center pt-8">
          <button 
            onClick={onBack} 
            disabled={isSubmitting}
            className="px-6 py-3 amy-glass text-muted-foreground hover:text-foreground rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
          >
            {commonT('back')}
          </button>
          
          {selectedAmount >= stakeOptions[0].amount && !isSubmitting ? (
            <button 
              onClick={handleNext}
              className="px-8 py-4 rounded-xl font-bold text-lg min-w-48 transition-all duration-300 relative overflow-hidden amy-glass-neon text-neon-green hover:amy-glass-hover"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {returnToStep ? t('returnToSummary') : t('reviewChallenge')}
                <ArrowRight className="w-5 h-5" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-green/10 to-neon-blue/10" />
            </button>
          ) : null}
        </div>
      </div>
    </>
  )
}