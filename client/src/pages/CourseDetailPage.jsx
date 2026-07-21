import { useParams } from 'react-router-dom'
import { Layers } from 'lucide-react'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { isNotFoundError } from '@/lib/errors'
import { SyllabusSkeleton } from '@/components/feedback/SyllabusSkeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { CourseHeader } from '@/features/courses/components/CourseHeader'
import { SyllabusTree } from '@/features/courses/components/SyllabusTree'
import { useCourse } from '@/features/courses/hooks/useCourse'
import { useCourseModules } from '@/features/courses/hooks/useCourseModules'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { paths } from '@/routes/paths'

/**
 * Course detail — header + syllabus (loading / empty / error / success).
 * Header and modules load independently so one can resolve before the other.
 */
export function CourseDetailPage() {
  const { courseId } = useParams()

  const {
    data: course,
    isPending: coursePending,
    isError: courseError,
    error: courseErr,
    refetch: refetchCourse,
  } = useCourse(courseId)

  const {
    data: modules,
    isPending: modulesPending,
    isError: modulesError,
    error: modulesErr,
    refetch: refetchModules,
  } = useCourseModules(courseId)

  if (courseError && isNotFoundError(courseErr)) {
    return (
      <NotFoundPage
        fullPage={false}
        title="Course not found"
        description="This course doesn't exist or you don't have access to it."
        backTo={paths.dashboard}
        backLabel="Back to dashboard"
      />
    )
  }

  if (!coursePending && courseError) {
    return (
      <ErrorState
        title="Couldn't load course"
        message={courseErr?.message ?? 'Please try again.'}
        onRetry={() => refetchCourse()}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: paths.dashboard },
          { label: course?.title ?? 'Course' },
        ]}
      />

      {coursePending ? <CourseHeaderSkeleton /> : null}
      {!coursePending && course ? <CourseHeader course={course} /> : null}

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-medium tracking-tight text-foreground">
          Syllabus
        </h2>

        {modulesPending ? <SyllabusSkeleton /> : null}

        {!modulesPending && modulesError ? (
          <ErrorState
            title="Couldn't load syllabus"
            message={modulesErr?.message ?? 'Please try again.'}
            onRetry={() => refetchModules()}
          />
        ) : null}

        {!modulesPending && !modulesError && modules?.length === 0 ? (
          <EmptyState
            icon={<Layers className="size-5" aria-hidden />}
            title="No modules yet"
            description="This course doesn't have a syllabus yet."
          />
        ) : null}

        {!modulesPending && !modulesError && modules?.length > 0 ? (
          <SyllabusTree courseId={courseId} modules={modules} />
        ) : null}
      </section>
    </div>
  )
}

function CourseHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <Skeleton className="h-8 w-2/3 max-w-md" />
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-4/5 max-w-lg" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-5 w-14 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  )
}
