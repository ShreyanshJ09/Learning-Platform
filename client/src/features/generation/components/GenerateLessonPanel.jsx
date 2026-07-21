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
  const { mutate, isPending } = useGenerateLesson(lessonId, courseId)
  const [generationError, setGenerationError] = useState(null)
  const startedForLessonRef = useRef(null)

  function startGeneration() {
    if (!lessonId) return

    setGenerationError(null)
    mutate(undefined, {
      onError: (err) => {
        startedForLessonRef.current = null
        setGenerationError(normalizeApiError(err))
      },
    })
  }

  useEffect(() => {
    if (!lessonId || startedForLessonRef.current === lessonId) return
    startedForLessonRef.current = lessonId
    startGeneration()
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
        {isPending
          ? 'Generating lesson content… this usually takes a few seconds.'
          : 'Preparing to generate lesson content…'}
      </p>
      <LessonSkeleton />
    </div>
  )
}
