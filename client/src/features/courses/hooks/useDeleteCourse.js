import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { deleteCourse } from '@/api/courses.api'
import { queryKeys } from '@/api/queryKeys'
import { paths } from '@/routes/paths'
import { toastMutationError } from '@/lib/toast'

/**
 * DELETE /api/courses/{id}/ — remove a course (and nested modules/lessons).
 * Call mutate(courseId) or mutateAsync(courseId).
 * Optimistically removes from list; rolls back on failure.
 */
export function useDeleteCourse() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (courseId) => deleteCourse(courseId),
    onMutate: async (courseId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.courses.list() })

      const previousList = queryClient.getQueryData(queryKeys.courses.list())

      queryClient.setQueryData(queryKeys.courses.list(), (current) =>
        Array.isArray(current)
          ? current.filter((course) => course.id !== courseId)
          : current,
      )

      return { previousList, courseId }
    },
    onError: (err, _courseId, context) => {
      if (context?.previousList !== undefined) {
        queryClient.setQueryData(queryKeys.courses.list(), context.previousList)
      }
      toastMutationError(err, 'Could not delete course.', { skipValidation: false })
    },
    onSuccess: (_data, courseId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.courses.detail(courseId),
      })
      queryClient.removeQueries({
        queryKey: queryKeys.courses.modules(courseId),
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.list() })
      toast.success('Course deleted')
      navigate(paths.dashboard, { replace: true })
    },
  })
}
