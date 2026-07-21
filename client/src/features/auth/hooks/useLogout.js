import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/providers/AuthProvider'
import { toastMutationError } from '@/lib/toast'

/**
 * Logout mutation — blacklists refresh (best effort) and clears local session.
 */
export function useLogout() {
  const { logout } = useAuth()

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => toast.success('Signed out'),
    onError: (err) => toastMutationError(err, 'Could not sign out', { skipValidation: false }),
  })
}
