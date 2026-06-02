import { useEffect, useState } from 'react'
import { api } from '../../api/client.js'
import { useAuthStore } from '../../auth/useAuthStore.js'

export function CounselorDashboard() {
  const token = useAuthStore((s) => s.sessions.counselor?.token)
  const [slots, setSlots] = useState([])
  const [selected, setSelected] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) return
    api
      .getCounselorSlots(token)
      .then((res) => setSlots(res.slots))
      .catch((err) => setMessage(err.message))
  }, [token])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Counselor Portal</h1>
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-slate-300/60 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/50">
          <h2 className="text-lg font-bold">15-minute Slot Calendar</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
            {slots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelected(slot.time)}
                className={`rounded px-2 py-2 ${selected === slot.time ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
              >
                {slot.time.split(' ')[1]}
              </button>
            ))}
          </div>
        </article>
        <article className="rounded-xl border border-slate-300/60 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/50">
          <h2 className="text-lg font-bold">Meeting Hub</h2>
          <div className="mt-4 space-y-2 text-sm">
            <button className="w-full rounded bg-sky-600 px-3 py-2 text-white">Start Chat</button>
            <button className="w-full rounded bg-emerald-600 px-3 py-2 text-white">Open Voice Call Logs</button>
            <button className="w-full rounded bg-violet-600 px-3 py-2 text-white">Launch Video Room</button>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Selected slot: {selected || 'No slot selected'}
          </p>
        </article>
      </section>
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </div>
  )
}

