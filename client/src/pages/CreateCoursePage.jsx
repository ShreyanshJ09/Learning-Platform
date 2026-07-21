import { PageHeader } from '@/components/common/PageHeader'
import { GenerateCourseForm } from '@/features/generation/components/GenerateCourseForm'

/**
 * Create course — topic prompt → AI generation → navigate to syllabus.
 */
export function CreateCoursePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Create course"
        description="Enter a topic and we'll build a structured syllabus with AI."
      />
      <GenerateCourseForm className="mx-auto w-full max-w-xl" />
    </div>
  )
}
