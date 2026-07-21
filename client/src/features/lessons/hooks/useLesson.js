import { useQuery } from '@tanstack/react-query'
import { getLesson } from '@/api/lessons.api'
import { queryKeys } from '@/api/queryKeys'
import { useAuth } from '@/providers/AuthProvider'

/**
 * Single lesson (GET /api/lessons/{id}/).
 * Enabled only when authenticated and lessonId is present.
 * Enriched lesson content is effectively immutable → longer staleTime (5 min).
 *
 * @param {string | undefined} lessonId
 */
export function useLesson(lessonId) {
  const { status } = useAuth()

  return useQuery({
    queryKey: queryKeys.lessons.detail(lessonId),
    queryFn: () => getLesson(lessonId),
    enabled: status === 'authenticated' && Boolean(lessonId),
    staleTime: 5 * 60_000,
  })
}
