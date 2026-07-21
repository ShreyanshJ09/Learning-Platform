import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Renders lesson learning objectives as a simple checklist-style list.
 *
 * @param {{
 *   objectives?: string[],
 *   className?: string,
 * }} props
 */
export function ObjectivesList({ objectives, className }) {
  const items = Array.isArray(objectives)
    ? objectives.filter((item) => typeof item === 'string' && item.trim())
    : []

  if (items.length === 0) return null

  return (
    <section className={cn('flex flex-col gap-2', className)} aria-labelledby="lesson-objectives-heading">
      <h2
        id="lesson-objectives-heading"
        className="font-heading text-sm font-medium tracking-tight text-foreground"
      >
        Objectives
      </h2>
      <ul className="space-y-2">
        {items.map((objective, index) => (
          <li
            key={`${index}-${objective.slice(0, 24)}`}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <CheckCircle2
              className="mt-0.5 size-4 shrink-0 text-muted-foreground/80"
              aria-hidden
            />
            <span className="min-w-0 text-foreground">{objective}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
