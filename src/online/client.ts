import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** Client Supabase, ou null si le suivi en direct n'est pas configuré (le jeu fonctionne alors hors ligne). */
export const supabase =
  url && anonKey ? createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } }) : null

export const ONLINE = supabase !== null

/** Tables préfixées : elles peuvent cohabiter avec celles d'une autre application dans le même projet Supabase. */
export const TABLES = { sessions: 'escape_sessions', teams: 'escape_teams' } as const

export interface SessionRow {
  code: string
  label: string | null
  created_at: string
}

export interface TeamRow {
  id: string
  session: string
  team: string
  phase: 'playing' | 'won'
  started_at: string | null
  finished_at: string | null
  solved: number[]
  /** 'dashboard', 'lock' ou numéro d'énigme */
  current_view: string | null
  errors: number
  hints: number
  lock_attempts: number
  updated_at: string
}

// Sans caractères ambigus (0/O, 1/I/L) pour une saisie facile au tableau
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export function generateCode(length = 5) {
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')
}

export function normalizeCode(raw: string) {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)
}

/** UUID v4, y compris hors contexte sécurisé (http sur réseau local) où crypto.randomUUID n'existe pas. */
export function uuid() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  const b = crypto.getRandomValues(new Uint8Array(16))
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

export type SessionCheck = 'ok' | 'unknown' | 'network'

export async function checkSession(code: string): Promise<SessionCheck> {
  if (!supabase) return 'network'
  const { data, error } = await supabase.from(TABLES.sessions).select('code').eq('code', code).maybeSingle()
  if (error) return 'network'
  return data ? 'ok' : 'unknown'
}

export function joinLink(code: string) {
  return `${location.origin}${location.pathname}?seance=${code}`
}
