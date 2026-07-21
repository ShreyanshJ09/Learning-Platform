import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateProfileRequest } from '@/api/auth.api'
import { queryKeys } from '@/api/queryKeys'
import { toastMutationError } from '@/lib/toast'

/**
 * PATCH /api/auth/me/ — update profile fields.
 * Optimistically updates auth.me cache; rolls back on failure.
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProfileRequest,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.auth.me })

      const previous = queryClient.getQueryData(queryKeys.auth.me)

      queryClient.setQueryData(queryKeys.auth.me, (current) =>
        current && typeof current === 'object'
          ? { ...current, ...payload }
          : current,
      )

      return { previous }
    },
    onError: (err, _payload, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKeys.auth.me, context.previous)
      }
      toastMutationError(err, 'Could not update profile.')
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKeys.auth.me, updatedUser)
      toast.success('Profile saved')
    },
  })
}
