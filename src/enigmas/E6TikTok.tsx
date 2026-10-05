import { motion } from 'framer-motion'
import { Bookmark, CheckCircle2, Heart, MessageCircle, MinusCircle, Music2, Pause, Play, Share2 } from 'lucide-react'
import { useState } from 'react'
import { EnigmaShell } from '../components/EnigmaShell'
import { Card } from '../components/ui/card'
import { ENIGMAS } from '../game/config'
import { useGame } from '../game/GameContext'
import { sound } from '../lib/sound'
import { cn } from '../lib/utils'

const CHARTER = [
  { id: 'tenue', text: 'La tenue professionnelle ne se porte qu’en contexte de soin, jamais pour se mettre en scène.', broken: true },
  { id: 'materiel', text: 'Le matériel de soins n’est pas un accessoire de divertissement.', broken: true },
  { id: 'lieu', text: 'Aucun élément ne doit permettre d’identifier le lieu de soins (logo, signalétique…).', broken: true },
  { id: 'tiers', text: 'Aucune personne (patient, collègue) filmée sans son consentement écrit.', broken: true },
  { id: 'image', text: 'Ne pas porter atteinte à la dignité et à l’image de la profession.', broken: true },
  { id: 'diag', text: 'Ne jamais citer un diagnostic ou un traitement de patient.', broken: false },
  { id: 'geo', text: 'Ne pas géolocaliser le domicile d’un patient lors d’une visite à domicile.', broken: false },
  { id: 'pub', text: 'Ne pas faire de publicité pour un médicament ou un produit de santé.', broken: false },
]

