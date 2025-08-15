import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import { DashboardLayoutClient } from '@/components/dashboard/dashboard-layout-client'

async function signOutAction() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  return (
    <DashboardLayoutClient user={user} signOutAction={signOutAction}>
      {children}
    </DashboardLayoutClient>
  )
}