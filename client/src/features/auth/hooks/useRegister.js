import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'

/**
 * Register mutation for forms.
 * Same session side-effects as login (via AuthProvider.register).
 */
export function useRegister() {
  const { register } = useAuth()

  return useMutation({
    mutationFn: (payload) => register(payload),
  })
}
