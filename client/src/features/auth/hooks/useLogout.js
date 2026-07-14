import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'

/**
 * Logout mutation — blacklists refresh (best effort) and clears local session.
 */
export function useLogout() {
  const { logout } = useAuth()

  return useMutation({
    mutationFn: () => logout(),
  })
}
