'use client'

import { cn } from '@/lib/utils'

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export function FormSection({ title, description, children, className, icon }: FormSectionProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center space-y-2">
        {icon && (
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              {icon}
            </div>
          </div>
        )}
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {description && (
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}