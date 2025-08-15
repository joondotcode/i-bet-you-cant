'use client'

import { useState, useRef, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import { format } from 'date-fns'
import { Calendar } from 'lucide-react'
import 'react-day-picker/dist/style.css'
import './date-picker.css'

interface DatePickerProps {
  value?: string
  onChange: (date: string) => void
  minDate?: string
  placeholder?: string
  className?: string
}

export function DatePicker({ 
  value, 
  onChange, 
  minDate, 
  placeholder = "Select date",
  className = "" 
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  // Parse date string in local timezone to avoid UTC conversion issues
  const parseLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day) // month is 0-indexed
  }
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? parseLocalDate(value) : undefined
  )
  
  // KAREN'S FIX: Sync internal state when external value prop changes
  useEffect(() => {
    if (value) {
      setSelectedDate(parseLocalDate(value))
    } else {
      setSelectedDate(undefined)
    }
  }, [value])
  const containerRef = useRef<HTMLDivElement>(null)

  // Convert string dates to Date objects - ONLY FUTURE DATES ALLOWED
  // Use local timezone to get proper "today" - KAREN'S FIX
  const today = new Date()
  const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const minDateObj = minDate ? parseLocalDate(minDate) : localToday
  
  // KAREN'S TEMPORAL LOGIC: Prevent going to past months
  // If we have a selected date, start from that month, otherwise use current month
  const initialMonth = selectedDate 
    ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    : new Date(today.getFullYear(), today.getMonth(), 1)
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const maxMonth = new Date(today.getFullYear() + 2, 11, 31) // 2 years future limit

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      onChange(format(date, 'yyyy-MM-dd'))
      setIsOpen(false)
    }
  }

  const displayValue = selectedDate ? format(selectedDate, 'MMM dd, yyyy') : ''

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Custom Input Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left text-lg bg-background/50 border-2 border-border rounded-2xl focus:border-neon-green focus:ring-4 focus:ring-neon-green/25 focus:bg-background/80 focus:shadow-lg focus:shadow-neon-green/10 transition-all duration-300 amy-glass hover:border-neon-green/40 cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className={`${displayValue ? 'text-foreground' : 'text-muted-foreground'}`}>
            {displayValue || placeholder}
          </span>
          <Calendar className="w-5 h-5 text-muted-foreground group-focus:text-neon-green group-hover:text-neon-green transition-colors" />
        </div>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-green/5 to-neon-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </button>

      {/* ROZ-FRIENDLY Date Picker Dropdown - LEFT-ALIGNED FOR CLARITY */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 z-50">
          <div className="amy-glass-neon rounded-2xl p-8 border border-neon-green/20 shadow-2xl shadow-black/50 backdrop-blur-xl bg-slate-900/95 min-w-[380px] max-w-[420px] custom-day-picker">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={{ before: minDateObj }}
              fromDate={minDateObj}
              fromMonth={currentMonth}
              toMonth={maxMonth}
              defaultMonth={initialMonth}
              showOutsideDays={false}
              fixedWeeks={true}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  )
}