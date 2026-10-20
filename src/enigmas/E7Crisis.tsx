import { Globe, MessageCircle, MoreHorizontal, Share2, ThumbsUp, X } from 'lucide-react'
import { ChoiceBoard, type ChoiceItem } from '../components/ChoiceBoard'
import { EnigmaShell } from '../components/EnigmaShell'
import { ENIGMAS } from '../game/config'

const PHOTO = `${import.meta.env.BASE_URL}images/post-pause-soignantes.jpg`

const COMMENTS = [
  { who: 'Sandrine L.', text: 'Honteux !!! On leur confie nos enfants 🤬' },
  { who: 'Marc T.', text: 'Et après ça se plaint de manquer de moyens… faut les virer' },
  { who: 'Julie P.', text: "Je reconnais le service, c'est au CH Val-de-Seine. Ma fille y était le mois dernier" },
]

const BEHAVIORS: ChoiceItem[] = [
  {
    id: 'repondre',
    tag: 'A',
    content: "Je réponds en commentaire que c'était leur pause réglementaire et que ce parent ment.",
    correct: 'ko',
    explanation: "À éviter : répondre soi-même, c'est parler au nom de l'établissement et nourrir la polémique.",
  },
  {
    id: 'alerter',
    tag: 'B',
    content: "J'alerte ma cadre de santé, qui prévient la direction de la communication.",
    correct: 'ok',
    explanation:
      "Bonne pratique (guide MACSF) : la hiérarchie et la communication décident d'une éventuelle réponse et peuvent demander le retrait de la photo, qui expose aussi le tableau des patients.",
  },
  {
    id: 'partager',
    tag: 'C',
    content: 'Je partage la publication sur mon compte avec un message de soutien à mes collègues.',
    correct: 'ko',
    explanation: "À éviter : chaque partage relance la viralité et diffuse encore l'image des soignantes et les données des patients.",
  },
  {
    id: 'mp',
    tag: 'D',
    content: 'J’écris en privé au parent, en me présentant comme soignante du service, pour lui demander de retirer la photo.',
    correct: 'ko',
    explanation: "À éviter : même en message privé, vous engagez l'établissement. Ce n'est pas votre rôle.",
  },
  {
    id: 'equipe',
    tag: 'E',
    content: "J'en parle avec l'équipe lors d'un temps d'échange dans le service, pour que personne ne réagisse seul en ligne.",
    correct: 'ok',
    explanation:
      'Bonne pratique (guide MACSF) : en parler dans son service pour alerter sur les conséquences, et soutenir les collègues exposées.',
  },
  {
    id: 'planning',
    tag: 'F',
    content: "Je publie le planning de la nuit pour prouver que l'équipe était au complet.",
    correct: 'ko',
    explanation: "À éviter : un document interne avec des noms ne se diffuse pas. Vous ajouteriez une fuite à la crise.",
  },
]

function FacebookPost() {
  return (
    <div className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-white text-slate-800 shadow-2xl shadow-cyan-950/40">
      <div className="flex items-center gap-2 p-3">
        <span className="grid size-10 place-items-center rounded-full bg-rose-600 font-bold text-white">K</span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-sm font-semibold">Kévin Dumas</p>
          <p className="flex items-center gap-1 text-xs text-slate-500">
            7 h · <Globe className="size-3" /> Public
          </p>
        </div>
        <MoreHorizontal className="size-5 text-slate-500" />
        <X className="size-5 text-slate-500" />
      </div>
      <p className="px-3 pb-3 text-sm leading-relaxed">
        Voilà comment on s'occupe de NOS ENFANTS en pédiatrie 😡😡 Mon fils sonne depuis 20 minutes et elles DORMENT !!!
        PARTAGEZ un maximum, tout le monde doit savoir 👇
      </p>
      <img
        src={PHOTO}
        alt="Deux soignantes, la tête posée sur la table, devant le tableau blanc du service de pédiatrie"
        className="block w-full"
      />
      <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-500">
        <span>😡😮👍 1,2 k</span>
        <span>486 commentaires · 2,4 k partages</span>
      </div>
      <div className="mx-3 grid grid-cols-3 border-y border-slate-200 py-1 text-sm font-medium text-slate-500">
        <span className="flex items-center justify-center gap-1.5 py-1">
          <ThumbsUp className="size-4" /> J'aime
        </span>
        <span className="flex items-center justify-center gap-1.5 py-1">
          <MessageCircle className="size-4" /> Commenter
        </span>
        <span className="flex items-center justify-center gap-1.5 py-1">
          <Share2 className="size-4" /> Partager
        </span>
      </div>
      <div className="space-y-2 p-3">
        {COMMENTS.map((c) => (
          <div key={c.who} className="flex gap-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-200 text-xs font-semibold">
              {c.who[0]}
            </span>
            <p className="rounded-2xl bg-slate-100 px-3 py-1.5 text-sm">
              <span className="block text-xs font-semibold">{c.who}</span>
              {c.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function E7Crisis() {
  return (
    <EnigmaShell
      enigma={ENIGMAS[6]}
      briefing="Pendant leur pause dans la salle de repos, deux soignantes du service ont été photographiées à leur insu par un parent. Sa publication a été partagée 2 400 fois dans la nuit. Vous êtes ESI dans ce service. Que faites-vous ?"
      question="Calculez : (nombre de réactions proposées − nombre de bonnes pratiques) + 3."
    >
      <div className="space-y-6">
        <FacebookPost />
        <ChoiceBoard
          enigmaId={7}
          instruction="Pour chaque réaction : bonne pratique ou à éviter ?"
          choices={[
            { key: 'ok', label: 'Bonne pratique', icon: ThumbsUp, tone: 'med' },
            { key: 'ko', label: 'À éviter', icon: X, tone: 'alert' },
          ]}
          items={BEHAVIORS}
        />
      </div>
    </EnigmaShell>
  )
}
