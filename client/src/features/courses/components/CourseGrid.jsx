import { CourseCard } from '@/features/courses/components/CourseCard'
import { cn } from '@/lib/utils'

/**
 * Responsive grid of CourseCard.
 * @param {{ courses: object[], className?: string }} props
 */
export function CourseGrid({ courses, className }) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-3', className)}>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
