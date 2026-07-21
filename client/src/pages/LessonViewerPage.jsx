import { useParams } from 'react-router-dom'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LessonSkeleton } from '@/components/feedback/LessonSkeleton'
import { isNotFoundError } from '@/lib/errors'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { useCourse } from '@/features/courses/hooks/useCourse'
import { useCourseModules } from '@/features/courses/hooks/useCourseModules'
import { GenerateLessonPanel } from '@/features/generation/components/GenerateLessonPanel'
import { EnrichedLessonView } from '@/features/generation/components/EnrichedLessonView'
import { LessonPrevNext } from '@/features/lessons/components/LessonPrevNext'
import { LessonSidebar } from '@/features/lessons/components/LessonSidebar'
import { useLesson } from '@/features/lessons/hooks/useLesson'
import {
  findModuleTitle,
  getAdjacentLessons,
} from '@/features/lessons/lib/lessonNavigation'
import { paths } from '@/routes/paths'

/**
 * Lesson viewer — flush-left syllabus rail + content column with prev/next.
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

  if (lessonError && isNotFoundError(lessonErr)) {
    return (
      <div className="px-4 py-6 sm:px-6">
        <NotFoundPage
          fullPage={false}
          title="Lesson not found"
          description="This lesson doesn't exist or you don't have access to it."
          backTo={courseId ? paths.course(courseId) : paths.dashboard}
          backLabel={courseId ? 'Back to course' : 'Back to dashboard'}
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
          <GenerateLessonPanel
            lessonId={lessonId}
            courseId={courseId}
            title={lesson.title}
          />
        ) : (
          <EnrichedLessonView
            lesson={lesson}
            lessonId={lessonId}
            courseId={courseId}
          />
        )}

        {!lessonPending && courseId ? (
          <LessonPrevNext courseId={courseId} prev={prev} next={next} />
        ) : null}
      </div>
    </div>
  )
}
