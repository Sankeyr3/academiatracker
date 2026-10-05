import { useState } from 'react'
import { supabase, toEmail } from '../lib/supabase'
import Logo from './Logo'

export default function Login() {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: toEmail(user),
      password,
    })
    setLoading(false)
    if (error) setError('Usuario o contraseña incorrectos')
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <div className="text-center mb-8">
          <h1 className="sr-only">Academia Tracker</h1>
          <Logo />
        </div>
        <input
          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-emerald-500"
          placeholder="Usuario"
          autoCapitalize="none"
          autoComplete="username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
        />
        <input
          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-emerald-500"
          placeholder="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          disabled={loading}
          className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 py-3 font-semibold text-slate-950"
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
