import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/**
 * Loading placeholder that mirrors ProfileForm layout.
 */
export function ProfileSkeleton({ className }) {
  return (
    <section
      aria-busy="true"
      aria-label="Loading profile"
      className={cn(
        'max-w-md space-y-6 rounded-xl bg-card p-6 ring-1 ring-foreground/10',
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <Skeleton className="size-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>

      <Skeleton className="h-9 w-28" />
    </section>
  )
}
