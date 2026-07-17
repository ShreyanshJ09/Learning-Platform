import { useEffect, useId, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, Loader2, LogOut, User } from 'lucide-react'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { Button } from '@/components/ui/button'
import { paths } from '@/routes/paths'
import { cn } from '@/lib/utils'

/**
 * Avatar trigger → Profile / Log out.
 * Logout lives here (moved off the temporary Dashboard button).
 */
export function UserMenu({ className }) {
  const navigate = useNavigate()
  const { data: user } = useCurrentUser()
  const { mutateAsync, isPending } = useLogout()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const menuId = useId()

  const label = user?.username || user?.email || 'Account'
  const initials = getInitials(user)

  useEffect(() => {
    if (!open) return undefined

    function onPointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  async function handleLogout() {
    setOpen(false)
    try {
      await mutateAsync()
    } finally {
      navigate(paths.login, { replace: true })
    }
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="gap-2"
      >
        <span
          className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground"
          aria-hidden
        >
          {initials}
        </span>
        <span className="hidden max-w-28 truncate sm:inline">{label}</span>
        <ChevronDown className="size-3.5 opacity-60" aria-hidden />
      </Button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md"
        >
          <Link
            role="menuitem"
            to={paths.profile}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            <User className="size-4" aria-hidden />
            Profile
          </Link>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted disabled:opacity-50"
            disabled={isPending}
            onClick={handleLogout}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <LogOut className="size-4" aria-hidden />
            )}
            {isPending ? 'Signing out…' : 'Log out'}
          </button>
        </div>
      ) : null}
    </div>
  )
}

function getInitials(user) {
  const source = user?.username || user?.email || '?'
  return String(source).slice(0, 2).toUpperCase()
}
