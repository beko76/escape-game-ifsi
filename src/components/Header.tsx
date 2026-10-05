import { KeyRound, ShieldAlert, Timer, Users } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { ENIGMAS, WARNING_THRESHOLD_MS } from '../game/config'
import { useGame } from '../game/GameContext'
import { sound } from '../lib/sound'
import { cn, formatDuration } from '../lib/utils'
import { LegislationSheet } from './LegislationSheet'
import { TeacherDialog } from './TeacherDialog'
import { Button } from './ui/button'

export function Header() {
  const { state, remainingMs, solvedCount } = useGame()
  const won = state.phase === 'won'
  const overtime = remainingMs < 0
  const warning = !won && remainingMs <= WARNING_THRESHOLD_MS

  // Bip d'alerte à chaque minute pendant les 5 dernières minutes
  const lastMinute = useRef<number | null>(null)
  useEffect(() => {
    if (won || remainingMs <= 0 || remainingMs > WARNING_THRESHOLD_MS) return
    const minute = Math.ceil(remainingMs / 60000)
    if (lastMinute.current !== null && minute !== lastMinute.current) sound.alarm()
    lastMinute.current = minute
  }, [remainingMs, won])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <div className="flex min-w-0 items-center gap-2">
          <ShieldAlert className="size-6 shrink-0 text-neon" />
          <div className="min-w-0 leading-tight">
            <p className="hidden font-mono text-[0.625rem] uppercase tracking-[0.2em] text-neon sm:block">Escape Game IFSI</p>
            <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-white">
              <Users className="size-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{state.team}</span>
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-1 sm:flex" aria-label={`${solvedCount} énigmes résolues sur 6`}>
            {ENIGMAS.map((e) => (
              <span
                key={e.id}
                className={cn('h-2 w-4 rounded-full', state.solved[e.id] ? 'bg-med glow-med' : 'bg-line')}
              />
            ))}
          </div>

          <div
            role="timer"
            aria-live="off"
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-lg font-bold tabular-nums sm:text-xl',
              won && 'border-med/50 bg-med/10 text-med',
              !won && !warning && 'border-neon/40 bg-neon/5 text-neon',
              warning && 'border-alert/60 bg-alert/10 text-alert glow-alert',
              warning && !overtime && 'blink-alert',
            )}
          >
            <Timer className="size-4" />
            {overtime && !won ? '+' : ''}
            {formatDuration(Math.abs(remainingMs))}
          </div>

          <span className="hidden md:block">
            <LegislationSheet />
          </span>
          <span className="md:hidden">
            <LegislationSheet compact />
          </span>
          <TeacherDialog
            trigger={
              <Button variant="ghost" size="icon" aria-label="Espace enseignant" title="Espace enseignant">
                <KeyRound />
              </Button>
            }
          />
        </div>
      </div>
    </header>
  )
}
