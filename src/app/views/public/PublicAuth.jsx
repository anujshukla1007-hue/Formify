import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth/useAuthStore.js'

export function PublicAuth() {
  const requestOtp = useAuthStore((s) => s.requestOtp)
  const verifyOtp = useAuthStore((s) => s.verifyOtp)
  const [target, setTarget] = useState('')
  const [otp, setOtp] = useState('')
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  return (
    <section className="glass-strong rounded-2xl p-5">
      <h2 className="text-2xl font-bold">Student OTP Login</h2>
      <p className="mt-1 text-sm text-slate-500">Use email or mobile. Demo OTP is 246810.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <input
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="focus-ring rounded-lg border border-slate-300/60 bg-white/60 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/50"
          placeholder="Email or phone"
        />
        <button
          onClick={async () => {
            const res = await requestOtp({ role: 'student', emailOrPhone: target })
            setMsg(res.message)
          }}
          className="rounded-lg bg-violet-600 px-3 py-2 font-semibold text-white"
        >
          Send OTP
        </button>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="focus-ring rounded-lg border border-slate-300/60 bg-white/60 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/50"
          placeholder="Enter OTP"
        />
        <button
          onClick={async () => {
            const res = await verifyOtp({ role: 'student', code: otp })
            setMsg(res.ok ? 'Login successful' : res.message)
            if (res.ok) navigate('/')
          }}
          className="rounded-lg bg-emerald-600 px-3 py-2 font-semibold text-white"
        >
          Verify OTP
        </button>
      </div>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </section>
  )
}

