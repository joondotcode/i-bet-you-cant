import { MultiStepSignup } from '@/components/auth/multi-step-signup'
import { requireGuest } from '@/lib/auth'

export default async function SignUpPage() {
  await requireGuest()
  
  return <MultiStepSignup />
}