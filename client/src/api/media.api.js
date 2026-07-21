import { apiClient } from '@/api/client'
import { normalizeList } from '@/lib/normalizeList'

/**
 * Frontend helpers for the Django media API.
 * Backend lives at: /api/media/...
 */

const MEDIA = {
  youtube: '/api/media/youtube/',
}

/**
 * Search YouTube for videos matching a lesson block query.
 * Response: [{ video_id, title, thumbnail }, ...]
 *
 * @param {string} query
 * @returns {Promise<Array<{ video_id: string, title: string, thumbnail: string }>>}
 */
export async function searchYoutube(query) {
  const { data } = await apiClient.get(MEDIA.youtube, {
    params: { query },
  })
  return normalizeList(data)
}
