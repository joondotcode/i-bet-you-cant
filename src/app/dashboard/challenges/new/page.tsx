import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CreateChallengeForm } from '@/components/challenge/create-challenge-form'

export default async function NewChallengePage() {
  const user = await getUser()
  
  // Redirect to login if not authenticated
  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Create New Challenge
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Set up your accountability challenge. Remember: you'll stake real money and forfeit it if you miss even one day.
        </p>
      </div>

      <CreateChallengeForm />
    </div>
  )
}