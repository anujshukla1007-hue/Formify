import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api/client.js'
import { useAuthStore } from '../../auth/useAuthStore.js'

export function PilotDashboard() {
  const token = useAuthStore((s) => s.sessions.pilot?.token)
  const [tasks, setTasks] = useState([])
  const [activeTaskId, setActiveTaskId] = useState(null)
  const [seconds, setSeconds] = useState(0)
  const [earning] = useState(2240)
  const [message, setMessage] = useState('')
  const activeTask = useMemo(() => tasks.find((t) => t.id === activeTaskId), [tasks, activeTaskId])

  useEffect(() => {
    if (!activeTaskId) return
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [activeTaskId])

  useEffect(() => {
    if (!token) return
    api
      .getPilotTasks(token)
      .then((res) => setTasks(res.tasks))
      .catch((err) => setMessage(err.message))
  }, [token])

  const updateTask = async (id, action, reason) => {
    try {
      if (!token) return
      await api.taskAction(id, action, reason, token)
      const refreshed = await api.getPilotTasks(token)
      setTasks(refreshed.tasks)
      setMessage(`Task ${id} ${action}ed successfully`)
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Form Pilot Workspace</h1>
      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-xl bg-emerald-600/20 p-4">
          <p className="text-sm">Real-time Earnings</p>
          <p className="text-2xl font-black">Rs {earning}</p>
        </article>
        <article className="rounded-xl bg-violet-600/20 p-4 lg:col-span-2">
          <p className="text-sm">Active Timer</p>
          <p className="text-2xl font-black">{Math.floor(seconds / 60)}m {seconds % 60}s</p>
        </article>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <article className="rounded-2xl border border-slate-300/60 bg-white/65 p-4 dark:border-slate-700 dark:bg-slate-900/50">
          <h2 className="text-lg font-bold">Task Queue</h2>
          <div className="mt-3 space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-lg border border-slate-200/70 p-3 dark:border-slate-700">
                <p className="font-semibold">{task.id} - {task.exam}</p>
                <p className="text-xs text-slate-500">{task.student} • {task.slot}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    className="rounded bg-emerald-600 px-2 py-1 text-xs text-white"
                    onClick={async () => {
                      await updateTask(task.id, 'accept')
                      setActiveTaskId(task.id)
                      setSeconds(0)
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="rounded bg-rose-600 px-2 py-1 text-xs text-white"
                    onClick={() => updateTask(task.id, 'reject')}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-2xl border border-slate-300/60 bg-white/65 p-4 dark:border-slate-700 dark:bg-slate-900/50">
          <h2 className="text-lg font-bold">Secure Side-by-side Workflow</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div
              onContextMenu={(e) => e.preventDefault()}
              className="rounded-lg border border-dashed border-slate-400 p-4 text-xs"
            >
              <p className="font-semibold">Secure Doc Viewer</p>
              <p>Aadhaar • Photo • Signature (inspect and right-click blocked)</p>
            </div>
            <div className="rounded-lg bg-sky-500/20 p-4 text-xs">
              <p className="font-semibold">Input Guide</p>
              <p>Paste OCR parsed fields only. Upload photo/sign from secure server path.</p>
            </div>
          </div>
          {activeTask && (
            <div className="mt-3 rounded bg-violet-600/20 px-3 py-2 text-sm">
              Working on {activeTask.id}. Redirect to in-portal application form enabled.
            </div>
          )}
          <button className="mt-3 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">
            Pay Govt Fee (Razorpay + WhatsApp QR Mock)
          </button>
        </article>
      </section>
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </div>
  )
}

