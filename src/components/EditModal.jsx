import { useState } from 'react'
import { STATUSES } from '../lib/status'
import Modal, { inputCls } from './Modal'

export default function EditModal({ video, modules, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(video.title)
  const [module, setModule] = useState(video.module)
  const [notes, setNotes] = useState(video.notes)
  const [status, setStatus] = useState(video.status)
  const [hours, setHours] = useState(String(video.hours ?? 0))

  function submit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title: title.trim(), module: module.trim(), notes: notes.trim(), status, hours: Number(hours) || 0 })
    onClose()
  }

  function remove() {
    if (confirm(`¿Borrar "${video.title}"?`)) {
      onDelete()
      onClose()
    }
  }

  return (
    <Modal title="Editar vídeo" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <label className="block space-y-1">
          <span className="text-xs text-slate-400">Título</span>
          <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-slate-400">Módulo / sección</span>
          <input className={inputCls} list="modules-edit" value={module} onChange={(e) => setModule(e.target.value)} />
          <datalist id="modules-edit">
            {modules.filter(Boolean).map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-slate-400">Horas de grabación</span>
          <input
            className={inputCls}
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </label>
        <div className="space-y-1">
          <span className="text-xs text-slate-400">Estado</span>
          <div className="grid grid-cols-2 gap-2">
            {STATUSES.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => setStatus(s.id)}
                className={`rounded-xl px-3 py-2 text-sm ring-1 text-left flex items-center gap-2 ${
                  status === s.id ? s.pill : 'ring-slate-800 text-slate-400'
                }`}
              >
                <span className={`w-2 h-2 shrink-0 rounded-full ${s.dot}`} />
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <label className="block space-y-1">
          <span className="text-xs text-slate-400">Notas</span>
          <textarea className={`${inputCls} min-h-20`} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        <div className="flex gap-2 pt-1">
          <button type="button" onClick={remove} className="rounded-xl px-4 py-3 text-red-400 hover:bg-red-500/10">
            Borrar
          </button>
          <button className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 py-3 font-semibold text-slate-950">
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  )
}
