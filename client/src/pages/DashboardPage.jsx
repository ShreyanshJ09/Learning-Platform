import { LogoutButton } from '@/features/auth/components/LogoutButton'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'

/**
 * Temporary dashboard shell for Phase 2 smoke tests.
 * Real course list arrives in Phase 3.
 */
export function DashboardPage() {
  const { data: user, isPending } = useCurrentUser()

  return (
    <main className="flex min-h-svh flex-col bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Auth complete — course list comes in Phase 3.
            </p>
          </div>
          <LogoutButton />
        </div>

        <section className="rounded-xl border border-border bg-card p-4 text-sm text-card-foreground">
          <p className="font-medium">Signed in as</p>
          {isPending && !user ? (
            <p className="mt-1 text-muted-foreground">Loading profile…</p>
          ) : (
            <dl className="mt-2 space-y-1 text-muted-foreground">
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 text-foreground">Email</dt>
                <dd>{user?.email ?? '—'}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 text-foreground">Username</dt>
                <dd>{user?.username ?? '—'}</dd>
              </div>
            </dl>
          )}
        </section>
      </div>
    </main>
  )
}
