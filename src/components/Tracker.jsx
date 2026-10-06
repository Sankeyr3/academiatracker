import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { STATUSES } from '../lib/status'
import { fmtHours, sumHours } from '../lib/hours'
import Logo from './Logo'
import Progress from './Progress'
import VideoRow from './VideoRow'
import AddModal from './AddModal'
import EditModal from './EditModal'

const FILTERS = [{ id: 'all', short: 'Todos' }, ...STATUSES]

export default function Tracker({ session }) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('position', { ascending: true })
    if (error) setError(error.message)
    else {
      setError('')
      setVideos(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    const channel = supabase
      .channel('videos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'videos' }, load)
      .subscribe()
    const onVisible = () => document.visibilityState === 'visible' && load()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      supabase.removeChannel(channel)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [load])

  // Actualiza la UI al instante y recarga si la petición falla
  async function mutate(optimistic, request) {
    setVideos(optimistic)
    const { error } = await request
    if (error) {
      setError(error.message)
      load()
    }
  }

  const updateVideo = (id, changes) =>
    mutate(
      (vs) => vs.map((v) => (v.id === id ? { ...v, ...changes } : v)),
      supabase.from('videos').update(changes).eq('id', id),
    )

  const deleteVideo = (id) =>
    mutate(
      (vs) => vs.filter((v) => v.id !== id),
      supabase.from('videos').delete().eq('id', id),
    )

  async function addVideos(module, titles, hours) {
    const maxPos = videos.reduce((m, v) => Math.max(m, v.position), 0)
    const rows = titles.map((title, i) => ({ title, module, hours, position: maxPos + i + 1 }))
    const { error } = await supabase.from('videos').insert(rows)
    if (error) setError(error.message)
    load()
  }

  // Intercambia la posición con el vecino dentro del mismo módulo
  function move(video, dir) {
    const siblings = videos.filter((v) => v.module === video.module)
    const other = siblings[siblings.findIndex((v) => v.id === video.id) + dir]
    if (!other) return
    mutate(
      (vs) =>
        vs
          .map((v) =>
            v.id === video.id
              ? { ...v, position: other.position }
              : v.id === other.id
                ? { ...v, position: video.position }
                : v,
          )
          .sort((a, b) => a.position - b.position),
      Promise.all([
        supabase.from('videos').update({ position: other.position }).eq('id', video.id),
        supabase.from('videos').update({ position: video.position }).eq('id', other.id),
      ]).then((rs) => rs.find((r) => r.error) ?? { error: null }),
    )
  }

  const modules = useMemo(() => [...new Set(videos.map((v) => v.module))], [videos])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return videos.filter(
      (v) =>
        (filter === 'all' || v.status === filter) &&
        (!q || v.title.toLowerCase().includes(q) || v.module.toLowerCase().includes(q)),
    )
  }, [videos, filter, query])

  const groups = useMemo(
    () =>
      modules
        .map((m) => ({
          module: m,
          all: videos.filter((v) => v.module === m),
          items: visible.filter((v) => v.module === m),
        }))
        .filter((g) => g.items.length > 0),
    [modules, videos, visible],
  )

  const counts = useMemo(() => {
    const c = Object.fromEntries(STATUSES.map((s) => [s.id, 0]))
    videos.forEach((v) => c[v.status]++)
    return c
  }, [videos])

  const hoursByStatus = useMemo(() => {
    const h = Object.fromEntries(STATUSES.map((s) => [s.id, 0]))
    videos.forEach((v) => (h[v.status] += Number(v.hours || 0)))
    return h
  }, [videos])

  return (
    <div className="min-h-screen text-slate-100">
      <header className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur border-b border-slate-900 pt-[env(safe-area-inset-top)]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <h1 className="flex-1">
            <span className="sr-only">Academia Tracker</span>
            <Logo size="sm" />
          </h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-slate-400 hover:text-white"
            title={session.user.email}
          >
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-28 pt-4 space-y-4">
        <Progress hours={hoursByStatus} total={sumHours(videos)} />

        <div className="space-y-3">
          <input
            className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-base sm:text-sm placeholder-slate-500 outline-none focus:border-slate-600"
            placeholder="Buscar vídeo o módulo…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 [scrollbar-width:none]">
            {FILTERS.map((f) => {
              const n = f.id === 'all' ? videos.length : counts[f.id]
              const active = filter === f.id
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-sm ring-1 transition ${
                    active ? 'bg-white text-slate-950 ring-white' : 'bg-slate-900 text-slate-300 ring-slate-800'
                  }`}
                >
                  {f.short} <span className="opacity-60">{n}</span>
                </button>
              )
            })}
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-slate-500 py-12">Cargando…</p>
        ) : videos.length === 0 ? (
          <div className="text-center text-slate-400 py-16">
            <p>Todavía no hay vídeos.</p>
            <button onClick={() => setAdding(true)} className="mt-3 text-emerald-400 underline">
              Añade los primeros
            </button>
          </div>
        ) : groups.length === 0 ? (
          <p className="text-center text-slate-500 py-12">Nada coincide con el filtro.</p>
        ) : (
          groups.map((g) => {
            const done = sumHours(g.all.filter((v) => v.status === 'editado'))
            return (
              <section key={g.module} className="space-y-2">
                <div className="flex items-baseline justify-between px-1 pt-2">
                  <h2 className="font-semibold text-slate-200">{g.module || 'Sin módulo'}</h2>
                  <span className="text-xs text-slate-500">
                    {fmtHours(done)} / {fmtHours(sumHours(g.all))} terminadas
                  </span>
                </div>
                <ul className="rounded-2xl bg-slate-900/60 border border-slate-800/80 divide-y divide-slate-800/80 overflow-hidden">
                  {g.items.map((v) => {
                    const i = g.all.findIndex((x) => x.id === v.id)
                    return (
                      <VideoRow
                        key={v.id}
                        video={v}
                        onStatus={(status) => updateVideo(v.id, { status })}
                        onEdit={() => setEditing(v)}
                        onUp={i > 0 ? () => move(v, -1) : null}
                        onDown={i < g.all.length - 1 ? () => move(v, 1) : null}
                      />
                    )
                  })}
                </ul>
              </section>
            )
          })
        )}
      </main>

      <button
        onClick={() => setAdding(true)}
        className="fixed right-5 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-3xl font-light shadow-lg shadow-emerald-500/20 grid place-items-center"
        aria-label="Añadir vídeos"
      >
        +
      </button>

      {adding && <AddModal modules={modules} onClose={() => setAdding(false)} onAdd={addVideos} />}
      {editing && (
        <EditModal
          video={editing}
          modules={modules}
          onClose={() => setEditing(null)}
          onSave={(changes) => updateVideo(editing.id, changes)}
          onDelete={() => deleteVideo(editing.id)}
        />
      )}
    </div>
  )
}
