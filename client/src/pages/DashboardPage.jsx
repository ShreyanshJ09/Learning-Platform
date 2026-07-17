import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { CourseGridSkeleton } from '@/components/feedback/CourseGridSkeleton'
import { buttonVariants } from '@/components/ui/button'
import { CourseGrid } from '@/features/courses/components/CourseGrid'
import { useCourses } from '@/features/courses/hooks/useCourses'
import { paths } from '@/routes/paths'

/**
 * Authenticated home — list the user's courses (loading / empty / error / success).
 */
export function DashboardPage() {
  const { data: courses, isPending, isError, error, refetch } = useCourses()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Courses"
        description="Courses you've created."
        actions={
          <Link to={paths.createCourse} className={buttonVariants()}>
            Create course
          </Link>
        }
      />

      {isPending ? <CourseGridSkeleton /> : null}

      {!isPending && isError ? (
        <ErrorState
          title="Couldn't load courses"
          message={error?.message ?? 'Please try again.'}
          onRetry={() => refetch()}
        />
      ) : null}

      {!isPending && !isError && courses?.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="size-5" aria-hidden />}
          title="No courses yet"
          description="Create your first course from a topic you want to learn."
          action={
            <Link to={paths.createCourse} className={buttonVariants()}>
              Create your first course
            </Link>
          }
        />
      ) : null}

      {!isPending && !isError && courses?.length > 0 ? (
        <CourseGrid courses={courses} />
      ) : null}
    </div>
  )
}
