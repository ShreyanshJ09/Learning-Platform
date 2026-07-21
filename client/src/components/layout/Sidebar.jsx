import { NavLink } from 'react-router-dom'
import { BookOpen, LayoutDashboard, PlusCircle, User } from 'lucide-react'
import { paths } from '@/routes/paths'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: paths.dashboard, label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: paths.createCourse, label: 'Create course', icon: PlusCircle },
  { to: paths.profile, label: 'Profile', icon: User },
]

/**
 * Primary app nav. Used in the desktop sidebar and mobile drawer.
 */
export function Sidebar({ className, onNavigate }) {
  return (
    <aside
      className={cn(
        'flex min-h-svh flex-col border-r border-border bg-background text-foreground',
        className,
      )}
    >
      <div className="flex h-14 items-center gap-2 px-4">
        <BookOpen className="size-5 shrink-0 text-sidebar-primary" aria-hidden />
        <span className="font-heading text-sm font-semibold tracking-tight">
          Learn with AI
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
              )
            }
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
