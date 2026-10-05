import { ArrowLeft, Eye, EyeOff, Gamepad2, Maximize, MonitorPlay } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { ONLINE, supabase, TABLES } from '../online/client'
import { JoinPanel } from './JoinPanel'
import { PasswordGate } from './PasswordGate'
import { SessionPicker } from './SessionPicker'
import { TeamBoard } from './TeamBoard'

function SetupNotice() {
  return (
    <Card className="mx-auto max-w-2xl p-6">
      <h2 className="text-lg font-semibold text-white">Le suivi en direct n'est pas encore configuré</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        Le tableau de bord a besoin d'une base de données Supabase (gratuite). Renseignez{' '}
        <code className="text-neon">VITE_SUPABASE_URL</code> et <code className="text-neon">VITE_SUPABASE_ANON_KEY</code>{' '}
        dans le fichier <code className="text-neon">.env</code>, puis reconstruisez l'application. Les étapes sont
        décrites dans le README. Le jeu fonctionne normalement en attendant, sans suivi.
      </p>
    </Card>
  )
}

/** Tableau de bord enseignant, accessible via #/prof (et #/prof/CODE pour une séance). */
export function TeacherDashboard({ code }: { code: string | null }) {
  const [label, setLabel] = useState<string | null>(null)
  const [missing, setMissing] = useState(false)
  const [showJoin, setShowJoin] = useState(true)

  useEffect(() => {
    setLabel(null)
    setMissing(false)
    if (!code || !supabase) return
    void supabase
      .from(TABLES.sessions)
      .select('label')
      .eq('code', code)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && !data) setMissing(true)
        setLabel(data?.label ?? null)
      })
  }, [code])

  const fullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.()
  }

  return (
    <div className="bg-cyber min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-line bg-slate-950/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <MonitorPlay className="size-6 shrink-0 text-neon" />
          <div className="min-w-0 leading-tight">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-neon">Escape Game IFSI</p>
            <p className="truncate text-sm font-semibold text-white">
              Tableau de bord enseignant{code ? ` · séance ${code}` : ''}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {code && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setShowJoin((s) => !s)} className="hidden sm:inline-flex">
                  {showJoin ? <EyeOff /> : <Eye />} {showJoin ? 'Masquer le code' : 'Afficher le code'}
                </Button>
                <a href="#/prof" className="hidden items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5 sm:inline-flex">
                  <ArrowLeft className="size-4" /> Séances
                </a>
              </>
            )}
            <Button variant="outline" size="icon" onClick={fullscreen} aria-label="Plein écran" title="Plein écran (projection)">
              <Maximize />
            </Button>
            <a
              href="#"
              title="Retour au jeu"
              aria-label="Retour au jeu"
              className="grid size-10 place-items-center rounded-lg text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <Gamepad2 className="size-4" />
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        {!ONLINE ? (
          <SetupNotice />
        ) : (
          <PasswordGate>
            {!code ? (
              <SessionPicker onOpen={(c) => (location.hash = `#/prof/${c}`)} />
            ) : missing ? (
              <Card className="mx-auto max-w-lg p-6 text-center">
                <p className="text-white">La séance « {code} » est introuvable.</p>
                <a href="#/prof" className="mt-3 inline-block text-sm text-neon hover:underline">
                  Revenir à la liste des séances
                </a>
              </Card>
            ) : (
              <>
                {showJoin && <JoinPanel code={code} label={label} />}
                <TeamBoard code={code} />
              </>
            )}
          </PasswordGate>
        )}
      </main>
    </div>
  )
}
