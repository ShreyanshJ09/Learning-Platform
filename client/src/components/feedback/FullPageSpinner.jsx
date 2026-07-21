import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Full-viewport loading indicator for boot / route guards.
 *
 * @param {{ message?: string, className?: string }} props
 */
export function FullPageSpinner({
  message = 'Loading session…',
  className,
}) {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className={cn(
        'flex min-h-svh flex-col items-center justify-center gap-3 bg-background text-muted-foreground',
        className,
      )}
    >
      <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
      <p className="text-sm">{message}</p>
    </main>
  )
}
