const REFRESH_KEY = 'ttl_refresh_token'

/** Short-lived access token — memory only (lost on full page reload). */
let accessToken = null

export function getAccess() {
  return accessToken
}

export function setAccess(token) {
  accessToken = token ?? null
}

export function getRefresh() {
  return localStorage.getItem(REFRESH_KEY)
}

export function setRefresh(token) {
  if (token) {
    localStorage.setItem(REFRESH_KEY, token)
  } else {
    localStorage.removeItem(REFRESH_KEY)
  }
}

/** Clear both tokens (logout / failed refresh). */
export function clear() {
  accessToken = null
  localStorage.removeItem(REFRESH_KEY)
}
