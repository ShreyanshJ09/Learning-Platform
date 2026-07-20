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
  detail: (id) => `/api/courses/${id}/`,
  modules: (courseId) => `/api/courses/${courseId}/modules/`,
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

/**
 * Fetch a single course (header info — no nested modules/lessons).
 *
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function getCourse(id) {
  const { data } = await apiClient.get(COURSES.detail(id))
  return data
}

/**
 * Fetch the course syllabus: modules each with lesson summaries.
 * Response is a bare array today; normalizeList also accepts a future `{ results }` envelope.
 *
 * @param {string} courseId
 * @returns {Promise<object[]>}
 */
export async function getCourseModules(courseId) {
  const { data } = await apiClient.get(COURSES.modules(courseId))
  return normalizeList(data)
}

/**
 * Partially update a course (owner-scoped).
 *
 * @param {string} id
 * @param {{ title?: string, description?: string, is_public?: boolean, tags?: string[] }} payload
 * @returns {Promise<object>}
 */
export async function updateCourse(id, payload) {
  const { data } = await apiClient.patch(COURSES.detail(id), payload)
  return data
}

/**
 * Delete a course and all nested modules/lessons (owner-scoped).
 *
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteCourse(id) {
  await apiClient.delete(COURSES.detail(id))
}
