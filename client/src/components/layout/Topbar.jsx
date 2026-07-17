import { Menu, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/layout/UserMenu'
import { useTheme } from '@/providers/ThemeProvider'

/**
 * Top chrome: mobile sidebar trigger, theme toggle, user menu.
 */
export function Topbar({ onMenuClick }) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open navigation"
          onClick={onMenuClick}
        >
          <Menu className="size-5" />
        </Button>
        <p className="hidden text-sm text-muted-foreground sm:block lg:hidden">
          Learn with AI
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
        <UserMenu />
      </div>
    </header>
  )
}
