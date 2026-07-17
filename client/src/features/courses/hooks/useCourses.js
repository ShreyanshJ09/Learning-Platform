import { useQuery } from '@tanstack/react-query'
import { listCourses } from '@/api/courses.api'
import { queryKeys } from '@/api/queryKeys'
import { useAuth } from '@/providers/AuthProvider'

/**
 * Owner's course list (GET /api/courses/).
 * Enabled only when authenticated.
 */
export function useCourses() {
  const { status } = useAuth()

  return useQuery({
    queryKey: queryKeys.courses.list(),
    queryFn: listCourses,
    enabled: status === 'authenticated',
    staleTime: 60_000,
  })
}
