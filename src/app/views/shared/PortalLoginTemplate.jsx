import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth/useAuthStore.js'

export function PortalLoginTemplate({ role, title }) {
  const requestOtp = useAuthStore((s) => s.requestOtp)
  const verifyOtp = useAuthStore((s) => s.verifyOtp)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  return (
    <div className="min-h-screen p-4">
      <section className="glass-strong mx-auto mt-12 max-w-xl rounded-2xl p-6">
        <h1 className="premium-title text-3xl font-black">ExamApply AI</h1>
        <h2 className="mt-2 text-xl font-bold">{title}</h2>
        <p className="text-sm text-slate-500">Authorized email required. OTP demo: 246810</p>
        <div className="mt-4 space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus-ring w-full rounded-lg border border-slate-300 bg-white/70 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/60"
            placeholder="Work email"
          />
          <button
            onClick={async () => {
              const res = await requestOtp({ role, emailOrPhone: email })
              setMsg(res.message)
            }}
            className="w-full rounded-lg bg-violet-600 px-3 py-2 font-semibold text-white"
          >
            Request OTP
          </button>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="focus-ring w-full rounded-lg border border-slate-300 bg-white/70 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/60"
            placeholder="Enter OTP"
          />
          <button
            onClick={async () => {
              const res = await verifyOtp({ role, code: otp })
              setMsg(res.ok ? 'Login success' : res.message)
              if (res.ok) navigate(`/${role}/app`)
            }}
            className="w-full rounded-lg bg-emerald-600 px-3 py-2 font-semibold text-white"
          >
            Verify & Enter
          </button>
          {msg && <p className="text-sm">{msg}</p>}
        </div>
      </section>
    </div>
  )
}

