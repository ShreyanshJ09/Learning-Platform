import { CourseCardSkeleton } from '@/components/feedback/CourseCardSkeleton'
import { cn } from '@/lib/utils'

/**
 * Responsive grid of CourseCardSkeleton — dashboard list loading state.
 */
export function CourseGridSkeleton({ count = 6, className }) {
  return (
    <div
      className={cn(
        'grid gap-4 sm:grid-cols-2 xl:grid-cols-3',
        className,
      )}
      aria-hidden
    >
      {Array.from({ length: count }, (_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  )
}
