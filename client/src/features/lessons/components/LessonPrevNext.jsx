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
        'sticky bottom-0 z-10 -mx-4 mt-auto border-t border-border bg-background/95 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-background/80 sm:-mx-6 sm:px-6',
        className,
      )}
    >
      <div className="flex items-stretch justify-between gap-3">
        {prev ? (
          <Link
            to={paths.lesson(courseId, prev.id)}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'min-w-0 max-w-[50%] flex-1 justify-start sm:max-w-xs',
            )}
          >
            <ChevronLeft className="size-4 shrink-0" aria-hidden />
            <span className="min-w-0 truncate text-left">
              <span className="block text-[0.65rem] font-normal uppercase tracking-wide text-muted-foreground">
                Previous
              </span>
              <span className="block truncate">{prev.title}</span>
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
              'min-w-0 max-w-[50%] flex-1 justify-end sm:max-w-xs',
            )}
          >
            <span className="min-w-0 truncate text-right">
              <span className="block text-[0.65rem] font-normal uppercase tracking-wide text-muted-foreground">
                Next
              </span>
              <span className="block truncate">{next.title}</span>
            </span>
            <ChevronRight className="size-4 shrink-0" aria-hidden />
          </Link>
        ) : (
          <span className="flex-1" aria-hidden />
        )}
      </div>
    </nav>
  )
}
