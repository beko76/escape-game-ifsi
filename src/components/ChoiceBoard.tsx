import { AnimatePresence, motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { CheckCircle2, MousePointerClick, XCircle } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import type { EnigmaId } from '../game/config'
import { useGame } from '../game/GameContext'
import { sound } from '../lib/sound'
import { cn } from '../lib/utils'

export interface Choice {
  key: string
  label: string
  icon: LucideIcon
  tone: 'med' | 'alert'
}

export interface ChoiceItem {
  id: string
  /** Pastille affichée à gauche (A, B, 1, 2…) */
  tag: string
  content: ReactNode
  correct: string
  explanation: ReactNode
}

const TONE = {
  med: { on: 'border-med bg-med/15 text-med', chip: 'border-med/40 bg-med/10 text-med' },
  alert: { on: 'border-alert bg-alert/15 text-alert', chip: 'border-alert/40 bg-alert/10 text-alert' },
} as const

/**
 * Liste de cartes à classer entre deux choix (vrai/faux, retenu/rejeté…).
 * Les choix de l'équipe servent d'outil de réflexion : rien n'est corrigé avant que
 * l'énigme soit résolue, ce qui obligerait sinon à donner la réponse.
 */
export function ChoiceBoard({
  enigmaId,
  choices,
  items,
  instruction,
}: {
  enigmaId: EnigmaId
  choices: [Choice, Choice]
  items: ChoiceItem[]
  instruction: string
}) {
  const { state } = useGame()
  const reveal = !!state.solved[enigmaId]
  const [picks, setPicks] = useState<Record<string, string>>({})

  const pick = (id: string, key: string) => {
    if (reveal) return
    sound.click()
    setPicks((p) => ({ ...p, [id]: p[id] === key ? '' : key }))
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm text-slate-300">
          <MousePointerClick className="size-4 shrink-0 text-neon" />
          {reveal ? 'Correction : la bonne réponse est surlignée pour chaque carte.' : instruction}
        </p>
        {!reveal && (
          <div className="flex gap-2">
            {choices.map((c) => (
              <span key={c.key} className={cn('rounded-full border px-3 py-1 font-mono text-xs', TONE[c.tone].chip)}>
                {c.label} : {items.filter((i) => picks[i.id] === c.key).length}
              </span>
            ))}
          </div>
        )}
      </div>

      {items.map((item, i) => {
        const picked = picks[item.id]
        const wrong = reveal && picked && picked !== item.correct
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              'rounded-xl border bg-panel-2/70 p-4',
              reveal ? (wrong ? 'border-alert/50' : 'border-med/40') : picked ? 'border-neon/40' : 'border-line',
            )}
          >
            <div className="flex gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-950 font-mono text-sm font-bold text-neon">
                {item.tag}
              </span>
              <div className="min-w-0 flex-1 text-sm leading-relaxed text-slate-200">{item.content}</div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:ml-11">
              {choices.map((c) => {
                const active = reveal ? item.correct === c.key : picked === c.key
                return (
                  <button
                    key={c.key}
                    type="button"
                    disabled={reveal}
                    aria-pressed={active}
                    onClick={() => pick(item.id, c.key)}
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                      active ? TONE[c.tone].on : 'border-line text-slate-400',
                      !reveal && 'cursor-pointer hover:border-slate-500 hover:text-slate-200',
                      reveal && !active && 'opacity-40',
                    )}
                  >
                    <c.icon className="size-4 shrink-0" />
                    {c.label}
                  </button>
                )
              })}
            </div>

            <AnimatePresence>
              {reveal && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 flex gap-2 text-sm leading-relaxed text-slate-400 sm:ml-11"
                >
                  {wrong ? (
                    <XCircle className="mt-0.5 size-4 shrink-0 text-alert" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-med" />
                  )}
                  <span>{item.explanation}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
