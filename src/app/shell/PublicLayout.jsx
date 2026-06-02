import { Link, NavLink, Outlet } from 'react-router-dom'
import { useTheme } from '../theme/theme-context.js'

const PUBLIC_NAV = [
  ['/', 'Home'],
  ['/latest-job', 'Latest Job'],
  ['/admit-card', 'Admit Card'],
  ['/result', 'Result'],
  ['/admission', 'Admission'],
  ['/syllabus', 'Syllabus'],
  ['/answer-key', 'Answer Key'],
]

export function PublicLayout() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div className="min-h-full px-4 py-5 md:px-6">
      <header className="glass-strong mx-auto mb-5 flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3">
        <div>
          <h1 className="premium-title text-3xl font-black tracking-tight md:text-4xl">ExamApply AI</h1>
          <p className="text-xs text-slate-500 dark:text-slate-300">
            Aap Padhai Par Dhyan Do, Form Ki Tension Hum Par Chodo!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="glass rounded-xl px-3 py-2 text-sm">
            {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
          <Link to="/auth" className="rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white">
            OTP Login
          </Link>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[220px_1fr]">
        <aside className="glass h-fit rounded-2xl p-3">
          <p className="mb-2 text-xs uppercase tracking-widest text-slate-500">Student Menu</p>
          <nav className="space-y-1">
            {PUBLIC_NAV.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-violet-600 text-white' : 'hover:bg-white/30 dark:hover:bg-white/10'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="min-h-[74vh]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

