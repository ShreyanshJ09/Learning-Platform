/** @typedef {'light' | 'dark' | 'system'} ThemeSetting */

export const THEME_STORAGE_KEY = 'ttl-theme'

/** @type {ThemeSetting[]} */
export const THEME_OPTIONS = ['light', 'dark', 'system']

/**
 * @returns {'light' | 'dark'}
 */
export function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/**
 * @param {ThemeSetting | string | null | undefined} theme
 * @returns {'light' | 'dark'}
 */
export function resolveTheme(theme) {
  return theme === 'system' || !theme ? getSystemTheme() : theme
}

/**
 * Apply the resolved theme class + color-scheme on `<html>`.
 *
 * @param {ThemeSetting | string} theme
 * @returns {'light' | 'dark'}
 */
export function applyTheme(theme) {
  const resolved = resolveTheme(theme)

  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', resolved === 'dark')
    document.documentElement.style.colorScheme = resolved
  }

  return resolved
}

/**
 * @param {ThemeSetting} [defaultTheme='system']
 * @returns {ThemeSetting}
 */
export function getStoredTheme(defaultTheme = 'system') {
  if (typeof window === 'undefined') return defaultTheme

  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }

  return defaultTheme
}

/**
 * @param {ThemeSetting} current
 * @returns {ThemeSetting}
 */
export function cycleTheme(current) {
  const index = THEME_OPTIONS.indexOf(current)
  const next = index === -1 ? 0 : (index + 1) % THEME_OPTIONS.length
  return THEME_OPTIONS[next]
}
