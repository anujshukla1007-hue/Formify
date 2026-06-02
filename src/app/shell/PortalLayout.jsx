import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTheme } from '../theme/theme-context.js'
import { useAuthStore } from '../auth/useAuthStore.js'

const NAV_BY_PORTAL = {
  pilot: [
    ['/pilot/app', 'Task Queue'],
    ['/pilot/app', 'Secure Viewer'],
    ['/pilot/app', 'Wallet & Payouts'],
  ],
  counselor: [
    ['/counselor/app', 'Schedule'],
    ['/counselor/app', 'Meeting Hub'],
  ],
  admin: [
    ['/admin/app', 'Metrics'],
    ['/admin/app', 'Management'],
    ['/admin/app', 'Refund Control'],
  ],
}

export function PortalLayout({ portal }) {
  const { theme, toggleTheme } = useTheme()
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const nav = NAV_BY_PORTAL[portal]

  return (
    <div className="min-h-full p-4 md:p-6">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="glass-strong sticky top-4 h-[calc(100vh-2rem)] rounded-2xl p-4">
          <div className="mb-6">
            <h2 className="premium-title text-2xl font-black">ExamApply AI</h2>
            <p className="text-xs uppercase tracking-widest text-slate-500">{portal} portal</p>
          </div>
          <nav className="space-y-1">
            {nav.map(([to, label]) => (
              <NavLink
                key={`${to}-${label}`}
                to={to}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-violet-600 text-white' : 'hover:bg-white/25 dark:hover:bg-white/10'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-6 space-y-2">
            <button onClick={toggleTheme} className="glass w-full rounded-lg px-3 py-2 text-sm">
              {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </button>
            <button
              onClick={() => {
                logout(portal)
                navigate(`/${portal}/login`, { replace: true })
              }}
              className="w-full rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white"
            >
              Logout
            </button>
            <Link to="/" className="block text-center text-xs text-slate-500 underline">
              Back to Main Website
            </Link>
          </div>
        </aside>
        <main className="glass min-h-[84vh] rounded-2xl p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

