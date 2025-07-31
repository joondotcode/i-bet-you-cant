'use client'

import { ReactNode } from 'react'

interface AccessibleLayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

export function AccessibleLayout({ children, title, description }: AccessibleLayoutProps) {
  return (
    <>
      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="skip-link focus:top-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Skip to main content
      </a>

      {/* Page structure with semantic HTML */}
      <div className="min-h-screen flex flex-col">
        {/* Header/Navigation would go here */}
        
        <main id="main-content" className="flex-1" role="main">
          {/* Page title for screen readers */}
          {title && (
            <h1 className="sr-only">{title}</h1>
          )}
          
          {/* Page description for screen readers */}
          {description && (
            <p className="sr-only">{description}</p>
          )}
          
          {children}
        </main>

        {/* Footer would go here */}
      </div>
    </>
  )
}

// Accessible heading component that maintains hierarchy
interface AccessibleHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: ReactNode
  className?: string
  id?: string
}

export function AccessibleHeading({ level, children, className = '', id }: AccessibleHeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements
  
  return (
    <Tag 
      id={id}
      className={`font-semibold text-foreground ${className}`}
      tabIndex={-1} // Allow programmatic focus for navigation
    >
      {children}
    </Tag>
  )
}

// Accessible form field wrapper
interface AccessibleFieldProps {
  label: string
  required?: boolean
  error?: string
  description?: string
  children: ReactNode
  id: string
}

export function AccessibleField({ 
  label, 
  required, 
  error, 
  description, 
  children, 
  id 
}: AccessibleFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined
  const errorId = error ? `${id}-error` : undefined
  
  return (
    <div className="space-y-2">
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-foreground"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {description && (
        <p id={descriptionId} className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
      
      <div>
        {children}
      </div>
      
      {error && (
        <p 
          id={errorId}
          className="text-sm text-red-600 dark:text-red-400"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  )
}

// Accessible status/announcement component
interface AccessibleStatusProps {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  isVisible?: boolean
}

export function AccessibleStatus({ message, type, isVisible = true }: AccessibleStatusProps) {
  if (!isVisible) return null
  
  const icons = {
    success: '✅',
    error: '❌', 
    warning: '⚠️',
    info: 'ℹ️'
  }
  
  const colors = {
    success: 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800',
    error: 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800',
    warning: 'text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800',
    info: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
  }
  
  return (
    <div 
      className={`p-4 rounded-lg border ${colors[type]}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-start gap-3">
        <span className="text-lg" aria-hidden="true">
          {icons[type]}
        </span>
        <p className="flex-1">
          <span className="sr-only">{type}: </span>
          {message}
        </p>
      </div>
    </div>
  )
}