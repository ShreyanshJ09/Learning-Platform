import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Sparkles } from 'lucide-react'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { GenerationProgress } from '@/features/generation/components/GenerationProgress'
import { useGenerateCourse } from '@/features/generation/hooks/useGenerateCourse'
import {
  getGenerationErrorMessage,
  getGenerationErrorTitle,
} from '@/features/generation/lib/generationErrors'
import { generateCourseSchema } from '@/features/generation/schemas'
import { normalizeApiError } from '@/lib/errors'
import { cn } from '@/lib/utils'

const EXAMPLE_TOPICS = [
  'Intro to React Hooks',
  'Basics of Copyright Law',
  'Python for data analysis',
]

const TOPIC_FIELD_ERROR = 'Please enter a topic (up to 500 characters).'

/**
 * Topic form for AI course generation — idle, generating, field error, retryable error.
 *
 * @param {{ className?: string }} props
 */
export function GenerateCourseForm({ className }) {
  const { mutateAsync, isPending } = useGenerateCourse()
  const [retryableError, setRetryableError] = useState(null)

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: zodResolver(generateCourseSchema),
    defaultValues: { topic: '' },
  })

  const topic = watch('topic') ?? ''
  const charCount = topic.length
  const trimmedTopic = topic.trim()
  const canSubmit =
    trimmedTopic.length > 0 && trimmedTopic.length <= 500 && !isPending

  async function onSubmit(values) {
    setRetryableError(null)
    clearErrors('topic')

    try {
      await mutateAsync(values.topic)
    } catch (err) {
      const apiError = normalizeApiError(err)

      if (apiError.code === 'validation' || apiError.status === 400) {
        const message =
          apiError.fieldErrors?.topic?.[0] ??
          apiError.message ??
          TOPIC_FIELD_ERROR
        setError('topic', { type: 'server', message })
        return
      }

      setRetryableError({
        title: getGenerationErrorTitle(apiError),
        message: getGenerationErrorMessage(apiError),
      })
    }
  }

  function handleRetry() {
    setRetryableError(null)
    handleSubmit(onSubmit)()
  }

  function handleExampleClick(example) {
    setValue('topic', example, { shouldDirty: true, shouldValidate: true })
    clearErrors('topic')
    setRetryableError(null)
  }

  if (isPending) {
    return <GenerationProgress className={className} />
  }

  if (retryableError) {
    return (
      <ErrorState
        className={cn('rounded-xl bg-card py-12 ring-1 ring-foreground/10', className)}
        title={retryableError.title}
        message={retryableError.message}
        onRetry={handleRetry}
        retryLabel="Try again"
      />
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        'flex flex-col gap-6 rounded-xl bg-card p-6 ring-1 ring-foreground/10',
        className,
      )}
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="course-topic">What do you want to learn?</Label>
        <textarea
          id="course-topic"
          rows={4}
          placeholder="e.g. Intro to machine learning for beginners"
          aria-invalid={Boolean(errors.topic)}
          disabled={isPending}
          className={cn(
            'w-full min-h-[7rem] resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80',
            errors.topic &&
              'border-destructive ring-3 ring-destructive/20 dark:border-destructive/50 dark:ring-destructive/40',
          )}
          {...register('topic')}
        />
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {errors.topic?.message ? (
              <span className="text-destructive">{errors.topic.message}</span>
            ) : (
              'Describe a topic and we’ll build modules and lessons for you.'
            )}
          </span>
          <span
            className={cn(
              'shrink-0 tabular-nums',
              charCount > 500 && 'text-destructive',
            )}
            aria-live="polite"
          >
            {charCount}/500
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Try an example
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_TOPICS.map((example) => (
            <Button
              key={example}
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => handleExampleClick(example)}
            >
              {example}
            </Button>
          ))}
        </div>
      </div>

      <Button type="submit" size="lg" disabled={!canSubmit} className="w-full sm:w-auto">
        {isPending ? (
          <>
            <Loader2 className="animate-spin" data-icon="inline-start" />
            Generating…
          </>
        ) : (
          <>
            <Sparkles data-icon="inline-start" aria-hidden />
            Generate course
          </>
        )}
      </Button>
    </form>
  )
}
