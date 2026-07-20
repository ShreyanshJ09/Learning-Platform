import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Navigation trail: Dashboard › Course › Lesson.
 * Last item is the current page (not a link). Earlier items may include `to`.
 *
 * @param {{
 *   items: Array<{ label: string, to?: string }>,
 *   className?: string,
 * }} props
 */
export function Breadcrumbs({ items, className }) {
  if (!items?.length) return null

  return (
    <nav aria-label="Breadcrumb" className={cn('min-w-0', className)}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 ? (
                <li aria-hidden className="flex items-center">
                  <ChevronRight className="size-3.5 shrink-0 opacity-60" />
                </li>
              ) : null}
              <li className="min-w-0">
                {isLast || !item.to ? (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className={cn(
                      'block truncate',
                      isLast && 'font-medium text-foreground',
                    )}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.to}
                    className="block truncate transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
