import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, MessageSquare, RotateCcw, UserPlus } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { EnigmaShell } from '../components/EnigmaShell'
import { Button } from '../components/ui/button'
import { ENIGMAS } from '../game/config'
import { sound } from '../lib/sound'
import { cn } from '../lib/utils'

type NodeId = 'q1' | 'q2' | 'end7' | 'end3' | 'end9' | 'end1' | 'end5'

interface Choice {
  key: string
  label: string
  next: NodeId
}

interface Question {
  kind: 'question'
  step: number
  icon: ReactNode
  situation: string
  choices: Choice[]
}

interface Ending {
  kind: 'end'
  box: number
  text: string
}

const TREE: Record<NodeId, Question | Ending> = {
  q1: {
    kind: 'question',
    step: 1,
    icon: <UserPlus className="size-5" />,
    situation:
      'Mme P., une patiente que vous avez prise en charge pendant votre stage, vous envoie une demande d’ami sur Facebook avec le message : « Merci pour tout, vous êtes adorable ! »',
    choices: [
      { key: 'X', label: "J'accepte : elle est sortie de l'hôpital, ce n'est plus ma patiente.", next: 'end7' },
      { key: 'Y', label: 'Je refuse poliment et je garde une relation strictement professionnelle.', next: 'q2' },
      { key: 'Z', label: "J'accepte mais je la mets dans une liste « accès restreint ».", next: 'end3' },
    ],
  },
  q2: {
    kind: 'question',
    step: 2,
    icon: <MessageSquare className="size-5" />,
    situation:
      'Un ami vous envoie par SMS la photo d’une plaie au mollet : « Toi qui fais des études d’infirmier, tu peux me dire si c’est infecté ? Je n’ai pas envie d’aller chez le médecin. »',
    choices: [
      { key: 'M', label: "Je lui donne mon avis et lui conseille une crème antiseptique.", next: 'end9' },
      { key: 'N', label: 'Je ne pose aucun avis à distance et je le réoriente vers son médecin.', next: 'end1' },
      { key: 'P', label: "Je montre la photo à l'infirmière de mon service pour avoir son avis.", next: 'end5' },
    ],
  },
  end7: {
    kind: 'end',
    box: 7,
    text: "Trois semaines plus tard, Mme P. commente vos photos de soirée et sa famille vous écrit pour avoir des nouvelles de sa voisine hospitalisée…",
  },
  end3: {
    kind: 'end',
    box: 3,
    text: "Mme P. voit que vous êtes « amis ». Elle commence à vous demander des conseils sur ses traitements en message privé…",
  },
  end9: {
    kind: 'end',
    box: 9,
    text: "La plaie s'aggrave pendant le week-end. Votre ami vous reproche de lui avoir dit que « ce n'était rien ».",
  },
  end1: {
    kind: 'end',
    box: 1,
    text: "Votre ami consulte son médecin le jour même. Vous êtes resté·e dans votre rôle sans faire circuler de photo.",
  },
  end5: {
    kind: 'end',
    box: 5,
    text: "La photo d'une personne extérieure au service circule désormais sur votre lieu de stage, sans son consentement.",
  },
}

function Tree() {
  const [node, setNode] = useState<NodeId>('q1')
  const [path, setPath] = useState<string[]>([])
  const current = TREE[node]

  const choose = (c: Choice) => {
    sound.click()
    setPath((p) => [...p, c.key])
    setNode(c.next)
  }

  const restart = () => {
    setNode('q1')
    setPath([])
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-slate-400">
        <span className="rounded border border-line px-2 py-1">DÉPART</span>
        {path.map((k, i) => (
          <span key={i} className="flex items-center gap-2">
            <ChevronRight className="size-3" />
            <span className="rounded border border-neon/40 bg-neon/10 px-2 py-1 text-neon">Choix {k}</span>
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={node}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
        >
          {current.kind === 'question' ? (
            <div className="rounded-2xl border border-line bg-panel-2/70 p-5">
              <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neon">
                {current.icon} Étape {current.step}/2
              </p>
              <p className="mt-3 text-base leading-relaxed text-white sm:text-lg">{current.situation}</p>
              <div className="mt-5 space-y-3">
                {current.choices.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => choose(c)}
                    className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-line bg-slate-950/60 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-neon/60"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-neon/10 font-mono font-bold text-neon group-hover:bg-neon group-hover:text-slate-950">
                      {c.key}
                    </span>
                    <span className="text-sm text-slate-200">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-neon/40 bg-panel-2/70 p-6 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-slate-400">Vous arrivez à la case</p>
              <motion.p
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                className={cn('mx-auto my-4 grid size-24 place-items-center rounded-2xl border-2 border-neon bg-slate-950 font-mono text-5xl font-bold text-neon text-glow')}
              >
                {current.box}
              </motion.p>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-300">{current.text}</p>
              <p className="mt-4 text-xs text-slate-500">
                Ce chemin vous semble-t-il être le bon ? Sinon, recommencez.
              </p>
              <Button variant="outline" className="mt-4" onClick={restart}>
                <RotateCcw /> Recommencer le parcours
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export function E4DecisionTree() {
  return (
    <EnigmaShell
      enigma={ENIGMAS[3]}
      briefing="Deux situations du quotidien d'un étudiant connecté. Faites les choix d'un professionnel : la case d'arrivée du bon parcours vous donnera le chiffre."
      question="Suivez le parcours professionnel jusqu'au bout. Quel est le numéro de la case d'arrivée ?"
    >
      <Tree />
    </EnigmaShell>
  )
}
