import { useQuery } from '@tanstack/react-query'
import { getCourse } from '@/api/courses.api'
import { queryKeys } from '@/api/queryKeys'
import { useAuth } from '@/providers/AuthProvider'

/**
 * Single course header (GET /api/courses/{id}/).
 * Enabled only when authenticated and courseId is present.
 *
 * @param {string | undefined} courseId
 */
export function useCourse(courseId) {
  const { status } = useAuth()

  return useQuery({
    queryKey: queryKeys.courses.detail(courseId),
    queryFn: () => getCourse(courseId),
    enabled: status === 'authenticated' && Boolean(courseId),
    staleTime: 60_000,
  })
}
