import { PageHeader } from '@/components/common/PageHeader'

/**
 * Placeholder until Phase 6 (AI generate course).
 * Linked from dashboard empty CTA and sidebar so nav smoke tests work.
 */
export function CreateCoursePage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Create course"
        description="Course generation arrives in a later phase. This route is a placeholder."
      />
      <p className="text-sm text-muted-foreground">
        You’ll enter a topic here and generate a structured course with AI.
      </p>
    </div>
  )
}
