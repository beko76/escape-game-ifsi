import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { CheckCircle2, KeyRound, Lightbulb, XCircle } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import type { EnigmaMeta } from '../game/config'
import { useGame } from '../game/GameContext'
import { sound } from '../lib/sound'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { Card } from './ui/card'

/** Zone « Entrez le chiffre N » commune à toutes les énigmes. */
export function AnswerPanel({ enigma, question }: { enigma: EnigmaMeta; question: string }) {
  const { state, solve, addError, takeHint } = useGame()
  const solved = !!state.solved[enigma.id]
  const hintShown = state.hints.includes(enigma.id)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const controls = useAnimationControls()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!value) return
    if (value === enigma.answer) {
      sound.success()
      solve(enigma.id)
    } else {
      sound.error()
      setError(true)
      addError(enigma.id)
      void controls.start({ x: [0, -12, 12, -8, 8, -4, 0], transition: { duration: 0.45 } })
    }
  }

  return (
    <Card className={cn('p-5 transition-shadow', solved && 'border-med/50 glow-med')}>
      <div className="flex items-start gap-3">
        <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', solved ? 'bg-med/15 text-med' : 'bg-neon/10 text-neon')}>
          <KeyRound className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-widest text-slate-400">Question</p>
          <p className="mt-1 font-medium leading-relaxed text-white">{question}</p>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {solved ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-5 flex items-center gap-4 rounded-xl border border-med/40 bg-med/10 p-4"
          >
            <CheckCircle2 className="size-8 shrink-0 text-med" />
            <div className="flex-1">
              <p className="text-sm text-emerald-200">Chiffre {enigma.id} récupéré</p>
              <p className="text-xs text-emerald-300/70">Notez-le : il servira pour le cadenas final.</p>
            </div>
            <span className="grid size-14 place-items-center rounded-xl bg-slate-950 font-mono text-3xl font-bold text-med glow-med">
              {enigma.answer}
            </span>
          </motion.div>
        ) : (
          <motion.form key="form" animate={controls} onSubmit={submit} className="mt-5">
            <label htmlFor={`answer-${enigma.id}`} className="text-sm text-slate-300">
              Entrez le Chiffre {enigma.id}
            </label>
            <div className="mt-2 flex gap-3">
              <input
                id={`answer-${enigma.id}`}
                inputMode="numeric"
                autoComplete="off"
                maxLength={2}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value.replace(/\D/g, '').slice(0, 2))
                  setError(false)
                }}
                placeholder="?"
                className={cn(
                  'h-14 w-20 rounded-xl border bg-slate-950 text-center font-mono text-3xl font-bold text-white outline-none transition-colors placeholder:text-slate-700',
                  error ? 'border-alert text-alert glow-alert' : 'border-line focus:border-neon focus:glow-neon',
                )}
              />
              <Button type="submit" size="lg" className="h-14 flex-1" disabled={!value}>
                Valider
              </Button>
            </div>
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 flex items-center gap-2 text-sm text-alert"
                >
                  <XCircle className="size-4" /> Mauvaise réponse. Réexaminez les indices.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>

      {!solved && (
        <div className="mt-4 border-t border-line pt-4">
          {hintShown ? (
            <p className="flex gap-2 text-sm leading-relaxed text-warn">
              <Lightbulb className="mt-0.5 size-4 shrink-0" />
              {enigma.hint}
            </p>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => takeHint(enigma.id)} className="text-warn hover:text-warn">
              <Lightbulb /> Besoin d'un indice ?
            </Button>
          )}
        </div>
      )}
    </Card>
  )
}
