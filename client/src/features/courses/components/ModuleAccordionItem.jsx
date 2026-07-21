import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { LessonListItem } from '@/features/courses/components/LessonListItem'
import { cn } from '@/lib/utils'

/**
 * One module accordion section + its lesson list.
 *
 * @param {{
 *   courseId: string,
 *   module: {
 *     id: string,
 *     title: string,
 *     order?: number,
 *     lessons?: Array<{ id: string, title: string, order?: number }>,
 *   },
 *   className?: string,
 * }} props
 */
export function ModuleAccordionItem({ courseId, module, className }) {
  const lessons = sortByOrder(module.lessons)

  return (
    <AccordionItem
      value={module.id}
      className={cn(
        'rounded-xl bg-card px-4 py-3 ring-1 ring-foreground/10',
        className,
      )}
    >
      <AccordionTrigger>
        <span className="min-w-0 truncate">{module.title}</span>
      </AccordionTrigger>
      <AccordionContent className="border-t border-border/60 pt-2 pb-1">
        {lessons.length === 0 ? (
          <p className="px-2 py-2 text-sm text-muted-foreground">
            No lessons in this module yet.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {lessons.map((lesson) => (
              <LessonListItem
                key={lesson.id}
                courseId={courseId}
                lesson={lesson}
              />
            ))}
          </ul>
        )}
      </AccordionContent>
    </AccordionItem>
  )
}

function sortByOrder(items) {
  if (!Array.isArray(items)) return []
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}
