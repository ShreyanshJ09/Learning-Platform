import { useQuery } from '@tanstack/react-query'
import { getCourseModules } from '@/api/courses.api'
import { queryKeys } from '@/api/queryKeys'
import { useAuth } from '@/providers/AuthProvider'

/**
 * Course syllabus — modules + lesson summaries (GET /api/courses/{id}/modules/).
 * Enabled only when authenticated and courseId is present.
 *
 * @param {string | undefined} courseId
 */
export function useCourseModules(courseId) {
  const { status } = useAuth()

  return useQuery({
    queryKey: queryKeys.courses.modules(courseId),
    queryFn: () => getCourseModules(courseId),
    enabled: status === 'authenticated' && Boolean(courseId),
    staleTime: 60_000,
  })
}
