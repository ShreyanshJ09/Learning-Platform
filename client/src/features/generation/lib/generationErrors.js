/**
 * User-facing copy for AI generation failures (course + lesson).
 * Matches FRONTEND_PLAN §12.3.
 *
 * @param {import('@/lib/errors').ApiError} apiError
 * @param {'course' | 'lesson'} [context]
 * @returns {string}
 */
export function getGenerationErrorMessage(apiError, context = 'course') {
  if (apiError.code === 'network') {
    return 'Network problem — check your connection and retry.'
  }

  if (apiError.status === 503 || apiError.code === 'ai_unavailable') {
    return 'Our AI service is temporarily unavailable. Please try again shortly.'
  }

  if (apiError.status === 502) {
    return context === 'lesson'
      ? "We couldn't generate this lesson. Please try again."
      : "We couldn't build a course for that topic. Try rephrasing and generate again."
  }

  if (apiError.code === 'server') {
    return "We couldn't generate content right now. Please try again."
  }

  return apiError.message ?? 'Something went wrong.'
}

/**
 * @param {import('@/lib/errors').ApiError} apiError
 * @param {'course' | 'lesson'} [context]
 * @returns {string}
 */
export function getGenerationErrorTitle(apiError, context = 'course') {
  if (apiError.code === 'network') {
    return 'Connection problem'
  }

  if (apiError.status === 503 || apiError.code === 'ai_unavailable') {
    return 'AI service unavailable'
  }

  return context === 'lesson'
    ? "Couldn't generate lesson"
    : "Couldn't generate course"
}
