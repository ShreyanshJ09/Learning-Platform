import { Navigate, Outlet, useSearchParams } from 'react-router-dom'
import { getSafeNextPath } from '@/features/auth/getSafeNextPath'
import { useAuth } from '@/providers/AuthProvider'

/**
 * Guards auth pages (login / register).
 * Logged-in users shouldn't see these — send them to dashboard or ?next=.
 */
export function PublicOnlyRoute() {
  const { status } = useAuth()
  const [searchParams] = useSearchParams()

  if (status === 'loading') {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background text-muted-foreground">
        <p className="text-sm">Loading session…</p>
      </main>
    )
  }

  if (status === 'authenticated') {
    return (
      <Navigate to={getSafeNextPath(searchParams.get('next'))} replace />
    )
  }

  return <Outlet />
}
