import { apiClient } from '@/api/client'

/**
 * Frontend helpers that call the EXISTING Django auth API.
 * We are NOT creating backend endpoints — only thin wrappers around them.
 *
 * Backend lives at: POST/GET /api/auth/...
 */

const AUTH = {
  register: '/api/auth/register/',
  login: '/api/auth/login/',
  refresh: '/api/auth/token/refresh/',
  logout: '/api/auth/logout/',
  me: '/api/auth/me/',
}

/**
 * Create account.
 * @param {{ email: string, username: string, password: string }} payload
 * @returns {Promise<{ user: object, access: string, refresh: string }>}
 */
export async function registerRequest(payload) {
  const { data } = await apiClient.post(AUTH.register, payload)
  return data
}

/**
 * Log in with email + password.
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<{ user: object, access: string, refresh: string }>}
 */
export async function loginRequest(payload) {
  const { data } = await apiClient.post(AUTH.login, payload)
  return data
}

/**
 * Exchange refresh token for a new access (+ rotated refresh).
 * Used by AuthProvider boot + Axios interceptor — not a React hook.
 * @param {string} refresh
 * @returns {Promise<{ access: string, refresh: string }>}
 */
export async function refreshRequest(refresh) {
  const { data } = await apiClient.post(AUTH.refresh, { refresh })
  return data
}

/**
 * Blacklist refresh token on the server.
 * @param {string} refresh
 * @returns {Promise<void>}
 */
export async function logoutRequest(refresh) {
  await apiClient.post(AUTH.logout, { refresh })
}

/**
 * Current logged-in user (needs access token — wired in Part 5 interceptors).
 * @returns {Promise<object>}
 */
export async function meRequest() {
  const { data } = await apiClient.get(AUTH.me)
  return data
}
