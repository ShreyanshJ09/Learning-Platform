import { useEffect, useId, useRef, useState } from 'react'
import { MoreHorizontal, RefreshCw } from 'lucide-react'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LessonSkeleton } from '@/components/feedback/LessonSkeleton'
import { Button } from '@/components/ui/button'
import { RegenerateLessonDialog } from '@/features/generation/components/RegenerateLessonDialog'
import { useGenerateLesson } from '@/features/generation/hooks/useGenerateLesson'
import {
  getGenerationErrorMessage,
  getGenerationErrorTitle,
} from '@/features/generation/lib/generationErrors'
import { LessonAudioPlayer } from '@/features/media/components/LessonAudioPlayer'
import { LessonRenderer } from '@/features/lessons/components/LessonRenderer'
import { ObjectivesList } from '@/features/lessons/components/ObjectivesList'
import { normalizeApiError } from '@/lib/errors'
import { cn } from '@/lib/utils'

/**
 * Enriched lesson body: content + overflow regenerate (Phase 6.6).
 *
 * @param {{
 *   lesson: {
 *     title: string,
 *     objectives?: string[],
 *     content?: unknown,
 *   },
 *   lessonId: string,
 *   courseId?: string,
 *   className?: string,
 * }} props
 */
export function EnrichedLessonView({
  lesson,
  lessonId,
  courseId,
  className,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [regenerateError, setRegenerateError] = useState(null)
  const menuRef = useRef(null)
  const menuId = useId()

  const { mutate, isPending } = useGenerateLesson(lessonId, courseId)

  useEffect(() => {
    if (!menuOpen) return undefined

    function onPointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  function handleRegenerate() {
    setRegenerateError(null)
    mutate(
      { regenerate: true },
      {
        onError: (err) => setRegenerateError(normalizeApiError(err)),
      },
    )
  }

  function openRegenerateDialog() {
    setMenuOpen(false)
    setDialogOpen(true)
  }

  return (
    <article className={cn('flex flex-col gap-6', className)}>
      <header className="flex items-start justify-between gap-4">
        <h1 className="min-w-0 font-heading text-2xl font-semibold tracking-tight text-foreground">
          {lesson.title}
        </h1>

        <div ref={menuRef} className="relative shrink-0">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label="Lesson actions"
            disabled={isPending}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MoreHorizontal className="size-4" aria-hidden />
          </Button>

          {menuOpen ? (
            <div
              id={menuId}
              role="menu"
              className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md"
            >
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                onClick={openRegenerateDialog}
              >
                <RefreshCw className="size-4" aria-hidden />
                Regenerate
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {isPending ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Regenerating lesson content… this usually takes a few seconds.
          </p>
          <LessonSkeleton />
        </div>
      ) : regenerateError ? (
        <ErrorState
          className="rounded-xl bg-card py-12 ring-1 ring-foreground/10"
          title={getGenerationErrorTitle(regenerateError, 'lesson')}
          message={getGenerationErrorMessage(regenerateError, 'lesson')}
          onRetry={handleRegenerate}
          retryLabel="Try again"
        />
      ) : (
        <>
          <LessonAudioPlayer lesson={lesson} />
          <ObjectivesList objectives={lesson.objectives} />
          <LessonRenderer content={lesson.content} />
        </>
      )}

      <RegenerateLessonDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleRegenerate}
      />
    </article>
  )
}
