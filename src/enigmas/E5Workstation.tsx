import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Flag, MinusCircle, MousePointerClick, Unlock } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { EnigmaShell } from '../components/EnigmaShell'
import { Card } from '../components/ui/card'
import { ENIGMAS } from '../game/config'
import { useGame } from '../game/GameContext'
import { sound } from '../lib/sound'
import { cn } from '../lib/utils'

interface Spot {
  id: string
  label: string
  isError: boolean
  explanation: string
}

const SPOTS: Spot[] = [
  { id: 'session', label: 'Session ouverte', isError: true, explanation: 'Session active non verrouillée : n’importe qui peut agir sous votre identité. Réflexe : Windows + L.' },
  { id: 'cps', label: 'Carte CPS', isError: true, explanation: 'Carte CPS laissée dans le lecteur : elle est personnelle et signe les actes en votre nom.' },
  { id: 'postit', label: 'Post-it', isError: true, explanation: 'Mot de passe noté sur un Post-it collé à l’écran : il n’est plus secret.' },
  { id: 'corridor', label: 'Couloir', isError: true, explanation: 'Écran tourné vers le couloir : patients et visiteurs peuvent lire les données.' },
  { id: 'usb', label: 'Clé USB', isError: true, explanation: 'Clé USB personnelle branchée : risque de virus et de fuite de données de santé.' },
  { id: 'psy', label: 'Dossier psy', isError: true, explanation: 'Dossier psychiatrique laissé ouvert à l’écran sans surveillance : données ultra-sensibles exposées.' },
  { id: 'gel', label: 'Gel hydroalcoolique', isError: false, explanation: 'Gel hydroalcoolique : bonne pratique d’hygiène, aucun risque informatique.' },
  { id: 'phone', label: 'Téléphone du service', isError: false, explanation: 'Téléphone fixe du service : outil normal du poste de soins.' },
  { id: 'mug', label: 'Tasse', isError: false, explanation: 'Une tasse (loin du clavier, c’est mieux !) : pas une faille de sécurité informatique.' },
]

