import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { ErrorPageLayout } from '@/components/error/ErrorPageLayout'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { paths } from '@/routes/paths'

/**
 * 404 UI — used for unknown routes and inline when a detail API returns 404.
 *
 * @param {{
 *   title?: string,
 *   description?: string,
 *   backTo?: string,
 *   backLabel?: string,
 *   fullPage?: boolean,
 *   className?: string,
 * }} props
 */
export function NotFoundPage({
  title = 'Page not found',
  description = "We couldn't find what you're looking for. It may have been removed or you don't have access.",
  backTo = paths.dashboard,
  backLabel = 'Back to dashboard',
  fullPage = true,
  className,
}) {
  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-16 text-center',
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FileQuestion className="size-5" aria-hidden />
      </div>

      <div className="space-y-1">
        <h1 className="font-heading text-lg font-medium tracking-tight text-foreground">
          {title}
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>

      <Link to={backTo} className={buttonVariants({ variant: 'outline' })}>
        {backLabel}
      </Link>
    </div>
  )

  if (fullPage) {
    return <ErrorPageLayout>{content}</ErrorPageLayout>
  }

  return content
}
