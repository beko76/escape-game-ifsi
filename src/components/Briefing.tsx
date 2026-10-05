import { motion } from 'framer-motion'
import { AlertTriangle, Hash, KeyRound, Loader2, Lock, Play, Radio, Timer, Users } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useGame } from '../game/GameContext'
import { checkSession, normalizeCode, ONLINE } from '../online/client'
import { sound } from '../lib/sound'
import { TeacherDialog } from './TeacherDialog'
import { Button } from './ui/button'
import { Card } from './ui/card'

export function Briefing() {
  const { start } = useGame()
  const [team, setTeam] = useState('')
  // Code de séance transmis par le lien / QR code de l'enseignant (?seance=XXXXX)
  const [code, setCode] = useState(() => normalizeCode(new URLSearchParams(location.search).get('seance') ?? ''))
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!team.trim() || checking) return
    let session: string | null = null
    if (ONLINE && code) {
      setChecking(true)
      setError(null)
      const result = await checkSession(code)
      setChecking(false)
      if (result === 'unknown') {
        setError(`Le code de séance « ${code} » est introuvable. Vérifiez-le auprès de votre enseignant.`)
        return
      }
      if (result === 'network') {
        setError("Impossible de joindre le serveur de suivi. Vérifiez la connexion, ou videz le code pour jouer sans suivi.")
        return
      }
      session = code
    }
    sound.alarm()
    start(team, session)
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-4xl flex-col justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-alert/50 bg-alert/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.25em] text-alert">
          <span className="blink-alert size-2 rounded-full bg-alert" /> Incident en cours
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl"
      >
        <span className="text-alert">ALERTE</span> <span className="text-glow text-neon">CONFIDENTIALITÉ</span>
        <span className="mt-2 block text-xl font-semibold text-slate-300 sm:text-2xl">Escape Game IFSI</span>
      </motion.h1>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card className="scanline mt-8 border-alert/30 p-5 sm:p-7">
          <div className="flex items-center gap-2 border-b border-line pb-3 font-mono text-xs text-slate-400">
            <Radio className="size-4 text-alert" />
            MESSAGE PRIORITAIRE · Direction des Soins
            <span className="ml-auto hidden sm:inline">Réf. DS-2026-117</span>
          </div>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            <p className="flex gap-2 font-semibold text-white">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warn" />
              Une fuite de données patients a été détectée cette nuit.
            </p>
            <p>
              Des informations confidentielles concernant des patients de l'établissement circulent sur les réseaux
              sociaux. Plusieurs étudiants en stage seraient impliqués. Les familles menacent de porter plainte.
            </p>
            <p>
              Votre équipe est missionnée par la cellule de crise. Examinez les{' '}
              <strong className="text-neon">6 pièces d'investigation</strong>, récupérez un chiffre dans chacune, puis
              déverrouillez le <strong className="text-neon">serveur sécurisé</strong> pour stopper la fuite.
            </p>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-slate-400 sm:gap-3">
            <div className="rounded-lg border border-line bg-slate-950/60 p-3">
              <Timer className="mx-auto mb-1 size-5 text-neon" />
              45 minutes
            </div>
            <div className="rounded-lg border border-line bg-slate-950/60 p-3">
              <KeyRound className="mx-auto mb-1 size-5 text-neon" />6 énigmes
            </div>
            <div className="rounded-lg border border-line bg-slate-950/60 p-3">
              <Lock className="mx-auto mb-1 size-5 text-neon" />1 cadenas
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onSubmit={submit}
        className="mt-6"
      >
        <div className={ONLINE ? 'grid gap-3 sm:grid-cols-[minmax(0,1fr)_11rem_auto]' : 'grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]'}>
          <label className="relative">
            <span className="sr-only">Nom de l'équipe</span>
            <Users className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
            <input
              value={team}
              onChange={(e) => setTeam(e.target.value.slice(0, 30))}
              placeholder="Nom de l'équipe (ex : Groupe A3)"
              className="h-14 w-full rounded-xl border border-line bg-panel pl-12 pr-4 text-base text-white outline-none transition-colors placeholder:text-slate-500 focus:border-neon focus:glow-neon"
            />
          </label>
          {ONLINE && (
            <label className="relative">
              <span className="sr-only">Code de séance</span>
              <Hash className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
              <input
                value={code}
                onChange={(e) => {
                  setCode(normalizeCode(e.target.value))
                  setError(null)
                }}
                placeholder="Code séance"
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                className="h-14 w-full rounded-xl border border-line bg-panel pl-12 pr-4 font-mono text-base uppercase tracking-widest text-white outline-none transition-colors placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-500 focus:border-neon focus:glow-neon"
              />
            </label>
          )}
          <Button type="submit" size="lg" className="h-14 px-8 text-base font-bold" disabled={!team.trim() || checking}>
            {checking ? <Loader2 className="size-5! animate-spin" /> : <Play className="size-5! fill-current" />}
            Lancer la mission
          </Button>
        </div>
        {error ? (
          <p className="mt-3 flex items-start gap-2 text-sm text-alert">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        ) : (
          ONLINE && (
            <p className="mt-3 text-xs text-slate-500">
              {code
                ? "Votre progression sera visible en direct par l'enseignant."
                : "Sans code de séance, la partie fonctionne mais l'enseignant ne verra pas votre progression."}
            </p>
          )
        )}
      </motion.form>

      <div className="mt-10 flex justify-center">
        <TeacherDialog
          trigger={
            <button type="button" className="cursor-pointer text-xs text-slate-600 hover:text-slate-400">
              Espace enseignant
            </button>
          }
        />
      </div>
    </main>
  )
}
