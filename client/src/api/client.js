import axios from 'axios'
import { env } from '@/lib/env'

/**
 * Shared Axios instance for Django API calls.
 * JWT attach + refresh interceptors are added in Phase 2 (Authentication).
 */
export const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
