import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Container } from '@/components/layout/Container'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { cn } from '@/lib/utils'

/**
 * Authenticated chrome: optional app sidebar + topbar + page outlet.
 * Lesson viewer uses hideSidebar so only the in-lesson syllabus nav shows.
 * Toaster stays in AppProviders (already mounted once).
 *
 * @param {{ hideSidebar?: boolean }} props
 */
export function AppShell({ hideSidebar = false }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!mobileOpen || hideSidebar) return undefined

    function onKeyDown(event) {
      if (event.key === 'Escape') setMobileOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previous
    }
  }, [mobileOpen, hideSidebar])

  return (
    <div className="flex min-h-svh bg-background text-foreground">
      {!hideSidebar ? (
        <>
          {/* Desktop sidebar */}
          <Sidebar className="hidden w-56 shrink-0 lg:flex" />

          {/* Mobile drawer */}
          <div
            className={cn(
              'fixed inset-0 z-40 lg:hidden',
              mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
            )}
            aria-hidden={!mobileOpen}
          >
            <button
              type="button"
              className={cn(
                'absolute inset-0 bg-black/40 transition-opacity',
                mobileOpen ? 'opacity-100' : 'opacity-0',
              )}
              aria-label="Close navigation"
              tabIndex={mobileOpen ? 0 : -1}
              onClick={() => setMobileOpen(false)}
            />
            <Sidebar
              className={cn(
                'absolute inset-y-0 left-0 w-64 shadow-lg transition-transform',
                mobileOpen ? 'translate-x-0' : '-translate-x-full',
              )}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          showMenu={!hideSidebar}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-auto">
          {hideSidebar ? (
            <Outlet />
          ) : (
            <Container>
              <Outlet />
            </Container>
          )}
        </main>
      </div>
    </div>
  )
}
