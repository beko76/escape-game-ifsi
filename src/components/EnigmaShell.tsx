import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import type { ReactNode } from 'react'
import type { EnigmaMeta } from '../game/config'
import { useGame } from '../game/GameContext'
import { AnswerPanel } from './AnswerPanel'
import { Button } from './ui/button'

interface Props {
  enigma: EnigmaMeta
  /** Consigne narrative affichée sous le titre */
  briefing: ReactNode
  question: string
  /** Scène interactive (mockup) */
  children: ReactNode
  /** Contenu pédagogique optionnel sous la réponse */
  aside?: ReactNode
}

export function EnigmaShell({ enigma, briefing, question, children, aside }: Props) {
  const { state, open } = useGame()
  const solved = !!state.solved[enigma.id]
  const Icon = enigma.icon

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-7xl px-4 py-6"
    >
      <Button variant="ghost" size="sm" onClick={() => open(null)} className="-ml-2 mb-4">
        <ArrowLeft /> Retour aux pièces d'investigation
      </Button>

      <div className="mb-6 flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-neon/30 bg-neon/10 text-neon">
          <Icon className="size-6" />
        </span>
        <div>
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-neon">
            Énigme {enigma.id}/6
            {solved && (
              <span className="inline-flex items-center gap-1 text-med">
                <CheckCircle2 className="size-3.5" /> résolue
              </span>
            )}
          </p>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{enigma.title}</h1>
          <div className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400 sm:text-base">{briefing}</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_23.75rem]">
        <div className="min-w-0">{children}</div>
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <AnswerPanel enigma={enigma} question={question} />
          {aside}
        </div>
      </div>
    </motion.section>
  )
}
