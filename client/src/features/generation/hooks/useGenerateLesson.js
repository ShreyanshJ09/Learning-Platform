import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { generateLesson } from '@/api/generation.api'
import { queryKeys } from '@/api/queryKeys'

/**
 * POST /api/generate/lesson/{id}/ — enrich a lesson stub (or regenerate).
 * Call mutate() / mutateAsync() or pass { regenerate: true } to replace content.
 *
 * On success: write lesson into cache, refresh syllabus for sidebar/prev-next,
 * toast "Lesson ready".
 *
 * retry: 0 — backend already retries Gemini; UI offers manual retry.
 *
 * @param {string | undefined} lessonId
 * @param {string | undefined} courseId — used to invalidate modules cache (from URL)
 */
export function useGenerateLesson(lessonId, courseId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ regenerate = false } = {}) => {
      if (!lessonId) {
        return Promise.reject(new Error('Lesson id is required'))
      }
      return generateLesson(lessonId, { regenerate })
    },
    retry: 0,
    onSuccess: (lesson) => {
      if (lessonId) {
        queryClient.setQueryData(queryKeys.lessons.detail(lessonId), lesson)
      }

      if (courseId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.courses.modules(courseId),
        })
      }

      toast.success('Lesson ready')
    },
  })
}
