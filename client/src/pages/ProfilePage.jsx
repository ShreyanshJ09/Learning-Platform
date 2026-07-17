import { PageHeader } from '@/components/common/PageHeader'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'

/**
 * Lightweight profile view for shell nav. Full edit form is a later phase.
 */
export function ProfilePage() {
  const { data: user, isPending } = useCurrentUser()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Profile"
        description="Your account details."
      />

      <section className="max-w-md rounded-xl bg-card p-4 text-sm ring-1 ring-foreground/10">
        {isPending && !user ? (
          <p className="text-muted-foreground">Loading profile…</p>
        ) : (
          <dl className="space-y-2 text-muted-foreground">
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-foreground">Email</dt>
              <dd>{user?.email ?? '—'}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-foreground">Username</dt>
              <dd>{user?.username ?? '—'}</dd>
            </div>
          </dl>
        )}
      </section>
    </div>
  )
}
