import { Navigate, Outlet, useSearchParams } from 'react-router-dom'
import { FullPageSpinner } from '@/components/feedback/FullPageSpinner'
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
    return <FullPageSpinner />
  }

  if (status === 'authenticated') {
    return (
      <Navigate to={getSafeNextPath(searchParams.get('next'))} replace />
    )
  }

  return <Outlet />
}
