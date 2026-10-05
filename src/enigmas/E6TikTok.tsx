import { motion } from 'framer-motion'
import {
  Bookmark,
  CheckCircle2,
  Heart,
  Maximize,
  MessageCircle,
  MinusCircle,
  Music2,
  Pause,
  Play,
  Share2,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useRef, useState, type MouseEvent } from 'react'
import { EnigmaShell } from '../components/EnigmaShell'
import { Card } from '../components/ui/card'
import { ENIGMAS } from '../game/config'
import { useGame } from '../game/GameContext'
import { sound } from '../lib/sound'
import { cn } from '../lib/utils'

const VIDEO_SRC = `${import.meta.env.BASE_URL}videos/tiktok-esi.mp4`

/** 5 règles transgressées par la vidéo, 3 respectées (leurres). */
const CHARTER = [
  { id: 'tenue', text: 'La tenue professionnelle ne se porte qu’en contexte de soin, jamais pour se mettre en scène.', broken: true },
  { id: 'lieu', text: 'Aucun élément ne doit permettre d’identifier le lieu de soins (signalétique du service, numéro de chambre…).', broken: true },
  { id: 'logo', text: 'Aucun logo de l’établissement ou de l’institut de formation ne doit apparaître.', broken: true },
  { id: 'dossier', text: 'Aucun document ou information patient ne doit être visible (nom, dossier, traitement).', broken: true },
  { id: 'image', text: 'Ne pas porter atteinte à la dignité et à l’image de la profession.', broken: true },
  { id: 'tiers', text: 'Aucune personne (patient, collègue) filmée sans son consentement écrit.', broken: false },
  { id: 'geo', text: 'Ne pas géolocaliser le domicile d’un patient lors d’une visite à domicile.', broken: false },
  { id: 'pub', text: 'Ne pas faire de publicité pour un médicament ou un produit de santé.', broken: false },
]

function TikTokPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) void v.play()
    else v.pause()
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const seek = (e: MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current
    if (!v || !v.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration
  }

  const fullscreen = () => {
    const el = frameRef.current
    if (!el) return
    if (document.fullscreenElement) void document.exitFullscreen()
    else void el.requestFullscreen?.()
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-black shadow-2xl shadow-fuchsia-950/30">
      {/* Barre supérieure façon TikTok */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-[#121212] px-4 py-2.5 text-white">
        <Music2 className="size-5 text-[#25f4ee] drop-shadow-[0.125rem_0.125rem_0_#fe2c55]" />
        <span className="font-bold tracking-tight">TikTok</span>
        <span className="ml-auto flex gap-4 text-sm">
          <span className="text-white/50">Abonnements</span>
          <span className="border-b-2 border-white font-semibold">Pour toi</span>
        </span>
      </div>

      <div ref={frameRef} className="relative grid place-items-center bg-black">
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          className="block aspect-video max-h-dvh w-full cursor-pointer object-contain"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onClick={togglePlay}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => {
            const v = e.currentTarget
            setProgress(v.duration ? v.currentTime / v.duration : 0)
          }}
        />

        {!playing && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label="Lire la vidéo"
            className="absolute inset-0 grid cursor-pointer place-items-center bg-black/25"
          >
            <Play className="size-16 fill-white/85 text-white/85 drop-shadow-lg" />
          </button>
        )}

        {/* Actions TikTok */}
        <div className="pointer-events-none absolute bottom-14 right-3 hidden flex-col items-center gap-3 text-white drop-shadow-[0_0.0625rem_0.25rem_rgb(0_0_0/0.8)] sm:bottom-16 sm:flex sm:gap-4">
          <div className="grid size-9 place-items-center rounded-full border-2 border-white bg-fuchsia-500 text-xs font-bold sm:size-11">
            LÉ
          </div>
          {[
            { Icon: Heart, label: '48,2 k', cls: 'fill-rose-500 text-rose-500' },
            { Icon: MessageCircle, label: '1 204', cls: 'fill-white' },
            { Icon: Bookmark, label: '3 018', cls: 'fill-white' },
            { Icon: Share2, label: '9 877', cls: '' },
          ].map(({ Icon, label, cls }) => (
            <span key={label} className="flex flex-col items-center text-[0.6875rem] font-semibold">
              <Icon className={cn('size-6 sm:size-7', cls)} />
              {label}
            </span>
          ))}
        </div>

        {/* Légende */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-11 pr-20 pt-10 text-white sm:block">
          <p className="text-sm font-bold sm:text-base">@lea.esi_</p>
          <p className="text-xs leading-snug sm:text-sm">Quand le service est calme 💃🩺 #nurselife #ESI #chirurgie #fyp</p>
          <p className="mt-1 hidden items-center gap-1 overflow-hidden whitespace-nowrap text-xs sm:flex">
            <Music2 className="size-3.5 shrink-0" />
            <motion.span animate={{ x: ['0%', '-50%'] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
              son original · Dance Challenge 2026 · son original · Dance Challenge 2026 ·
            </motion.span>
          </p>
        </div>

        {/* Contrôles */}
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6 text-white sm:bg-none">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? 'Pause' : 'Lecture'}
            className="cursor-pointer rounded p-1 hover:bg-white/10"
          >
            {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
          </button>
          <div
            onClick={seek}
            className="relative h-4 flex-1 cursor-pointer"
            role="slider"
            aria-label="Position dans la vidéo"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/30" />
            <div
              className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? 'Activer le son' : 'Couper le son'}
            className="cursor-pointer rounded p-1 hover:bg-white/10"
          >
            {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </button>
          <button type="button" onClick={fullscreen} aria-label="Plein écran" className="cursor-pointer rounded p-1 hover:bg-white/10">
            <Maximize className="size-5" />
          </button>
        </div>
      </div>
      {/* Légende sous la vidéo sur petit écran, pour ne rien masquer */}
      <div className="bg-[#121212] px-4 pt-3 text-white sm:hidden">
        <p className="text-sm font-bold">@lea.esi_</p>
        <p className="text-xs leading-snug">Quand le service est calme 💃🩺 #nurselife #ESI #chirurgie #fyp</p>
        <p className="mt-1 flex gap-4 text-xs text-white/70">
          <span>❤️ 48,2 k</span>
          <span>💬 1 204</span>
          <span>↗ 9 877</span>
        </p>
      </div>
      <p className="bg-[#121212] px-4 py-2 text-xs text-slate-400">
        Astuce : mettez en pause ou passez en plein écran pour examiner les détails.
      </p>
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
      <ul className="grid gap-2 md:grid-cols-2">
        {CHARTER.map((r) => {
          const on = checked.has(r.id)
          return (
            <li key={r.id}>
              <button
                type="button"
                disabled={reveal}
                onClick={() => toggle(r.id)}
                className={cn(
                  'flex h-full w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors',
                  !reveal && 'cursor-pointer',
                  !reveal &&
                    (on ? 'border-warn/60 bg-warn/10 text-amber-100' : 'border-line text-slate-300 hover:border-neon/50'),
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
      briefing="Cette vidéo publiée par une étudiante a été vue 600 000 fois. La famille d'une patiente du service de chirurgie l'a signalée à la direction. Analysez-la à l'aide de la Charte."
      question="Combien de règles de la Charte du Soignant Connecté cette vidéo transgresse-t-elle ?"
    >
      <div className="space-y-6">
        <TikTokPlayer />
        <Charter />
      </div>
    </EnigmaShell>
  )
}
