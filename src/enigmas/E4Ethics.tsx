import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, HelpCircle, ShieldCheck, XCircle } from 'lucide-react'
import { useState } from 'react'
import { EnigmaShell } from '../components/EnigmaShell'
import { Card } from '../components/ui/card'
import { ENIGMAS } from '../game/config'
import { useGame } from '../game/GameContext'
import { sound } from '../lib/sound'
import { cn } from '../lib/utils'

interface Situation {
  id: number
  text: string
  good: boolean
  explanation: string
}

const SITUATIONS: Situation[] = [
  {
    id: 1,
    text: "Accepter la demande d'ami Facebook d'un patient tout juste sorti de l'hôpital pour prendre de ses nouvelles.",
    good: false,
    explanation: "La relation de soin s'arrête à la sortie : devenir « ami » brouille la distance professionnelle et expose votre vie privée comme la sienne.",
  },
  {
    id: 2,
    text: "Refuser poliment la demande d'ami d'un patient en lui rappelant le cadre déontologique et la distance thérapeutique.",
    good: true,
    explanation: 'Le refus, expliqué avec bienveillance, protège la relation de soin sans blesser le patient.',
  },
  {
    id: 3,
    text: "Analyser et interpréter par SMS la photo d'une plaie post-opératoire envoyée par un ami, en lui prescrivant une pommade du service.",
    good: false,
    explanation: "Diagnostic à distance, prescription hors de votre rôle propre et détournement de matériel du service : trois fautes en un message.",
  },
  {
    id: 4,
    text: "Réorienter un proche qui demande un avis médical urgent vers son médecin traitant ou le 15, sans poser de diagnostic.",
    good: true,
    explanation: "Orienter vers le bon interlocuteur, c'est aider réellement, sans engager votre responsabilité sur un avis donné à l'aveugle.",
  },
  {
    id: 5,
    text: "Divulguer à un collègue d'un autre service les antécédents d'un patient car on discute à la cafétéria.",
    good: false,
    explanation: "Ce collègue ne prend pas en charge le patient : aucun secret partagé possible, et la cafétéria est un lieu public.",
  },
  {
    id: 6,
    text: "Transférer une photo de dossier patient de l'ordinateur de l'hôpital vers son téléphone via WhatsApp pour réviser le soir.",
    good: false,
    explanation: "Données de santé sorties du système sécurisé vers une messagerie grand public : fuite de données au sens du RGPD.",
  },
  {
    id: 7,
    text: "Signaler immédiatement à l'équipe encadrante ou au cadre de santé un risque de rupture de confidentialité observé dans le service.",
    good: true,
    explanation: 'Alerter tôt permet de limiter la fuite. Se taire, c’est laisser le risque se réaliser.',
  },
  {
    id: 8,
    text: 'Répondre à un journaliste sur les réseaux sociaux qui demande des détails sur une personnalité hospitalisée incognito.',
    good: false,
    explanation: 'Même la confirmation de la présence d’un patient est couverte par le secret. Les demandes de la presse vont à la direction de la communication.',
  },
]

