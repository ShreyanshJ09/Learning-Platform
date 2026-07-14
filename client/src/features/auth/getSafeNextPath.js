import { paths } from '@/routes/paths'

/**
 * Resolve ?next= to an in-app path, defaulting to the dashboard.
 * Rejects protocol-relative / external URLs.
 * @param {string | null} next
 */
export function getSafeNextPath(next) {
  if (next && next.startsWith('/') && !next.startsWith('//')) {
    return next
  }
  return paths.dashboard
}
