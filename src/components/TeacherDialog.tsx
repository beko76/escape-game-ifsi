import { motion, useAnimationControls } from 'framer-motion'
import { KeyRound, MonitorPlay, RotateCcw } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { TEACHER_PASSWORD } from '../game/config'
import { useGame } from '../game/GameContext'
import { cn } from '../lib/utils'
import { Button, buttonVariants } from './ui/button'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'

/** Réinitialisation protégée par le mot de passe enseignant. */
export function TeacherDialog({ trigger }: { trigger: ReactNode }) {
  const { reset } = useGame()
  const [open, setOpen] = useState(false)
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState(false)
  const controls = useAnimationControls()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (pwd.trim().toUpperCase() === TEACHER_PASSWORD.toUpperCase()) {
      setOpen(false)
      setPwd('')
      reset()
    } else {
      setError(true)
      void controls.start({ x: [0, -10, 10, -8, 8, 0], transition: { duration: 0.4 } })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        setError(false)
        setPwd('')
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        title="Espace enseignant"
        description="Réinitialiser la partie pour une nouvelle équipe. La progression actuelle sera effacée."
        icon={<KeyRound className="mt-0.5 size-6 text-warn" />}
      >
        <motion.form animate={controls} onSubmit={submit} className="space-y-4">
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
          <Button type="submit" variant="danger" className="w-full">
            <RotateCcw /> Réinitialiser pour une autre équipe
          </Button>
        </motion.form>
        <div className="mt-5 border-t border-line pt-5">
          <p className="text-sm text-slate-400">Suivre toutes les équipes en direct pendant la séance :</p>
          <a
            href="#/prof"
            onClick={() => setOpen(false)}
            className={cn(buttonVariants({ variant: 'outline' }), 'mt-3 w-full')}
          >
            <MonitorPlay /> Ouvrir le tableau de bord enseignant
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
