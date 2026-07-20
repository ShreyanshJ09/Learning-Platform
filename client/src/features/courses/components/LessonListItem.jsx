import { Link } from 'react-router-dom'
import { paths } from '@/routes/paths'
import { cn } from '@/lib/utils'

/**
 * One lesson row in the syllabus: title + link to the lesson viewer.
 *
 * @param {{
 *   courseId: string,
 *   lesson: { id: string, title: string, order?: number },
 *   className?: string,
 * }} props
 */
export function LessonListItem({ courseId, lesson, className }) {
  return (
    <li>
      <Link
        to={paths.lesson(courseId, lesson.id)}
        className={cn(
          'block rounded-lg px-2 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
          className,
        )}
      >
        <span className="block truncate">{lesson.title}</span>
      </Link>
    </li>
  )
}
