import { useQuery } from '@tanstack/react-query'
import { meRequest } from '@/api/auth.api'
import { queryKeys } from '@/api/queryKeys'
import { useAuth } from '@/providers/AuthProvider'

/**
 * Current user query (GET /api/auth/me/).
 * Enabled only when authenticated; seeded by login/register/boot via cache.
 */
export function useCurrentUser() {
  const { status, user } = useAuth()

  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: meRequest,
    enabled: status === 'authenticated',
    initialData: user ?? undefined,
    staleTime: 5 * 60_000,
  })
}
