import { Gavel, Globe, Landmark, ThumbsDown, ThumbsUp } from 'lucide-react'
import { ChoiceBoard, type ChoiceItem } from '../components/ChoiceBoard'
import { EnigmaShell } from '../components/EnigmaShell'
import { Card } from '../components/ui/card'
import { ENIGMAS } from '../game/config'

const ARGUMENTS: ChoiceItem[] = [
  {
    id: 'prive',
    tag: '1',
    content: '« Mon compte Facebook est en mode privé : seuls mes amis pouvaient voir la publication. »',
    correct: 'rejete',
    explanation:
      "Rejeté : la preuve, la capture d'écran est arrivée jusqu'aux parents. Un message se diffuse sans contrôle, et les paramètres de confidentialité changent sans prévenir (guide MACSF).",
  },
  {
    id: 'nom',
    tag: '2',
    content: '« Je n’ai cité aucun nom : personne ne peut savoir de quel enfant je parle. »',
    correct: 'rejete',
    explanation:
      "Rejeté : service, numéro de chambre, âge et motif d'hospitalisation suffisent. Les parents se sont reconnus : c'est une identification indirecte.",
  },
  {
    id: 'bio',
    tag: '3',
    content: '« Ma bio précise “Mes propos n’engagent que moi”. »',
    correct: 'rejete',
    explanation:
      "Rejeté : selon le guide MACSF, cette mention ne protège rien. Les internautes font le lien avec l'établissement et les collègues.",
  },
  {
    id: 'etudiant',
    tag: '4',
    content: '« Je suis étudiant : le secret professionnel ne s’applique qu’aux infirmiers diplômés. »',
    correct: 'rejete',
    explanation:
      "Rejeté : l'Art. L. 1110-4 CSP s'impose à toute personne intervenant dans le système de santé, y compris les étudiants en stage.",
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
              Hier à 22:47 · <Globe className="size-3" /> Amis
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed">
          Journée de fou en pédiatrie 😩 Le petit de la chambre 8, 3 ans, hospitalisé pour sa gastro, m'a encore vomi
          dessus. Et ses parents, de vrais cas sociaux 🙄 Vivement la fin du stage !
        </p>
        <p className="mt-3 border-t border-slate-200 pt-2 text-xs text-slate-500">👍😆 87 · 23 commentaires · 4 partages</p>
      </div>
    </Card>
  )
}

export function E6Tribunal() {
  return (
    <EnigmaShell
      enigma={ENIGMAS[5]}
      briefing="Yanis, ESI en 2e année, a publié ce message. Les parents de l'enfant l'ont découvert grâce à une capture d'écran. Après avis de la section disciplinaire, le directeur de l'IFSI a prononcé son exclusion. Yanis saisit le tribunal administratif. Vous êtes le rapporteur : examinez sa défense."
      question="Combien des arguments de défense de Yanis le tribunal doit-il rejeter ?"
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
            { key: 'retenu', label: 'Retenu', icon: ThumbsUp, tone: 'med' },
            { key: 'rejete', label: 'Rejeté', icon: ThumbsDown, tone: 'alert' },
          ]}
          items={ARGUMENTS}
        />
      </div>
    </EnigmaShell>
  )
}
