import { motion } from 'framer-motion'
import { Heart, MoreHorizontal, Send, ZoomIn, ZoomOut } from 'lucide-react'
import { useState } from 'react'
import { EnigmaShell } from '../components/EnigmaShell'
import { ENIGMAS } from '../game/config'
import { cn } from '../lib/utils'

const BOARD = [
  { room: '102', name: 'Mme D.', info: 'Diabète T2 · amputation J+3' },
  { room: '104', name: 'M. L.', info: 'VIH · bilan infectieux' },
  { room: '108', name: 'Mme R.', info: 'TS médicamenteuse · surveillance' },
]

/** Selfie illustré (aucune vraie photo) */
function Selfie() {
  return (
    <svg viewBox="0 0 200 220" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="skin" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f2c9a5" />
          <stop offset="1" stopColor="#e0ab85" />
        </linearGradient>
      </defs>
      {/* bras tendu */}
      <path d="M160 220 L190 120 L205 125 L185 220Z" fill="url(#skin)" />
      {/* tunique */}
      <path d="M30 220 Q40 160 100 150 Q160 160 170 220Z" fill="#7cc3d9" />
      <path d="M85 152 L100 180 L115 152" fill="none" stroke="#5aa6bd" strokeWidth="4" />
      {/* cou + tête */}
      <rect x="88" y="120" width="24" height="34" rx="10" fill="url(#skin)" />
      <ellipse cx="100" cy="95" rx="38" ry="44" fill="url(#skin)" />
      <path d="M60 90 Q58 45 100 42 Q145 42 140 92 Q132 62 100 60 Q72 62 60 90Z" fill="#4a2f21" />
      {/* visage souriant */}
      <ellipse cx="86" cy="96" rx="4" ry="5" fill="#2b1d16" />
      <ellipse cx="114" cy="96" rx="4" ry="5" fill="#2b1d16" />
      <path d="M84 116 Q100 130 116 116" fill="none" stroke="#8c4a3a" strokeWidth="4" strokeLinecap="round" />
      {/* tasse de café */}
      <rect x="22" y="160" width="34" height="40" rx="5" fill="#f5f5f4" />
      <path d="M56 170 q14 0 14 12 q0 12 -14 12" fill="none" stroke="#f5f5f4" strokeWidth="5" />
      <path d="M30 150 q4 -8 0 -14 M42 150 q4 -8 0 -14" stroke="#cbd5e1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function StoryMockup() {
  const [zoom, setZoom] = useState(false)

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Smartphone */}
      <div className="relative w-full max-w-[340px] rounded-[2.6rem] border-[10px] border-slate-800 bg-slate-900 shadow-2xl shadow-cyan-950/40">
        <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
        <div className="relative aspect-[9/17] overflow-hidden rounded-[1.9rem] bg-gradient-to-b from-[#1b2a3a] to-[#0d1724]">
          {/* Barre de progression story */}
          <div className="absolute inset-x-3 top-8 z-20 flex gap-1">
            <div className="h-0.5 flex-1 overflow-hidden rounded bg-white/30">
              <motion.div
                className="h-full bg-white"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <div className="h-0.5 flex-1 rounded bg-white/30" />
          </div>
          <div className="absolute inset-x-3 top-11 z-20 flex items-center gap-2 text-white">
            <div className="rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-[2px]">
              <div className="grid size-7 place-items-center rounded-full bg-slate-900 text-[10px] font-bold">LM</div>
            </div>
            <span className="text-xs font-semibold">lucas.esi_</span>
            <span className="text-xs text-white/60">2 h</span>
            <MoreHorizontal className="ml-auto size-4" />
          </div>

          {/* Arrière-plan : couloir + tableau mural */}
          <motion.div
            className="absolute inset-0 origin-[37%_25%]"
            animate={{ scale: zoom ? 1.55 : 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          >
            <div className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-[#c9d6dd] to-[#aebdc6]" />
            <div className="absolute inset-x-0 top-[55%] h-[45%] bg-[#8fa3ad]" />
            {/* tableau blanc */}
            <div className="absolute left-[6%] top-[19%] w-[62%] rounded-sm border-[3px] border-slate-400 bg-white p-1.5 shadow-md">
              <p className="mb-1 text-center text-[7px] font-bold uppercase tracking-wide text-blue-800">
                Unité Médecine B · Nuit
              </p>
              {BOARD.map((b) => (
                <div key={b.room} className="flex gap-1 border-t border-slate-200 py-[2px] text-[6.5px] leading-tight">
                  <span className="font-bold text-red-600">Ch.{b.room}</span>
                  <span className="font-semibold text-slate-800">{b.name}</span>
                  <span className="text-blue-900">{b.info}</span>
                </div>
              ))}
            </div>
            {/* selfie au premier plan */}
            <div className="absolute -right-[8%] bottom-0 h-[62%] w-[85%]">
              <Selfie />
            </div>
          </motion.div>

          {/* Légende */}
          <div className="absolute inset-x-0 bottom-24 z-20 flex justify-center px-4">
            <p className="rounded-lg bg-black/60 px-3 py-1.5 text-center text-sm font-semibold text-white backdrop-blur-sm">
              Garde de nuit calme, café bien mérité ! ☕
            </p>
          </div>

          <div className="absolute inset-x-3 bottom-4 z-20 flex items-center gap-2">
            <div className="flex-1 rounded-full border border-white/50 px-4 py-2 text-xs text-white/70">Envoyer un message</div>
            <Heart className="size-6 text-white" />
            <Send className="size-6 text-white" />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setZoom((z) => !z)}
        className={cn(
          'flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors',
          zoom ? 'border-neon bg-neon/10 text-neon' : 'border-line text-slate-300 hover:border-neon/60',
        )}
      >
        {zoom ? <ZoomOut className="size-4" /> : <ZoomIn className="size-4" />}
        {zoom ? 'Dézoomer' : "Zoomer sur l'arrière-plan"}
      </button>
    </div>
  )
}

export function E1Instagram() {
  const enigma = ENIGMAS[0]
  return (
    <EnigmaShell
      enigma={enigma}
      briefing={
        <>
          Un patient a signalé cette story publiée par un étudiant en stage. Elle est restée en ligne 24 h et a été vue
          par 312 personnes. Analysez l'image : qu'est-ce qui a fuité ?
        </>
      }
      question="Calculez : [nombre de chambres exposées] + [années d'emprisonnement prévues par l'Art. 226-13 du Code pénal]."
    >
      <StoryMockup />
    </EnigmaShell>
  )
}
