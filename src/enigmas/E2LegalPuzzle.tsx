import { AnimatePresence, motion } from 'framer-motion'
import { Camera, CheckCircle2, Cloud, MessageSquareWarning, RotateCcw, XCircle } from 'lucide-react'
import { useState } from 'react'
import { EnigmaShell } from '../components/EnigmaShell'
import { Button } from '../components/ui/button'
import { ENIGMAS } from '../game/config'
import { sound } from '../lib/sound'
import { cn } from '../lib/utils'

const SITUATIONS = [
  { id: 'A', icon: Camera, text: "Publier la photo d'un patient sans son accord écrit.", law: 2 },
  { id: 'B', icon: MessageSquareWarning, text: 'Divulguer le diagnostic d’un patient à son voisin.', law: 1 },
  { id: 'C', icon: Cloud, text: 'Stocker un dossier patient sur un cloud personnel non sécurisé.', law: 3 },
] as const

const LAW_CARDS = [
  { n: 1, ref: 'Art. 226-13', code: 'Code pénal', label: 'Violation du secret professionnel' },
  { n: 2, ref: 'Art. 9', code: 'Code civil', label: "Vie privée & droit à l'image" },
  { n: 3, ref: 'RGPD', code: 'Règlement UE', label: 'Protection des données de santé' },
] as const

type SituationId = (typeof SITUATIONS)[number]['id']

/**
 * Association par « tap » : on sélectionne une situation puis un texte de loi.
 * Plus fiable que le glisser-déposer sur téléphone et tablette.
 */
function Puzzle() {
  const [selected, setSelected] = useState<SituationId | null>(null)
  const [links, setLinks] = useState<Partial<Record<SituationId, number>>>({})
  const [checked, setChecked] = useState(false)

  const complete = SITUATIONS.every((s) => links[s.id] !== undefined)
  const allGood = SITUATIONS.every((s) => links[s.id] === s.law)

  const pickLaw = (n: number) => {
    if (!selected) return
    sound.click()
    setLinks((l) => ({ ...l, [selected]: n }))
    setChecked(false)
    const next = SITUATIONS.find((s) => s.id !== selected && links[s.id] === undefined)
    setSelected(next?.id ?? null)
  }

  const verify = () => {
    setChecked(true)
    if (allGood) sound.success()
    else sound.error()
  }

  return (
    <div className="space-y-5">
      <p className="rounded-lg border border-neon/20 bg-neon/5 px-4 py-3 text-sm text-cyan-100">
        <strong>Mode d'emploi :</strong> touchez une situation, puis le texte de loi correspondant.
      </p>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400">Situations</h3>
          {SITUATIONS.map((s) => {
            const linked = links[s.id]
            const ok = checked && linked === s.law
            const ko = checked && linked !== undefined && linked !== s.law
            return (
              <motion.button
                key={s.id}
                type="button"
                layout
                onClick={() => setSelected(s.id)}
                className={cn(
                  'flex w-full cursor-pointer items-start gap-3 rounded-xl border bg-panel-2/70 p-4 text-left transition-colors',
                  selected === s.id ? 'border-neon glow-neon' : 'border-line hover:border-neon/50',
                  ok && 'border-med/70',
                  ko && 'border-alert/70',
                )}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-950 font-mono font-bold text-neon">
                  {s.id}
                </span>
                <span className="flex-1 text-sm text-slate-200">
                  <s.icon className="mb-1 size-4 text-slate-400" />
                  {s.text}
                </span>
                <span
                  className={cn(
                    'grid size-9 shrink-0 place-items-center rounded-lg border border-dashed font-mono font-bold',
                    linked ? 'border-solid border-neon/60 bg-neon/10 text-neon' : 'border-line text-slate-600',
                    ok && 'border-med bg-med/15 text-med',
                    ko && 'border-alert bg-alert/15 text-alert',
                  )}
                >
                  {linked ?? '?'}
                </span>
              </motion.button>
            )
          })}
        </div>

        <div className="space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400">Textes de loi</h3>
          {LAW_CARDS.map((l) => (
            <button
              key={l.n}
              type="button"
              disabled={!selected}
              onClick={() => pickLaw(l.n)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border border-line bg-slate-950/60 p-4 text-left transition-all',
                selected ? 'cursor-pointer hover:-translate-y-0.5 hover:border-neon/60' : 'opacity-70',
              )}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-neon/15 font-mono text-lg font-bold text-neon">
                {l.n}
              </span>
              <span>
                <span className="block font-semibold text-white">
                  {l.ref} <span className="font-normal text-slate-400">· {l.code}</span>
                </span>
                <span className="text-sm text-slate-400">{l.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={verify} disabled={!complete}>
          Vérifier mes associations
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setLinks({})
            setChecked(false)
            setSelected(null)
          }}
        >
          <RotateCcw /> Recommencer
        </Button>
      </div>
      <AnimatePresence>
        {checked && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn('flex items-center gap-2 text-sm', allGood ? 'text-med' : 'text-alert')}
          >
            {allGood ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
            {allGood
              ? 'Toutes les associations sont correctes !'
              : 'Certaines associations sont fausses (en rouge). Consultez la Fiche Législation.'}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export function E2LegalPuzzle() {
  return (
    <EnigmaShell
      enigma={ENIGMAS[1]}
      briefing="Le service juridique vous transmet trois signalements. Retrouvez, pour chacun, le texte qui s'applique."
      question="Quel est le numéro du texte de loi associé à la Situation A ?"
    >
      <Puzzle />
    </EnigmaShell>
  )
}
