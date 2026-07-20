import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useUpdateCourse } from '@/features/courses/hooks/useUpdateCourse'
import { editCourseSchema } from '@/features/courses/schemas'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { normalizeApiError } from '@/lib/errors'
import { cn } from '@/lib/utils'

/**
 * Dialog form to edit course title, description, tags, and visibility.
 *
 * @param {{
 *   course: {
 *     id: string,
 *     title: string,
 *     description?: string,
 *     tags?: string[],
 *     is_public?: boolean,
 *   },
 *   open: boolean,
 *   onOpenChange: (open: boolean) => void,
 * }} props
 */
export function EditCourseDialog({ course, open, onOpenChange }) {
  const { mutateAsync, isPending } = useUpdateCourse(course.id)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: zodResolver(editCourseSchema),
    defaultValues: toFormValues(course),
  })

  useEffect(() => {
    if (open) {
      reset(toFormValues(course))
      clearErrors()
    }
  }, [open, course, reset, clearErrors])

  async function onSubmit(values) {
    clearErrors('root')
    try {
      await mutateAsync({
        title: values.title,
        description: values.description,
        tags: values.tags,
        is_public: values.is_public,
      })
      toast.success('Course updated')
      onOpenChange(false)
    } catch (err) {
      const apiError = normalizeApiError(err)
      const fieldErrors = apiError.fieldErrors

      if (fieldErrors) {
        for (const [key, messages] of Object.entries(fieldErrors)) {
          if (key === 'non_field_errors') continue
          const message = messages?.[0]
          if (message) {
            setError(key, { type: 'server', message })
          }
        }
        const nonField = fieldErrors.non_field_errors?.[0]
        if (nonField) {
          setError('root', { type: 'server', message: nonField })
          return
        }
      }

      setError('root', {
        type: 'server',
        message: apiError.message ?? 'Could not update course.',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit course</DialogTitle>
          <DialogDescription>
            Update the course title, description, tags, and visibility.
          </DialogDescription>
        </DialogHeader>

        <form
          id="edit-course-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {errors.root?.message ? (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {errors.root.message}
            </p>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="edit-course-title">Title</Label>
            <Input
              id="edit-course-title"
              aria-invalid={Boolean(errors.title)}
              disabled={isPending}
              {...register('title')}
            />
            {errors.title?.message ? (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-course-description">Description</Label>
            <textarea
              id="edit-course-description"
              rows={3}
              disabled={isPending}
              aria-invalid={Boolean(errors.description)}
              className={cn(
                'w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm dark:bg-input/30',
              )}
              {...register('description')}
            />
            {errors.description?.message ? (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-course-tags">Tags</Label>
            <Input
              id="edit-course-tags"
              placeholder="python, beginner, algorithms"
              aria-invalid={Boolean(errors.tags)}
              disabled={isPending}
              {...register('tags')}
            />
            <p className="text-xs text-muted-foreground">
              Separate tags with commas.
            </p>
            {errors.tags?.message ? (
              <p className="text-sm text-destructive">{errors.tags.message}</p>
            ) : null}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="size-4 rounded border border-input"
              disabled={isPending}
              {...register('is_public')}
            />
            Make course public
          </label>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-course-form"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              'Save changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function toFormValues(course) {
  return {
    title: course.title ?? '',
    description: course.description ?? '',
    tags: Array.isArray(course.tags) ? course.tags.join(', ') : '',
    is_public: Boolean(course.is_public),
  }
}
