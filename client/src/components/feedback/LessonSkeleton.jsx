import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/**
 * Loading placeholder that mirrors LessonViewerPage content
 * (title, objectives lines, content block placeholders).
 *
 * @param {{ className?: string }} props
 */
export function LessonSkeleton({ className }) {
  return (
    <div
      className={cn('flex flex-col gap-6', className)}
      aria-hidden
      aria-busy="true"
    >
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3 max-w-lg" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton className="h-4 w-4/5 max-w-sm" />
        <Skeleton className="h-4 w-3/5 max-w-xs" />
      </div>

      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-1/2 max-w-sm" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  )
}
