import { useEffect, useMemo, useState } from 'react'
import type { GameState } from '../game/GameContext'
import { supabase, type TeamRow } from './client'

export type SyncStatus = 'off' | 'pending' | 'ok' | 'error'

const HEARTBEAT_MS = 30_000

function toRow(s: GameState): Omit<TeamRow, 'updated_at'> | null {
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
  }
}

/**
 * Envoie la progression de l'équipe au tableau de bord enseignant.
 * Un « battement de cœur » toutes les 30 s permet à l'enseignant de repérer les équipes déconnectées.
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
    const payload = JSON.parse(key) as Omit<TeamRow, 'updated_at'>
    let cancelled = false
    setStatus((s) => (s === 'off' ? 'pending' : s))

    const send = async () => {
      const { error } = await supabase!.from('teams').upsert({ ...payload, updated_at: new Date().toISOString() })
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
