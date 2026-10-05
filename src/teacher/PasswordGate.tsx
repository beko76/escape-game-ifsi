import { motion, useAnimationControls } from 'framer-motion'
import { ArrowLeft, KeyRound } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { TEACHER_PASSWORD } from '../game/config'

const UNLOCK_KEY = 'escape-ifsi-prof-ok'

function isUnlocked() {
  try {
    return sessionStorage.getItem(UNLOCK_KEY) === '1'
  } catch {
    return false
  }
}

/** Protège le tableau de bord par le mot de passe enseignant (mémorisé le temps de l'onglet). */
export function PasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(isUnlocked)
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState(false)
  const controls = useAnimationControls()

  if (unlocked) return children

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (pwd.trim().toUpperCase() === TEACHER_PASSWORD.toUpperCase()) {
      try {
        sessionStorage.setItem(UNLOCK_KEY, '1')
      } catch {
        /* ignore */
      }
      setUnlocked(true)
    } else {
      setError(true)
      void controls.start({ x: [0, -10, 10, -8, 8, 0], transition: { duration: 0.4 } })
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10">
      <motion.div animate={controls}>
        <Card className="p-6">
          <span className="grid size-12 place-items-center rounded-2xl bg-warn/10 text-warn">
            <KeyRound className="size-6" />
          </span>
          <h1 className="mt-4 text-xl font-bold text-white">Tableau de bord enseignant</h1>
          <p className="mt-1 text-sm text-slate-400">Suivi en direct des équipes de l'escape game.</p>
          <form onSubmit={submit} className="mt-5 space-y-3">
            <label className="block text-sm text-slate-300">
              Mot de passe enseignant
              <input
                type="password"
                autoFocus
                value={pwd}
                onChange={(e) => {
                  setPwd(e.target.value)
                  setError(false)
                }}
                className="mt-2 h-11 w-full rounded-lg border border-line bg-slate-950 px-3 font-mono text-white outline-none focus:border-neon"
              />
            </label>
            {error && <p className="text-sm text-alert">Mot de passe incorrect.</p>}
            <Button type="submit" className="w-full">
              Accéder au tableau de bord
            </Button>
          </form>
        </Card>
      </motion.div>
      <a href="#" className="mt-6 inline-flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-300">
        <ArrowLeft className="size-4" /> Retour au jeu
      </a>
    </main>
  )
}
