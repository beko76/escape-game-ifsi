import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { CheckCircle2, KeyRound, Lightbulb, Lock, Radio, XCircle } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { MAX_ATTEMPTS, TEACHER_PASSWORD, type EnigmaMeta } from '../game/config'
import { useGame } from '../game/GameContext'
import { sound } from '../lib/sound'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { Card } from './ui/card'

/** Textes du panneau de réponse, personnalisables par énigme. */
export interface AnswerLabels {
  submit?: string
  success?: string
  error?: string
}

/** Énigme bloquée après trop d'essais : déblocage par l'enseignant, à distance ou sur place. */
function LockedNotice({ enigma }: { enigma: EnigmaMeta }) {
  const { state, unlock } = useGame()
  const [pwd, setPwd] = useState('')
  const [open, setOpen] = useState(false)
  const [error, setError] = useState(false)
  const controls = useAnimationControls()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (pwd.trim().toUpperCase() === TEACHER_PASSWORD.toUpperCase()) {
      sound.success()
      unlock(enigma.id)
    } else {
      setError(true)
      void controls.start({ x: [0, -10, 10, -8, 8, 0], transition: { duration: 0.4 } })
    }
  }

  return (
    <motion.div
      key="locked"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-5 rounded-xl border border-warn/50 bg-warn/10 p-4"
    >
      <p className="flex items-center gap-2 font-semibold text-amber-100">
        <Lock className="size-5 shrink-0 text-warn" /> Énigme bloquée
      </p>
      <p className="mt-2 text-sm leading-relaxed text-amber-100/80">
        {MAX_ATTEMPTS} réponses fausses : cette énigme est verrouillée. Appelez votre enseignant pour la débloquer. En
        attendant, vous pouvez avancer sur les autres énigmes.
      </p>
      {state.session && (
        <p className="mt-3 flex items-center gap-2 text-xs text-amber-200">
          <Radio className="blink-alert size-3.5 shrink-0" />
          Demande transmise au tableau de bord enseignant : le déblocage sera automatique.
        </p>
      )}
      {open ? (
        <motion.form animate={controls} onSubmit={submit} className="mt-4 space-y-2 border-t border-warn/20 pt-4">
          <label className="block text-xs text-slate-300">
            Mot de passe enseignant
            <input
              type="password"
              autoFocus
              value={pwd}
              onChange={(e) => {
                setPwd(e.target.value)
                setError(false)
              }}
              className="mt-1.5 h-10 w-full rounded-lg border border-line bg-slate-950 px-3 font-mono text-white outline-none focus:border-neon"
            />
          </label>
          {error && <p className="text-xs text-alert">Mot de passe incorrect.</p>}
          <Button type="submit" variant="outline" size="sm" className="w-full">
            <KeyRound /> Débloquer l'énigme
          </Button>
        </motion.form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 cursor-pointer text-xs text-slate-400 underline-offset-2 hover:text-white hover:underline"
        >
          Déblocage sur place par l'enseignant
        </button>
      )}
    </motion.div>
  )
}

/** Zone « Entrez le chiffre N » commune à toutes les énigmes. */
export function AnswerPanel({ enigma, question, labels = {} }: { enigma: EnigmaMeta; question: string; labels?: AnswerLabels }) {
  const { state, solve, addError, takeHint, locked } = useGame()
  const solved = !!state.solved[enigma.id]
  const isLocked = locked.includes(enigma.id)
  const left = MAX_ATTEMPTS - (state.strikes[enigma.id] ?? 0)
  const hintShown = state.hints.includes(enigma.id)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const controls = useAnimationControls()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!value || isLocked) return
    if (value === enigma.answer) {
      sound.success()
      solve(enigma.id)
    } else {
      sound.error()
      setError(true)
      setValue('')
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
              <p className="text-sm text-emerald-200">{labels.success ?? `Chiffre ${enigma.id} récupéré`}</p>
              <p className="text-xs text-emerald-300/70">Notez-le : il servira pour le cadenas final.</p>
            </div>
            <span className="grid size-14 place-items-center rounded-xl bg-slate-950 font-mono text-3xl font-bold text-med glow-med">
              {enigma.answer}
            </span>
          </motion.div>
        ) : isLocked ? (
          <LockedNotice key="locked" enigma={enigma} />
        ) : (
          <motion.form key="form" animate={controls} onSubmit={submit} className="mt-5">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor={`answer-${enigma.id}`} className="text-sm text-slate-300">
                Entrez le Chiffre {enigma.id}
              </label>
              <span
                title={`Au bout de ${MAX_ATTEMPTS} erreurs, l'énigme est bloquée jusqu'à l'intervention de l'enseignant`}
                className={cn(
                  'flex items-center gap-1 font-mono text-xs',
                  left <= 1 ? 'text-alert' : left < MAX_ATTEMPTS ? 'text-warn' : 'text-slate-500',
                )}
              >
                {Array.from({ length: MAX_ATTEMPTS }, (_, i) => (
                  <span key={i} className={cn('size-2 rounded-full', i < left ? 'bg-current' : 'bg-slate-700')} />
                ))}
                <span className="ml-1">
                  {left} essai{left > 1 ? 's' : ''}
                </span>
              </span>
            </div>
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
                {labels.submit ?? 'Valider'}
              </Button>
            </div>
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 flex items-start gap-2 text-sm text-alert"
                >
                  <XCircle className="size-4 shrink-0" />
                  <span>
                    {labels.error ?? 'Mauvaise réponse. Réexaminez les indices.'}
                    {left === 1 && <strong className="block">Dernier essai avant blocage !</strong>}
                  </span>
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
