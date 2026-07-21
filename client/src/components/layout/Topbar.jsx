import { Menu, Monitor, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/layout/UserMenu'
import { cycleTheme } from '@/lib/theme'
import { useTheme } from '@/providers/ThemeProvider'

const THEME_LABELS = {
  light: 'light mode',
  dark: 'dark mode',
  system: 'system theme',
}

/**
 * Top chrome: mobile sidebar trigger, theme toggle, user menu.
 *
 * @param {{ showMenu?: boolean, onMenuClick?: () => void }} props
 */
export function Topbar({ showMenu = true, onMenuClick }) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const nextTheme = cycleTheme(theme)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 bg-background px-4">
      <div className="flex items-center gap-2">
        {showMenu ? (
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
        ) : null}
        <p className="hidden text-sm text-muted-foreground sm:block lg:hidden">
          Learn with AI
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Theme: ${THEME_LABELS[theme]}. Switch to ${THEME_LABELS[nextTheme]}.`}
          onClick={() => setTheme(nextTheme)}
        >
          {theme === 'system' ? (
            <Monitor className="size-4" />
          ) : resolvedTheme === 'dark' ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>
        <UserMenu />
      </div>
    </header>
  )
}
