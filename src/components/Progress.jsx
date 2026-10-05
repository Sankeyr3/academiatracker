import { STATUS } from '../lib/status'

export default function Progress({ counts, total }) {
  const recorded = counts.grabado + counts.editando + counts.editado
  const pct = (n) => (total ? (n / total) * 100 : 0)

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Stat label="Grabados" value={recorded} total={total} color="text-amber-300" />
        <Stat label="Terminados" value={counts.editado} total={total} color="text-emerald-300" />
      </div>

      <div className="h-3 rounded-full bg-slate-800 overflow-hidden flex">
        {['editado', 'editando', 'grabado'].map((s) => (
          <div key={s} className={`${STATUS[s].bar} transition-all`} style={{ width: `${pct(counts[s])}%` }} />
        ))}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
        {['sin_grabar', 'grabado', 'editando', 'editado'].map((s) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${STATUS[s].dot}`} />
            {STATUS[s].short} {counts[s]}
          </span>
        ))}
      </div>
    </div>
  )
}

function Stat({ label, value, total, color }) {
  const pct = total ? Math.round((value / total) * 100) : 0
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-bold ${color}`}>{pct}%</span>
        <span className="text-sm text-slate-500">
          {value}/{total}
        </span>
      </div>
    </div>
  )
}
