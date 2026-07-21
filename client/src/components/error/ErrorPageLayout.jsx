/**
 * Centered full-viewport shell for standalone error routes (404, route errors).
 */
export function ErrorPageLayout({ children }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-6 py-10 text-foreground">
      <div className="max-w-md space-y-6 text-center">{children}</div>
    </main>
  )
}
