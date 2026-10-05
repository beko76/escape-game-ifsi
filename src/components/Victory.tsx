import { motion } from 'framer-motion'
import { Clock, Lightbulb, RotateCcw, ShieldCheck, Trophy, XCircle } from 'lucide-react'
import { ENIGMAS, GAME_DURATION_MS } from '../game/config'
import { useGame } from '../game/GameContext'
import { formatDuration } from '../lib/utils'
import { GoldenRulesDialog } from './GoldenRules'
import { TeacherDialog } from './TeacherDialog'
import { Button } from './ui/button'
import { Card } from './ui/card'

export function Victory() {
  const { state, elapsedMs } = useGame()
  const inTime = elapsedMs <= GAME_DURATION_MS
  const totalErrors = Object.values(state.errors).reduce((a, b) => a + (b ?? 0), 0) + state.lockAttempts

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-5xl px-4 py-8">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 12 }}
          className="mx-auto grid size-24 place-items-center rounded-3xl border-2 border-med bg-med/15 text-med glow-med"
        >
          <Trophy className="size-12" />
        </motion.div>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-med">Mission accomplie</p>
        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">Fuite stoppée, {state.team} !</h1>
        <p className="mx-auto mt-2 max-w-xl text-slate-400">
          {inTime
            ? 'Vous avez neutralisé la fuite de données dans le temps imparti. La Direction des Soins vous félicite.'
            : 'La fuite est stoppée, avec un peu de retard. L’essentiel : retenir les bons réflexes !'}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <Clock className="mx-auto size-5 text-neon" />
          <p className="mt-2 font-mono text-2xl font-bold text-white sm:text-3xl">{formatDuration(elapsedMs)}</p>
          <p className="text-xs text-slate-400">temps réalisé</p>
        </Card>
        <Card className="p-4 text-center">
          <Lightbulb className="mx-auto size-5 text-warn" />
          <p className="mt-2 font-mono text-2xl font-bold text-white sm:text-3xl">{state.hints.length}</p>
          <p className="text-xs text-slate-400">indice{state.hints.length > 1 ? 's' : ''} utilisé{state.hints.length > 1 ? 's' : ''}</p>
        </Card>
        <Card className="p-4 text-center">
          <XCircle className="mx-auto size-5 text-alert" />
          <p className="mt-2 font-mono text-2xl font-bold text-white sm:text-3xl">{totalErrors}</p>
          <p className="text-xs text-slate-400">erreur{totalErrors > 1 ? 's' : ''} de saisie</p>
        </Card>
      </div>

      <h2 className="mt-10 flex items-center gap-2 text-xl font-bold text-white">
        <ShieldCheck className="size-5 text-med" /> Débriefing : ce qu'il faut retenir
      </h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {ENIGMAS.map((e, i) => (
          <motion.div key={e.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.07 }}>
            <Card className="flex h-full gap-4 p-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-slate-950 font-mono text-2xl font-bold text-med glow-med">
                {e.answer}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-semibold text-white">
                  <e.icon className="size-4 text-neon" /> {e.title}
                </p>
                <p className="mt-1 font-mono text-xs text-neon">{e.debrief.law}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{e.debrief.takeaway}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <GoldenRulesDialog />
        <TeacherDialog
          trigger={
            <Button variant="ghost" size="lg">
              <RotateCcw /> Réinitialiser pour une autre équipe
            </Button>
          }
        />
      </div>
    </motion.section>
  )
}
