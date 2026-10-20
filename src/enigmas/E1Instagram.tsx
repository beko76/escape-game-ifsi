import { motion } from 'framer-motion'
import { Heart, MapPin, MoreHorizontal, Send, ZoomIn, ZoomOut } from 'lucide-react'
import { useState } from 'react'
import { EnigmaShell } from '../components/EnigmaShell'
import { ENIGMAS } from '../game/config'
import { cn } from '../lib/utils'

const PHOTO = `${import.meta.env.BASE_URL}images/story-pause-cafe.jpg`

function StoryMockup() {
  const [zoom, setZoom] = useState(false)

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Smartphone */}
      <div className="relative w-full max-w-[21.25rem] rounded-[2.6rem] border-[0.625rem] border-slate-800 bg-slate-900 shadow-2xl shadow-cyan-950/40">
        <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
        <div className="relative aspect-[9/17] overflow-hidden rounded-[1.9rem] bg-black">
          {/* Fond flouté, comme Instagram pour une photo en paysage */}
          <img src={PHOTO} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-125 object-cover opacity-60 blur-2xl" />

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
            <div className="rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-[0.125rem]">
              <div className="grid size-7 place-items-center rounded-full bg-slate-900 text-[0.625rem] font-bold">MC</div>
            </div>
            <span className="text-xs font-semibold">manon.esi_</span>
            <span className="text-xs text-white/60">3 h</span>
            <MoreHorizontal className="ml-auto size-4" />
          </div>

          {/* Photo */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden">
            <motion.img
              src={PHOTO}
              alt="Deux soignantes rient autour d'un café devant le tableau blanc du service de pédiatrie"
              className="block w-full origin-[42%_8%]"
              animate={{ scale: zoom ? 2.6 : 1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>

          {/* Stickers */}
          <div className="absolute inset-x-0 top-[19%] z-20 flex justify-center">
            <span className="flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[0.6875rem] font-bold uppercase text-pink-600 shadow">
              <MapPin className="size-3" /> CH Val-de-Seine · Pédiatrie
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-24 z-20 flex justify-center px-4">
            <p className="rounded-lg bg-black/60 px-3 py-1.5 text-center text-sm font-semibold text-white backdrop-blur-sm">
              Pause café méritée avec ma tutrice 😂☕ #teampédia
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
  return (
    <EnigmaShell
      enigma={ENIGMAS[0]}
      briefing={
        <>
          Cette story a été publiée par une étudiante en stage, géolocalisée sur le service. Elle a été vue 418 fois avant
          d'être supprimée, mais des captures circulent déjà. Analysez l'image : qui est exposé ?
        </>
      }
      question="Calculez : [délai de prescription d'un délit, en années] + [nombre de patients exposés] − [années d'emprisonnement prévues par l'Art. 226-13 CP] − [nombre de soignantes photographiées]."
    >
      <StoryMockup />
    </EnigmaShell>
  )
}
