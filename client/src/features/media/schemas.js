import { z } from 'zod'

/** One YouTube search result from GET /api/media/youtube/ */
export const youtubeVideoSchema = z.object({
  video_id: z.string(),
  title: z.string(),
  thumbnail: z.string(),
})

export const youtubeSearchResponseSchema = z.array(youtubeVideoSchema)

/** Languages accepted by POST /api/media/tts/ */
export const TTS_LANGUAGES = /** @type {const} */ ([
  { value: 'en', label: 'English' },
  { value: 'hinglish', label: 'Hinglish' },
])

export const ttsRequestSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Text is required')
    .max(4000, 'Text must be at most 4000 characters'),
  language: z.string().trim().max(32).default('en'),
})

