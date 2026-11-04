import { Gavel, ImageOff, Landmark, Lock, ThumbsDown, ThumbsUp } from 'lucide-react'
import { ChoiceBoard, type ChoiceItem } from '../components/ChoiceBoard'
import { EnigmaShell } from '../components/EnigmaShell'
import { Card } from '../components/ui/card'
import { ENIGMAS } from '../game/config'

const ARGUMENTS: ChoiceItem[] = [
  {
    id: 'horstemps',
    tag: '1',
    content:
      '« Les publications litigieuses ont été postées exclusivement depuis mon domicile et pendant mon week-end, c’est-à-dire strictement en dehors de mon temps de stage et de mes heures de formation à l’IFSI. »',
    correct: 'rejete',
    explanation:
      "Rejeté : des faits commis en dehors du service peuvent être sanctionnés dès lors qu'ils visent l'institution ou ses membres et portent atteinte à leur réputation.",
  },
  {
    id: 'prive',
    tag: '2',
    content:
      '« Mon compte personnel sur la plateforme était configuré avec le paramètre “privé” et restreint à un cercle d’amis, ce qui constitue une correspondance privée inviolable. »',
    correct: 'rejete',
    explanation:
      "Rejeté : un message accessible à plusieurs dizaines d'« amis » n'est pas une correspondance privée. Les captures circulent : « c'est sur le web, c'est donc public » (guide MACSF).",
  },
  {
    id: 'expression',
    tag: '3',
    content:
      '« Le principe constitutionnel de la liberté d’expression m’autorise à exprimer librement mon mécontentement et mon opinion critique sur l’organisation des soins dans un hôpital public. »',
    correct: 'rejete',
    explanation:
      "Rejeté : la liberté d'expression n'est pas absolue. Elle ne couvre ni la diffamation, ni les photos dégradantes, et elle est limitée par le devoir de réserve et la déontologie.",
  },
  {
    id: 'prenoms',
    tag: '4',
    content:
      '« Je n’ai mentionné aucun nom de famille ni aucune fonction précise dans mes publications, uniquement les prénoms des cadres et le nom générique du service. »',
    correct: 'rejete',
    explanation:
      "Rejeté : prénoms, service et photos suffisent à identifier les personnes visées. Les cadres se sont reconnues, tout comme leurs collègues.",
  },
  {
    id: 'prejudice',
    tag: '5',
    content:
      '« L’établissement de santé n’a subi aucun préjudice financier direct ou perte de matériel consécutive à mes publications sur Internet. »',
    correct: 'rejete',
    explanation:
      "Rejeté : la sanction disciplinaire réprime un manquement aux obligations de l'étudiant. Elle n'exige aucun préjudice financier : l'atteinte à la dignité des personnes et à l'image de l'institution suffit.",
  },
  {
    id: 'charte',
    tag: '6',
    content:
      '« Aucune charte informatique ou charte du soignant connecté n’avait été signée ni remise en mains propres le jour de ma rentrée administrative à l’IFSI. »',
    correct: 'retenu',
    explanation:
      "Peut être retenu : l'IFSI a une obligation d'information envers ses étudiants. Le juge vérifiera si les règles avaient été portées à sa connaissance, sans pour autant effacer la gravité des propos.",
  },
]

function Evidence() {
  return (
    <Card className="overflow-hidden">
      <p className="flex items-center gap-2 border-b border-line bg-slate-950/60 px-4 py-2 font-mono text-xs uppercase tracking-widest text-slate-400">
        Pièce n° 1 · capture d'écran versée au dossier
      </p>
      <div className="bg-white p-4 text-slate-800">
        <div className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white">Y</span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Yanis B.</p>
            <p className="flex items-center gap-1 text-xs text-slate-500">
              Samedi à 23:12 · <Lock className="size-3" /> Amis
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed">
          Encore une semaine de calvaire en chirurgie 🤡 Sandrine et Christine, les pires cadres de France : incompétentes
          et elles harcèlent les étudiants. Petit montage photo pour vous les présenter 😂👇
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="flex aspect-video flex-col items-center justify-center gap-1 rounded-md bg-slate-200 text-center text-[0.6875rem] text-slate-500"
            >
              <ImageOff className="size-5" />
              Photo masquée par le greffe
            </div>
          ))}
        </div>
        <p className="mt-3 border-t border-slate-200 pt-2 text-xs text-slate-500">😆😡 64 · 31 commentaires · 7 partages</p>
      </div>
    </Card>
  )
}

export function E6Tribunal() {
  return (
    <EnigmaShell
      enigma={ENIGMAS[5]}
      briefing="Yanis, ESI en 2e année, a diffusé sur un réseau social des commentaires diffamants et des photos dégradantes de l'équipe d'encadrement. Après avis de la section disciplinaire, il est exclu de son IFSI pour 6 mois. Il saisit le tribunal administratif. Vous êtes le rapporteur : analysez la solidité de ses six arguments au regard du droit de la fonction publique hospitalière et de la déontologie soignante."
      question="Calculez : nombre d'arguments totalement rejetés par le juge + 2."
    >
      <div className="space-y-5">
        <Evidence />
        <div className="flex items-center gap-3 rounded-xl border border-neon/30 bg-neon/5 px-4 py-3 text-sm text-cyan-100">
          <Landmark className="size-5 shrink-0 text-neon" />
          <p>
            <strong>Tribunal administratif</strong> · Requête n° 2026-0412 · B. Yanis c/ IFSI · Mémoire en défense
          </p>
          <Gavel className="ml-auto hidden size-5 shrink-0 text-neon sm:block" />
        </div>
        <ChoiceBoard
          enigmaId={6}
          instruction="Pour chaque argument, rendez votre avis."
          choices={[
            { key: 'retenu', label: 'Peut être retenu', icon: ThumbsUp, tone: 'med' },
            { key: 'rejete', label: 'Rejeté', icon: ThumbsDown, tone: 'alert' },
          ]}
          items={ARGUMENTS}
        />
      </div>
    </EnigmaShell>
  )
}
