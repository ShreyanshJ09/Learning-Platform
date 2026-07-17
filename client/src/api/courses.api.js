import { apiClient } from '@/api/client'
import { normalizeList } from '@/lib/normalizeList'

/**
 * Frontend helpers that call the EXISTING Django courses API.
 * We are NOT creating backend endpoints — only thin wrappers around them.
 *
 * Backend lives at: /api/courses/...
 */

const COURSES = {
  list: '/api/courses/',
}

/**
 * List the current user's courses (owner-scoped).
 * Response is a bare array today; normalizeList also accepts a future `{ results }` envelope.
 *
 * @returns {Promise<object[]>}
 */
export async function listCourses() {
  const { data } = await apiClient.get(COURSES.list)
  return normalizeList(data)
}
