import { Link, useParams } from 'react-router-dom'
import { BookOpen, Sparkles } from 'lucide-react'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LessonSkeleton } from '@/components/feedback/LessonSkeleton'
import { buttonVariants } from '@/components/ui/button'
import { useCourse } from '@/features/courses/hooks/useCourse'
import { useCourseModules } from '@/features/courses/hooks/useCourseModules'
import { LessonPrevNext } from '@/features/lessons/components/LessonPrevNext'
import { LessonRenderer } from '@/features/lessons/components/LessonRenderer'
import { LessonSidebar } from '@/features/lessons/components/LessonSidebar'
import { ObjectivesList } from '@/features/lessons/components/ObjectivesList'
import { useLesson } from '@/features/lessons/hooks/useLesson'
import {
  findModuleTitle,
  getAdjacentLessons,
} from '@/features/lessons/lib/lessonNavigation'
import { paths } from '@/routes/paths'

/**
 * Lesson viewer — flush-left syllabus rail + content column with prev/next.
 * Generate / regenerate UI arrives in Phase 6; not-enriched shows a static message.
 */
export function LessonViewerPage() {
  const { courseId, lessonId } = useParams()

  const {
    data: lesson,
    isPending: lessonPending,
    isError: lessonError,
    error: lessonErr,
    refetch: refetchLesson,
  } = useLesson(lessonId)

  const { data: course } = useCourse(courseId)
  const { data: modules } = useCourseModules(courseId)

  const { prev, next } = getAdjacentLessons(modules, lessonId)

  const isNotFound =
    lessonError &&
    (lessonErr?.code === 'not_found' || lessonErr?.status === 404)

  if (isNotFound) {
    return (
      <div className="px-4 py-6 sm:px-6">
        <EmptyState
          icon={<BookOpen className="size-5" aria-hidden />}
          title="Lesson not found"
          description="This lesson doesn't exist or you don't have access to it."
          action={
            <Link
              to={courseId ? paths.course(courseId) : paths.dashboard}
              className={buttonVariants({ variant: 'outline' })}
            >
              {courseId ? 'Back to course' : 'Back to dashboard'}
            </Link>
          }
        />
      </div>
    )
  }

  if (!lessonPending && lessonError) {
    return (
      <div className="px-4 py-6 sm:px-6">
        <ErrorState
          title="Couldn't load lesson"
          message={lessonErr?.message ?? 'Please try again.'}
          onRetry={() => refetchLesson()}
        />
      </div>
    )
  }

  const breadcrumbCourse = {
    label: course?.title ?? 'Course',
    to: courseId ? paths.course(courseId) : undefined,
  }

  const moduleTitle = lesson
    ? findModuleTitle(modules, lesson.module)
    : undefined

  const breadcrumbItems = lessonPending
    ? [
        { label: 'Dashboard', to: paths.dashboard },
        breadcrumbCourse,
        { label: 'Lesson' },
      ]
    : [
        { label: 'Dashboard', to: paths.dashboard },
        breadcrumbCourse,
        ...(moduleTitle ? [{ label: moduleTitle }] : []),
        { label: lesson?.title ?? 'Lesson' },
      ]

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] flex-col lg:flex-row">
      {courseId && modules?.length ? (
        <LessonSidebar
          courseId={courseId}
          lessonId={lessonId}
          modules={modules}
          className="px-4 pt-4 sm:px-6 lg:sticky lg:top-0 lg:h-[calc(100svh-3.5rem)] lg:self-start lg:overflow-y-auto lg:px-0 lg:pt-0"
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:pr-10">
        <Breadcrumbs items={breadcrumbItems} />

        {lessonPending ? (
          <LessonSkeleton />
        ) : !lesson.is_enriched ? (
          <NotEnrichedState title={lesson.title} courseId={courseId} />
        ) : (
          <article className="flex flex-col gap-6">
            <header className="space-y-1">
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                {lesson.title}
              </h1>
            </header>

            <ObjectivesList objectives={lesson.objectives} />
            <LessonRenderer content={lesson.content} />
          </article>
        )}

        {!lessonPending && courseId ? (
          <LessonPrevNext courseId={courseId} prev={prev} next={next} />
        ) : null}
      </div>
    </div>
  )
}

/**
 * Phase 5 placeholder — Phase 6 replaces this with GenerateLessonPanel.
 *
 * @param {{ title?: string, courseId?: string }} props
 */
function NotEnrichedState({ title, courseId }) {
  return (
    <div className="flex flex-col gap-6">
      {title ? (
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
      ) : null}
      <EmptyState
        icon={<Sparkles className="size-5" aria-hidden />}
        title="This lesson hasn't been generated yet"
        description="AI lesson generation arrives in a later phase. You can go back to the syllabus for now."
        action={
          courseId ? (
            <Link
              to={paths.course(courseId)}
              className={buttonVariants({ variant: 'outline' })}
            >
              Back to syllabus
            </Link>
          ) : null
        }
      />
    </div>
  )
}
