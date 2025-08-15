'use client'

import { LanguageSwitcher } from '@/components/i18n/language-switcher'

interface ProgressInfo {
  currentStep: number
  totalSteps: number
  stepTitle: string
  isVisible: boolean
}

interface DashboardHeaderProps {
  user: {
    email?: string
  }
  signOutAction: () => void
  progress?: ProgressInfo
}

export function DashboardHeader({ user, signOutAction, progress }: DashboardHeaderProps) {
  return (
    <header className="amy-glass border-b border-border/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* AMY'S BRANDED LOGO SECTION */}
          <div className="flex items-center space-x-3">
            <div className="relative group">
              {/* CHALLENGE LOGO ICON */}
              <div className="w-12 h-12 amy-glass-neon rounded-xl flex items-center justify-center relative overflow-hidden border border-neon-green/20">
                {/* Custom Challenge Target Icon */}
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="text-neon-green"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="12" r="2" fill="currentColor"/>
                  <path d="M12 2L14 6L12 10L10 6Z" fill="currentColor"/>
                </svg>
                {/* Pulsing glow effect */}
                <div className="absolute inset-0 bg-neon-green/10 rounded-xl group-hover:bg-neon-green/20 transition-colors duration-300"></div>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-green/30 to-neon-blue/20 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
            </div>
            
            {/* BRAND TYPOGRAPHY - BOLD AND CONFIDENT */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-white tracking-tight leading-none">
                  I Bet You Can&apos;t
                </h1>
              </div>
              <div className="flex items-center justify-between">
                <span className="hidden lg:block amy-context-tagline">
                  Daily habits. $15 stakes. No excuses.
                </span>
              </div>
            </div>
          </div>
          
          {/* AMY'S USER SECTION - PROFESSIONAL & TRUSTWORTHY */}
          <div className="flex items-center space-x-4">
            {/* LANGUAGE SWITCHER */}
            <LanguageSwitcher />
            {/* USER INFO - CONFIDENT DISPLAY */}
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-white">
                {user.email?.split('@')[0]}
              </span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                <span className="text-xs text-neon-green font-medium uppercase tracking-wide">
                  $15 Staked
                </span>
              </div>
            </div>
            
            {/* USER AVATAR - PREMIUM STYLE */}
            <div className="relative group">
              <div className="w-10 h-10 amy-glass rounded-full flex items-center justify-center border border-neon-green/30 relative overflow-hidden">
                <span className="text-base font-black text-neon-green">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
                <div className="absolute inset-0 bg-gradient-to-br from-neon-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="absolute -inset-0.5 bg-neon-green/20 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
            </div>
            
            {/* AMY'S PREMIUM EXIT BUTTON - CONFIDENT & DESIRABLE */}
            <form action={signOutAction}>
              <button 
                type="submit"
                className="group relative px-6 py-2.5 bg-gradient-to-r from-slate-800/80 to-slate-700/60 hover:from-red-600/90 hover:to-red-500/80 text-slate-200 hover:text-white rounded-xl font-semibold text-sm tracking-wide transition-all duration-500 border border-slate-600/40 hover:border-red-400/60 shadow-lg hover:shadow-red-500/25 backdrop-blur-sm overflow-hidden"
              >
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                
                {/* Button content */}
                <span className="relative flex items-center gap-2">
                  <svg 
                    className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* AMY'S INTEGRATED PROGRESS BAR - KAREN'S SIMPLIFIED VERSION */}
        {progress?.isVisible && (
          <div className="pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-foreground font-semibold text-sm">
                Step {progress.currentStep} of {progress.totalSteps}
              </div>
              <div className="text-neon-green font-medium text-sm">
                {progress.stepTitle}
              </div>
            </div>
            
            {/* AMY'S INTEGRATED CLEAN PROGRESS BAR */}
            <div className="amy-progress-container h-3 relative">
              <div 
                className="amy-progress-bar amy-progress-smooth h-full"
                style={{ width: `${(progress.currentStep / progress.totalSteps) * 100}%` }}
              />
            </div>
            
            {/* Progress indicators - Karen's lean version */}
            <div className="flex justify-between mt-2">
              {['Habit', 'Duration', 'Stake', 'Confirm'].map((label, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-1 text-xs ${
                    index + 1 <= progress.currentStep 
                      ? 'text-neon-green' 
                      : 'text-muted-foreground'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    index + 1 <= progress.currentStep 
                      ? 'bg-neon-green shadow-sm shadow-neon-green' 
                      : 'bg-muted'
                  }`} />
                  <span className="hidden sm:inline font-medium text-xs">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}