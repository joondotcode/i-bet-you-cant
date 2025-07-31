import { getUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { DashboardClient } from '@/components/dashboard/dashboard-client'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await getUser()
  
  // Redirect to login if not authenticated
  if (!user) {
    redirect('/auth/login')
  }
  
  const supabase = await createClient()

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <DashboardClient user={user} profile={profile} />
  )
}