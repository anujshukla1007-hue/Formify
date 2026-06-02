import { SECTION_DATA } from '../../data/examData.js'

export function PublicSection({ kind }) {
  return (
    <section className="glass rounded-2xl p-5">
      <h2 className="text-xl font-bold capitalize">{kind.replace('-', ' ')}</h2>
      <p className="mt-2 text-sm text-slate-500">{SECTION_DATA[kind]}</p>
      <div className="mt-4 space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border border-slate-200/70 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-900/50">
            <p className="font-medium">
              {kind.toUpperCase()} Alert #{i}
            </p>
            <p className="text-xs text-slate-500">Official link verified • Updated just now</p>
          </div>
        ))}
      </div>
    </section>
  )
}

