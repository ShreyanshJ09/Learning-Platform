import { useQuery } from '@tanstack/react-query'
import { searchYoutube } from '@/api/media.api'
import { queryKeys } from '@/api/queryKeys'
import { youtubeSearchResponseSchema } from '@/features/media/schemas'
import { useAuth } from '@/providers/AuthProvider'
import { youtubeEnabled } from '@/lib/env'

/**
 * GET /api/media/youtube/?query= — cached by query string.
 * Backend also caches results for 24h; frontend keeps a long staleTime to match.
 *
 * @param {string | undefined} query
 */
export function useYoutubeSearch(query) {
  const { status } = useAuth()
  const trimmed = typeof query === 'string' ? query.trim() : ''

  return useQuery({
    queryKey: queryKeys.media.youtube(trimmed),
    queryFn: async () => {
      const data = await searchYoutube(trimmed)
      const parsed = youtubeSearchResponseSchema.safeParse(data)
      return parsed.success ? parsed.data : []
    },
    enabled:
      youtubeEnabled &&
      status === 'authenticated' &&
      trimmed.length > 0,
    staleTime: 24 * 60 * 60_000,
    retry: 1,
  })
}
