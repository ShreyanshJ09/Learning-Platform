import { createContext, useContext, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  loginRequest,
  logoutRequest,
  meRequest,
  refreshRequest,
  registerRequest,
} from '@/api/auth.api'
import { queryKeys } from '@/api/queryKeys'
import {
  clear,
  getRefresh,
  setAccess,
  setRefresh,
} from '@/lib/tokenStorage'

const AuthContext = createContext(null)

/**
 * Owns the auth session:
 * - status: 'loading' | 'authenticated' | 'unauthenticated'
 * - silent refresh on boot if a refresh token exists
 * - login / register / logout helpers
 */
export function AuthProvider({ children }) {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState('loading')
  const [user, setUser] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function boot() {
      const refresh = getRefresh()

      // No saved session → show public routes
      if (!refresh) {
        if (!cancelled) {
          setUser(null)
          setStatus('unauthenticated')
        }
        return
      }

      try {
        // Silent refresh (access was lost on page reload)
        const tokens = await refreshRequest(refresh)
        setAccess(tokens.access)
        setRefresh(tokens.refresh)

        const me = await meRequest()
        if (cancelled) return

        queryClient.setQueryData(queryKeys.auth.me, me)
        setUser(me)
        setStatus('authenticated')
      } catch {
        clear()
        queryClient.removeQueries({ queryKey: queryKeys.auth.me })
        if (!cancelled) {
          setUser(null)
          setStatus('unauthenticated')
        }
      }
    }

    boot()
    return () => {
      cancelled = true
    }
  }, [queryClient])

  async function login(credentials) {
    const data = await loginRequest(credentials)
    setAccess(data.access)
    setRefresh(data.refresh)
    queryClient.setQueryData(queryKeys.auth.me, data.user)
    setUser(data.user)
    setStatus('authenticated')
    return data
  }

  async function register(payload) {
    const data = await registerRequest(payload)
    setAccess(data.access)
    setRefresh(data.refresh)
    queryClient.setQueryData(queryKeys.auth.me, data.user)
    setUser(data.user)
    setStatus('authenticated')
    return data
  }

  async function logout() {
    const refresh = getRefresh()
    try {
      if (refresh) {
        await logoutRequest(refresh)
      }
    } catch {
      // Server may reject an already-invalid token — still clear locally
    } finally {
      clear()
      queryClient.clear()
      setUser(null)
      setStatus('unauthenticated')
    }
  }

  const value = {
    status,
    user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
