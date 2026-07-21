import { apiClient } from '@/api/client'

/**
 * Frontend helpers that call the EXISTING Django generation API.
 * We are NOT creating backend endpoints — only thin wrappers around them.
 *
 * Backend lives at: /api/generate/...
 */

const GENERATION = {
  course: '/api/generate/course/',
  lesson: (lessonId) => `/api/generate/lesson/${lessonId}/`,
}

/**
 * Generate a full course outline from a topic (course + modules + lesson stubs).
 * Long-running — can take 20–30 seconds.
 *
 * Request:  { topic: string }  (≤500 chars, required)
 * Response: flat Course object, 201 — no nested modules; fetch syllabus separately.
 *
 * @param {{ topic: string }} payload
 * @returns {Promise<object>}
 */
export async function generateCourse({ topic }) {
  const { data } = await apiClient.post(GENERATION.course, { topic })
  return data
}

/**
 * Enrich a lesson stub with objectives + content blocks.
 * Idempotent when regenerate is false and the lesson is already enriched.
 *
 * Request:  { regenerate?: boolean }  (default false)
 * Response: full Lesson object, 200
 *
 * @param {string} lessonId
 * @param {{ regenerate?: boolean }} [options]
 * @returns {Promise<object>}
 */
export async function generateLesson(lessonId, { regenerate = false } = {}) {
  const { data } = await apiClient.post(GENERATION.lesson(lessonId), {
    regenerate,
  })
  return data
}
