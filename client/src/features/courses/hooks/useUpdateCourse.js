import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCourse } from '@/api/courses.api'
import { queryKeys } from '@/api/queryKeys'

/**
 * PATCH /api/courses/{id}/ — edit course fields.
 * On success: write updated course into the detail cache + refresh the dashboard list.
 *
 * @param {string} courseId
 */
export function useUpdateCourse(courseId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => updateCourse(courseId, payload),
    onSuccess: (updatedCourse) => {
      queryClient.setQueryData(
        queryKeys.courses.detail(courseId),
        updatedCourse,
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.list() })
    },
  })
}
