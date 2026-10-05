import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isConfigured = Boolean(url && key)

export const supabase = isConfigured ? createClient(url, key) : null

const USERNAME_DOMAIN = import.meta.env.VITE_USERNAME_DOMAIN || 'academia.app'

// Permite entrar con "david" en vez de "david@academia.app"
export function toEmail(user) {
  const u = user.trim().toLowerCase()
  return u.includes('@') ? u : `${u}@${USERNAME_DOMAIN}`
}
