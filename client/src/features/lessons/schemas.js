import { z } from 'zod'

/**
 * Runtime contract for lesson `content[]` blocks (backend parser.py).
 * Known types are strict; unknown future types pass through via looseBlockSchema
 * so UnknownBlock can render them instead of failing the whole lesson.
 */

export const headingBlockSchema = z.object({
  type: z.literal('heading'),
  text: z.string(),
})

export const paragraphBlockSchema = z.object({
  type: z.literal('paragraph'),
  text: z.string(),
})

export const codeBlockSchema = z.object({
  type: z.literal('code'),
  language: z.string(),
  text: z.string(),
})

export const videoBlockSchema = z.object({
  type: z.literal('video'),
  query: z.string(),
})

export const mcqBlockSchema = z.object({
  type: z.literal('mcq'),
  question: z.string(),
  options: z.array(z.string()),
  /** 0-based index into options */
  answer: z.number().int(),
  explanation: z.string(),
})

/** Strict union of backend-supported block types. */
export const contentBlockSchema = z.discriminatedUnion('type', [
  headingBlockSchema,
  paragraphBlockSchema,
  codeBlockSchema,
  videoBlockSchema,
  mcqBlockSchema,
])

/**
 * Forward-compat: any object with a `type` string keeps extra fields.
 * Used when a block isn't a known variant (or is known but malformed).
 */
export const looseBlockSchema = z.object({ type: z.string() }).passthrough()

/**
 * Full lesson content array. Tries the strict union first, then loose.
 * @example
 * lessonContentSchema.safeParse(lesson.content)
 */
export const lessonContentSchema = z.array(
  z.union([contentBlockSchema, looseBlockSchema]),
)
