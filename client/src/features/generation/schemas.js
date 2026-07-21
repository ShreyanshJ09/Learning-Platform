import { z } from 'zod'

/** Shared copy for empty/invalid topic — matches FRONTEND_PLAN §12.3 (400). */
const TOPIC_REQUIRED = 'Please enter a topic (up to 500 characters).'

/**
 * Create-course form schema (POST /api/generate/course/).
 * Mirrors backend GenerateCourseSerializer: trimmed, non-empty, max 500 chars.
 */
export const generateCourseSchema = z.object({
  topic: z
    .string()
    .min(1, TOPIC_REQUIRED)
    .max(500, TOPIC_REQUIRED)
    .transform((value) => value.trim())
    .refine((value) => value.length > 0, TOPIC_REQUIRED),
})

/**
 * Lesson generation request body (POST /api/generate/lesson/{id}/).
 * Used when confirming regenerate in a later step.
 */
export const generateLessonSchema = z.object({
  regenerate: z.boolean().optional().default(false),
})