function Hotspot({
  id,
  flagged,
  reveal,
  onToggle,
  className,
  children,
}: {
  id: string
  flagged: boolean
  reveal: boolean
  onToggle: (id: string) => void
  className?: string
  children: ReactNode
}) {
  const spot = SPOTS.find((s) => s.id === id)!
  return (
    <motion.button
      type="button"
      whileHover={{ scale: reveal ? 1 : 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => !reveal && onToggle(id)}
      aria-pressed={flagged}
      aria-label={spot.label}
      className={cn(
        'absolute rounded-lg outline-2 outline-offset-2 transition-[outline-color,box-shadow]',
        reveal ? 'cursor-default' : 'cursor-pointer hover:outline-dashed hover:outline-neon/60',
        !reveal && flagged && 'outline-solid outline-warn shadow-[0_0_24px_-2px_rgb(251_191_36/0.6)]',
        reveal && spot.isError && 'outline-solid outline-med',
        reveal && !spot.isError && 'opacity-60',
        className,
      )}
    >
      {children}
      <AnimatePresence>
        {(flagged || (reveal && spot.isError)) && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className={cn(
              'absolute -right-2 -top-2 z-10 grid size-6 place-items-center rounded-full text-slate-950',
              reveal ? 'bg-med' : 'bg-warn',
            )}
          >
            {reveal ? <CheckCircle2 className="size-4" /> : <Flag className="size-3.5" />}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

function Scene({ flagged, reveal, toggle }: { flagged: Set<string>; reveal: boolean; toggle: (id: string) => void }) {
  const hp = (id: string) => ({ id, flagged: flagged.has(id), reveal, onToggle: toggle })

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      <div className="relative aspect-[16/11] min-w-[620px] overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-[#1c2b3f] to-[#121c2b]">
        {/* mur + bureau */}
        <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-b from-[#6b4f3a] to-[#4d3828]" />
        <div className="absolute inset-x-0 bottom-[30%] h-1.5 bg-[#83634a]" />

        {/* Fenêtre sur le couloir */}
        <Hotspot {...hp('corridor')} className="left-[2%] top-[6%] h-[56%] w-[20%] overflow-hidden border-4 border-slate-500 bg-[#9fb3c4]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#cfdbe5] to-[#93a8b9]" />
          <div className="absolute bottom-0 left-[15%] h-[55%] w-[22%] rounded-t-full bg-slate-700/80" />
          <div className="absolute bottom-0 left-[50%] h-[65%] w-[24%] rounded-t-full bg-slate-800/80" />
          <div className="absolute bottom-[58%] left-[52%] size-[22%] rounded-full bg-slate-800/80" />
          <div className="absolute bottom-[50%] left-[17%] size-[18%] rounded-full bg-slate-700/80" />
          <span className="absolute inset-x-0 top-1 text-center text-[10px] font-bold text-slate-700">COULOIR · Visiteurs</span>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <path d="M60 45 L100 30 L100 70Z" fill="rgb(251 191 36 / 0.25)" />
          </svg>
        </Hotspot>

        {/* Écran */}
        <div className="absolute left-[27%] top-[5%] h-[60%] w-[48%] rounded-xl border-[6px] border-slate-800 bg-slate-900 shadow-2xl">
          <div className="flex h-full flex-col overflow-hidden rounded-md bg-[#eef3f8] text-slate-800">
            <Hotspot {...hp('session')} className="relative! flex w-full items-center gap-1.5 rounded-none bg-[#1d4f91] px-2 py-1 text-left text-[10px] text-white">
              <Unlock className="size-3 text-amber-300" />
              <span className="font-semibold">DPI · Session : IDE M. MARTIN</span>
              <span className="ml-auto text-white/70">connectée depuis 06:12</span>
            </Hotspot>
            <div className="flex flex-1 text-[9px]">
              <div className="w-[28%] space-y-1 border-r border-slate-300 bg-white p-1.5">
                <p className="font-bold text-[#1d4f91]">Patients · Unité 3</p>
                {['Ch.301 — B. Henri', 'Ch.302 — L. Sarah', 'Ch.305 — G. Paul', 'Ch.307 — K. Anaïs'].map((p, i) => (
                  <p key={p} className={cn('truncate rounded px-1', i === 2 && 'bg-[#dbe8f7] font-semibold')}>
                    {p}
                  </p>
                ))}
              </div>
              <div className="flex-1 p-1.5">
                <Hotspot {...hp('psy')} className="relative! block h-full w-full rounded border border-rose-300 bg-white p-1.5 text-left">
                  <p className="font-bold text-rose-700">PSYCHIATRIE · Notes d'entretien — CONFIDENTIEL</p>
                  <p className="mt-1 text-slate-500">Patient : G. Paul, 42 ans</p>
                  <div className="mt-1 space-y-1">
                    <div className="h-1.5 w-[90%] rounded bg-slate-300" />
                    <div className="h-1.5 w-[75%] rounded bg-slate-300" />
                    <div className="h-1.5 w-[82%] rounded bg-slate-300" />
                    <div className="h-1.5 w-[60%] rounded bg-slate-300" />
                  </div>
                </Hotspot>
              </div>
            </div>
          </div>
          {/* Post-it */}
          <Hotspot {...hp('postit')} className="-right-[9%] top-[8%] w-[22%] rotate-6 rounded-sm bg-yellow-300 p-1.5 text-left font-[cursive] text-[10px] leading-tight text-slate-800 shadow-md">
            mdp DPI :<br />
            <b>Soleil2026!</b>
          </Hotspot>
        </div>
        {/* pied d'écran */}
        <div className="absolute left-[48%] top-[65%] h-[5%] w-[6%] bg-slate-700" />

        {/* Clavier */}
        <div className="absolute left-[32%] top-[76%] h-[9%] w-[34%] rounded-md border border-slate-500 bg-slate-300 shadow">
          <div className="grid h-full grid-cols-12 gap-[2px] p-1">
            {Array.from({ length: 36 }).map((_, i) => (
              <span key={i} className="rounded-[2px] bg-slate-100" />
            ))}
          </div>
        </div>

        {/* Clé USB branchée au clavier */}
        <Hotspot {...hp('usb')} className="left-[66.5%] top-[77%] flex h-[6%] w-[11%] items-center rounded-sm bg-fuchsia-500 px-1 text-[8px] font-bold text-white">
          <span className="mr-1 h-[60%] w-2 rounded-[1px] bg-slate-300" />
          PERSO 64Go
        </Hotspot>

        {/* Lecteur CPS + carte */}
        <Hotspot {...hp('cps')} className="left-[79%] top-[64%] h-[22%] w-[13%] rounded-md bg-slate-800 p-1">
          <div className="absolute -top-[45%] left-[12%] h-[70%] w-[76%] rounded-md border border-emerald-700 bg-gradient-to-br from-emerald-400 to-emerald-700 p-1 text-left text-[7px] font-bold text-white">
            CPS
            <span className="mt-1 block h-2 w-3 rounded-[2px] bg-amber-300" />
            <span className="mt-0.5 block font-normal">MARTIN M.</span>
          </div>
          <span className="absolute bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-emerald-400" />
        </Hotspot>

        {/* Leurres */}
        <Hotspot {...hp('phone')} className="left-[6%] top-[70%] h-[16%] w-[15%] rounded-lg bg-slate-700 p-1">
          <div className="h-[35%] rounded bg-slate-900" />
          <div className="mt-1 grid grid-cols-3 gap-[2px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="h-1.5 rounded-[2px] bg-slate-400" />
            ))}
          </div>
        </Hotspot>
        <Hotspot {...hp('gel')} className="left-[93%] top-[56%] h-[26%] w-[5%] rounded-t-md rounded-b-sm bg-sky-200/90">
          <span className="absolute -top-[18%] left-1/2 h-[20%] w-[40%] -translate-x-1/2 rounded-t bg-slate-200" />
          <span className="absolute inset-x-0 top-[40%] text-center text-[7px] font-bold text-sky-800">SHA</span>
        </Hotspot>
        <Hotspot {...hp('mug')} className="left-[22%] top-[71%] h-[12%] w-[6%] rounded-b-lg rounded-t-sm bg-white">
          <span className="absolute -right-[40%] top-[20%] h-[50%] w-[45%] rounded-r-full border-[3px] border-l-0 border-white" />
        </Hotspot>
      </div>
    </div>
  )
}

function Inspection() {
  const { state } = useGame()
  const solved = !!state.solved[5]
  const [flagged, setFlagged] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    sound.click()
    setFlagged((f) => {
      const n = new Set(f)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm text-slate-300">
          <MousePointerClick className="size-4 text-neon" />
          Touchez chaque élément qui vous semble être une faille pour le signaler.
        </p>
        <span className="rounded-full border border-warn/40 bg-warn/10 px-3 py-1 font-mono text-sm text-warn">
          <Flag className="mr-1 inline size-3.5" />
          {flagged.size} signalé{flagged.size > 1 ? 's' : ''}
        </span>
      </div>
      <Scene flagged={flagged} reveal={solved} toggle={toggle} />
      <p className="text-xs text-slate-500 sm:hidden">Faites défiler la scène horizontalement, ou tournez votre téléphone en mode paysage.</p>

      {solved && (
        <Card className="p-5">
          <h3 className="mb-3 font-semibold text-white">Correction</h3>
          <ul className="space-y-2 text-sm">
            {SPOTS.map((s) => (
              <li key={s.id} className="flex gap-2">
                {s.isError ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-med" />
                ) : (
                  <MinusCircle className="mt-0.5 size-4 shrink-0 text-slate-500" />
                )}
                <span className={s.isError ? 'text-slate-200' : 'text-slate-500'}>{s.explanation}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}

export function E5Workstation() {
  return (
    <EnigmaShell
      enigma={ENIGMAS[4]}
      briefing="06h45. L'infirmière de nuit est partie en urgence en chambre 307. Vous arrivez au poste de soins et découvrez son ordinateur dans cet état. Inspectez la scène."
      question="Combien d'erreurs de sécurité informatique identifiez-vous sur cette scène ?"
    >
      <Inspection />
    </EnigmaShell>
  )
}
