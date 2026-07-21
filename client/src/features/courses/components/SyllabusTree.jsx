import { Accordion } from '@/components/ui/accordion'
import { ModuleAccordionItem } from '@/features/courses/components/ModuleAccordionItem'
import { cn } from '@/lib/utils'

/**
 * Course syllabus: accordion of modules → lesson links.
 *
 * @param {{
 *   courseId: string,
 *   modules: Array<{
 *     id: string,
 *     title: string,
 *     order?: number,
 *     lessons?: Array<{ id: string, title: string, order?: number }>,
 *   }>,
 *   className?: string,
 * }} props
 */
export function SyllabusTree({ courseId, modules, className }) {
  const sortedModules = sortByOrder(modules)
  const defaultOpen = sortedModules.map((module) => module.id)

  if (sortedModules.length === 0) {
    return null
  }

  return (
    <Accordion
      multiple
      defaultValue={defaultOpen}
      className={cn('gap-3', className)}
    >
      {sortedModules.map((module) => (
        <ModuleAccordionItem
          key={module.id}
          courseId={courseId}
          module={module}
        />
      ))}
    </Accordion>
  )
}

function sortByOrder(items) {
  if (!Array.isArray(items)) return []
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}
