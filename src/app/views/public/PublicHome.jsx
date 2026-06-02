import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { EXAMS } from '../../data/examData.js'
import { api } from '../../api/client.js'

function evaluateEligibility(profile, exams) {
  const qRank = { highschool: 1, intermediate: 2, graduation: 3, postgraduation: 4 }
  return exams.filter((exam) => qRank[profile.qualification] >= qRank[exam.minQualification])
}

export function PublicHome() {
  const [query, setQuery] = useState('')
  const [profile, setProfile] = useState({
    dob: '',
    gender: 'male',
    state: 'UP',
    qualification: 'graduation',
    category: 'general',
    height: '',
  })
  const [eligible, setEligible] = useState([])
  const [chat, setChat] = useState([
    { role: 'assistant', text: '### Career Saarthi AI\nAsk me your exam goal and preparation plan.' },
  ])
  const [prompt, setPrompt] = useState('')
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [docs, setDocs] = useState([])
  const [wallet] = useState(950)
  const [exams, setExams] = useState(EXAMS)
  const [message, setMessage] = useState('')
  const filtered = useMemo(
    () => exams.filter((e) => e.name.toLowerCase().includes(query.toLowerCase())),
    [query, exams],
  )

  useEffect(() => {
    api
      .getPublicExams()
      .then((res) => setExams(res.exams))
      .catch(() => setMessage('API offline. Using local exam cache.'))
  }, [])

  return (
    <div className="space-y-4">
      <section className="glass-strong rounded-2xl p-5">
        <h2 className="text-2xl font-bold">Top 10 India + UP Govt Exam Search</h2>
        <input
          className="focus-ring mt-3 w-full rounded-lg border border-slate-300/70 bg-white/70 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/60"
          placeholder="Search exam..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {filtered.map((exam) => (
            <div key={exam.name} className="rounded-lg bg-white/70 p-3 text-sm dark:bg-slate-900/40">
              <p className="font-semibold">{exam.name}</p>
              <div className="mt-2 flex gap-2">
                <a href={exam.link} target="_blank" rel="noreferrer" className="rounded bg-indigo-600 px-2 py-1 text-xs text-white">
                  Self Apply
                </a>
                <button className="rounded bg-amber-500 px-2 py-1 text-xs text-black">Apply with Pilot</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="glass rounded-2xl p-5">
          <h3 className="text-lg font-bold">Smart Eligibility Engine (AI)</h3>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {Object.entries(profile).map(([key, value]) => (
              <input
                key={key}
                value={value}
                onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                className="focus-ring rounded-lg border border-slate-300/70 bg-white/80 px-3 py-2 text-sm capitalize dark:border-slate-700 dark:bg-slate-900/40"
                placeholder={key}
              />
            ))}
          </div>
          <button
            onClick={() => setEligible(evaluateEligibility(profile, exams))}
            className="mt-3 rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white"
          >
            Check My Eligibility
          </button>
          <div className="mt-3 space-y-2">
            {eligible.map((e) => (
              <p key={e.name} className="rounded-lg bg-emerald-500/20 px-3 py-2 text-sm">
                Eligible: {e.name}
              </p>
            ))}
          </div>
        </article>

        <article className="glass rounded-2xl p-5">
          <h3 className="text-lg font-bold">Checkout + Live Wallet Ledger</h3>
          <div className="mt-3 space-y-2 text-sm">
            <p>Government Exam Fee: Rs 100</p>
            <p>Service Fee (A/B/C): Rs 49 / Rs 79 / Rs 99</p>
            <p className="font-semibold">Wallet Balance: Rs {wallet}</p>
            <p className="rounded bg-violet-600/20 px-3 py-2">Projected Deduction: Rs 179</p>
          </div>
        </article>
      </section>

      <button
        onClick={() => setShowWhatsApp(true)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-xl"
      >
        Submit Docs via WhatsApp
      </button>

      <div className="fixed bottom-24 right-6 z-30 w-[350px] max-w-[90vw] rounded-2xl border border-slate-300/60 bg-white/90 p-3 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
        <p className="mb-2 text-sm font-semibold">Career Saarthi AI (Gemini Mock)</p>
        <div className="mb-2 h-44 space-y-2 overflow-y-auto rounded bg-slate-50 p-2 text-xs dark:bg-slate-950/60">
          {chat.map((m, i) => (
            <div key={i} className={m.role === 'assistant' ? '' : 'text-right'}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900" />
          <button
            onClick={() => {
              if (!prompt.trim()) return
              setChat((c) => [
                ...c,
                { role: 'user', text: prompt },
                { role: 'assistant', text: `- Recommended stream: **${prompt.includes('upsc') ? 'UPSC CSE' : 'SSC + Banking'}**\n- Plan: 6h daily with mock tests.` },
              ])
              setPrompt('')
            }}
            className="rounded bg-violet-600 px-2 text-xs text-white"
          >
            Send
          </button>
        </div>
      </div>

      {showWhatsApp && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="glass-strong w-full max-w-xl rounded-2xl p-5">
            <h4 className="text-lg font-bold">Secure Document Uplink via WhatsApp API activated</h4>
            <p className="mt-1 text-sm text-slate-500">
              Your files are protected under our 48-Hour Data Wipe Policy.
            </p>
            <label className="mt-4 block rounded-lg border border-dashed border-slate-400 p-6 text-center text-sm">
              Drop or Select Files
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const uploaded = [...(e.target.files || [])].map((f) => ({
                    name: f.name,
                    ocr: {
                      studentName: 'Demo Student',
                      dob: '12-07-2005',
                      fatherName: 'Mock Father',
                      board: 'UP Board',
                      percentage: '82%',
                    },
                  }))
                  setDocs(uploaded)
                }}
              />
            </label>
            <div className="mt-3 space-y-2 text-xs">
              {docs.map((d) => (
                <div key={d.name} className="rounded bg-emerald-600/20 px-3 py-2">
                  {d.name} {'->'} OCR parsed and linked with Application ID.
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setShowWhatsApp(false)} className="rounded bg-slate-800 px-3 py-2 text-sm text-white dark:bg-slate-200 dark:text-black">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {message && <p className="text-xs text-slate-500">{message}</p>}
    </div>
  )
}


