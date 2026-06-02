import { EXAMS } from '../../data/examData.js'

export function ExamsIndex() {
  return (
    <section className="glass rounded-2xl p-5">
      <h2 className="text-xl font-bold">Top Exams</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {EXAMS.map((exam) => (
          <article key={exam.name} className="rounded-xl border border-slate-200/60 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/40">
            <p className="font-semibold">{exam.name}</p>
            <p className="text-xs text-slate-500">{exam.category}</p>
            <div className="mt-3 flex gap-2">
              <a href={exam.link} target="_blank" rel="noreferrer" className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white">
                Self Apply
              </a>
              <button className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-black">
                Apply with Pilot
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

