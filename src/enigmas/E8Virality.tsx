import { motion } from 'framer-motion'
import { Check, ChevronRight, X } from 'lucide-react'
import { ChoiceBoard, type ChoiceItem } from '../components/ChoiceBoard'
import { EnigmaShell } from '../components/EnigmaShell'
import { ENIGMAS } from '../game/config'
import { cn } from '../lib/utils'

const STATEMENTS: ChoiceItem[] = [
  {
    id: 'filmer',
    tag: '1',
    content: 'Un patient qui filme les soignants dans sa chambre et poste la vidéo porte atteinte à leur droit à l’image.',
    correct: 'vrai',
    explanation: "Vrai : les soignants aussi ont un droit à l'image (Art. 9 C. civ.). L'hôpital peut porter plainte en leur nom.",
  },
  {
    id: 'disclaimer',
    tag: '2',
    content: '« Ces propos n’engagent que moi » dans ma bio protège mon établissement et mes collègues.',
    correct: 'faux',
    explanation: "Faux : les internautes font le lien entre la personne et son lieu de travail, malgré la mention.",
  },
  {
    id: 'prive',
    tag: '3',
    content: 'Un profil réglé en « privé » le reste définitivement : inutile de revérifier ses paramètres.',
    correct: 'faux',
    explanation: 'Faux : certains réseaux modifient leurs paramètres (parfois tous les 6 mois). Un profil privé peut devenir public.',
  },
  {
    id: 'viral',
    tag: '4',
    content: 'Une publication peut atteindre des inconnus par les amis d’amis, sans que son auteur puisse l’arrêter.',
    correct: 'vrai',
    explanation: 'Vrai : « un message sur un réseau social se diffuse sans contrôle ». Une fois partagé, il ne vous appartient plus.',
  },
  {
    id: 'prenom',
    tag: '5',
    content: 'Changer le prénom d’un patient suffit à garantir qu’il ne sera pas reconnu.',
    correct: 'faux',
    explanation: "Faux : le patient ou sa famille peuvent se reconnaître au contexte (service, date, situation).",
  },
  {
    id: 'geoloc',
    tag: '6',
    content: 'La géolocalisation d’une publication peut révéler où et quand je travaille.',
    correct: 'vrai',
    explanation: "Vrai : sans vous en rendre compte, vous indiquez où vous êtes et à quel moment précis.",
  },
]

const RINGS = [
  { label: 'Moi', people: ['Je publie'], cls: 'border-neon/60 bg-neon/10 text-neon' },
  { label: 'Cercle proche', people: ['Famille', 'Amis', 'Collègues'], cls: 'border-med/50 bg-med/10 text-med' },
  { label: 'Cercle élargi', people: ["Amis d'amis", 'Anciens amis'], cls: 'border-warn/50 bg-warn/10 text-warn' },
  { label: 'Hors contrôle', people: ['Inconnus', 'Inconnus', 'Inconnus…'], cls: 'border-alert/50 bg-alert/10 text-alert' },
]

/** D'après la planche « Viralité, mode d'emploi » du guide MACSF */
function Propagation() {
  return (
    <div className="rounded-2xl border border-line bg-panel/80 p-4">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-400">Viralité · mode d'emploi</p>
      <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
        {RINGS.map((r, i) => (
          <div key={r.label} className="flex flex-1 flex-col gap-2 md:flex-row md:items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.4 }}
              className={cn('flex-1 rounded-xl border p-3', r.cls)}
            >
              <p className="text-xs font-semibold uppercase tracking-wider">{r.label}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {r.people.map((p, j) => (
                  <span key={j} className="rounded-full bg-slate-950/60 px-2 py-0.5 text-xs text-slate-300">
                    {p}
                  </span>
                ))}
              </div>
            </motion.div>
            {i < RINGS.length - 1 && <ChevronRight className="mx-auto size-5 shrink-0 rotate-90 text-slate-500 md:rotate-0" />}
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-sm italic text-slate-400">
        « S'exprimer sur un réseau social, c'est comme parler au micro dans un stade. »
      </p>
    </div>
  )
}

export function E8Virality() {
  return (
    <EnigmaShell
      enigma={ENIGMAS[7]}
      briefing="La direction des soins prépare une formation pour les nouveaux étudiants à partir du guide de bonnes pratiques de la Fondation MACSF. Avant diffusion, auditez ces six affirmations."
      question="Calculez : [(nombre de VRAI × 3) − (nombre de FAUX × 1)] − 3."
    >
      <div className="space-y-5">
        <Propagation />
        <ChoiceBoard
          enigmaId={8}
          instruction="Vrai ou faux ?"
          choices={[
            { key: 'vrai', label: 'Vrai', icon: Check, tone: 'med' },
            { key: 'faux', label: 'Faux', icon: X, tone: 'alert' },
          ]}
          items={STATEMENTS}
        />
      </div>
    </EnigmaShell>
  )
}
