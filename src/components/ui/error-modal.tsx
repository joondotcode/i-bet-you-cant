'use client'

import { useState, useEffect } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { Button } from './button'

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  errors: Record<string, string>
  description?: string
}

export function ErrorModal({ 
  isOpen, 
  onClose, 
  title = "Please fix the following errors", 
  errors,
  description = "Please correct the highlighted fields and try again."
}: ErrorModalProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      setIsVisible(false)
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen && !isVisible) return null

  const errorEntries = Object.entries(errors).filter(([_, message]) => message && message.trim() !== '')

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative bg-background border border-border rounded-lg shadow-lg max-w-md w-full mx-4 transform transition-all duration-200 ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {errorEntries.length > 0 ? (
            <ul className="space-y-3">
              {errorEntries.map(([field, message]) => (
                <li key={field} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <span className="font-medium text-foreground capitalize">
                      {field === 'general' ? 'Error' : field.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="ml-1 text-muted-foreground">{message}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              Please check the form for any missing required fields.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-border">
          <Button onClick={onClose} className="min-w-20">
            Got it
          </Button>
        </div>
      </div>
    </div>
  )
}