function Dancer({ playing }: { playing: boolean }) {
  return (
    <motion.svg
      viewBox="-4 -6 128 216"
      className="h-full"
      aria-hidden
      animate={playing ? { rotate: [-6, 6, -6], y: [0, -8, 0] } : { rotate: 0, y: 0 }}
      transition={playing ? { duration: 0.9, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
      style={{ originX: 0.5, originY: 1 }}
    >
      {/* jambes */}
      <g className={cn('dance-leg-l', !playing && 'dance-paused')}>
        <rect x="44" y="130" width="14" height="70" rx="6" fill="#3b82a0" />
        <rect x="40" y="196" width="20" height="9" rx="4" fill="#f8fafc" />
      </g>
      <g className={cn('dance-leg-r', !playing && 'dance-paused')}>
        <rect x="62" y="130" width="14" height="70" rx="6" fill="#3b82a0" />
        <rect x="62" y="196" width="20" height="9" rx="4" fill="#f8fafc" />
      </g>
      {/* tunique */}
      <path d="M36 70 Q60 58 84 70 L88 138 L32 138Z" fill="#5fb4cf" />
      <path d="M52 66 L60 84 L68 66" fill="none" stroke="#3b8fab" strokeWidth="3" />
      <rect x="40" y="96" width="12" height="9" rx="2" fill="#3b8fab" />
      {/* stéthoscope */}
      <path d="M48 70 Q46 98 60 100 Q74 98 72 70" fill="none" stroke="#1f2937" strokeWidth="2.5" />
      <circle cx="60" cy="103" r="4" fill="#94a3b8" />
      {/* bras qui bougent + gants gonflés */}
      {/* bras gauche levé + gant gonflé en ballon */}
      <g className={cn('dance-arm-l', !playing && 'dance-paused')}>
        <path d="M40 76 L24 60 L18 40" fill="none" stroke="#5fb4cf" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 60 L18 40" fill="none" stroke="#f2c9a5" strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="16" cy="26" rx="10" ry="12" fill="#93c5fd" />
        <path d="M9 18 l-3 -9 M14 15 l-1 -10 M19 15 l1 -10 M24 19 l4 -7" stroke="#93c5fd" strokeWidth="4" strokeLinecap="round" />
      </g>
      {/* bras droit levé + seringue */}
      <g className={cn('dance-arm-r', !playing && 'dance-paused')}>
        <path d="M80 76 L96 60 L102 40" fill="none" stroke="#5fb4cf" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M96 60 L102 40" fill="none" stroke="#f2c9a5" strokeWidth="9" strokeLinecap="round" />
        <g transform="translate(98 8) rotate(10)">
          <rect x="0" y="4" width="7" height="26" rx="1" fill="#e2e8f0" stroke="#64748b" />
          <rect x="3" y="-8" width="1.2" height="12" fill="#94a3b8" />
          <rect x="-2" y="30" width="11" height="4" fill="#64748b" />
        </g>
      </g>
      {/* tête */}
      <rect x="54" y="52" width="12" height="12" rx="4" fill="#f2c9a5" />
      <circle cx="60" cy="38" r="18" fill="#f2c9a5" />
      <path d="M41 36 Q42 16 60 16 Q80 16 79 38 Q76 24 60 25 Q46 25 41 36Z" fill="#7c3f1d" />
      <path d="M78 30 q14 6 6 26" stroke="#7c3f1d" strokeWidth="7" fill="none" strokeLinecap="round" />
      <circle cx="53" cy="39" r="2.2" fill="#1f2937" />
      <circle cx="67" cy="39" r="2.2" fill="#1f2937" />
      <path d="M53 47 Q60 53 67 47" stroke="#9f4637" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </motion.svg>
  )
}

function TikTokPlayer() {
  const [playing, setPlaying] = useState(true)

  return (
    <div className="mx-auto w-full max-w-[340px] rounded-[2.6rem] border-[10px] border-slate-800 bg-black shadow-2xl shadow-fuchsia-950/30">
      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        className="relative block aspect-[9/17] w-full cursor-pointer overflow-hidden rounded-[1.9rem] bg-[#cfd8de] text-left"
        aria-label={playing ? 'Mettre en pause' : 'Lire la vidéo'}
      >
        {/* chambre d'hôpital */}
        <div className="absolute inset-x-0 top-0 h-[62%] bg-gradient-to-b from-[#dfe7ec] to-[#c4d0d8]" />
        <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[#a5b4bf]" />
        <div className="absolute left-[8%] top-[13%] rounded bg-[#1d4f91] px-2 py-1 text-[9px] font-bold text-white">
          ✚ CHU Saint-Exemple · Pneumologie
        </div>
        {/* lit avec patient */}
        <div className="absolute left-[46%] top-[40%] h-[18%] w-[40%]">
          <div className="absolute bottom-0 h-[45%] w-full rounded-md bg-slate-500" />
          <div className="absolute bottom-[40%] h-[30%] w-full rounded-md bg-white" />
          <div className="absolute bottom-[58%] left-[8%] h-[30%] w-[26%] rounded-full bg-[#e8c3a3]" />
          <div className="absolute bottom-[50%] left-[30%] h-[22%] w-[65%] rounded-md bg-sky-100" />
          <div className="absolute -top-[30%] right-[6%] h-[70%] w-[3%] bg-slate-400" />
          <div className="absolute -top-[34%] right-[2%] h-[12%] w-[14%] rounded-sm bg-sky-200/80" />
        </div>
        {/* danseuse */}
        <div className="absolute bottom-[8%] left-[6%] h-[64%]">
          <Dancer playing={playing} />
        </div>

        {!playing && (
          <div className="absolute inset-0 grid place-items-center bg-black/20">
            <Play className="size-16 fill-white/80 text-white/80" />
          </div>
        )}

        {/* UI TikTok */}
        <div className="absolute inset-x-0 top-6 flex justify-center gap-4 text-sm font-semibold text-white drop-shadow">
          <span className="opacity-70">Abonnements</span>
          <span className="border-b-2 border-white pb-0.5">Pour toi</span>
        </div>
        <div className="absolute bottom-24 right-2 flex flex-col items-center gap-4 text-white drop-shadow">
          <div className="grid size-10 place-items-center rounded-full border-2 border-white bg-fuchsia-500 text-xs font-bold">CE</div>
          <span className="flex flex-col items-center text-[11px] font-semibold">
            <Heart className="size-7 fill-rose-500 text-rose-500" />
            48,2 k
          </span>
          <span className="flex flex-col items-center text-[11px] font-semibold">
            <MessageCircle className="size-7 fill-white" />
            1 204
          </span>
          <span className="flex flex-col items-center text-[11px] font-semibold">
            <Bookmark className="size-7 fill-white" />
            3 018
          </span>
          <span className="flex flex-col items-center text-[11px] font-semibold">
            <Share2 className="size-7" />
            9 877
          </span>
        </div>
        <div className="absolute inset-x-3 bottom-4 pr-14 text-white drop-shadow">
          <p className="text-sm font-bold">@chloe.esi_</p>
          <p className="text-xs leading-snug">Quand la garde est calme 💃🩺 #nurselife #ESI #hopital #fyp</p>
          <p className="mt-1 flex items-center gap-1 overflow-hidden whitespace-nowrap text-xs">
            <Music2 className="size-3.5 shrink-0" />
            <motion.span
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            >
              son original · Dance Challenge 2026 · son original · Dance Challenge 2026 ·
            </motion.span>
          </p>
        </div>
        <span className="absolute left-3 top-14 rounded-full bg-black/40 p-1.5 text-white">
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </span>
      </button>
    </div>
  )
}

function Charter() {
  const { state } = useGame()
  const reveal = !!state.solved[6]
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    sound.click()
    setChecked((c) => {
      const n = new Set(c)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-semibold text-white">Charte du Soignant Connecté</h3>
        <span className="rounded-full border border-warn/40 bg-warn/10 px-2.5 py-0.5 font-mono text-xs text-warn">
          {checked.size} cochée{checked.size > 1 ? 's' : ''}
        </span>
      </div>
      <p className="mb-3 text-xs text-slate-400">Cochez les règles transgressées par la vidéo.</p>
      <ul className="space-y-2">
        {CHARTER.map((r) => {
          const on = checked.has(r.id)
          return (
            <li key={r.id}>
              <button
                type="button"
                disabled={reveal}
                onClick={() => toggle(r.id)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors',
                  !reveal && 'cursor-pointer',
                  !reveal && (on ? 'border-warn/60 bg-warn/10 text-amber-100' : 'border-line text-slate-300 hover:border-neon/50'),
                  reveal && (r.broken ? 'border-med/50 bg-med/10 text-emerald-100' : 'border-line text-slate-500'),
                )}
              >
                {reveal ? (
                  r.broken ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-med" />
                  ) : (
                    <MinusCircle className="mt-0.5 size-4 shrink-0" />
                  )
                ) : (
                  <span
                    className={cn(
                      'mt-0.5 grid size-4 shrink-0 place-items-center rounded border',
                      on ? 'border-warn bg-warn text-slate-950' : 'border-slate-500',
                    )}
                  >
                    {on && <CheckCircle2 className="size-3" />}
                  </span>
                )}
                {r.text}
              </button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

export function E6TikTok() {
  return (
    <EnigmaShell
      enigma={ENIGMAS[5]}
      briefing="Cette vidéo d'une étudiante a été vue 600 000 fois. La direction de l'hôpital a été interpellée par la famille d'un patient. Analysez-la à l'aide de la Charte."
      question="Combien de règles de la Charte du Soignant Connecté cette vidéo transgresse-t-elle ?"
    >
      <div className="grid items-start gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <TikTokPlayer />
        <Charter />
      </div>
    </EnigmaShell>
  )
}
