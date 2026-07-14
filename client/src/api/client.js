import axios from 'axios'
import { env } from '@/lib/env'
import { normalizeApiError } from '@/lib/errors'
import {
  clear,
  getAccess,
  getRefresh,
  setAccess,
  setRefresh,
} from '@/lib/tokenStorage'

/**
 * Shared Axios instance for Django API calls.
 * - Request: attach Bearer access token (when present)
 * - Response: on 401, refresh once (single-flight), retry; else normalize error
 */
export const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/** URLs that must stay anonymous (no Bearer, no refresh-on-401 loop). */
const AUTH_URLS = [
  '/api/auth/register/',
  '/api/auth/login/',
  '/api/auth/token/refresh/',
]

function isAuthUrl(url = '') {
  return AUTH_URLS.some((path) => url.includes(path))
}

/** Shared in-flight refresh so parallel 401s don't rotate/blacklist each other. */
let refreshPromise = null

/**
 * Call refresh with plain axios (not apiClient) to avoid interceptor recursion
 * and circular imports with auth.api.js.
 */
async function refreshTokens() {
  const refresh = getRefresh()
  if (!refresh) {
    throw new Error('No refresh token')
  }

  const { data } = await axios.post(
    `${env.VITE_API_URL}/api/auth/token/refresh/`,
    { refresh },
    { headers: { 'Content-Type': 'application/json' } },
  )

  setAccess(data.access)
  if (data.refresh) {
    setRefresh(data.refresh)
  }
  return data.access
}

function refreshAccessSingleFlight() {
  if (!refreshPromise) {
    refreshPromise = refreshTokens().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

apiClient.interceptors.request.use((config) => {
  if (isAuthUrl(config.url)) {
    return config
  }

  const access = getAccess()
  if (access) {
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const status = error.response?.status
    const url = originalRequest?.url ?? ''

    const shouldTryRefresh =
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthUrl(url)

    if (shouldTryRefresh) {
      originalRequest._retry = true

      try {
        const access = await refreshAccessSingleFlight()
        originalRequest.headers.Authorization = `Bearer ${access}`
        return apiClient(originalRequest)
      } catch {
        clear()
        return Promise.reject(
          normalizeApiError(
            error.response
              ? error
              : new Error('Session expired. Please sign in again.'),
          ),
        )
      }
    }

    return Promise.reject(normalizeApiError(error))
  },
)
