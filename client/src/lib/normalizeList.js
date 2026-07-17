/**
 * Normalize a list API payload into a plain array.
 *
 * Today `GET /api/courses/` returns a bare JSON array.
 * A future DRF paginated response may look like `{ results: [...] }`.
 * Screens and hooks should always receive an array — call this at the API boundary.
 *
 * @param {unknown} data
 * @returns {unknown[]}
 */
export function normalizeList(data) {
  if (Array.isArray(data)) {
    return data
  }

  if (
    data != null &&
    typeof data === 'object' &&
    Array.isArray(/** @type {{ results?: unknown }} */ (data).results)
  ) {
    return /** @type {{ results: unknown[] }} */ (data).results
  }

  return []
}
