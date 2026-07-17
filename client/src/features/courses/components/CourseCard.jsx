import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { paths } from '@/routes/paths'
import { cn } from '@/lib/utils'

/**
 * @param {{ course: {
 *   id: string,
 *   title: string,
 *   description?: string,
 *   tags?: string[],
 *   created_at?: string,
 * }, className?: string }} props
 */
export function CourseCard({ course, className }) {
  const createdLabel = formatCreatedAt(course.created_at)
  const tags = Array.isArray(course.tags) ? course.tags.slice(0, 3) : []

  return (
    <Link
      to={paths.course(course.id)}
      className={cn('block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50', className)}
    >
      <Card className="h-full transition-colors hover:bg-muted/40">
        <CardHeader>
          <CardTitle className="line-clamp-2">{course.title}</CardTitle>
          {course.description ? (
            <CardDescription className="line-clamp-2">
              {course.description}
            </CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {tags.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
          {createdLabel ? (
            <p className="text-xs text-muted-foreground">{createdLabel}</p>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  )
}

function formatCreatedAt(value) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
