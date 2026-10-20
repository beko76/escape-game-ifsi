import { Lock, ShieldOff } from 'lucide-react'
import { ChoiceBoard, type ChoiceItem } from '../components/ChoiceBoard'
import { EnigmaShell } from '../components/EnigmaShell'
import { ENIGMAS } from '../game/config'

function Case({ title, children }: { title: string; children: string }) {
  return (
    <>
      <p className="font-mono text-xs uppercase tracking-wider text-neon">{title}</p>
      <p className="mt-1">{children}</p>
    </>
  )
}

const CASES: ChoiceItem[] = [
  {
    id: 'mineur',
    tag: '1',
    content: (
      <Case title="Urgences pédiatriques · Lina, 4 ans">
        Ecchymoses d'âges différents sur le dos et deux brûlures circulaires sur l'avant-bras. Les explications des
        parents varient. L'équipe adresse un signalement au procureur de la République.
      </Case>
    ),
    correct: 'derog',
    explanation: "Art. 226-14 1° CP : informer les autorités de sévices infligés à un mineur est autorisé, et même attendu.",
  },
  {
    id: 'adultere',
    tag: '2',
    content: (
      <Case title="Chirurgie · M. R., 47 ans">
        Il vous confie avoir une liaison. Le lendemain, son épouse vous prend à part : « Je sais qu'il vous parle.
        Dites-moi ce qu'il me cache. »
      </Case>
    ),
    correct: 'secret',
    explanation: "Aucun texte ne permet de révéler la vie privée d'un patient à son conjoint : le secret couvre aussi ce qui est confié.",
  },
  {
    id: 'couple',
    tag: '3',
    content: (
      <Case title="Orthopédie · Mme K., 34 ans">
        Hospitalisée pour une fracture du poignet, elle finit par dire que son conjoint la frappe et qu'il « va la tuer
        en rentrant ». Le médecin l'informe qu'il va signaler la situation au procureur, puis le fait.
      </Case>
    ),
    correct: 'derog',
    explanation:
      'Art. 226-14 3° CP : violences au sein du couple mettant la vie de la victime en danger immédiat. Le signalement est possible même sans son accord, en l’en informant.',
  },
  {
    id: 'refus',
    tag: '4',
    content: (
      <Case title="Oncologie · M. P., 58 ans">
        Lucide et informé, il refuse sa chimiothérapie et demande que ses enfants ne soient pas mis au courant. Ceux-ci
        exigent de connaître le diagnostic « pour le convaincre ».
      </Case>
    ),
    correct: 'secret',
    explanation:
      "Le refus de soins d'un adulte lucide se respecte. Même en cas de diagnostic grave, la famille n'est informée que si le patient ne s'y oppose pas (Art. L. 1110-4 CSP).",
  },
]

export function E4Derogations() {
  return (
    <EnigmaShell
      enigma={ENIGMAS[3]}
      briefing="Le cadre de santé vous remet quatre situations rencontrées cette semaine dans l'établissement. Pour chacune, la loi permet-elle de lever le secret professionnel ? Appuyez-vous sur l'Art. 226-14 du Code pénal."
      question="Combien de ces situations permettent légalement de lever le secret professionnel ?"
    >
      <ChoiceBoard
        enigmaId={4}
        instruction="Pour chaque situation, choisissez une issue."
        choices={[
          { key: 'derog', label: 'Dérogation légale', icon: ShieldOff, tone: 'med' },
          { key: 'secret', label: 'Secret maintenu', icon: Lock, tone: 'alert' },
        ]}
        items={CASES}
      />
    </EnigmaShell>
  )
}
