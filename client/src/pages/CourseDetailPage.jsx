import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { buttonVariants } from '@/components/ui/button'
import { paths } from '@/routes/paths'

/**
 * Placeholder until Phase 4 (syllabus / detail).
 * Keeps CourseCard links inside the authenticated shell.
 */
export function CourseDetailPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Course"
        description="Course detail and syllabus arrive in Phase 4."
      />
      <Link to={paths.dashboard} className={buttonVariants({ variant: 'outline' })}>
        Back to dashboard
      </Link>
    </div>
  )
}
