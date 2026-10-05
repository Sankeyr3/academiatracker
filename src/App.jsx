import { useEffect, useState } from 'react'
import { supabase, isConfigured } from './lib/supabase'
import Login from './components/Login'
import Tracker from './components/Tracker'

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    if (!isConfigured) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (!isConfigured) {
    return (
      <div className="min-h-screen grid place-items-center p-6 text-slate-300">
        <p className="max-w-sm text-center">
          Falta configurar <code className="text-amber-300">VITE_SUPABASE_URL</code> y{' '}
          <code className="text-amber-300">VITE_SUPABASE_ANON_KEY</code>.
        </p>
      </div>
    )
  }

  if (session === undefined) {
    return <div className="min-h-screen grid place-items-center text-slate-500">Cargando…</div>
  }

  return session ? <Tracker session={session} /> : <Login />
}
