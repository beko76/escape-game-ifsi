import { AnimatePresence, motion } from 'framer-motion'
import { BellRing, CheckCircle2, Clock, Lightbulb, Lock, LockOpen, Medal, Radio, Trash2, Users, WifiOff, XCircle } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Card } from '../components/ui/card'
import { ENIGMAS, GAME_DURATION_MS } from '../game/config'
import { supabase, TABLES, type TeamRow } from '../online/client'
import { sound } from '../lib/sound'
import { cn, formatDuration } from '../lib/utils'

/** Au-delà, un joueur sans « battement de cœur » est signalé comme déconnecté. */
const STALE_MS = 90_000

type Status = 'done' | 'overtime' | 'stale' | 'playing'

const STATUS_UI: Record<Status, { label: string; cls: string }> = {
  done: { label: 'Terminé', cls: 'border-med/50 bg-med/10 text-med' },
  playing: { label: 'En cours', cls: 'border-neon/40 bg-neon/10 text-neon' },
  overtime: { label: 'Temps dépassé', cls: 'border-alert/50 bg-alert/10 text-alert' },
  stale: { label: 'Déconnecté ?', cls: 'border-warn/50 bg-warn/10 text-warn' },
}

function statusOf(t: TeamRow, now: number): Status {
  if (t.finished_at) return 'done'
  if (now - Date.parse(t.updated_at) > STALE_MS) return 'stale'
  if (t.started_at && now - Date.parse(t.started_at) > GAME_DURATION_MS) return 'overtime'
  return 'playing'
}

function elapsedOf(t: TeamRow, now: number) {
  if (!t.started_at) return 0
  const end = t.finished_at ? Date.parse(t.finished_at) : now
  return end - Date.parse(t.started_at)
}

/** Classement : joueurs ayant terminé, par temps, puis les autres par avancement. */
function rank(teams: TeamRow[], now: number) {
  return [...teams].sort((a, b) => {
    if (!!a.finished_at !== !!b.finished_at) return a.finished_at ? -1 : 1
    if (a.finished_at && b.finished_at) return elapsedOf(a, now) - elapsedOf(b, now)
    if (b.solved.length !== a.solved.length) return b.solved.length - a.solved.length
    return a.errors + a.hints - (b.errors + b.hints)
  })
}

function ago(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000))
  if (s < 60) return `il y a ${s} s`
  const m = Math.round(s / 60)
  return `il y a ${m} min`
}

function viewLabel(v: string | null) {
  if (!v || v === 'dashboard') return 'Tableau des énigmes'
  if (v === 'lock') return 'Cadenas final'
  const e = ENIGMAS.find((x) => String(x.id) === v)
  return e ? `Énigme ${e.id} · ${e.title}` : '—'
}

function Progress({ team }: { team: TeamRow }) {
  return (
    <div className="flex items-center gap-1">
      {ENIGMAS.map((e) => {
        const solved = team.solved.includes(e.id)
        const blocked = !solved && !!team.locked?.includes(e.id)
        const here = !team.finished_at && team.current_view === String(e.id)
        return (
          <span
            key={e.id}
            title={`${e.title}${solved ? ' : résolue' : blocked ? ' : bloquée (3 erreurs)' : here ? ' : en cours' : ''}`}
            className={cn(
              'grid size-7 place-items-center rounded-md border font-mono text-xs font-bold',
              solved ? 'border-med/60 bg-med/20 text-med' : 'border-line bg-slate-950 text-slate-600',
              here && 'border-neon text-neon glow-neon',
              blocked && 'border-warn bg-warn/20 text-warn',
            )}
          >
            {e.id}
          </span>
        )
      })}
      <span
        title="Cadenas final"
        className={cn(
          'ml-1 grid size-7 place-items-center rounded-md border',
          team.finished_at
            ? 'border-med/60 bg-med/20 text-med'
            : team.current_view === 'lock'
              ? 'border-neon text-neon glow-neon'
              : 'border-line bg-slate-950 text-slate-600',
        )}
      >
        <Lock className="size-3.5" />
      </span>
    </div>
  )
}

