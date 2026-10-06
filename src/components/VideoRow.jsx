import { STATUS, STATUSES } from '../lib/status'
import { fmtHours } from '../lib/hours'

export default function VideoRow({ video, onStatus, onEdit, onUp, onDown }) {
  const s = STATUS[video.status]
  return (
    <li className="flex items-center gap-2 pl-2 pr-2 py-2.5">
      <div className="flex flex-col -my-1">
        <ArrowBtn onClick={onUp} label="Subir">▲</ArrowBtn>
        <ArrowBtn onClick={onDown} label="Bajar">▼</ArrowBtn>
      </div>

      <button onClick={onEdit} className="flex-1 min-w-0 text-left">
        <div className={`truncate ${video.status === 'editado' ? 'text-slate-400' : 'text-slate-100'}`}>
          {video.title}
        </div>
        {video.notes && <div className="truncate text-xs text-slate-500">{video.notes}</div>}
      </button>

      <span className="shrink-0 text-xs tabular-nums text-slate-500">{fmtHours(video.hours)}</span>

      <div className={`relative shrink-0 rounded-full ring-1 ${s.pill}`}>
        <select
          value={video.status}
          onChange={(e) => onStatus(e.target.value)}
          className="appearance-none bg-transparent pl-6 pr-3 py-1.5 text-xs font-medium outline-none cursor-pointer"
          aria-label="Estado"
        >
          {STATUSES.map((o) => (
            <option key={o.id} value={o.id} className="bg-slate-900 text-slate-100">
              {o.label}
            </option>
          ))}
        </select>
        <span className={`pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${s.dot}`} />
      </div>
    </li>
  )
}

function ArrowBtn({ onClick, label, children }) {
  return (
    <button
      onClick={onClick ?? undefined}
      disabled={!onClick}
      aria-label={label}
      className="text-[10px] leading-none px-1.5 py-1 text-slate-500 hover:text-white disabled:opacity-20"
    >
      {children}
    </button>
  )
}
