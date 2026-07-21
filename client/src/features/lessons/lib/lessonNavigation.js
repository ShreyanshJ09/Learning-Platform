/**
 * Pure helpers for lesson viewer navigation (sidebar + prev/next).
 * No React — easy to unit-test later.
 */

/**
 * @template {{ order?: number }} T
 * @param {T[] | undefined | null} items
 * @returns {T[]}
 */
export function sortByOrder(items) {
  if (!Array.isArray(items)) return []
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

/**
 * Flatten modules → ordered lesson list (module order, then lesson order).
 *
 * @param {Array<{
 *   id: string,
 *   title: string,
 *   order?: number,
 *   lessons?: Array<{ id: string, title: string, order?: number }>,
 * }> | undefined} modules
 * @returns {Array<{
 *   id: string,
 *   title: string,
 *   order?: number,
 *   moduleId: string,
 *   moduleTitle: string,
 * }>}
 */
export function flattenLessons(modules) {
  return sortByOrder(modules).flatMap((mod) =>
    sortByOrder(mod.lessons).map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      order: lesson.order,
      moduleId: mod.id,
      moduleTitle: mod.title,
    })),
  )
}

/**
 * Resolve previous / next lesson relative to `lessonId`.
 *
 * @param {Parameters<typeof flattenLessons>[0]} modules
 * @param {string | undefined} lessonId
 */
export function getAdjacentLessons(modules, lessonId) {
  const lessons = flattenLessons(modules)
  const index = lessons.findIndex((lesson) => String(lesson.id) === String(lessonId))

  if (index < 0) {
    return { prev: null, next: null, current: null, lessons }
  }

  return {
    prev: lessons[index - 1] ?? null,
    next: lessons[index + 1] ?? null,
    current: lessons[index] ?? null,
    lessons,
  }
}

/**
 * @param {Parameters<typeof flattenLessons>[0]} modules
 * @param {string | undefined} moduleId
 * @returns {string | undefined}
 */
export function findModuleTitle(modules, moduleId) {
  if (!modules?.length || moduleId == null) return undefined
  const match = modules.find((mod) => String(mod.id) === String(moduleId))
  return match?.title
}
