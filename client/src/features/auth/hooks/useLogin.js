import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'

/**
 * Login mutation for forms.
 * Uses AuthProvider.login (tokens + session status + cache).
 * Forms get isPending / error / mutateAsync from React Query.
 */
export function useLogin() {
  const { login } = useAuth()

  return useMutation({
    mutationFn: (credentials) => login(credentials),
  })
}
