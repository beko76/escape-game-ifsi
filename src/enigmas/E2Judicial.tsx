import { FileWarning, Landmark, Scale } from 'lucide-react'
import { ChoiceBoard, type ChoiceItem } from '../components/ChoiceBoard'
import { EnigmaShell } from '../components/EnigmaShell'
import { Card } from '../components/ui/card'
import { ENIGMAS } from '../game/config'

const ITEMS: ChoiceItem[] = [
  {
    id: 'civil',
    tag: 'A',
    content: (
      <>
        <strong className="text-white">Atteinte au droit à l'image et à la vie privée</strong> du patient : la famille
        réclame des dommages et intérêts. <span className="font-mono text-xs text-neon">Art. 9 Code civil</span>
      </>
    ),
    correct: 'jud',
    explanation: 'Action civile devant le tribunal judiciaire : ordre judiciaire.',
  },
  {
    id: 'secret',
    tag: 'B',
    content: (
      <>
        <strong className="text-white">Violation du secret professionnel</strong> : l'état du patient et le service sont
        révélés. <span className="font-mono text-xs text-neon">Art. 226-13 Code pénal</span>
      </>
    ),
    correct: 'jud',
    explanation: 'Délit jugé par le tribunal correctionnel (1 an, 15 000 €) : ordre judiciaire.',
  },
  {
    id: 'cnil',
    tag: 'C',
    content: (
      <>
        <strong className="text-white">Manquement au RGPD</strong> : l'hôpital, qui n'a pas su protéger les données de
        santé, reçoit une amende de la CNIL. <span className="font-mono text-xs text-neon">RGPD</span>
      </>
    ),
    correct: 'adm',
    explanation: "La CNIL est une autorité administrative indépendante : son amende n'est pas prononcée par un juge judiciaire.",
  },
  {
    id: 'intimite',
    tag: 'D',
    content: (
      <>
        <strong className="text-white">Captation et diffusion de l'image d'une personne dans un lieu privé</strong>,
        sans son consentement. <span className="font-mono text-xs text-neon">Art. 226-1 Code pénal</span>
      </>
    ),
    correct: 'jud',
    explanation: "La chambre est un lieu privé pour le patient : délit puni d'1 an et 45 000 €, ordre judiciaire.",
  },
  {
    id: 'ifsi',
    tag: 'E',
    content: (
      <>
        <strong className="text-white">Exclusion de la formation</strong> prononcée par le directeur de l'IFSI après
        avis de la section disciplinaire.
      </>
    ),
    correct: 'adm',
    explanation: 'Sanction disciplinaire : décision administrative, contestable devant le tribunal administratif.',
  },
]

export function E2Judicial() {
  return (
    <EnigmaShell
      enigma={ENIGMAS[1]}
      briefing="Théo, ESI en stage en réanimation, a filmé un patient intubé et sédaté pendant sa toilette, puis posté la vidéo en story Snapchat. La famille a porté plainte. Le service juridique de l'hôpital liste les qualifications possibles."
      question="Combien de ces qualifications relèvent des juridictions de l'ordre judiciaire (pénal ou civil) ?"
    >
      <div className="space-y-5">
        <Card className="scanline border-alert/30 p-5">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-alert">
            <FileWarning className="size-4" /> Dossier contentieux n° 2026-RÉA-041
          </p>
          <div className="mt-3 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
            <p>
              <span className="block text-xs text-slate-500">Fait</span>
              Vidéo de 14 s, story Snapchat « Ambiance réa 🎧 »
            </p>
            <p>
              <span className="block text-xs text-slate-500">Diffusion</span>
              212 vues, 3 captures d'écran détectées
            </p>
            <p>
              <span className="block text-xs text-slate-500">Visible à l'écran</span>
              Visage du patient, scope, nom du service
            </p>
          </div>
        </Card>
        <ChoiceBoard
          enigmaId={2}
          instruction="Classez chaque qualification selon l'ordre qui la sanctionne."
          choices={[
            { key: 'jud', label: 'Ordre judiciaire', icon: Scale, tone: 'med' },
            { key: 'adm', label: 'Hors judiciaire', icon: Landmark, tone: 'alert' },
          ]}
          items={ITEMS}
        />
      </div>
    </EnigmaShell>
  )
}
