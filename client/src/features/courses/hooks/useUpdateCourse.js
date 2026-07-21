import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateCourse } from '@/api/courses.api'
import { queryKeys } from '@/api/queryKeys'
import { toastMutationError } from '@/lib/toast'

/**
 * PATCH /api/courses/{id}/ — edit course fields.
 * Optimistically updates detail + list caches; rolls back on failure.
 *
 * @param {string} courseId
 */
export function useUpdateCourse(courseId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => updateCourse(courseId, payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.courses.detail(courseId),
      })
      await queryClient.cancelQueries({ queryKey: queryKeys.courses.list() })

      const previousDetail = queryClient.getQueryData(
        queryKeys.courses.detail(courseId),
      )
      const previousList = queryClient.getQueryData(queryKeys.courses.list())

      queryClient.setQueryData(queryKeys.courses.detail(courseId), (current) =>
        current && typeof current === 'object'
          ? { ...current, ...payload }
          : current,
      )

      queryClient.setQueryData(queryKeys.courses.list(), (current) =>
        Array.isArray(current)
          ? current.map((course) =>
              course.id === courseId ? { ...course, ...payload } : course,
            )
          : current,
      )

      return { previousDetail, previousList }
    },
    onError: (err, _payload, context) => {
      if (context?.previousDetail !== undefined) {
        queryClient.setQueryData(
          queryKeys.courses.detail(courseId),
          context.previousDetail,
        )
      }
      if (context?.previousList !== undefined) {
        queryClient.setQueryData(queryKeys.courses.list(), context.previousList)
      }
      toastMutationError(err, 'Could not update course.')
    },
    onSuccess: (updatedCourse) => {
      queryClient.setQueryData(
        queryKeys.courses.detail(courseId),
        updatedCourse,
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.list() })
      toast.success('Course updated')
    },
  })
}
