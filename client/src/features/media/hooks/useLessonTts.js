import { useMutation } from '@tanstack/react-query'
import { generateSpeech } from '@/api/media.api'
import { ttsRequestSchema } from '@/features/media/schemas'

/**
 * POST /api/media/tts/ — generate a WAV blob for lesson speech.
 * Call mutate({ text, language }) / mutateAsync(...).
 * retry: 0 — TTS is expensive; UI offers manual retry.
 */
export function useLessonTts() {
  return useMutation({
    mutationFn: async (payload) => {
      const parsed = ttsRequestSchema.parse(payload)
      const blob = await generateSpeech(parsed)
      return {
        blob,
        objectUrl: URL.createObjectURL(blob),
        language: parsed.language,
        text: parsed.text,
      }
    },
    retry: 0,
  })
}
