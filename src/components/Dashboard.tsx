import { motion } from 'framer-motion'
import { CheckCircle2, ChevronRight, Lock, LockOpen } from 'lucide-react'
import { ENIGMAS } from '../game/config'
import { useGame } from '../game/GameContext'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { Card } from './ui/card'

export function Dashboard() {
  const { state, open, solvedCount, allSolved } = useGame()

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-7xl px-4 py-6 sm:py-8"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-neon">Cellule de crise · {state.team}</p>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Pièces d'investigation</h1>
          <p className="mt-1 text-sm text-slate-400">
            Résolvez les énigmes dans l'ordre de votre choix. Chacune révèle un chiffre du code.
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl font-bold text-white">
            {solvedCount}
            <span className="text-slate-500">/6</span>
          </p>
          <p className="text-xs text-slate-400">énigmes résolues</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ENIGMAS.map((e, i) => {
          const solved = !!state.solved[e.id]
          return (
            <motion.button
              key={e.id}
              type="button"
              onClick={() => open(e.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className={cn(
                'group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-panel/80 p-5 text-left transition-colors',
                solved ? 'border-med/50 glow-med' : 'border-line hover:border-neon/60',
              )}
            >
              <div className="flex items-start justify-between">
                <span
                  className={cn(
                    'grid size-12 place-items-center rounded-xl',
                    solved ? 'bg-med/15 text-med' : 'bg-neon/10 text-neon',
                  )}
                >
                  <e.icon className="size-6" />
                </span>
                <span className="font-mono text-xs text-slate-500">#{e.id}</span>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-white">{e.title}</h2>
              <p className="text-sm text-slate-400">{e.subtitle}</p>
              <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                {solved ? (
                  <span className="flex items-center gap-2 text-sm text-med">
                    <CheckCircle2 className="size-4" /> Chiffre {e.id} :
                    <span className="rounded-md bg-slate-950 px-2 font-mono text-lg font-bold">{e.answer}</span>
                  </span>
                ) : (
                  <span className="text-sm text-slate-400">Chiffre {e.id} : <span className="font-mono">?</span></span>
                )}
                <ChevronRight className="size-5 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-neon" />
              </div>
            </motion.button>
          )
        })}
      </div>

      <Card className={cn('mt-6 flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left', allSolved && 'border-neon/60 glow-neon')}>
        <span className={cn('grid size-14 shrink-0 place-items-center rounded-2xl', allSolved ? 'bg-neon/15 text-neon' : 'bg-slate-800 text-slate-500')}>
          {allSolved ? <LockOpen className="size-7" /> : <Lock className="size-7" />}
        </span>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white">Serveur sécurisé · Cadenas final</h2>
          <p className="text-sm text-slate-400">
            {allSolved
              ? 'Tous les chiffres sont réunis. Saisissez le code dans l’ordre des énigmes (1 → 6).'
              : `Encore ${6 - solvedCount} chiffre${6 - solvedCount > 1 ? 's' : ''} à trouver avant de pouvoir tenter le code.`}
          </p>
        </div>
        <Button size="lg" disabled={!allSolved} onClick={() => open('lock')}>
          Accéder au cadenas
        </Button>
      </Card>
    </motion.section>
  )
}
