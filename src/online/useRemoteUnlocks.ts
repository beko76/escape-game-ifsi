import { useEffect } from 'react'
import type { EnigmaId } from '../game/config'
import { supabase, TABLES, type TeamRow } from './client'

const POLL_MS = 8_000

/**
 * Tant qu'une énigme est bloquée, écoute les déblocages envoyés depuis le tableau de bord enseignant
 * (temps réel, avec une vérification périodique si les websockets sont filtrés par le réseau).
 */
export function useRemoteUnlocks(
  teamId: string | null,
  waiting: boolean,
  apply: (unlocks: Partial<Record<EnigmaId, number>>) => void,
) {
  useEffect(() => {
    if (!supabase || !teamId || !waiting) return
    const client = supabase
    const receive = (row: Partial<TeamRow> | null) => {
      if (row?.unlocks) apply(row.unlocks as Partial<Record<EnigmaId, number>>)
    }
    const check = async () => {
      const { data } = await client.from(TABLES.teams).select('unlocks').eq('id', teamId).maybeSingle()
      receive(data as Partial<TeamRow> | null)
    }
    void check()
    const channel = client
      .channel(`unlock-${teamId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: TABLES.teams, filter: `id=eq.${teamId}` }, (p) =>
        receive(p.new as Partial<TeamRow>),
      )
      .subscribe()
    const poll = setInterval(check, POLL_MS)
    return () => {
      clearInterval(poll)
      void client.removeChannel(channel)
    }
  }, [teamId, waiting, apply])
}
