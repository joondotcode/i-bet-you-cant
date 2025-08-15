import React from 'react'

interface IconProps {
  className?: string
  size?: number
}

// AMY'S MODERN HABIT ICON SYSTEM
// Clean, consistent, and professional

export const MeditationIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5L13.5 7.2C12.8 7.1 12 7.4 11.5 8L10.5 9.5L9.5 8C9 7.4 8.2 7.1 7.5 7.2L6 7.5L0 7V9L6 8.5L7.5 8.8L8.5 10.3C8.8 10.8 9.4 11 10 11H14C14.6 11 15.2 10.8 15.5 10.3L16.5 8.8L18 8.5L21 9ZM12 13.5C11.2 13.5 10.5 14.2 10.5 15V17.5C10.5 18.3 11.2 19 12 19C12.8 19 13.5 18.3 13.5 17.5V15C13.5 14.2 12.8 13.5 12 13.5ZM7 15.5V22H9V15.5C9 15.2 9.2 15 9.5 15H14.5C14.8 15 15 15.2 15 15.5V22H17V15.5C17 14.1 15.9 13 14.5 13H9.5C8.1 13 7 14.1 7 15.5Z" 
      fill="currentColor"
    />
  </svg>
)

export const ExerciseIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M20.57 14.86L22 13.43L20.57 12L17 15.57L8.43 7L12 3.43L10.57 2L9.14 3.43L7.71 2L5.57 4.14L4.14 2.71L2.71 4.14L4.14 5.57L2 7.71L3.43 9.14L2 10.57L3.43 12L7 8.43L15.57 17L12 20.57L13.43 22L14.86 20.57L16.29 22L18.43 19.86L19.86 21.29L21.29 19.86L19.86 18.43L22 16.29L20.57 14.86ZM6.43 5.57L7.5 4.5L8.5 5.5L7.43 6.57L6.43 5.57ZM17.5 19.5L16.43 18.43L17.5 17.36L18.57 18.43L17.5 19.5Z" 
      fill="currentColor"
    />
  </svg>
)

export const ReadingIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M21 5C19.89 4.65 18.67 4.5 17.5 4.5C15.55 4.5 13.45 4.9 12 6C10.55 4.9 8.45 4.5 6.5 4.5C5.33 4.5 4.11 4.65 3 5C2.25 5.25 1.6 5.55 1 6V18.5C1 18.78 1.22 19 1.5 19C1.6 19 1.69 18.97 1.78 18.92C2.55 18.59 3.42 18.34 4.34 18.25C5.08 18.18 5.84 18.18 6.59 18.28C8.36 18.53 9.94 19.36 11.06 20.62C11.66 21.19 12.34 21.19 12.94 20.62C14.06 19.36 15.64 18.53 17.41 18.28C18.16 18.18 18.92 18.18 19.66 18.25C20.58 18.34 21.45 18.59 22.22 18.92C22.31 18.97 22.4 19 22.5 19C22.78 19 23 18.78 23 18.5V6C22.4 5.55 21.75 5.25 21 5ZM21 16.5C20.42 16.5 19.86 16.59 19.3 16.69C18.27 16.86 17.2 17.22 16.2 17.77C15.2 18.32 14.27 19.05 13.5 19.95V8.5C14.8 7.8 16.6 7.5 18.5 7.5C19.4 7.5 20.3 7.6 21 7.8V16.5ZM11 8.5V19.95C10.23 19.05 9.3 18.32 8.3 17.77C7.3 17.22 6.23 16.86 5.2 16.69C4.64 16.59 4.08 16.5 3.5 16.5V7.8C4.2 7.6 5.1 7.5 6 7.5C7.9 7.5 9.7 7.8 11 8.5Z" 
      fill="currentColor"
    />
  </svg>
)

export const WritingIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M14.06 9.02L14.98 9.94L5.92 19H5V18.08L14.06 9.02ZM17.66 3C17.41 3 17.15 3.1 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C18.17 3.09 17.92 3 17.66 3ZM14.06 6.19L3 17.25V21H6.75L17.81 9.94L14.06 6.19Z" 
      fill="currentColor"
    />
  </svg>
)

export const WalkingIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M13.5 5.5C14.6 5.5 15.5 4.6 15.5 3.5S14.6 1.5 13.5 1.5 11.5 2.4 11.5 3.5 12.4 5.5 13.5 5.5ZM9.8 8.9L7 23H9.1L10.9 15L13 17V23H15V15.5L12.9 13.5L13.5 10.5C14.8 12 16.8 13 19 13V11C17.1 11 15.5 10 14.7 8.4L13.7 6.9C13.3 6.2 12.6 5.9 11.9 5.9S10.7 6.3 10.4 7L7.6 8.3L8.4 10.1L9.8 8.9Z" 
      fill="currentColor"
    />
  </svg>
)

export const GratitudeIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" 
      fill="currentColor"
    />
  </svg>
)

// Icon mapping for easy access
export const HABIT_ICONS = {
  'Daily Meditation': MeditationIcon,
  'Morning Workout': ExerciseIcon,
  'Read 20 Minutes': ReadingIcon,
  'Write 300 Words': WritingIcon,
  '8,000 Steps': WalkingIcon,
  'Practice Gratitude': GratitudeIcon,
} as const

export type HabitTitle = keyof typeof HABIT_ICONS