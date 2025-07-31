import { EnhancedLogin } from '@/components/auth/enhanced-login'
import { requireGuest } from '@/lib/auth'

export default async function LoginPage() {
  await requireGuest()
  
  return <EnhancedLogin />
}