function Audit() {
  const { state } = useGame()
  const reveal = !!state.solved[4]
  const [picked, setPicked] = useState<Set<number>>(new Set())

  const toggle = (id: number) => {
    if (reveal) return
    sound.click()
    setPicked((p) => {
      const n = new Set(p)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  return (
    <div className="space-y-5">
      <span className="inline-flex items-center gap-2 rounded-full border border-neon/40 bg-neon/10 px-3 py-1 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-neon">
        <ShieldCheck className="size-3.5 shrink-0" />
        Pièce D : audit des choix éthiques et posture soignante
      </span>

      <Card className="flex gap-3 border-warn/30 bg-warn/5 p-4 text-sm leading-relaxed text-amber-100">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warn" />
        <p>
          Au cours de leur formation, les ESI sont régulièrement confrontés à des dilemmes entre empathie, sollicitations
          personnelles et rigueur professionnelle. Examinez les 8 situations ci-dessous et sélectionnez{' '}
          <strong className="text-white">uniquement les BONNES PRATIQUES</strong> conformes au code de déontologie.
        </p>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {SITUATIONS.map((s, i) => {
          const on = picked.has(s.id)
          const wrong = reveal && on !== s.good
          return (
            <motion.button
              key={s.id}
              type="button"
              role="checkbox"
              aria-checked={reveal ? s.good : on}
              disabled={reveal}
              onClick={() => toggle(s.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                'flex h-full flex-col gap-3 rounded-xl border bg-slate-900/80 p-4 text-left text-sm leading-relaxed transition-colors',
                !reveal && 'cursor-pointer',
                !reveal && (on ? 'border-neon bg-neon/10 text-cyan-50 glow-neon' : 'border-slate-800 text-slate-300 hover:border-neon/50'),
                reveal && (s.good ? 'border-med/60 bg-med/10 text-emerald-50' : 'border-slate-800 text-slate-500'),
              )}
            >
              <span className="flex items-start gap-3">
                <span
                  className={cn(
                    'mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border',
                    !reveal && (on ? 'border-neon bg-neon text-slate-950' : 'border-slate-600'),
                    reveal && (s.good ? 'border-med bg-med text-slate-950' : 'border-slate-700'),
                  )}
                >
                  {(reveal ? s.good : on) && <CheckCircle2 className="size-4" />}
                </span>
                <span>
                  <span className="mr-1.5 font-mono text-xs text-slate-500">{String(s.id).padStart(2, '0')}</span>
                  {s.text}
                </span>
              </span>
              <AnimatePresence>
                {reveal && (
                  <motion.span
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={cn('flex gap-2 text-xs', s.good ? 'text-emerald-200' : 'text-slate-400')}
                  >
                    {s.good ? (
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-med" />
                    ) : (
                      <XCircle className={cn('mt-0.5 size-3.5 shrink-0', wrong ? 'text-alert' : 'text-slate-500')} />
                    )}
                    {s.explanation}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      {!reveal && (
        <Card className="flex flex-wrap items-center justify-between gap-3 border-slate-800 bg-slate-900/80 p-4">
          <p className="font-mono text-sm text-slate-300">
            Nombre de sélections = <span className="text-lg font-bold text-neon">{picked.size}</span>
          </p>
          <p className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <HelpCircle className="size-4 shrink-0 text-neon" />
            (Nombre de bonnes pratiques retenues × 2) − 4 = Chiffre 4
          </p>
        </Card>
      )}

      {reveal && (
        <Card className="border-med/50 bg-med/10 p-5 glow-med">
          <p className="flex items-center gap-2 font-semibold text-emerald-100">
            <ShieldCheck className="size-5 shrink-0 text-med" /> Les 3 bonnes pratiques : situations 2, 4 et 7
          </p>
          <p className="mt-2 font-mono text-sm text-emerald-200">(3 × 2) − 4 = 2</p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-100/80">
            Distance professionnelle maintenue, réorientation sans diagnostic, alerte de l'encadrement : la posture
            soignante protège le patient sans renoncer à l'empathie. Les 5 autres situations violent le secret, la
            sécurité des données ou le cadre de la relation de soin.
          </p>
        </Card>
      )}
    </div>
  )
}

export function E4Ethics() {
  return (
    <EnigmaShell
      enigma={ENIGMAS[3]}
      briefing="Le cadre formateur a recueilli ces situations auprès des étudiants de la promotion. Certaines relèvent de la bonne posture soignante, d'autres d'une faute déontologique. À vous de trier."
      question="Calculez : (nombre de bonnes pratiques retenues × 2) − 4."
      labels={{
        submit: 'Valider la Pièce D',
        success: 'Analyse éthique validée · Chiffre 4 débloqué : 2',
        error: 'Analyse incomplète ou erronée. Vérifiez vos choix éthiques.',
      }}
    >
      <Audit />
    </EnigmaShell>
  )
}
