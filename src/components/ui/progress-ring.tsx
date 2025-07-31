'use client'

import { useEffect, useState } from 'react'

interface ProgressRingProps {
  progress: number // 0-100
  size?: 'sm' | 'md' | 'lg' | 'xl'
  strokeWidth?: number
  showPercentage?: boolean
  children?: React.ReactNode
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
  animated?: boolean
}

export function ProgressRing({ 
  progress, 
  size = 'md', 
  strokeWidth, 
  showPercentage = true, 
  children,
  color = 'blue',
  animated = true
}: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setAnimatedProgress(progress)
    }
  }, [progress, animated])

  const sizes = {
    sm: { radius: 20, defaultStroke: 3, font: 'text-xs' },
    md: { radius: 30, defaultStroke: 4, font: 'text-sm' },
    lg: { radius: 40, defaultStroke: 5, font: 'text-base' },
    xl: { radius: 60, defaultStroke: 6, font: 'text-xl' }
  }

  const colors = {
    blue: 'stroke-blue-500',
    green: 'stroke-green-500', 
    red: 'stroke-red-500',
    yellow: 'stroke-yellow-500',
    purple: 'stroke-purple-500'
  }

  const { radius, defaultStroke, font } = sizes[size]
  const stroke = strokeWidth ?? defaultStroke
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          stroke="currentColor"
          className="text-gray-200 dark:text-gray-700"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress circle */}
        <circle
          stroke="currentColor"
          className={`${colors[color]} transition-all duration-1000 ease-in-out`}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showPercentage && (
          <span className={`font-bold text-foreground ${font}`}>
            {Math.round(animatedProgress)}%
          </span>
        ))}
      </div>
    </div>
  )
}