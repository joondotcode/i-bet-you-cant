import { requireGuest } from '@/lib/auth'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireGuest()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            I Bet You Can&apos;t
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Build habits through accountability
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}