export function TeamBoard({ code }: { code: string }) {
  const [teams, setTeams] = useState<TeamRow[] | null>(null)
  const [live, setLive] = useState<'connecting' | 'live' | 'error'>('connecting')
  const [now, setNow] = useState(() => Date.now())

  const fetchTeams = useCallback(async () => {
    const { data, error } = await supabase!.from(TABLES.teams).select('*').eq('session', code)
    if (!error && data) setTeams(data as TeamRow[])
    else if (error) setLive('error')
  }, [code])

  useEffect(() => {
    void fetchTeams()
    // Temps réel : chaque changement d'un joueur de la séance est appliqué immédiatement
    const channel = supabase!
      .channel(`${TABLES.teams}-${code}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: TABLES.teams }, (payload) => {
        if (payload.eventType === 'DELETE') {
          const id = (payload.old as Partial<TeamRow>).id
          setTeams((ts) => ts?.filter((t) => t.id !== id) ?? ts)
          return
        }
        const row = payload.new as TeamRow
        if (row.session !== code) return
        setTeams((ts) => {
          const list = ts ?? []
          return list.some((t) => t.id === row.id) ? list.map((t) => (t.id === row.id ? row : t)) : [...list, row]
        })
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setLive('live')
        else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') setLive('error')
      })
    // Filet de sécurité si le temps réel est coupé (réseau d'établissement filtrant les websockets…)
    const poll = setInterval(fetchTeams, 15_000)
    const tick = setInterval(() => setNow(Date.now()), 1000)
    return () => {
      void supabase!.removeChannel(channel)
      clearInterval(poll)
      clearInterval(tick)
    }
  }, [code, fetchTeams])

  const ranked = useMemo(() => rank(teams ?? [], now), [teams, now])

  const remove = async (t: TeamRow) => {
    if (!confirm(`Retirer le joueur « ${t.team} » du tableau de bord ?`)) return
    setTeams((ts) => ts?.filter((x) => x.id !== t.id) ?? ts)
    await supabase!.from(TABLES.teams).delete().eq('id', t.id)
  }

  /** Accorde 3 nouveaux essais : le joueur reçoit le déblocage en quelques secondes. */
  const unlock = async (t: TeamRow, id: number) => {
    const unlocks = { ...(t.unlocks ?? {}), [id]: (t.unlocks?.[id] ?? 0) + 1 }
    setTeams((ts) => ts?.map((x) => (x.id === t.id ? { ...x, unlocks, locked: x.locked?.filter((l) => l !== id) } : x)) ?? ts)
    const { error } = await supabase!.from(TABLES.teams).update({ unlocks }).eq('id', t.id)
    if (error) {
      alert(
        error.code === 'PGRST204'
          ? "Le déblocage à distance n'est pas encore activé dans la base Supabase (voir README). Débloquez sur place avec le mot de passe enseignant."
          : `Déblocage impossible : ${error.message}`,
      )
      void fetchTeams()
    }
  }

  const requests = ranked.flatMap((t) =>
    t.finished_at ? [] : (t.locked ?? []).filter((id) => !t.solved.includes(id)).map((id) => ({ team: t, id })),
  )

  // Bip à chaque nouvelle demande de déblocage
  const lastRequests = useRef(0)
  useEffect(() => {
    if (requests.length > lastRequests.current) sound.alarm()
    lastRequests.current = requests.length
  }, [requests.length])

  const finished = ranked.filter((t) => t.finished_at)
  const best = finished[0]
  const stats = [
    { label: 'Joueurs', value: ranked.length, icon: Users, cls: 'text-neon' },
    {
      label: 'En cours',
      value: ranked.filter((t) => !t.finished_at).length,
      icon: Radio,
      cls: 'text-neon',
    },
    { label: 'Terminés', value: finished.length, icon: CheckCircle2, cls: 'text-med' },
    {
      label: 'Meilleur temps',
      value: best ? formatDuration(elapsedOf(best, now)) : '—',
      icon: Medal,
      cls: 'text-warn',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="flex items-center gap-3 p-4">
            <s.icon className={cn('size-6 shrink-0', s.cls)} />
            <div>
              <p className="font-mono text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <AnimatePresence initial={false}>
        {requests.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="border-warn/60 bg-warn/10 p-4">
              <p className="flex items-center gap-2 font-semibold text-amber-100">
                <BellRing className="blink-alert size-5 shrink-0 text-warn" />
                Demande{requests.length > 1 ? 's' : ''} de déblocage
              </p>
              <ul className="mt-3 space-y-2">
                {requests.map(({ team, id }) => {
                  const e = ENIGMAS.find((x) => x.id === id)
                  return (
                    <li key={`${team.id}-${id}`} className="flex flex-wrap items-center gap-3 rounded-lg border border-warn/30 bg-slate-950/60 px-3 py-2">
                      <Lock className="size-4 shrink-0 text-warn" />
                      <span className="text-sm text-slate-200">
                        <strong className="text-white">{team.team}</strong> est bloqué sur l'énigme {id}
                        {e ? ` · ${e.title}` : ''} (3 erreurs)
                      </span>
                      <button
                        type="button"
                        onClick={() => unlock(team, id)}
                        className="ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-warn px-3 py-1.5 text-sm font-semibold text-slate-950 hover:bg-amber-300"
                      >
                        <LockOpen className="size-4" /> Débloquer
                      </button>
                    </li>
                  )
                })}
              </ul>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
          <h2 className="font-semibold text-white">Joueurs en direct</h2>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-xs',
              live === 'live' && 'border-med/40 text-med',
              live === 'connecting' && 'border-line text-slate-400',
              live === 'error' && 'border-warn/50 text-warn',
            )}
          >
            {live === 'error' ? (
              <>
                <WifiOff className="size-3.5" /> Actualisation toutes les 15 s
              </>
            ) : (
              <>
                <span className={cn('size-1.5 rounded-full', live === 'live' ? 'blink-alert bg-med' : 'bg-slate-500')} />
                {live === 'live' ? 'Temps réel' : 'Connexion…'}
              </>
            )}
          </span>
        </div>

        {teams === null ? (
          <p className="p-8 text-center text-sm text-slate-400">Chargement…</p>
        ) : ranked.length === 0 ? (
          <div className="p-10 text-center">
            <Users className="mx-auto size-10 text-slate-600" />
            <p className="mt-3 font-medium text-slate-300">En attente des joueurs…</p>
            <p className="mt-1 text-sm text-slate-500">
              Ils apparaîtront ici dès qu'ils auront lancé la mission avec le code de séance.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[56rem] text-left text-sm">
              <thead className="border-b border-line font-mono text-[0.6875rem] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Joueur</th>
                  <th className="px-4 py-3 font-medium">Progression</th>
                  <th className="px-4 py-3 font-medium">Où en est-elle ?</th>
                  <th className="px-4 py-3 font-medium">Chrono</th>
                  <th className="px-4 py-3 text-center font-medium" title="Indices utilisés">
                    <Lightbulb className="mx-auto size-4" />
                  </th>
                  <th className="px-4 py-3 text-center font-medium" title="Erreurs de saisie (énigmes + cadenas)">
                    <XCircle className="mx-auto size-4" />
                  </th>
                  <th className="px-4 py-3 font-medium">Activité</th>
                  <th className="px-2 py-3" />
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {ranked.map((t, i) => {
                    const status = statusOf(t, now)
                    const elapsed = elapsedOf(t, now)
                    const remaining = GAME_DURATION_MS - elapsed
                    return (
                      <motion.tr
                        key={t.id}
                        layout
                        initial={{ opacity: 0, backgroundColor: 'rgb(34 211 238 / 0.15)' }}
                        animate={{ opacity: 1, backgroundColor: 'rgb(34 211 238 / 0)' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="border-b border-line/60 last:border-0"
                      >
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'grid size-8 place-items-center rounded-full font-mono font-bold',
                              t.finished_at && i === 0 && 'bg-amber-400/20 text-amber-300',
                              t.finished_at && i === 1 && 'bg-slate-300/15 text-slate-200',
                              t.finished_at && i === 2 && 'bg-orange-500/15 text-orange-300',
                              (!t.finished_at || i > 2) && 'text-slate-400',
                            )}
                          >
                            {i + 1}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-white">{t.team}</p>
                          <span
                            className={cn(
                              'mt-1 inline-block rounded-full border px-2 py-0.5 text-[0.6875rem]',
                              STATUS_UI[status].cls,
                            )}
                          >
                            {STATUS_UI[status].label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Progress team={t} />
                          <p className="mt-1 text-xs text-slate-500">{t.solved.length}/{ENIGMAS.length} énigmes</p>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {t.finished_at ? <span className="text-med">Mission accomplie 🎉</span> : viewLabel(t.current_view)}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5',
                              t.finished_at ? 'text-med' : remaining < 0 ? 'text-alert' : remaining < 5 * 60_000 ? 'text-warn' : 'text-white',
                            )}
                          >
                            <Clock className="size-3.5" />
                            {formatDuration(elapsed)}
                          </span>
                          {!t.finished_at && (
                            <p className="text-xs text-slate-500">
                              {remaining >= 0 ? `reste ${formatDuration(remaining)}` : `+${formatDuration(-remaining)}`}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-warn">{t.hints}</td>
                        <td className="px-4 py-3 text-center font-mono text-alert">{t.errors + t.lock_attempts}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{ago(now - Date.parse(t.updated_at))}</td>
                        <td className="px-2 py-3">
                          <button
                            type="button"
                            onClick={() => remove(t)}
                            aria-label={`Retirer le joueur ${t.team}`}
                            title="Retirer le joueur"
                            className="cursor-pointer rounded-md p-2 text-slate-600 hover:bg-alert/10 hover:text-alert"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
