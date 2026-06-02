import { useMemo, useState } from 'react'
import { EXAM_CATEGORIES } from '../../data/examData.js'
import { api } from '../../api/client.js'
import { useAuthStore } from '../../auth/useAuthStore.js'
import { useEffect } from 'react'

export function AdminDashboard() {
  const token = useAuthStore((s) => s.sessions.admin?.token)
  const [people, setPeople] = useState([])
  const [backendMetrics, setBackendMetrics] = useState({ totalRevenue: 0, activeForms: 0, activePilots: 0, activeCounselors: 0 })
  const [showRefundConfirm, setShowRefundConfirm] = useState(false)
  const [message, setMessage] = useState('')
  const metrics = useMemo(
    () => ({
      revenue: `Rs ${backendMetrics.totalRevenue.toLocaleString('en-IN')}`,
      activeForms: backendMetrics.activeForms,
      activePilots: backendMetrics.activePilots,
      activeCounselors: backendMetrics.activeCounselors,
    }),
    [backendMetrics],
  )

  useEffect(() => {
    if (!token) return
    Promise.all([api.getAdminMetrics(token), api.getWorkforce(token)])
      .then(([mRes, wRes]) => {
        setBackendMetrics(mRes)
        setPeople(wRes.people)
      })
      .catch((err) => setMessage(err.message))
  }, [token])

  const refresh = async () => {
    if (!token) return
    const [mRes, wRes] = await Promise.all([api.getAdminMetrics(token), api.getWorkforce(token)])
    setBackendMetrics(mRes)
    setPeople(wRes.people)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin Control Room</h1>
      <section className="grid gap-3 md:grid-cols-4">
        {[
          ['Total Revenue Generated', metrics.revenue],
          ['Active Forms Submitted', metrics.activeForms],
          ['Active Form Pilots', metrics.activePilots],
          ['Active Counselors Online', metrics.activeCounselors],
        ].map(([title, value]) => (
          <button key={title} className="rounded-xl bg-violet-600/20 p-4 text-left">
            <p className="text-xs">{title}</p>
            <p className="mt-1 text-xl font-black">{value}</p>
          </button>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <article className="rounded-xl border border-slate-300/60 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/50">
          <h2 className="text-lg font-bold">Pilot/Counselor Management</h2>
          <table className="mt-3 w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-slate-500">
                <th>Name</th>
                <th>Role</th>
                <th>Category</th>
                <th>KYC</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {people.map((p) => (
                <tr key={p.id} className="border-t border-slate-200/60 dark:border-slate-700">
                  <td>{p.name}</td>
                  <td>{p.role}</td>
                  <td>{p.category}</td>
                  <td>
                    <button
                      onClick={async () => {
                        if (!token) return
                        await api.toggleKyc(p.id, token)
                        await refresh()
                      }}
                      className={`rounded px-2 py-1 text-xs ${p.kyc ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-black'}`}
                    >
                      {p.kyc ? 'Approved' : 'Approve KYC'}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={async () => {
                        const reason = window.prompt('Block/Unblock reason?')
                        if (reason === null) return
                        if (!token) return
                        await api.toggleActive(p.id, reason, token)
                        await refresh()
                      }}
                      className={`rounded px-2 py-1 text-xs ${p.active ? 'bg-rose-600 text-white' : 'bg-slate-700 text-white'}`}
                    >
                      {p.active ? 'Instant Block' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            <button
              className="rounded bg-indigo-600 px-3 py-2 text-sm text-white"
              onClick={async () => {
                if (!token) return
                await api.addWorkforce(
                  {
                    name: 'New Pilot',
                    email: `pilot${Date.now()}@examapply.ai`,
                    role: 'pilot',
                    category: 'SSC',
                    pan: 'ABCDE1234F',
                    aadhaar: '123412341234',
                    marksheetUrl: 'https://example.com/marksheet',
                  },
                  token,
                )
                await refresh()
              }}
            >
              Add Pilot
            </button>
            <button
              className="rounded bg-sky-600 px-3 py-2 text-sm text-white"
              onClick={async () => {
                if (!token) return
                await api.addWorkforce(
                  {
                    name: 'New Counselor',
                    email: `counselor${Date.now()}@examapply.ai`,
                    role: 'counselor',
                    category: 'UPSC',
                    pan: 'ABCDE1234F',
                    aadhaar: '123412341234',
                    marksheetUrl: 'https://example.com/marksheet',
                  },
                  token,
                )
                await refresh()
              }}
            >
              Add Counselor
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Include PAN, Aadhaar, latest qualification marksheet in onboarding form and category mapping.
          </p>
        </article>
        <article className="rounded-xl border border-slate-300/60 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/50">
          <h2 className="text-lg font-bold">Auto Task Assignment + Recovery</h2>
          <p className="mt-2 text-sm">
            New paid student request auto-assigned by category + time slot. On pilot error, task reroutes to next active pilot and triggers WhatsApp alert instantly.
          </p>
          <div className="mt-4 rounded-lg bg-emerald-600/20 p-3 text-sm">
            Completed form {'->'} PDF stored server-side and sent over Email + WhatsApp.
          </div>
          <div className="mt-3 flex gap-2">
            <select className="w-full rounded border border-slate-300 bg-white px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
              {EXAM_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <button className="rounded bg-violet-600 px-3 py-2 text-sm text-white">Reassign</button>
          </div>
          <button
            onClick={() => setShowRefundConfirm(true)}
            className="mt-4 w-full rounded bg-rose-600 px-3 py-2 text-sm font-semibold text-white"
          >
            Process Refund
          </button>
        </article>
      </section>

      {showRefundConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="glass-strong w-full max-w-md rounded-2xl p-5">
            <h3 className="text-lg font-bold">Warning: Refund Action</h3>
            <p className="mt-2 text-sm">Confirm refund only if form filing failed or user-facing issue is validated.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowRefundConfirm(false)} className="rounded bg-slate-600 px-3 py-2 text-sm text-white">
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!token) return
                  await api.processRefund(
                    { applicationId: 'SSC2600001', reason: 'Form submission failed', amount: 179 },
                    token,
                  )
                  setShowRefundConfirm(false)
                  setMessage('Refund processed successfully')
                }}
                className="rounded bg-rose-600 px-3 py-2 text-sm text-white"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </div>
  )
}

