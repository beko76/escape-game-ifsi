import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { uuid } from '../online/client'
import { useProgressSync, type SyncStatus } from '../online/useProgressSync'
import { ENIGMAS, GAME_DURATION_MS, STORAGE_KEY, type EnigmaId } from './config'

export type Phase = 'briefing' | 'playing' | 'won'

export interface GameState {
  phase: Phase
  team: string
  /** Code de séance pour le suivi enseignant (null = partie hors ligne) */
  session: string | null
  /** Identifiant unique de la partie, côté base de données */
  teamId: string | null
  startedAt: number | null
  finishedAt: number | null
  /** Énigme ouverte (null = tableau de bord, 'lock' = cadenas final) */
  view: EnigmaId | 'lock' | null
  solved: Partial<Record<EnigmaId, boolean>>
  errors: Partial<Record<EnigmaId, number>>
  hints: EnigmaId[]
  lockAttempts: number
  timeUpAcknowledged: boolean
}

const INITIAL: GameState = {
  phase: 'briefing',
  team: '',
  session: null,
  teamId: null,
  startedAt: null,
  finishedAt: null,
  view: null,
  solved: {},
  errors: {},
  hints: [],
  lockAttempts: 0,
  timeUpAcknowledged: false,
}

/**
 * La partie est rangée dans sessionStorage : elle survit à un rafraîchissement,
 * mais fermer l'onglet la clôture et la page suivante repart de l'accueil.
 */
function load(): GameState {
  try {
    // Ancien stockage persistant (localStorage), qui gardait la partie après fermeture
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL
    return { ...INITIAL, ...(JSON.parse(raw) as Partial<GameState>) }
  } catch {
    return INITIAL
  }
}

interface GameApi {
  state: GameState
  now: number
  remainingMs: number
  elapsedMs: number
  solvedCount: number
  allSolved: boolean
  sync: SyncStatus
  start: (team: string, session: string | null) => void
  open: (view: GameState['view']) => void
  solve: (id: EnigmaId) => void
  addError: (id: EnigmaId) => void
  takeHint: (id: EnigmaId) => void
  failLock: () => void
  win: () => void
  acknowledgeTimeUp: () => void
  reset: () => void
}

const Ctx = createContext<GameApi | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(load)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* stockage indisponible (navigation privée) : le jeu reste jouable */
    }
  }, [state])

  useEffect(() => {
    if (state.phase !== 'playing') return
    const t = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(t)
  }, [state.phase])

  const sync = useProgressSync(state)

  const update = useCallback((fn: (s: GameState) => GameState) => setState(fn), [])

  const api = useMemo<GameApi>(() => {
    const end = state.finishedAt ?? now
    const elapsedMs = state.startedAt ? end - state.startedAt : 0
    const solvedCount = ENIGMAS.filter((e) => state.solved[e.id]).length
    return {
      state,
      now,
      elapsedMs,
      remainingMs: GAME_DURATION_MS - elapsedMs,
      solvedCount,
      allSolved: solvedCount === ENIGMAS.length,
      sync,
      start: (team, session) =>
        update(() => ({
          ...INITIAL,
          phase: 'playing',
          team: team.trim(),
          session,
          teamId: uuid(),
          startedAt: Date.now(),
        })),
      open: (view) => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        update((s) => ({ ...s, view }))
      },
      solve: (id) => update((s) => ({ ...s, solved: { ...s.solved, [id]: true } })),
      addError: (id) => update((s) => ({ ...s, errors: { ...s.errors, [id]: (s.errors[id] ?? 0) + 1 } })),
      takeHint: (id) => update((s) => (s.hints.includes(id) ? s : { ...s, hints: [...s.hints, id] })),
      failLock: () => update((s) => ({ ...s, lockAttempts: s.lockAttempts + 1 })),
      win: () => update((s) => ({ ...s, phase: 'won', finishedAt: Date.now(), view: null })),
      acknowledgeTimeUp: () => update((s) => ({ ...s, timeUpAcknowledged: true })),
      reset: () => {
        try {
          sessionStorage.removeItem(STORAGE_KEY)
        } catch {
          /* ignore */
        }
        setState(INITIAL)
      },
    }
  }, [state, now, sync, update])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useGame() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useGame doit être utilisé dans <GameProvider>')
  return ctx
}
