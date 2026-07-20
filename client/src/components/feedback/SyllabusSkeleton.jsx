import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/**
 * Loading placeholder that mirrors SyllabusTree (accordion of modules + lessons).
 * Shown while useCourseModules is pending — keeps layout stable.
 *
 * @param {{ moduleCount?: number, lessonsPerModule?: number, className?: string }} props
 */
export function SyllabusSkeleton({
  moduleCount = 3,
  lessonsPerModule = 3,
  className,
}) {
  return (
    <div
      className={cn('flex flex-col gap-3', className)}
      aria-hidden
      aria-busy="true"
    >
      {Array.from({ length: moduleCount }, (_, moduleIndex) => (
        <div
          key={moduleIndex}
          className="rounded-xl bg-card p-4 ring-1 ring-foreground/10"
        >
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="size-4 shrink-0 rounded-sm" />
          </div>

          <ul className="mt-4 space-y-2.5 border-t border-border/60 pt-3">
            {Array.from({ length: lessonsPerModule }, (_, lessonIndex) => (
              <li key={lessonIndex}>
                <Skeleton
                  className={cn(
                    'h-4',
                    lessonIndex % 3 === 0
                      ? 'w-3/5'
                      : lessonIndex % 3 === 1
                        ? 'w-2/5'
                        : 'w-1/2',
                  )}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
