import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProviders } from './app/providers/AppProviders.jsx'
import { PublicLayout } from './app/shell/PublicLayout.jsx'
import { PortalLayout } from './app/shell/PortalLayout.jsx'
import { ProtectedRoute } from './app/auth/ProtectedRoute.jsx'
import { PublicHome } from './app/views/public/PublicHome.jsx'
import { ExamsIndex } from './app/views/public/ExamsIndex.jsx'
import { PublicSection } from './app/views/public/PublicSection.jsx'
import { PublicAuth } from './app/views/public/PublicAuth.jsx'
import { PilotLogin } from './app/views/pilot/PilotLogin.jsx'
import { PilotDashboard } from './app/views/pilot/PilotDashboard.jsx'
import { CounselorLogin } from './app/views/counselor/CounselorLogin.jsx'
import { CounselorDashboard } from './app/views/counselor/CounselorDashboard.jsx'
import { AdminLogin } from './app/views/admin/AdminLogin.jsx'
import { AdminDashboard } from './app/views/admin/AdminDashboard.jsx'

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<PublicHome />} />
            <Route path="exams" element={<ExamsIndex />} />
            <Route path="auth" element={<PublicAuth />} />
            <Route path="home" element={<Navigate to="/" replace />} />
            <Route path="latest-job" element={<PublicSection kind="latest-job" />} />
            <Route path="admit-card" element={<PublicSection kind="admit-card" />} />
            <Route path="result" element={<PublicSection kind="result" />} />
            <Route path="admission" element={<PublicSection kind="admission" />} />
            <Route path="syllabus" element={<PublicSection kind="syllabus" />} />
            <Route path="answer-key" element={<PublicSection kind="answer-key" />} />
          </Route>

          <Route path="pilot">
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<PilotLogin />} />
            <Route
              path="app"
              element={
                <ProtectedRoute role="pilot">
                  <PortalLayout portal="pilot" />
                </ProtectedRoute>
              }
            >
              <Route index element={<PilotDashboard />} />
            </Route>
          </Route>

          <Route path="counselor">
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<CounselorLogin />} />
            <Route
              path="app"
              element={
                <ProtectedRoute role="counselor">
                  <PortalLayout portal="counselor" />
                </ProtectedRoute>
              }
            >
              <Route index element={<CounselorDashboard />} />
            </Route>
          </Route>

          <Route path="admin">
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<AdminLogin />} />
            <Route
              path="app"
              element={
                <ProtectedRoute role="admin">
                  <PortalLayout portal="admin" />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  )
}
