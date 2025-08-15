import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ChallengeWizard } from '@/components/challenge/challenge-wizard'

export default async function NewChallengePage() {
  const user = await getUser()
  
  // Redirect to login if not authenticated
  if (!user) {
    redirect('/auth/login')
  }

  return <ChallengeWizard />
}