'use client'

import { Shield, Lock, Zap, Users, CheckCircle2, Star } from 'lucide-react'
import { Badge } from './badge'
import { cn } from '@/lib/utils'

interface TrustIndicatorProps {
  className?: string
  showStats?: boolean
  animate?: boolean
}

export function TrustIndicator({ className, showStats = true, animate = true }: TrustIndicatorProps) {
  const indicators = [
    {
      icon: Shield,
      text: "SSL Secured",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20"
    },
    {
      icon: Lock,
      text: "Stripe Protected",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      icon: Star,
      text: "Money-Back Guarantee",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20"
    }
  ]

  const stats = [
    { value: "1,247", label: "Active Users", icon: Users },
    { value: "73%", label: "Success Rate", icon: CheckCircle2 },
    { value: "$18K+", label: "Returned to Winners", icon: Zap }
  ]

  return (
    <div className={cn("space-y-6", className)}>
      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-3">
        {indicators.map((indicator, index) => {
          const Icon = indicator.icon
          return (
            <Badge
              key={indicator.text}
              variant="outline"
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-xs font-medium transition-all duration-300",
                indicator.bgColor,
                indicator.borderColor,
                animate && "hover:scale-105 hover:shadow-sm",
                animate && `animation-delay-${index * 100}`
              )}
            >
              <Icon className={cn("w-3 h-3", indicator.color)} />
              {indicator.text}
            </Badge>
          )
        })}
      </div>

      {/* Stats */}
      {showStats && (
        <div className="grid grid-cols-3 gap-4 text-center">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className={cn(
                  "space-y-1 transition-all duration-300",
                  animate && "hover:scale-105",
                  animate && `animation-delay-${(index + 3) * 100}`
                )}
              >
                <div className="flex items-center justify-center gap-1">
                  <Icon className="w-4 h-4 text-primary" />
                  <div className="text-lg font-bold text-foreground">{stat.value}</div>
                </div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            )
          })}
        </div>
      )}

      {/* Security Notice */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground leading-relaxed">
          🔒 Your financial information is secured by bank-level encryption.
          <br />
          Payments processed securely through Stripe.
        </p>
      </div>
    </div>
  )
}