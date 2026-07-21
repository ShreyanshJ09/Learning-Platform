import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ListTree } from 'lucide-react'
import { sortByOrder } from '@/features/lessons/lib/lessonNavigation'
import { paths } from '@/routes/paths'
import { cn } from '@/lib/utils'

/**
 * In-lesson syllabus nav: modules → lessons, current lesson highlighted.
 * Flush left rail on desktop; collapsible toggle on small screens.
 *
 * @param {{
 *   courseId: string,
 *   lessonId: string,
 *   modules?: Array<{
 *     id: string,
 *     title: string,
 *     order?: number,
 *     lessons?: Array<{ id: string, title: string, order?: number }>,
 *   }>,
 *   className?: string,
 * }} props
 */
export function LessonSidebar({ courseId, lessonId, modules, className }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const sortedModules = sortByOrder(modules)

  if (sortedModules.length === 0) return null

  return (
    <aside
      className={cn(
        'w-full lg:flex lg:h-full lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-card/40',
        className,
      )}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 rounded-xl bg-card px-3 py-2.5 text-sm font-medium text-foreground ring-1 ring-foreground/10 lg:hidden"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
      >
        <span className="flex items-center gap-2">
          <ListTree className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          Syllabus
        </span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-muted-foreground transition-transform',
            mobileOpen && 'rotate-180',
          )}
          aria-hidden
        />
      </button>

      <nav
        aria-label="Lesson syllabus"
        className={cn(
          'mt-2 rounded-xl bg-card p-3 ring-1 ring-foreground/10 lg:mt-0 lg:flex-1 lg:overflow-y-auto lg:rounded-none lg:bg-transparent lg:p-4 lg:ring-0',
          mobileOpen ? 'block' : 'hidden lg:block',
        )}
      >
        <p className="mb-3 hidden text-xs font-medium uppercase tracking-wide text-muted-foreground lg:block">
          Syllabus
        </p>
        <ul className="space-y-3">
          {sortedModules.map((mod) => {
            const lessons = sortByOrder(mod.lessons)
            return (
              <li key={mod.id}>
                <p className="mb-1 truncate px-2 text-xs font-medium text-muted-foreground">
                  {mod.title}
                </p>
                {lessons.length === 0 ? (
                  <p className="px-2 py-1 text-xs text-muted-foreground">
                    No lessons
                  </p>
                ) : (
                  <ul className="space-y-0.5">
                    {lessons.map((lesson) => {
                      const isCurrent =
                        String(lesson.id) === String(lessonId)
                      return (
                        <li key={lesson.id}>
                          <Link
                            to={paths.lesson(courseId, lesson.id)}
                            aria-current={isCurrent ? 'page' : undefined}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              'block rounded-lg px-2 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                              isCurrent
                                ? 'bg-muted font-medium text-foreground'
                                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                            )}
                          >
                            <span className="line-clamp-2">{lesson.title}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
