import { CheckCircle2, CreditCard, Eye, ScrollText, ShieldAlert, Unlock, XCircle } from 'lucide-react'
import { ChoiceBoard, type ChoiceItem } from '../components/ChoiceBoard'
import { EnigmaShell } from '../components/EnigmaShell'
import { ENIGMAS } from '../game/config'
import { cn } from '../lib/utils'

const RESIDENTS = ['Ch.104 · M. Lefèvre, 88 ans', 'Ch.105 · Mme Roussel, 92 ans', 'Ch.107 · Mme Garnier, 85 ans', 'Ch.110 · M. Petit, 79 ans']

const TRACES = [
  { t: '07:02:45', who: 'DUBOIS C.', what: 'Connexion poste PSOINS-01 (carte CPS)' },
  { t: '09:41:10', who: 'DUBOIS C.', what: 'Validation transmissions · Ch.105 (saisie ESI)' },
  { t: '10:15:33', who: 'DUBOIS C.', what: 'Session inactive depuis 22 min · Ch.107 ouvert' },
]

const STATEMENTS: ChoiceItem[] = [
  {
    id: 'session',
    tag: '1',
    content:
      "Le fait de laisser une session active de DPI ouverte sans surveillance sur l'ordinateur du couloir pendant que l'infirmière réalise un soin en chambre constitue une faute de sécurité informatique engageant sa responsabilité.",
    correct: 'vrai',
    explanation:
      "Vrai : une session ouverte permet à n'importe qui de lire ou de saisir sous son nom. On verrouille son poste dès qu'on s'éloigne.",
  },
  {
    id: 'cps',
    tag: '2',
    content:
      'Laisser sa carte CPS (Carte de Professionnel de Santé) insérée dans le lecteur de l’ordinateur lorsqu’on s’éloigne du poste de soins est une pratique tolérée pour gagner du temps lors des transmissions de relève.',
    correct: 'faux',
    explanation:
      "Faux : la carte CPS est l'identité numérique du soignant. Elle se retire dès qu'on quitte le poste, aucune tolérance pour « gagner du temps ».",
  },
  {
    id: 'postit',
    tag: '3',
    content:
      'Inscrire le mot de passe de la session DPI sur un Post-it collé sur l’écran pour faciliter le travail des remplaçants et des stagiaires respecte les protocoles RGPD.',
    correct: 'faux',
    explanation:
      "Faux : un mot de passe affiché n'est plus secret. Le RGPD impose des mesures de sécurité adaptées ; remplaçants et stagiaires doivent avoir leurs propres comptes.",
  },
  {
    id: 'ecran',
    tag: '4',
    content:
      "L'orientation de l'écran d'ordinateur du poste de soins directement vers le couloir, permettant aux résidents déambulants et aux visiteurs de lire les dossiers médicaux, viole les principes de confidentialité.",
    correct: 'vrai',
    explanation:
      "Vrai : laisser des données de santé lisibles par des tiers est une atteinte au secret. L'écran doit être orienté hors de la vue du public (ou équipé d'un filtre de confidentialité).",
  },
  {
    id: 'usb',
    tag: '5',
    content:
      "Brancher une clé USB personnelle sur la station informatique de l'EHPAD pour y copier des données nominatives de résidents afin de finir son plan de soins chez soi est strictement interdit par les règles de sécurité des SI de santé.",
    correct: 'vrai',
    explanation:
      "Vrai : les données de santé ne sortent pas des outils validés par l'établissement. Une clé perso peut être perdue, volée ou introduire un virus.",
  },
  {
    id: 'titulaire',
    tag: '6',
    content:
      "Si un ESI (Étudiant Infirmier) valide des transmissions et des actes sous le compte de l'infirmière tuteur avec l'accord de celle-ci, l'infirmière titulaire du compte est juridiquement présumée responsable des actes enregistrés sous son identifiant.",
    correct: 'vrai',
    explanation:
      "Vrai : la traçabilité attribue chaque acte au titulaire de la session. En prêtant son compte, la tutrice endosse des actes qu'elle n'a pas réalisés.",
  },
  {
    id: 'usurpation',
    tag: '7',
    content:
      "L'étudiant qui utilise les identifiants d'un tiers commet une usurpation d'accès et une falsification de traçabilité, restant lui-même pénalement responsable de ses actes.",
    correct: 'vrai',
    explanation:
      "Vrai : l'accord de la tutrice ne l'exonère pas. Le journal des accès ne reflète plus qui a réellement agi, et l'étudiant répond de ses propres actes.",
  },
  {
    id: 'dsi',
    tag: '8',
    content:
      "La Direction des Systèmes d'Information (DSI) et l'établissement n'ont aucune responsabilité juridique en cas d'absence de création de comptes informatiques individuels pour les stagiaires, la faute incombant uniquement à l'étudiant.",
    correct: 'faux',
    explanation:
      "Faux : l'établissement doit organiser la sécurité de son SI, dont des accès individuels pour chaque utilisateur. Sans compte stagiaire, sa responsabilité est engagée.",
  },
]

