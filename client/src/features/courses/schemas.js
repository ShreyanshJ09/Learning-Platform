import { z } from 'zod'

/**
 * Edit-course form schema (PATCH /api/courses/{id}/).
 * Tags are edited as a comma-separated string, then parsed to string[].
 */
export const editCourseSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .transform((value) => value.trim())
    .refine((value) => value.length > 0, 'Title is required'),
  description: z
    .string()
    .transform((value) => value.trim()),
  tags: z
    .string()
    .transform((value) =>
      value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  is_public: z.boolean(),
})
