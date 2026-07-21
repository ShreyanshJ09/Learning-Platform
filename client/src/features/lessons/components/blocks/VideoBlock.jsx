import { Video } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Video content block — placeholder until /api/media/youtube/ exists.
 * Shows the search query; later swap internals for a real embed (no registry change).
 *
 * @param {import('@/features/lessons/registry/types.js').BlockProps} props
 */
export function VideoBlock({ block, className }) {
  const query = typeof block.query === 'string' ? block.query : ''

  return (
    <aside
      className={cn(
        'flex flex-col gap-2 rounded-xl bg-muted/40 px-4 py-5 ring-1 ring-foreground/10',
        className,
      )}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Video className="size-4 shrink-0" aria-hidden />
        <span className="text-xs font-medium uppercase tracking-wide">
          Video coming soon
        </span>
      </div>
      {query ? (
        <p className="text-sm text-foreground">
          Search query:{' '}
          <span className="font-medium">{query}</span>
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">No video query provided.</p>
      )}
    </aside>
  )
}
