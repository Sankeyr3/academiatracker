export const STATUSES = [
  {
    id: 'sin_grabar',
    label: 'Sin grabar',
    short: 'Sin grabar',
    pill: 'bg-slate-800 text-slate-300 ring-slate-700',
    dot: 'bg-slate-500',
    bar: 'bg-slate-700',
  },
  {
    id: 'grabado',
    label: 'Grabado',
    short: 'Grabado',
    pill: 'bg-amber-500/15 text-amber-300 ring-amber-500/40',
    dot: 'bg-amber-400',
    bar: 'bg-amber-400',
  },
  {
    id: 'editando',
    label: 'Grabado · editando',
    short: 'Editando',
    pill: 'bg-sky-500/15 text-sky-300 ring-sky-500/40',
    dot: 'bg-sky-400',
    bar: 'bg-sky-400',
  },
  {
    id: 'editado',
    label: 'Grabado y editado',
    short: 'Editado',
    pill: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/40',
    dot: 'bg-emerald-400',
    bar: 'bg-emerald-400',
  },
]

export const STATUS = Object.fromEntries(STATUSES.map((s) => [s.id, s]))

// "editando" es un subestado de "grabado"
export const isRecorded = (status) => status !== 'sin_grabar'
