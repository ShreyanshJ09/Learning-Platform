/**
 * Centered shell for login / register pages.
 */
export function AuthLayout({ children }) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-10 text-foreground">
      <div className="mb-8 text-center">
        <p className="font-heading text-xl font-semibold tracking-tight">
          Learn with AI
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Turn a topic into a structured course
        </p>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </main>
  )
}
