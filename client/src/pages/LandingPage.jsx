import { Link } from 'react-router-dom'
import { useAuth } from '@/providers/AuthProvider'
import { buttonVariants } from '@/components/ui/button'
import { paths } from '@/routes/paths'

/**
 * Minimal landing so Phase 2 can be smoke-tested without typing URLs.
 * Full marketing page is later polish.
 */
export function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth()

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-6 text-foreground">
      <div className="max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Text-to-Learn
          </h1>
          <p className="text-muted-foreground">
            Turn a topic into a structured course.
          </p>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading session…</p>
        ) : isAuthenticated ? (
          <Link
            to={paths.dashboard}
            className={buttonVariants({ size: 'lg' })}
          >
            Go to dashboard
          </Link>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to={paths.register}
              className={buttonVariants({ size: 'lg' })}
            >
              Get started
            </Link>
            <Link
              to={paths.login}
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              Log in
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
