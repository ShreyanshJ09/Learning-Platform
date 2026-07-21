import { AlertCircle, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useYoutubeSearch } from '@/features/media/hooks/useYoutubeSearch'
import { youtubeEnabled } from '@/lib/env'
import { cn } from '@/lib/utils'

/**
 * Video content block — resolves `query` via GET /api/media/youtube/ and embeds
 * the top result. Falls back to a placeholder when YouTube is disabled.
 *
 * @param {import('@/features/lessons/registry/types.js').BlockProps} props
 */
export function VideoBlock({ block, className }) {
  const query = typeof block.query === 'string' ? block.query : ''

  if (!youtubeEnabled) {
    return <VideoBlockPlaceholder query={query} className={className} />
  }

  if (!query.trim()) {
    return <VideoBlockPlaceholder query="" className={className} />
  }

  return <VideoBlockEmbed query={query} className={className} />
}

/**
 * @param {{ query: string, className?: string }} props
 */
function VideoBlockEmbed({ query, className }) {
  const { data, isPending, isError, error, refetch } = useYoutubeSearch(query)
  const video = data?.[0]

  if (isPending) {
    return (
      <figure className={cn('flex flex-col gap-2', className)}>
        <Skeleton className="aspect-video w-full rounded-xl" />
        <Skeleton className="h-4 w-2/3 max-w-sm" />
      </figure>
    )
  }

  if (isError) {
    return (
      <aside
        role="alert"
        className={cn(
          'flex flex-col gap-3 rounded-xl bg-destructive/10 px-4 py-4 ring-1 ring-destructive/20',
          className,
        )}
      >
        <div className="flex items-start gap-2 text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div>
            <p className="text-sm font-medium">Couldn&apos;t load video</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {error?.message ?? 'Please try again.'}
            </p>
          </div>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </aside>
    )
  }

  if (!video) {
    return (
      <VideoBlockPlaceholder
        query={query}
        className={className}
        message="No videos found for this topic."
      />
    )
  }

  return (
    <figure className={cn('flex flex-col gap-2', className)}>
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black ring-1 ring-foreground/10">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.video_id)}?rel=0`}
          title={video.title}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <figcaption className="text-sm text-muted-foreground">{video.title}</figcaption>
    </figure>
  )
}

/**
 * Legacy / fallback UI when YouTube integration is off or has no results.
 *
 * @param {{ query: string, className?: string, message?: string }} props
 */
function VideoBlockPlaceholder({ query, className, message }) {
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
          {message ?? 'Video coming soon'}
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
