import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { CourseDetailPage } from '@/pages/CourseDetailPage'
import { CreateCoursePage } from '@/pages/CreateCoursePage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ErrorPage } from '@/pages/ErrorPage'
import { LandingPage } from '@/pages/LandingPage'
import { LessonViewerPage } from '@/pages/LessonViewerPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { RegisterPage } from '@/pages/RegisterPage'
import { paths } from '@/routes/paths'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { PublicOnlyRoute } from '@/routes/PublicOnlyRoute'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route errorElement={<ErrorPage />}>
          <Route path={paths.landing} element={<LandingPage />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path={paths.login} element={<LoginPage />} />
            <Route path={paths.register} element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path={paths.dashboard} element={<DashboardPage />} />
              <Route path={paths.createCourse} element={<CreateCoursePage />} />
              <Route path={paths.profile} element={<ProfilePage />} />
              <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            </Route>
            {/* Lesson viewer: topbar only — no app nav (Dashboard / Create / Profile) */}
            <Route element={<AppShell hideSidebar />}>
              <Route
                path="/courses/:courseId/lessons/:lessonId"
                element={<LessonViewerPage />}
              />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
