'use client'

import { useState, useEffect } from 'react'

export function PsychologyVisualization() {
  const [animationState, setAnimationState] = useState<'idle' | 'demonstrating'>('idle')

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationState('demonstrating')
      setTimeout(() => setAnimationState('idle'), 3000)
    }, 8000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-2xl p-8 mb-16 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          See Loss Aversion in Action
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Watch how your brain responds differently to potential gains vs. losses
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Gain Scenario */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">Gain Scenario</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              "Complete your habit and <strong>earn $15</strong>"
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Motivation Level:</span>
              <div className="flex items-center gap-1">
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-green-500 transition-all duration-1000 ${
                      animationState === 'demonstrating' ? 'w-12' : 'w-12'
                    }`}
                  />
                </div>
                <span className="text-xs text-gray-500">50%</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400">
              💭 "Nice bonus, but I can live without it"
            </div>
          </div>
        </div>

        {/* Loss Scenario */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-red-200 dark:border-red-800">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">Loss Scenario</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              "Miss your habit and <strong>lose $15</strong>"
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Motivation Level:</span>
              <div className="flex items-center gap-1">
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-red-500 transition-all duration-1000 ${
                      animationState === 'demonstrating' ? 'w-full' : 'w-full'
                    }`}
                  />
                </div>
                <span className="text-xs text-gray-500">100%</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400">
              💭 "I cannot let my money disappear!"
            </div>
          </div>
        </div>
      </div>

      {/* Scientific Explanation */}
      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              The Science: Why This Works
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              <strong>Loss aversion</strong> is a cognitive bias where people feel the pain of losing something twice as strongly as the pleasure of gaining the same thing. 
              This is why the fear of losing $15 motivates you more powerfully than the prospect of earning $15.
              <br /><br />
              Studies show this effect can increase habit completion rates by <strong>200-300%</strong> compared to reward-based systems.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Element */}
      <div className="mt-6 text-center">
        <button
          onClick={() => {
            setAnimationState('demonstrating')
            setTimeout(() => setAnimationState('idle'), 3000)
          }}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
        >
          ↻ See the demonstration again
        </button>
      </div>
    </div>
  )
}