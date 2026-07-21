import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { ErrorPageLayout } from '@/components/error/ErrorPageLayout'
import { Button, buttonVariants } from '@/components/ui/button'
import { paths } from '@/routes/paths'

/**
 * React Router `errorElement` — catches thrown loader/render errors for a route subtree.
 */
export function ErrorPage() {
  const error = useRouteError()

  let title = 'Something went wrong'
  let message = 'An unexpected error occurred. Try reloading the page or go back to the dashboard.'

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`
    if (typeof error.data === 'string') {
      message = error.data
    } else if (
      error.data &&
      typeof error.data === 'object' &&
      'message' in error.data &&
      typeof error.data.message === 'string'
    ) {
      message = error.data.message
    }
  } else if (error instanceof Error) {
    message = error.message
  }

  const devDetail =
    import.meta.env.DEV && error instanceof Error ? error.stack : null

  return (
    <ErrorPageLayout>
      <div className="flex flex-col items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-5" aria-hidden />
        </div>

        <div className="space-y-1">
          <h1 className="font-heading text-lg font-medium tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={() => window.location.reload()}>
          Reload page
        </Button>
        <Link to={paths.dashboard} className={buttonVariants({ variant: 'outline' })}>
          Back to dashboard
        </Link>
      </div>

      {devDetail ? (
        <pre className="max-h-48 w-full overflow-auto rounded-lg bg-muted p-3 text-left text-xs text-muted-foreground">
          {devDetail}
        </pre>
      ) : null}
    </ErrorPageLayout>
  )
}
