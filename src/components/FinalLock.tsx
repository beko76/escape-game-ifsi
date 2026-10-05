import confetti from 'canvas-confetti'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { ArrowLeft, ChevronDown, ChevronUp, Delete, Lock, LockOpen, ShieldX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FINAL_CODE } from '../game/config'
import { useGame } from '../game/GameContext'
import { sound } from '../lib/sound'
import { cn } from '../lib/utils'
import { Button } from './ui/button'

const LENGTH = FINAL_CODE.length

function fireConfetti() {
  const colors = ['#22d3ee', '#34d399', '#e2e8f0', '#fbbf24']
  confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 }, colors })
  setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0 }, colors }), 250)
  setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1 }, colors }), 400)
}

export function FinalLock() {
  const { open, failLock, win, state } = useGame()
  const [digits, setDigits] = useState<number[]>(() => Array(LENGTH).fill(0))
  const [cursor, setCursor] = useState(0)
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle')
  const controls = useAnimationControls()

  const setDigit = (i: number, v: number) => {
    sound.click()
    setStatus('idle')
    setDigits((d) => d.map((x, j) => (j === i ? (v + 10) % 10 : x)))
  }

  const typeDigit = (v: number) => {
    setDigit(cursor, v)
    setCursor((c) => Math.min(LENGTH - 1, c + 1))
  }

  const submit = () => {
    if (status === 'success') return
    if (digits.join('') === FINAL_CODE) {
      setStatus('success')
      sound.unlock()
      fireConfetti()
      setTimeout(win, 2200)
    } else {
      setStatus('error')
      sound.error()
      failLock()
      void controls.start({ x: [0, -18, 18, -14, 14, -6, 6, 0], transition: { duration: 0.55 } })
    }
  }

  // Saisie au clavier physique (PC)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) typeDigit(Number(e.key))
      else if (e.key === 'ArrowLeft' || e.key === 'Backspace') setCursor((c) => Math.max(0, c - 1))
      else if (e.key === 'ArrowRight') setCursor((c) => Math.min(LENGTH - 1, c + 1))
      else if (e.key === 'ArrowUp') setDigit(cursor, digits[cursor] + 1)
      else if (e.key === 'ArrowDown') setDigit(cursor, digits[cursor] - 1)
      else if (e.key === 'Enter') submit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const success = status === 'success'

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-3xl px-4 py-6"
    >
      <Button variant="ghost" size="sm" onClick={() => open(null)} className="-ml-2 mb-4">
        <ArrowLeft /> Retour aux pièces d'investigation
      </Button>

      <div className="text-center">
        <motion.div
          animate={success ? { rotate: [0, -15, 0], scale: [1, 1.2, 1] } : {}}
          className={cn(
            'mx-auto grid size-20 place-items-center rounded-3xl border-2',
            success ? 'border-med bg-med/15 text-med glow-med' : status === 'error' ? 'border-alert bg-alert/10 text-alert' : 'border-neon/50 bg-neon/10 text-neon',
          )}
        >
          {success ? <LockOpen className="size-10" /> : <Lock className="size-10" />}
        </motion.div>
        <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">Serveur sécurisé</h1>
        <p className="mt-1 text-sm text-slate-400">Saisissez les 6 chiffres dans l'ordre des énigmes pour stopper la fuite.</p>
      </div>

      <motion.div
        animate={controls}
        className={cn(
          'mt-8 rounded-3xl border bg-gradient-to-b from-slate-900 to-slate-950 p-4 sm:p-6',
          success ? 'border-med/60 glow-med' : status === 'error' ? 'border-alert/60 glow-alert' : 'border-line',
        )}
      >
        <div className="flex justify-center gap-1.5 sm:gap-3">
          {digits.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <button
                type="button"
                aria-label={`Chiffre ${i + 1} : augmenter`}
                onClick={() => {
                  setCursor(i)
                  setDigit(i, d + 1)
                }}
                className="cursor-pointer rounded-md p-1 text-slate-500 hover:bg-white/5 hover:text-neon"
              >
                <ChevronUp className="size-6" />
              </button>
              <button
                type="button"
                onClick={() => setCursor(i)}
                aria-label={`Position ${i + 1}`}
                className={cn(
                  'relative h-16 w-11 cursor-pointer overflow-hidden rounded-xl border-2 bg-black font-mono text-4xl font-bold sm:h-20 sm:w-14 sm:text-5xl',
                  success ? 'border-med text-med' : status === 'error' ? 'border-alert/70 text-alert' : cursor === i ? 'border-neon text-neon glow-neon' : 'border-line text-slate-200',
                )}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={d}
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 30, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 grid place-items-center"
                  >
                    {d}
                  </motion.span>
                </AnimatePresence>
              </button>
              <button
                type="button"
                aria-label={`Chiffre ${i + 1} : diminuer`}
                onClick={() => {
                  setCursor(i)
                  setDigit(i, d - 1)
                }}
                className="cursor-pointer rounded-md p-1 text-slate-500 hover:bg-white/5 hover:text-neon"
              >
                <ChevronDown className="size-6" />
              </button>
              <span className="font-mono text-[0.625rem] text-slate-600">E{i + 1}</span>
            </div>
          ))}
        </div>

        {/* Pavé numérique */}
        <div className="mx-auto mt-5 grid max-w-xs grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => typeDigit(n)}
              className="h-12 cursor-pointer rounded-xl border border-line bg-panel-2 font-mono text-xl font-semibold text-white transition-colors hover:border-neon/60 active:bg-neon/20"
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCursor((c) => Math.max(0, c - 1))}
            aria-label="Position précédente"
            className="grid h-12 cursor-pointer place-items-center rounded-xl border border-line bg-panel-2 text-slate-400 hover:border-neon/60"
          >
            <Delete className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => typeDigit(0)}
            className="h-12 cursor-pointer rounded-xl border border-line bg-panel-2 font-mono text-xl font-semibold text-white hover:border-neon/60 active:bg-neon/20"
          >
            0
          </button>
          <Button size="lg" className="h-12" onClick={submit} disabled={success}>
            OK
          </Button>
        </div>
      </motion.div>

      <div className="mt-5 min-h-12 text-center">
        <AnimatePresence mode="wait">
          {status === 'error' && (
            <motion.p
              key="err"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-2 rounded-lg border border-alert/50 bg-alert/10 px-4 py-2 font-mono text-sm font-semibold uppercase tracking-wider text-alert"
            >
              <ShieldX className="size-4" /> Accès refusé · Code incorrect
            </motion.p>
          )}
          {success && (
            <motion.p
              key="ok"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 rounded-lg border border-med/50 bg-med/10 px-4 py-2 font-mono text-sm font-semibold uppercase tracking-wider text-med"
            >
              <LockOpen className="size-4" /> Accès autorisé · Fuite stoppée
            </motion.p>
          )}
        </AnimatePresence>
        {state.lockAttempts > 0 && !success && (
          <p className="mt-2 text-xs text-slate-500">Tentatives échouées : {state.lockAttempts}</p>
        )}
      </div>
    </motion.section>
  )
}
