'use client'

import React, { useState } from 'react'
import { DashboardHeader } from './dashboard-header'

interface ProgressInfo {
  currentStep: number
  totalSteps: number
  stepTitle: string
  isVisible: boolean
}

interface DashboardLayoutClientProps {
  user: {
    email?: string
  }
  signOutAction: () => void
  children: React.ReactNode
}

export function DashboardLayoutClient({ user, signOutAction, children }: DashboardLayoutClientProps) {
  const [progress, setProgress] = useState<ProgressInfo | undefined>()

  // Karen's simple progress handler - no context bloat
  const handleProgressChange = (currentStep: number, totalSteps: number, stepTitle: string, isVisible: boolean) => {
    setProgress({ currentStep, totalSteps, stepTitle, isVisible })
  }

  // Clone children and inject progress handler for ChallengeWizard
  const childrenWithProgress = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type?.name === 'ChallengeWizard') {
      return React.cloneElement(child as any, { onProgressChange: handleProgressChange })
    }
    return child
  })

  return (
    <div className="min-h-screen amy-radial-glow">
      <DashboardHeader user={user} signOutAction={signOutAction} progress={progress} />
      
      <main className="max-w-7xl mx-auto py-8 px-6 lg:px-8">
        {childrenWithProgress}
      </main>
    </div>
  )
}