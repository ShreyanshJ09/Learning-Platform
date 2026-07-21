import { RootErrorBoundary } from '@/components/error/RootErrorBoundary'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/providers/AuthProvider'
import { QueryProvider } from '@/providers/QueryProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <RootErrorBoundary>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </RootErrorBoundary>
      </QueryProvider>
    </ThemeProvider>
  )
}
