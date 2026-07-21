import { env } from '@/lib/env'
import { cn } from '@/lib/utils'

/**
 * Fallback for unregistered or unknown block types.
 * Dev: show raw JSON to aid debugging. Prod: neutral placeholder.
 *
 * @param {import('@/features/lessons/registry/types.js').BlockProps} props
 */
export function UnknownBlock({ block, className }) {
  const isDev = env.VITE_ENV === 'development'

  return (
    <aside
      role="note"
      className={cn(
        'rounded-xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground ring-1 ring-foreground/10',
        className,
      )}
    >
      <p className="font-medium text-foreground">
        This content type isn&apos;t supported yet
        {block?.type ? (
          <span className="font-normal text-muted-foreground">
            {' '}
            ({block.type})
          </span>
        ) : null}
      </p>
      {isDev ? (
        <pre className="mt-2 overflow-x-auto rounded-lg bg-background p-2 text-xs text-muted-foreground">
          {safeStringify(block)}
        </pre>
      ) : null}
    </aside>
  )
}

function safeStringify(value) {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}
