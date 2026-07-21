import { useEffect, useRef, useState } from 'react'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LessonSkeleton } from '@/components/feedback/LessonSkeleton'
import { useGenerateLesson } from '@/features/generation/hooks/useGenerateLesson'
import {
  getGenerationErrorMessage,
  getGenerationErrorTitle,
} from '@/features/generation/lib/generationErrors'
import { normalizeApiError } from '@/lib/errors'
import { cn } from '@/lib/utils'

/**
 * Shown when is_enriched === false — auto-starts generation on mount.
 * Displays skeleton while pending; ErrorState + retry on failure.
 *
 * Uses mutateAsync + try/catch (not mutate onError) so failures still
 * surface if the mutation observer disconnects mid-request.
 *
 * @param {{
 *   lessonId: string,
 *   courseId?: string,
 *   title?: string,
 *   className?: string,
 * }} props
 */
export function GenerateLessonPanel({
  lessonId,
  courseId,
  title,
  className,
}) {
  const { mutateAsync } = useGenerateLesson(lessonId, courseId)
  const [generationError, setGenerationError] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const startedForLessonRef = useRef(null)

  async function startGeneration() {
    if (!lessonId) return

    setGenerationError(null)
    setIsGenerating(true)
    try {
      await mutateAsync({})
    } catch (err) {
      startedForLessonRef.current = null
      setGenerationError(normalizeApiError(err))
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    if (!lessonId || startedForLessonRef.current === lessonId) return
    startedForLessonRef.current = lessonId
    void startGeneration()
  }, [lessonId]) // eslint-disable-line react-hooks/exhaustive-deps -- fire once per lesson

  if (generationError) {
    return (
      <div className={cn('flex flex-col gap-6', className)}>
        {title ? (
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
        ) : null}
        <ErrorState
          className="rounded-xl bg-card py-12 ring-1 ring-foreground/10"
          title={getGenerationErrorTitle(generationError, 'lesson')}
          message={getGenerationErrorMessage(generationError, 'lesson')}
          onRetry={startGeneration}
          retryLabel="Try again"
        />
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {title ? (
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
      ) : null}
      <p className="text-sm text-muted-foreground">
        {isGenerating
          ? 'Generating lesson content… this usually takes a few seconds.'
          : 'Preparing to generate lesson content…'}
      </p>
      <LessonSkeleton />
    </div>
  )
}
