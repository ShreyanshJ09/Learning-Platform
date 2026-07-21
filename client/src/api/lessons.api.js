import { apiClient } from '@/api/client'

/**
 * Frontend helpers that call the EXISTING Django lessons API.
 * We are NOT creating backend endpoints — only thin wrappers around them.
 *
 * Backend lives at: /api/lessons/...
 */

const LESSONS = {
  detail: (id) => `/api/lessons/${id}/`,
}

/**
 * Fetch a single lesson (full payload for the lesson viewer).
 * Response shape: { id, module, title, objectives, content, is_enriched, order, created_at }
 *
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function getLesson(id) {
  const { data } = await apiClient.get(LESSONS.detail(id))
  return data
}
