import { cn } from '@/lib/utils'

/**
 * Generic empty list / empty page placeholder.
 * Pass an optional icon, title, description, and an action (usually a Button/Link).
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-16 text-center',
        className,
      )}
    >
      {icon ? (
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
      ) : null}
      <div className="space-y-1">
        <h2 className="font-heading text-lg font-medium tracking-tight text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  )
}