function Screen() {
  return (
    <div className="space-y-3">
      <div className="flex gap-3 rounded-xl border border-warn/40 bg-warn/10 p-3 text-sm text-amber-100">
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-warn" />
        <p>
          <strong>Constat RSSI, 10h15 :</strong> poste du couloir allumé, écran tourné vers la salle d'activités, aucune
          infirmière en vue. L'IDE réalise un soin en chambre 107.
        </p>
      </div>

      <div className="relative rounded-xl border-[0.375rem] border-slate-800 bg-slate-900 shadow-2xl">
        <div className="absolute -top-3 right-4 z-10 rotate-3 rounded-sm bg-yellow-200 px-2 py-1 font-mono text-[0.6875rem] text-slate-800 shadow-md">
          DPI : Ehpad2026!
        </div>
        <div className="overflow-hidden rounded-md bg-[#eef3f8] text-slate-800">
          <div className="flex items-center gap-2 bg-[#1d4f91] px-3 py-1.5 text-xs text-white">
            <Unlock className="size-3.5 text-amber-300" />
            <span className="font-semibold">DPI · Session : C. DUBOIS, IDE</span>
            <span className="ml-auto hidden text-white/70 sm:inline">EHPAD Les Tilleuls · poste PSOINS-01</span>
          </div>
          <div className="flex text-xs">
            <div className="w-[38%] space-y-1 border-r border-slate-300 bg-white p-2 sm:w-[30%]">
              <p className="font-bold text-[#1d4f91]">Résidents</p>
              {RESIDENTS.map((r, i) => (
                <p key={r} className={cn('truncate rounded px-1', i === 2 && 'bg-[#dbe8f7] font-semibold')}>
                  {r}
                </p>
              ))}
            </div>
            <div className="flex-1 space-y-2 p-2">
              <p className="font-bold text-[#1d4f91]">Transmissions ciblées · Ch.107 Mme Garnier</p>
              <div className="rounded border border-slate-300 bg-white p-2 leading-relaxed text-slate-600">
                <p>
                  <b>D :</b> chute nocturne, hématome hanche gauche
                </p>
                <p>
                  <b>A :</b> surveillance douleur, avis médecin coordonnateur
                </p>
                <p>
                  <b>R :</b> <span className="italic text-slate-400">à compléter</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[0.6875rem]">
                <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-800">
                  <CreditCard className="size-3" /> Carte CPS insérée
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-slate-200 px-1.5 py-0.5 text-slate-700">
                  USB : « CLE_PERSO » connectée
                </span>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-300 bg-slate-100 p-2 font-mono text-[0.6875rem]">
            <p className="mb-1 flex items-center gap-1 font-sans font-bold text-slate-700">
              <ScrollText className="size-3.5" /> Journal des accès (traçabilité)
            </p>
            {TRACES.map((l) => (
              <p key={l.t} className="truncate text-slate-600">
                {l.t} · <b>{l.who}</b> · {l.what}
              </p>
            ))}
          </div>
        </div>
      </div>

      <p className="flex items-center gap-2 text-xs text-slate-400">
        <Eye className="size-4 shrink-0" /> Deux visiteurs et un résident déambulant passent devant l'écran pendant le
        contrôle.
      </p>
    </div>
  )
}

export function E5DPI() {
  return (
    <EnigmaShell
      enigma={ENIGMAS[4]}
      briefing="Audit inopiné de la sécurité des systèmes d'information (RSSI) dans un EHPAD. Au poste de soins des résidents, plusieurs infractions aux règles de protection du dossier patient informatisé (DPI) et des transmissions ciblées sont constatées. Examinez les huit affirmations relatives à ce contrôle."
      question="Calculez : (nombre d'affirmations vraies × 2) − 2."
    >
      <div className="space-y-5">
        <Screen />
        <ChoiceBoard
          enigmaId={5}
          instruction="Au regard du droit de la cybersécurité en santé et du RGPD, chaque affirmation est-elle vraie ?"
          choices={[
            { key: 'vrai', label: 'Vraie', icon: CheckCircle2, tone: 'med' },
            { key: 'faux', label: 'Fausse', icon: XCircle, tone: 'alert' },
          ]}
          items={STATEMENTS}
        />
      </div>
    </EnigmaShell>
  )
}
