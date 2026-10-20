import { CheckCircle2, MessageSquareQuote, ScrollText, Unlock, XCircle } from 'lucide-react'
import { ChoiceBoard, type ChoiceItem } from '../components/ChoiceBoard'
import { EnigmaShell } from '../components/EnigmaShell'
import { ENIGMAS } from '../game/config'
import { cn } from '../lib/utils'

const PATIENTS = ['Ch.10 · Emma, 7 ans', 'Ch.11 · Yanis, 11 ans', 'Ch.12 · Noé, 3 ans', 'Ch.14 · Inès, 15 ans']

const TRACES = [
  { t: '06:58:12', who: 'MARTIN S.', what: 'Connexion poste PSOINS-02' },
  { t: '11:04:37', who: 'MARTIN S.', what: 'Ouverture dossier · Ch.14 Inès' },
  { t: '14:32:07', who: 'MARTIN S.', what: 'Ouverture dossier · Ch.12 Noé' },
]

const STATEMENTS: ChoiceItem[] = [
  {
    id: 'resp',
    tag: 'A',
    content: "Si je valide les transmissions sous la session de ma tutrice, ces actes lui seront attribués : sa responsabilité est engagée pour des soins qu'elle n'a pas réalisés.",
    correct: 'ok',
    explanation: 'Exact : tout acte saisi sous une session est juridiquement attribué à son titulaire.',
  },
  {
    id: 'perso',
    tag: 'B',
    content: 'Les identifiants du DPI et la carte CPS sont strictement personnels : les prêter est interdit, même avec l’accord de la tutrice.',
    correct: 'ok',
    explanation: "Exact : l'accord de la tutrice ne change rien. Elle doit vous ouvrir vos propres accès étudiant.",
  },
  {
    id: 'trace',
    tag: 'C',
    content: 'Chaque ouverture de dossier est tracée (identifiant, date, heure) et peut être contrôlée après coup.',
    correct: 'ok',
    explanation: 'Exact : le journal ci-dessus en est la preuve. Les accès injustifiés sont régulièrement audités.',
  },
  {
    id: 'tous',
    tag: 'D',
    content: 'Comme je suis soumis au secret professionnel, je peux consulter le dossier de n’importe quel patient de l’hôpital.',
    correct: 'ko',
    explanation: "Inexact : être soumis au secret n'ouvre aucun droit d'accès. On ne consulte que les dossiers des patients que l'on prend en charge.",
  },
]

function Screen() {
  return (
    <div className="space-y-3">
      <div className="flex gap-3 rounded-xl border border-warn/40 bg-warn/10 p-3 text-sm text-amber-100">
        <MessageSquareQuote className="mt-0.5 size-5 shrink-0 text-warn" />
        <p>
          <strong>Mme Martin, IDE tutrice :</strong> « Je suis débordée. Prends ma session pour valider les transmissions
          de Noé, mon mot de passe c'est <span className="font-mono">Pedia2026</span>. »
        </p>
      </div>

      <div className="rounded-xl border-[0.375rem] border-slate-800 bg-slate-900 shadow-2xl">
        <div className="overflow-hidden rounded-md bg-[#eef3f8] text-slate-800">
          <div className="flex items-center gap-2 bg-[#1d4f91] px-3 py-1.5 text-xs text-white">
            <Unlock className="size-3.5 text-amber-300" />
            <span className="font-semibold">DPI · Session : S. MARTIN, IDE</span>
            <span className="ml-auto hidden text-white/70 sm:inline">Pédiatrie · poste PSOINS-02</span>
          </div>
          <div className="flex text-xs">
            <div className="w-[34%] space-y-1 border-r border-slate-300 bg-white p-2 sm:w-[28%]">
              <p className="font-bold text-[#1d4f91]">Patients</p>
              {PATIENTS.map((p, i) => (
                <p key={p} className={cn('truncate rounded px-1', i === 2 && 'bg-[#dbe8f7] font-semibold')}>
                  {p}
                </p>
              ))}
            </div>
            <div className="flex-1 space-y-2 p-2">
              <p className="font-bold text-[#1d4f91]">Transmissions ciblées · Ch.12 Noé, 3 ans</p>
              <div className="rounded border border-slate-300 bg-white p-2 leading-relaxed text-slate-600">
                <p>
                  <b>D :</b> vomissements ×2 depuis 13h
                </p>
                <p>
                  <b>A :</b> réhydratation orale fractionnée, surveillance diurèse
                </p>
                <p>
                  <b>R :</b> <span className="italic text-slate-400">à compléter</span>
                </p>
              </div>
              <span className="inline-block rounded bg-[#1d4f91] px-2 py-1 text-[0.6875rem] font-semibold text-white">
                Valider · signé S. MARTIN
              </span>
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
    </div>
  )
}

export function E5DPI() {
  return (
    <EnigmaShell
      enigma={ENIGMAS[4]}
      briefing="14h32, service de pédiatrie. Votre tutrice vous tend son poste déjà connecté au dossier patient informatisé (DPI). Avant d'accepter, examinez l'écran et évaluez les quatre affirmations."
      question="Calculez : (nombre d'affirmations exactes × 2) + 2."
    >
      <div className="space-y-5">
        <Screen />
        <ChoiceBoard
          enigmaId={5}
          instruction="Chaque affirmation est-elle exacte ?"
          choices={[
            { key: 'ok', label: 'Exacte', icon: CheckCircle2, tone: 'med' },
            { key: 'ko', label: 'Inexacte', icon: XCircle, tone: 'alert' },
          ]}
          items={STATEMENTS}
        />
      </div>
    </EnigmaShell>
  )
}
