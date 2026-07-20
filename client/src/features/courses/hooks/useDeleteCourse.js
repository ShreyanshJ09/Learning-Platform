import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { deleteCourse } from '@/api/courses.api'
import { queryKeys } from '@/api/queryKeys'
import { paths } from '@/routes/paths'

/**
 * DELETE /api/courses/{id}/ — remove a course (and nested modules/lessons).
 * Call mutate(courseId) or mutateAsync(courseId).
 * On success: drop detail/modules caches, refresh list, go to dashboard.
 */
export function useDeleteCourse() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (courseId) => deleteCourse(courseId),
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
