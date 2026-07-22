import { useEffect, useMemo, useRef, useState } from 'react'
import { Download, Loader2, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useLessonTts } from '@/features/media/hooks/useLessonTts'
import { buildLessonSpeechText } from '@/features/media/lib/lessonSpeechText'
import { TTS_LANGUAGES } from '@/features/media/schemas'
import { normalizeApiError } from '@/lib/errors'
import { cn } from '@/lib/utils'

/**
 * Language toggle + listen / download for lesson TTS (POST /api/media/tts/).
 *
 * @param {{
 *   lesson: {
 *     title?: string,
 *     objectives?: string[],
 *     content?: unknown,
 *   },
 *   className?: string,
 * }} props
 */
export function LessonAudioPlayer({ lesson, className }) {
  const [language, setLanguage] = useState('en')
  const [audioUrl, setAudioUrl] = useState(null)
  const [error, setError] = useState(null)
  const audioRef = useRef(null)
  const objectUrlRef = useRef(null)

  const { mutate, isPending } = useLessonTts()

  const speechText = useMemo(() => buildLessonSpeechText(lesson), [lesson])
  const canSpeak = speechText.length > 0

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
    }
  }, [])

  // Changing lesson or language clears the previous clip.
  useEffect(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setAudioUrl(null)
    setError(null)
  }, [speechText, language])

  useEffect(() => {
    if (!audioUrl || !audioRef.current) return
    audioRef.current.load()
    audioRef.current.play().catch(() => {
      // Autoplay may be blocked — controls still work.
    })
  }, [audioUrl])

  function handleGenerate() {
    if (!canSpeak || isPending) return

    setError(null)
    mutate(
      { text: speechText, language },
      {
        onSuccess: (result) => {
          if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current)
          }
          objectUrlRef.current = result.objectUrl
          setAudioUrl(result.objectUrl)
        },
        onError: (err) => {
          setError(normalizeApiError(err))
        },
      },
    )
  }

  function handleDownload() {
    if (!audioUrl) return
    const link = document.createElement('a')
    link.href = audioUrl
    link.download = `lesson-${language}.wav`
    link.click()
  }

  return (
    <section
      aria-label="Lesson audio"
      className={cn(
        'flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">Listen to this lesson</p>
          <p className="text-xs text-muted-foreground">
            Generates spoken audio from the lesson text (up to ~4000 characters).
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <div className="space-y-1">
            <Label htmlFor="lesson-tts-language" className="text-xs">
              Language
            </Label>
            <select
              id="lesson-tts-language"
              value={language}
              disabled={isPending}
              onChange={(event) => setLanguage(event.target.value)}
              className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30"
            >
              {TTS_LANGUAGES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="button"
            size="sm"
            disabled={!canSpeak || isPending}
            onClick={handleGenerate}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Generating…
              </>
            ) : (
              <>
                <Volume2 className="size-4" aria-hidden />
                {audioUrl ? 'Regenerate' : 'Listen'}
              </>
            )}
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!audioUrl || isPending}
            onClick={handleDownload}
          >
            <Download className="size-4" aria-hidden />
            Download
          </Button>
        </div>
      </div>

      {!canSpeak ? (
        <p className="text-sm text-muted-foreground">
          No readable lesson text available for audio yet.
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error.message || 'Could not generate audio.'}
        </p>
      ) : null}

      {audioUrl ? (
        <audio
          ref={audioRef}
          controls
          src={audioUrl}
          className="w-full"
          preload="metadata"
        >
          Your browser does not support audio playback.
        </audio>
      ) : null}
    </section>
  )
}
