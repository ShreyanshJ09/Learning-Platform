import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { paths } from '@/routes/paths'
import { cn } from '@/lib/utils'

/**
 * Sticky prev / next lesson controls for the lesson viewer.
 *
 * @param {{
 *   courseId: string,
 *   prev?: { id: string, title: string } | null,
 *   next?: { id: string, title: string } | null,
 *   className?: string,
 * }} props
 */
export function LessonPrevNext({ courseId, prev, next, className }) {
  if (!prev && !next) return null

  return (
    <nav
      aria-label="Lesson pagination"
      className={cn(
        'sticky bottom-0 z-10 -mx-4 mt-auto border-t border-border bg-background/95 px-4 py-4 backdrop-blur supports-backdrop-filter:bg-background/80 sm:-mx-6 sm:px-6',
        className,
      )}
    >
      <div className="flex items-stretch justify-between gap-4">
        {prev ? (
          <Link
            to={paths.lesson(courseId, prev.id)}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-auto min-h-14 min-w-0 max-w-[50%] flex-1 gap-3 px-4 py-3 sm:max-w-sm',
              'items-center justify-start text-left whitespace-normal',
            )}
          >
            <ChevronLeft className="size-5 shrink-0" aria-hidden />
            <span className="min-w-0">
              <span className="block text-xs font-normal uppercase tracking-wide text-muted-foreground">
                Previous
              </span>
              <span className="mt-0.5 block truncate text-sm font-medium leading-snug">
                {prev.title}
              </span>
            </span>
          </Link>
        ) : (
          <span className="flex-1" aria-hidden />
        )}

        {next ? (
          <Link
            to={paths.lesson(courseId, next.id)}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-auto min-h-14 min-w-0 max-w-[50%] flex-1 gap-3 px-4 py-3 sm:max-w-sm',
              'items-center justify-end text-right whitespace-normal',
            )}
          >
            <span className="min-w-0">
              <span className="block text-xs font-normal uppercase tracking-wide text-muted-foreground">
                Next
              </span>
              <span className="mt-0.5 block truncate text-sm font-medium leading-snug">
                {next.title}
              </span>
            </span>
            <ChevronRight className="size-5 shrink-0" aria-hidden />
          </Link>
        ) : (
          <span className="flex-1" aria-hidden />
        )}
      </div>
    </nav>
  )
}
