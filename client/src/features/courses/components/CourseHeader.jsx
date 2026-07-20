import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { EditCourseDialog } from '@/features/courses/components/EditCourseDialog'
import { useDeleteCourse } from '@/features/courses/hooks/useDeleteCourse'
import { cn } from '@/lib/utils'

/**
 * Course detail header: title, description, tags, edit + delete actions.
 *
 * @param {{
 *   course: {
 *     id: string,
 *     title: string,
 *     description?: string,
 *     tags?: string[],
 *     is_public?: boolean,
 *   },
 *   className?: string,
 * }} props
 */
export function CourseHeader({ course, className }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { mutateAsync: deleteCourseAsync, isPending: isDeleting } =
    useDeleteCourse()

  const tags = Array.isArray(course.tags) ? course.tags : []

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            {course.title}
          </h1>
          {course.description ? (
            <p className="max-w-2xl text-sm text-muted-foreground">
              {course.description}
            </p>
          ) : null}
          {tags.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="size-4" aria-hidden />
            Edit
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" aria-hidden />
            Delete
          </Button>
        </div>
      </div>

      <EditCourseDialog
        course={course}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete course?"
        description="This will permanently delete the course and all its lessons. This action cannot be undone."
        confirmLabel="Delete course"
        isPending={isDeleting}
        onConfirm={() => deleteCourseAsync(course.id)}
      />
    </div>
  )
}
