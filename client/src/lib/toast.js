import { toast } from 'sonner'
import { normalizeApiError } from '@/lib/errors'

/**
 * Show a user-safe error toast from any mutation failure.
 * Skips validation errors when the caller maps field errors inline.
 *
 * @param {unknown} err
 * @param {string} [fallback='Something went wrong.']
 * @param {{ skipValidation?: boolean }} [options]
 */
export function toastMutationError(
  err,
  fallback = 'Something went wrong.',
  { skipValidation = true } = {},
) {
  const apiError = normalizeApiError(err)

  if (skipValidation && apiError.code === 'validation') {
    return
  }

  toast.error(apiError.message || fallback)
}
