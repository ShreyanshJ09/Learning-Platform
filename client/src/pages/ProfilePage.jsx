import { Loader2, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { ProfileSkeleton } from '@/components/feedback/ProfileSkeleton'
import { Button } from '@/components/ui/button'
import { ProfileForm } from '@/features/auth/components/ProfileForm'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { cn } from '@/lib/utils'
import { paths } from '@/routes/paths'

/**
 * View and edit the current user profile.
 */
export function ProfilePage() {
  const navigate = useNavigate()
  const { data: user, isPending } = useCurrentUser()
  const { mutateAsync: logoutAsync, isPending: isLoggingOut } = useLogout()

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    user?.username ||
    user?.email ||
    'Account'

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Profile"
        description="View and update your account details."
      />

      {isPending && !user ? (
        <ProfileSkeleton />
      ) : (
        <section
          aria-busy={isPending}
          className="max-w-md space-y-6 rounded-xl bg-card p-6 ring-1 ring-foreground/10"
        >
          <div className="flex items-center gap-4">
            <ProfileAvatar user={user} />
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{displayName}</p>
              <p className="truncate text-sm text-muted-foreground">
                {user?.email ?? '—'}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p className="font-medium text-foreground">Email</p>
            <p className="text-muted-foreground">{user?.email ?? '—'}</p>
            <p className="text-xs text-muted-foreground">
              Email cannot be changed here.
            </p>
          </div>

          {user ? <ProfileForm user={user} /> : null}

          <div className="border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isLoggingOut}
              onClick={async () => {
                try {
                  await logoutAsync()
                } finally {
                  navigate(paths.login, { replace: true })
                }
              }}
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Signing out…
                </>
              ) : (
                <>
                  <LogOut className="size-4" aria-hidden />
                  Log out
                </>
              )}
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}

function ProfileAvatar({ user }) {
  const initials = getInitials(user)
  const picture = user?.profile_picture?.trim()

  if (picture) {
    return (
      <img
        src={picture}
        alt=""
        className="size-14 shrink-0 rounded-full object-cover ring-1 ring-border"
      />
    )
  }

  return (
    <span
      className={cn(
        'flex size-14 shrink-0 items-center justify-center rounded-full bg-muted text-base font-medium text-foreground ring-1 ring-border',
      )}
      aria-hidden
    >
      {initials}
    </span>
  )
}

function getInitials(user) {
  const fromName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .map((part) => part[0])
    .join('')

  if (fromName) return fromName.slice(0, 2).toUpperCase()

  const source = user?.username || user?.email || '?'
  return String(source).slice(0, 2).toUpperCase()
}
