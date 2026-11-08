import { useEffect, useMemo, useState } from 'react'
import { ENIGMAS, MAX_ATTEMPTS } from '../game/config'
import type { GameState } from '../game/GameContext'
import { supabase, TABLES, type TeamRow } from './client'

export type SyncStatus = 'off' | 'pending' | 'ok' | 'error'

const HEARTBEAT_MS = 30_000

type Row = Omit<TeamRow, 'updated_at' | 'unlocks'>

/** Base pas encore migrée (colonne « locked » absente) : on envoie la progression sans elle. */
let legacySchema = false

function toRow(s: GameState): Row | null {
  if (!s.session || !s.teamId || s.phase === 'briefing' || !s.startedAt) return null
  return {
    id: s.teamId,
    session: s.session,
    team: s.team,
    phase: s.phase,
    started_at: new Date(s.startedAt).toISOString(),
    finished_at: s.finishedAt ? new Date(s.finishedAt).toISOString() : null,
    solved: Object.entries(s.solved)
      .filter(([, v]) => v)
      .map(([k]) => Number(k))
      .sort(),
    current_view: s.view === null ? 'dashboard' : String(s.view),
    errors: Object.values(s.errors).reduce((a, b) => a + (b ?? 0), 0),
    hints: s.hints.length,
    lock_attempts: s.lockAttempts,
    locked: ENIGMAS.filter((e) => !s.solved[e.id] && (s.strikes[e.id] ?? 0) >= MAX_ATTEMPTS).map((e) => e.id),
  }
}

/**
 * Envoie la progression du joueur au tableau de bord enseignant.
 * Un « battement de cœur » toutes les 30 s permet à l'enseignant de repérer les joueurs déconnectés.
 */
export function useProgressSync(state: GameState): SyncStatus {
  const row = useMemo(() => toRow(state), [state])
  const key = row ? JSON.stringify(row) : null
  const [status, setStatus] = useState<SyncStatus>('off')

  useEffect(() => {
    if (!key || !supabase) {
      setStatus('off')
      return
    }
    const payload = JSON.parse(key) as Row
    let cancelled = false
    setStatus((s) => (s === 'off' ? 'pending' : s))

    const send = async () => {
      const row: Partial<Row> = { ...payload }
      if (legacySchema) delete row.locked
      let { error } = await supabase!.from(TABLES.teams).upsert({ ...row, updated_at: new Date().toISOString() })
      if (error?.code === 'PGRST204' && !legacySchema) {
        legacySchema = true
        delete row.locked
        ;({ error } = await supabase!.from(TABLES.teams).upsert({ ...row, updated_at: new Date().toISOString() }))
      }
      if (!cancelled) setStatus(error ? 'error' : 'ok')
    }

    const debounce = setTimeout(send, 300)
    const heartbeat = payload.phase === 'playing' ? setInterval(send, HEARTBEAT_MS) : undefined
    return () => {
      cancelled = true
      clearTimeout(debounce)
      clearInterval(heartbeat)
    }
  }, [key])

  return status
}
