import axios from 'axios'
import { apiClient } from '@/api/client'
import { normalizeApiError } from '@/lib/errors'
import { normalizeList } from '@/lib/normalizeList'

/**
 * Frontend helpers for the Django media API.
 * Backend lives at: /api/media/...
 */

const MEDIA = {
  youtube: '/api/media/youtube/',
  tts: '/api/media/tts/',
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

/**
 * Generate spoken audio for lesson text.
 * POST /api/media/tts/ → audio/wav blob (not JSON).
 *
 * @param {{ text: string, language?: string }} payload
 * @returns {Promise<Blob>}
 */
export async function generateSpeech({ text, language = 'en' }) {
  try {
    const { data, headers } = await apiClient.post(
      MEDIA.tts,
      { text, language },
      { responseType: 'blob' },
    )

    const contentType = String(headers?.['content-type'] ?? data?.type ?? '')
    if (contentType.includes('application/json')) {
      throw await apiErrorFromJsonBlob(data, 400)
    }

    return data
  } catch (err) {
    throw await improveBlobApiError(err)
  }
}

/**
 * When responseType is blob, DRF error bodies arrive as Blobs — parse detail.
 * @param {unknown} err
 * @returns {Promise<import('@/lib/errors').ApiError>}
 */
async function improveBlobApiError(err) {
  const apiError = normalizeApiError(err)
  const raw = apiError.raw

  if (axios.isAxiosError(raw) && raw.response?.data instanceof Blob) {
    try {
      const json = JSON.parse(await raw.response.data.text())
      if (typeof json?.detail === 'string') {
        return { ...apiError, message: json.detail }
      }
    } catch {
      // keep normalized error
    }
  }

  return apiError
}

/**
 * @param {Blob} blob
 * @param {number} status
 */
async function apiErrorFromJsonBlob(blob, status) {
  let message = 'Could not generate audio.'
  try {
    const json = JSON.parse(await blob.text())
    if (typeof json?.detail === 'string') message = json.detail
  } catch {
    // keep default
  }
  return {
    status,
    code:
      status === 503 ? 'ai_unavailable' : status >= 500 ? 'server' : 'unknown',
    message,
    raw: null,
  }
}
