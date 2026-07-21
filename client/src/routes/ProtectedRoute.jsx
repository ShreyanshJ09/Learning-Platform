import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { FullPageSpinner } from '@/components/feedback/FullPageSpinner'
import { useAuth } from '@/providers/AuthProvider'
import { paths } from '@/routes/paths'

/**
 * Guards private pages (dashboard, courses, …).
 * - loading → splash (don't bounce to login yet)
 * - unauthenticated → /login?next=<where they tried to go>
 * - authenticated → render child routes via <Outlet />
 */
export function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <FullPageSpinner />
  }

  if (status === 'unauthenticated') {
    const next = `${location.pathname}${location.search}`
    return (
      <Navigate
        to={`${paths.login}?next=${encodeURIComponent(next)}`}
        replace
      />
    )
  }

  return <Outlet />
}

