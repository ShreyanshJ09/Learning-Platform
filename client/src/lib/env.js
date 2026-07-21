import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z
    .string()
    .min(1, 'VITE_API_URL is required')
    .url('VITE_API_URL must be a valid URL'),
  VITE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  /** Set to "false" to keep VideoBlock on the placeholder UI. */
  VITE_ENABLE_YOUTUBE: z
    .enum(['true', 'false'])
    .optional()
    .default('true'),
})

const parsed = envSchema.safeParse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_ENV: import.meta.env.VITE_ENV ?? 'development',
  VITE_ENABLE_YOUTUBE: import.meta.env.VITE_ENABLE_YOUTUBE ?? 'true',
})

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('\n')
  throw new Error(`Invalid environment configuration:\n${details}`)
}

/** @type {{ VITE_API_URL: string, VITE_ENV: 'development' | 'production' | 'test', VITE_ENABLE_YOUTUBE: 'true' | 'false' }} */
export const env = parsed.data

/** When false, VideoBlock shows the legacy placeholder instead of calling the API. */
export const youtubeEnabled = env.VITE_ENABLE_YOUTUBE === 'true'
