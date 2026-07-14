import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email')
    .transform((value) => value.trim().toLowerCase()),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email')
    .transform((value) => value.trim().toLowerCase()),
  username: z
    .string()
    .min(1, 'Username is required')
    .transform((value) => value.trim()),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
})
