import { motion } from 'framer-motion'
import { ArrowLeft, CheckCheck, Mic, Paperclip, Phone, Video } from 'lucide-react'
import { EnigmaShell } from '../components/EnigmaShell'
import { ENIGMAS } from '../game/config'
import { cn } from '../lib/utils'

interface Msg {
  from: string
  color?: string
  text: string
  time: string
  me?: boolean
}

const MESSAGES: Msg[] = [
  { from: 'Léa', color: 'text-pink-400', text: 'Vous devinerez jamais qui est arrivée en chir cette nuit 😱', time: '07:42' },
  { from: 'Tom', color: 'text-amber-400', text: 'Qui ?? Raconte', time: '07:43' },
  {
    from: 'Léa',
    color: 'text-pink-400',
    text: "La dame de la chambre 204 ! L'ancienne maire du village 😮 Elle est là pour une occlusion",
    time: '07:43',
  },
  { from: 'Tom', color: 'text-amber-400', text: 'Nooon 😂', time: '07:44' },
  {
    from: 'Karim',
    color: 'text-sky-400',
    text: "Ahah je la connais, elle habite rue des Lilas juste à côté de chez ma grand-mère, je vais lui dire qu'elle est hospitalisée",
    time: '07:46',
  },
  {
    from: 'Inès',
    color: 'text-emerald-400',
    text: "Euh les gars… on n'a pas le droit de parler de ça ici. Supprimez vos messages svp 🙏",
    time: '07:48',
  },
  { from: 'Moi', text: 'Inès a raison…', time: '07:49', me: true },
]

function Chat() {
  return (
    <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-[2rem] border-[10px] border-slate-800 bg-[#0b141a] shadow-2xl shadow-cyan-950/40">
      <div className="flex items-center gap-3 bg-[#202c33] px-3 py-3 text-white">
        <ArrowLeft className="size-5 text-slate-300" />
        <div className="grid size-9 place-items-center rounded-full bg-teal-700 text-sm">🩺</div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">Promo ESI 1A · Stage 🏥</p>
          <p className="truncate text-xs text-slate-400">Inès, Karim, Léa, Tom, Vous</p>
        </div>
        <Video className="size-5 text-slate-300" />
        <Phone className="size-5 text-slate-300" />
      </div>

      <div
        className="space-y-2 px-3 py-4"
        style={{
          backgroundImage: 'radial-gradient(rgb(255 255 255 / 0.035) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      >
        <p className="mx-auto w-fit rounded-md bg-[#182229] px-3 py-1 text-[11px] text-slate-400">AUJOURD'HUI</p>
        {MESSAGES.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.25 + i * 0.35 }}
            className={cn('flex', m.me ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[82%] rounded-lg px-3 py-1.5 text-[14px] leading-snug shadow',
                m.me ? 'rounded-tr-none bg-[#005c4b] text-white' : 'rounded-tl-none bg-[#202c33] text-slate-100',
              )}
            >
              {!m.me && <p className={cn('text-xs font-semibold', m.color)}>{m.from}</p>}
              <p>{m.text}</p>
              <p className="mt-0.5 flex items-center justify-end gap-1 text-[10px] text-slate-400">
                {m.time}
                {m.me && <CheckCheck className="size-3.5 text-sky-400" />}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-[#202c33] px-3 py-2">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-[#2a3942] px-4 py-2 text-sm text-slate-400">
          Message <Paperclip className="ml-auto size-4" />
        </div>
        <div className="grid size-10 place-items-center rounded-full bg-[#00a884] text-white">
          <Mic className="size-5" />
        </div>
      </div>
    </div>
  )
}

export function E3WhatsApp() {
  return (
    <EnigmaShell
      enigma={ENIGMAS[2]}
      briefing="Une capture de ce groupe WhatsApp de promo circule désormais dans tout le village. Lisez l'échange : qui a laissé fuiter des informations permettant d'identifier la patiente ?"
      question="Prenez le dernier chiffre du numéro de chambre et multipliez-le par le nombre d'étudiants ayant partagé des données identifiantes."
    >
      <Chat />
    </EnigmaShell>
  )
}
