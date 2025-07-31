import { create } from 'zustand'

export interface Challenge {
  id: string
  user_id: string
  title: string
  description?: string
  duration_days: number
  stake_amount: number
  status: 'pending' | 'active' | 'completed' | 'failed'
  start_date: string
  end_date: string
  stripe_payment_intent_id?: string
  payment_status: 'pending' | 'succeeded' | 'failed' | 'refunded'
  created_at: string
  updated_at: string
  // Computed fields
  currentStreak: number
  hasCheckedInToday: boolean
}

interface ChallengeState {
  challenges: Challenge[]
  currentChallenge: Challenge | null
  isLoading: boolean
  error: string | null
}

interface ChallengeActions {
  fetchChallenges: () => Promise<void>
  createChallenge: (challengeData: {
    title: string
    description?: string
    durationDays: number
    stakeAmount: number
    startDate: string
  }) => Promise<Challenge>
  recordCheckin: (challengeId: string, notes?: string) => Promise<void>
  setCurrentChallenge: (challenge: Challenge | null) => void
  clearError: () => void
}

type ChallengeStore = ChallengeState & ChallengeActions

export const useChallengeStore = create<ChallengeStore>((set, get) => ({
  // Initial state
  challenges: [],
  currentChallenge: null,
  isLoading: false,
  error: null,

  // Actions
  fetchChallenges: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await fetch('/api/challenges')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch challenges')
      }

      const challenges = data.challenges || []
      
      // Find the current active challenge
      const activeChallenge = challenges.find((c: Challenge) => 
        c.status === 'active' || c.status === 'pending'
      )

      set({ 
        challenges,
        currentChallenge: activeChallenge || null,
        isLoading: false,
        error: null
      })
    } catch (error) {
      console.error('Error fetching challenges:', error)
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch challenges'
      })
    }
  },

  createChallenge: async (challengeData) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(challengeData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create challenge')
      }

      const newChallenge = data.challenge
      
      set(state => ({
        challenges: [newChallenge, ...state.challenges],
        currentChallenge: newChallenge,
        isLoading: false,
        error: null
      }))

      return newChallenge
    } catch (error) {
      console.error('Error creating challenge:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create challenge'
      set({ 
        isLoading: false, 
        error: errorMessage
      })
      throw error
    }
  },

  recordCheckin: async (challengeId: string, notes?: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await fetch(`/api/challenges/${challengeId}/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to record check-in')
      }

      // Update the challenge with new streak and check-in status
      set(state => {
        const updatedChallenges = state.challenges.map(challenge => {
          if (challenge.id === challengeId) {
            return {
              ...challenge,
              currentStreak: data.currentStreak,
              hasCheckedInToday: true,
              status: data.isComplete ? 'completed' : challenge.status
            }
          }
          return challenge
        })

        const updatedCurrentChallenge = state.currentChallenge?.id === challengeId
          ? updatedChallenges.find(c => c.id === challengeId) || null
          : state.currentChallenge

        return {
          challenges: updatedChallenges,
          currentChallenge: updatedCurrentChallenge,
          isLoading: false,
          error: null
        }
      })
    } catch (error) {
      console.error('Error recording check-in:', error)
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to record check-in'
      })
      throw error
    }
  },

  setCurrentChallenge: (challenge: Challenge | null) => {
    set({ currentChallenge: challenge })
  },

  clearError: () => {
    set({ error: null })
  }
}))

// Selector hooks for common use cases
export const useCurrentChallenge = () => useChallengeStore(state => state.currentChallenge)
export const useChallenges = () => useChallengeStore(state => state.challenges)
export const useChallengeLoading = () => useChallengeStore(state => state.isLoading)
export const useChallengeError = () => useChallengeStore(state => state.error)