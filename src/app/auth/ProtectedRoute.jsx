import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from './useAuthStore.js'

export function ProtectedRoute({ role, children }) {
  const location = useLocation()
  const session = useAuthStore((s) => s.sessions[role])

  if (!session) {
    return <Navigate to={`/${role}/login`} state={{ from: location.pathname }} replace />
  }
  return children
}

