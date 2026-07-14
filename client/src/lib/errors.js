import axios from 'axios'

/**
 * @typedef {Object} ApiError
 * @property {number | null} status
 * @property {'validation' | 'auth' | 'forbidden' | 'not_found' | 'ai_unavailable' | 'server' | 'network' | 'unknown'} code
 * @property {string} message
 * @property {Record<string, string[]>} [fieldErrors]
 * @property {unknown} [raw]
 */

/**
 * Map HTTP status → a stable error code for the UI.
 * @param {number | null} status
 * @returns {ApiError['code']}
 */
function codeFromStatus(status) {
  if (status == null) return 'network'
  if (status === 400) return 'validation'
  if (status === 401) return 'auth'
  if (status === 403) return 'forbidden'
  if (status === 404) return 'not_found'
  if (status === 503) return 'ai_unavailable'
  if (status >= 500) return 'server'
  return 'unknown'
}

/**
 * DRF may return:
 * - `{ detail: "..." }`
 * - `{ email: ["..."], password: ["..."] }`
 * - `{ non_field_errors: ["..."] }`
 * @param {unknown} data
 * @returns {{ message: string, fieldErrors?: Record<string, string[]> }}
 */
function parseDjangoBody(data) {
  if (data == null) {
    return { message: 'Something went wrong.' }
  }

  if (typeof data === 'string') {
    return { message: data }
  }

  if (typeof data !== 'object') {
    return { message: 'Something went wrong.' }
  }

  /** @type {Record<string, unknown>} */
  const body = data

  if (typeof body.detail === 'string') {
    return { message: body.detail }
  }

  if (Array.isArray(body.detail)) {
    return { message: body.detail.map(String).join(' ') }
  }

  /** @type {Record<string, string[]>} */
  const fieldErrors = {}

  for (const [key, value] of Object.entries(body)) {
    if (Array.isArray(value)) {
      fieldErrors[key] = value.map(String)
    } else if (typeof value === 'string') {
      fieldErrors[key] = [value]
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    const firstKey = Object.keys(fieldErrors)[0]
    const firstMsg = fieldErrors[firstKey]?.[0]
    return {
      message: firstMsg ?? 'Please check the form and try again.',
      fieldErrors,
    }
  }

  return { message: 'Something went wrong.' }
}

/** @type {Set<ApiError['code']>} */
const API_ERROR_CODES = new Set([
  'validation',
  'auth',
  'forbidden',
  'not_found',
  'ai_unavailable',
  'server',
  'network',
  'unknown',
])

/**
 * True when `err` is already our ApiError shape (e.g. re-thrown by apiClient).
 * Must not match AxiosError — Axios also has message/code/status.
 * @param {unknown} err
 * @returns {err is ApiError}
 */
function isApiError(err) {
  if (err == null || typeof err !== 'object' || axios.isAxiosError(err)) {
    return false
  }

  const candidate = /** @type {{ message?: unknown, code?: unknown, status?: unknown }} */ (
    err
  )

  return (
    typeof candidate.message === 'string' &&
    typeof candidate.code === 'string' &&
    API_ERROR_CODES.has(/** @type {ApiError['code']} */ (candidate.code)) &&
    (candidate.status === null || typeof candidate.status === 'number')
  )
}

/**
 * Convert any thrown value (usually an Axios error) into a consistent ApiError.
 * Idempotent: if the interceptor already normalized, return that object as-is.
 * UI and hooks should use this shape — not raw Axios errors.
 *
 * @param {unknown} err
 * @returns {ApiError}
 */
export function normalizeApiError(err) {
  // Axios first — AxiosError also has message/code/status and must be parsed
  if (axios.isAxiosError(err)) {
    const status = err.response?.status ?? null
    const { message, fieldErrors } = parseDjangoBody(err.response?.data)

    if (!err.response) {
      return {
        status: null,
        code: 'network',
        message: 'Network problem. Check your connection and try again.',
        raw: err,
      }
    }

    return {
      status,
      code: codeFromStatus(status),
      message,
      ...(fieldErrors ? { fieldErrors } : {}),
      raw: err,
    }
  }

  // apiClient rejects with normalizeApiError(...) — keep fieldErrors intact
  if (isApiError(err)) {
    return err
  }

  if (err instanceof Error) {
    return {
      status: null,
      code: 'unknown',
      message: err.message || 'Something went wrong.',
      raw: err,
    }
  }

  return {
    status: null,
    code: 'unknown',
    message: 'Something went wrong.',
    raw: err,
  }
}

/** @param {ApiError} error */
export function isAuthError(error) {
  return error.code === 'auth'
}

/** @param {ApiError} error */
export function isValidationError(error) {
  return error.code === 'validation'
}

/** @param {ApiError} error */
export function isNetworkError(error) {
  return error.code === 'network'
}
