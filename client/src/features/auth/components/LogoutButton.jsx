import { useNavigate } from 'react-router-dom'
import { Loader2, LogOut } from 'lucide-react'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { Button } from '@/components/ui/button'
import { paths } from '@/routes/paths'

/**
 * Log out (server blacklist best-effort + clear local session), then go to /login.
 */
export function LogoutButton({ className, variant = 'outline', size = 'default' }) {
  const navigate = useNavigate()
  const { mutateAsync, isPending } = useLogout()

  async function handleLogout() {
    try {
      await mutateAsync()
    } finally {
      // Always leave protected UI — AuthProvider clears session even if API fails.
      navigate(paths.login, { replace: true })
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      disabled={isPending}
      onClick={handleLogout}
    >
      {isPending ? (
        <>
          <Loader2 className="animate-spin" data-icon="inline-start" />
          Signing out…
        </>
      ) : (
        <>
          <LogOut data-icon="inline-start" />
          Log out
        </>
      )}
    </Button>
  )
}
