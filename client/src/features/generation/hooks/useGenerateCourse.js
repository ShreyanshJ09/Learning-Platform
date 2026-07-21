import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { getCourseModules } from '@/api/courses.api'
import { generateCourse } from '@/api/generation.api'
import { queryKeys } from '@/api/queryKeys'
import { paths } from '@/routes/paths'

/**
 * POST /api/generate/course/ — create a course outline from a topic (20–30s).
 * Call mutate(topic) or mutateAsync(topic) with a trimmed string.
 *
 * On success: seed course detail cache, refresh list, prefetch syllabus,
 * toast, navigate to /courses/{id}.
 *
 * retry: 0 — backend already retries Gemini; UI offers manual retry.
 */
export function useGenerateCourse() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (topic) => generateCourse({ topic }),
    retry: 0,
    onSuccess: (course) => {
      queryClient.setQueryData(queryKeys.courses.detail(course.id), course)
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.list() })
      queryClient.prefetchQuery({
        queryKey: queryKeys.courses.modules(course.id),
        queryFn: () => getCourseModules(course.id),
      })
      toast.success('Course created')
      navigate(paths.course(course.id))
    },
  })
}
