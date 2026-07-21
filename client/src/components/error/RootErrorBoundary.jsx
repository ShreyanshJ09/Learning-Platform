import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { paths } from '@/routes/paths'

/**
 * Last-resort boundary around the app tree (inside providers, outside the router).
 * Catches render errors that escape route-level handling.
 */
export class RootErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('[RootErrorBoundary]', error, info?.componentStack)
    }
  }

  render() {
    if (this.state.hasError) {
      const { error } = this.state
      const devDetail =
        import.meta.env.DEV && error instanceof Error ? error.stack : null

      return (
        <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-6 py-10 text-center text-foreground">
          <div className="flex max-w-md flex-col items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" aria-hidden />
            </div>

            <div className="space-y-1">
              <h1 className="font-heading text-lg font-medium tracking-tight">
                The app hit an unexpected error
              </h1>
              <p className="text-sm text-muted-foreground">
                Something broke outside the normal error handling. Reload the page
                or return to the dashboard.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className={buttonVariants()}
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
            <a href={paths.dashboard} className={buttonVariants({ variant: 'outline' })}>
              Back to dashboard
            </a>
          </div>

          {devDetail ? (
            <pre className="max-h-48 w-full max-w-md overflow-auto rounded-lg bg-muted p-3 text-left text-xs text-muted-foreground">
              {devDetail}
            </pre>
          ) : null}
        </main>
      )
    }

    return this.props.children
  }
}
