import { motion } from 'framer-motion'
import { ArrowLeft, CheckCheck, Mic, Paperclip, Phone, UserCheck, UserX, Video } from 'lucide-react'
import { ChoiceBoard, type ChoiceItem } from '../components/ChoiceBoard'
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
  { from: 'Léa', text: "Devinez qui est arrivé en cardio cette nuit… le prof de sport du lycée ! Chambre 312 😳", time: '07:12', me: true },
  { from: 'Mehdi', color: 'text-amber-400', text: "Sérieux ?? Il nous a tellement fait courir 😂 Il a quoi ?", time: '07:14' },
  { from: 'Léa', text: 'Infarctus à 52 ans. Coro prévue demain, sa femme a pleuré toute la nuit 😕', time: '07:15', me: true },
  { from: 'Claire', color: 'text-sky-400', text: 'Je suis de repos aujourd’hui, donne-moi son nom, je passerai le voir 😉', time: '07:21' },
  { from: 'Léa', text: 'Patrick M. Mais chut 🤫', time: '07:22', me: true },
  { from: 'Jules', color: 'text-emerald-400', text: "Je préviens le groupe des anciens du lycée, ils vont halluciner", time: '07:30' },
]

const MEMBERS: ChoiceItem[] = [
  {
    id: 'mehdi',
    tag: 'M',
    content: (
      <>
        <strong className="text-white">Mehdi</strong> : ancien ESI de la promo, diplômé, aujourd'hui IDE en EHPAD.
      </>
    ),
    correct: 'non',
    explanation: "Il ne participe pas à la prise en charge du patient : son diplôme ne lui donne aucun droit d'en savoir quoi que ce soit.",
  },
  {
    id: 'claire',
    tag: 'C',
    content: (
      <>
        <strong className="text-white">Claire</strong> : IDE en pneumologie dans le même hôpital, de repos ce jour-là.
      </>
    ),
    correct: 'non',
    explanation: "Travailler dans le même établissement ne suffit pas : elle n'appartient pas à l'équipe de soins de ce patient.",
  },
  {
    id: 'jules',
    tag: 'J',
    content: (
      <>
        <strong className="text-white">Jules</strong> : ESI 1re année, en stage dans le service de psychiatrie.
      </>
    ),
    correct: 'non',
    explanation: 'Étudiant lui aussi soumis au secret, mais hors de la prise en charge du patient : non habilité.',
  },
]

function Chat() {
  return (
    <div className="mx-auto w-full max-w-[26.25rem] overflow-hidden rounded-[2rem] border-[0.625rem] border-slate-800 bg-[#0b141a] shadow-2xl shadow-cyan-950/40">
      <div className="flex items-center gap-3 bg-[#202c33] px-3 py-3 text-white">
        <ArrowLeft className="size-5 text-slate-300" />
        <div className="grid size-9 place-items-center rounded-full bg-teal-700 text-sm">💉</div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">Les potes de la promo</p>
          <p className="truncate text-xs text-slate-400">Claire, Jules, Mehdi, Vous</p>
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
        <p className="mx-auto w-fit rounded-md bg-[#182229] px-3 py-1 text-[0.6875rem] text-slate-400">AUJOURD'HUI</p>
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
                'max-w-[82%] rounded-lg px-3 py-1.5 text-[0.875rem] leading-snug shadow',
                m.me ? 'rounded-tr-none bg-[#005c4b] text-white' : 'rounded-tl-none bg-[#202c33] text-slate-100',
              )}
            >
              {!m.me && <p className={cn('text-xs font-semibold', m.color)}>{m.from}</p>}
              <p>{m.text}</p>
              <p className="mt-0.5 flex items-center justify-end gap-1 text-[0.625rem] text-slate-400">
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
      briefing="Vous êtes Léa, ESI en stage en cardiologie. Ce matin, vous avez écrit dans le groupe WhatsApp de vos amis soignants. « Entre professionnels, c'est du secret partagé », pensiez-vous. Vérifiez qui, parmi les destinataires, avait le droit de recevoir ces informations."
      question="Calculez : [somme des chiffres du numéro de chambre] + [nombre de destinataires non habilités à recevoir ces informations]."
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <Chat />
        <div className="space-y-3">
          <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400">Fiches des destinataires</h3>
          <ChoiceBoard
            enigmaId={3}
            instruction="Pour chaque destinataire : était-il habilité à recevoir ces informations ?"
            choices={[
              { key: 'oui', label: 'Habilité', icon: UserCheck, tone: 'med' },
              { key: 'non', label: 'Non habilité', icon: UserX, tone: 'alert' },
            ]}
            items={MEMBERS}
          />
        </div>
      </div>
    </EnigmaShell>
  )
}
