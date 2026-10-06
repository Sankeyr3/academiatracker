import { useState } from 'react'
import Modal, { inputCls } from './Modal'

export default function AddModal({ modules, onClose, onAdd }) {
  const [module, setModule] = useState(modules.at(-1) ?? '')
  const [text, setText] = useState('')
  const [hours, setHours] = useState('')
  const [saving, setSaving] = useState(false)

  const titles = text
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean)

  async function submit(e) {
    e.preventDefault()
    if (!titles.length) return
    setSaving(true)
    await onAdd(module.trim(), titles, Number(hours) || 0)
    onClose()
  }

  return (
    <Modal title="Añadir vídeos" onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <label className="block space-y-1">
          <span className="text-xs text-slate-400">Módulo / sección</span>
          <input
            className={inputCls}
            list="modules"
            value={module}
            onChange={(e) => setModule(e.target.value)}
            placeholder="Ej. Método principiante"
          />
          <datalist id="modules">
            {modules.filter(Boolean).map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-slate-400">Títulos (uno por línea)</span>
          <textarea
            className={`${inputCls} min-h-40`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={'Introducción\nNotación\nLa cruz blanca'}
            autoFocus
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-slate-400">Horas de grabación (cada vídeo)</span>
          <input
            className={inputCls}
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Ej. 1 (21 algoritmos ≈ 1 h)"
          />
        </label>
        <button
          disabled={saving || !titles.length}
          className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 py-3 font-semibold text-slate-950"
        >
          {saving ? 'Guardando…' : `Añadir ${titles.length || ''} ${titles.length === 1 ? 'vídeo' : 'vídeos'}`}
        </button>
      </form>
    </Modal>
  )
}
