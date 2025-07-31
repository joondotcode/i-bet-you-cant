import { forwardRef, useState, useId } from 'react'
import { Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PasswordStrength {
  score: number
  label: string
  color: string
  suggestions: string[]
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  description?: string
  showPasswordStrength?: boolean
  icon?: React.ReactNode
  success?: boolean
}

function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: 'Enter a password', color: 'text-muted-foreground', suggestions: [] }
  
  let score = 0
  const suggestions: string[] = []
  
  // Length check
  if (password.length >= 8) score += 25
  else suggestions.push('Use at least 8 characters')
  
  // Lowercase check
  if (/[a-z]/.test(password)) score += 25
  else suggestions.push('Include lowercase letters')
  
  // Uppercase check
  if (/[A-Z]/.test(password)) score += 25
  else suggestions.push('Include uppercase letters')
  
  // Number or special character check
  if (/[\d!@#$%^&*(),.?":{}|<>]/.test(password)) score += 25
  else suggestions.push('Include numbers or special characters')
  
  let label = 'Weak'
  let color = 'text-red-500'
  
  if (score >= 75) {
    label = 'Strong'
    color = 'text-green-500'
  } else if (score >= 50) {
    label = 'Good'
    color = 'text-yellow-500'
  } else if (score >= 25) {
    label = 'Fair'
    color = 'text-orange-500'
  }
  
  return { score, label, color, suggestions }
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className = '', 
    label, 
    error, 
    description,
    type = 'text', 
    showPasswordStrength = false,
    icon,
    success = false,
    id,
    required,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ 
      score: 0, 
      label: 'Enter a password', 
      color: 'text-muted-foreground', 
      suggestions: [] 
    })
    
    const reactId = useId()
    const inputId = id || `input-${reactId}`
    const isPassword = type === 'password'
    const actualType = isPassword && showPassword ? 'text' : type
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (showPasswordStrength && isPassword) {
        setPasswordStrength(calculatePasswordStrength(e.target.value))
      }
      props.onChange?.(e)
    }

    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId}
            className="text-sm font-medium text-foreground flex items-center gap-1"
          >
            {label}
            {required && <span className="text-red-500" aria-label="required">*</span>}
          </label>
        )}
        
        {description && (
          <p className="text-sm text-muted-foreground" id={`${inputId}-description`}>
            {description}
          </p>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          
          <input
            id={inputId}
            type={actualType}
            className={cn(
              "flex h-12 w-full rounded-lg border bg-background px-3 py-2 text-sm",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-200",
              icon && "pl-10",
              (isPassword || success || error) && "pr-12",
              error && "border-red-500 focus:ring-red-500",
              success && "border-green-500 focus:ring-green-500",
              !error && !success && "border-input hover:border-primary/50",
              className
            )}
            ref={ref}
            onChange={handlePasswordChange}
            aria-describedby={
              [
                description && `${inputId}-description`,
                error && `${inputId}-error`,
                showPasswordStrength && `${inputId}-strength`
              ].filter(Boolean).join(' ') || undefined
            }
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />
          
          {/* Password toggle button */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
          
          {/* Success/Error icons */}
          {success && !isPassword && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
              <Check size={18} />
            </div>
          )}
          
          {error && !isPassword && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
              <AlertCircle size={18} />
            </div>
          )}
        </div>
        
        {/* Password strength indicator */}
        {showPasswordStrength && isPassword && (
          <div id={`${inputId}-strength`} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Password strength</span>
              <span className={cn("text-xs font-medium", passwordStrength.color)}>
                {passwordStrength.label}
              </span>
            </div>
            
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-300 rounded-full",
                  passwordStrength.score >= 75 && "bg-green-500",
                  passwordStrength.score >= 50 && passwordStrength.score < 75 && "bg-yellow-500",
                  passwordStrength.score >= 25 && passwordStrength.score < 50 && "bg-orange-500",
                  passwordStrength.score < 25 && "bg-red-500"
                )}
                style={{ width: `${passwordStrength.score}%` }}
              />
            </div>
            
            {passwordStrength.suggestions.length > 0 && (
              <ul className="text-xs text-muted-foreground space-y-1">
                {passwordStrength.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <X size={12} className="text-red-500 flex-shrink-0" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        
        {error && (
          <p className="text-sm text-red-500 flex items-center gap-2" id={`${inputId}-error`}>
            <AlertCircle size={14} />
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'