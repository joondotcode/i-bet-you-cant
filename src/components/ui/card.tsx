import * as React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'ghost' | 'glass' | 'gradient'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-card text-card-foreground border shadow-sm',
      outlined: 'bg-background border-2 border-border hover:border-ring/50 transition-colors',
      elevated: 'bg-card shadow-lg hover:shadow-xl border border-border/50 transition-all duration-300',
      ghost: 'bg-muted/50 backdrop-blur-sm border border-border/30',
      glass: 'bg-white/10 backdrop-blur-md border border-white/20 shadow-lg',
      gradient: 'bg-gradient-to-br from-card to-muted border shadow-lg'
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg transition-all duration-200",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("flex flex-col space-y-1.5 p-6", className)} 
      {...props} 
    />
  )
)

CardHeader.displayName = 'CardHeader'

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3 
      ref={ref} 
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)} 
      {...props} 
    />
  )
)

CardTitle.displayName = 'CardTitle'

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p 
      ref={ref} 
      className={cn("text-sm text-muted-foreground", className)} 
      {...props} 
    />
  )
)

CardDescription.displayName = 'CardDescription'

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("p-6 pt-0", className)} 
      {...props} 
    />
  )
)

CardContent.displayName = 'CardContent'

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn("flex items-center p-6 pt-0", className)} 
      {...props} 
    />
  )
)

CardFooter.displayName = 'CardFooter'