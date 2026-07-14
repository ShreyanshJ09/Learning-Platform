import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { paths } from '@/routes/paths'

function PlaceholderPage({ title }) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-6 text-foreground">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">
          Route shell only — real pages come in later phases.
        </p>
      </div>
    </main>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={paths.landing}
          element={<PlaceholderPage title="Text-to-Learn" />}
        />
        <Route
          path={paths.login}
          element={<PlaceholderPage title="Login" />}
        />
        <Route
          path={paths.register}
          element={<PlaceholderPage title="Register" />}
        />
        <Route
          path={paths.dashboard}
          element={<PlaceholderPage title="Dashboard" />}
        />
        <Route path="*" element={<Navigate to={paths.landing} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
