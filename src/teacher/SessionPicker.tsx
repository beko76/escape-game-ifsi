import { CalendarClock, ChevronRight, Loader2, Plus } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { generateCode, supabase, type SessionRow } from '../online/client'

const dateFormat = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })

/** Création d'une nouvelle séance ou reprise d'une séance récente. */
export function SessionPicker({ onOpen }: { onOpen: (code: string) => void }) {
  const [label, setLabel] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recent, setRecent] = useState<SessionRow[] | null>(null)

  useEffect(() => {
    void supabase!
      .from('sessions')
      .select('code,label,created_at')
      .order('created_at', { ascending: false })
      .limit(12)
      .then(({ data, error }) => {
        if (error) setError('Impossible de charger les séances : vérifiez la connexion.')
        setRecent(data ?? [])
      })
  }, [])

  const create = async (e: FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setError(null)
    // Quelques essais au cas (très improbable) où le code tiré existe déjà
    for (let attempt = 0; attempt < 4; attempt++) {
      const code = generateCode()
      const { error } = await supabase!.from('sessions').insert({ code, label: label.trim() || null })
      if (!error) {
        setCreating(false)
        onOpen(code)
        return
      }
      if (error.code !== '23505') break
    }
    setCreating(false)
    setError('La création de la séance a échoué. Vérifiez la connexion et réessayez.')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white">Nouvelle séance</h2>
        <p className="mt-1 text-sm text-slate-400">
          Un code est généré : les équipes le saisissent (ou scannent le QR code) pour apparaître ici en direct.
        </p>
        <form onSubmit={create} className="mt-5 space-y-3">
          <label className="block text-sm text-slate-300">
            Nom de la séance <span className="text-slate-500">(facultatif)</span>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value.slice(0, 60))}
              placeholder="ex : TD confidentialité · Promo 2026 · Groupe 2"
              className="mt-2 h-11 w-full rounded-lg border border-line bg-slate-950 px-3 text-white outline-none placeholder:text-slate-600 focus:border-neon"
            />
          </label>
          <Button type="submit" size="lg" className="w-full" disabled={creating}>
            {creating ? <Loader2 className="animate-spin" /> : <Plus />}
            Créer la séance
          </Button>
          {error && <p className="text-sm text-alert">{error}</p>}
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white">Séances récentes</h2>
        {recent === null ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <Loader2 className="size-4 animate-spin" /> Chargement…
          </p>
        ) : recent.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Aucune séance pour l'instant.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {recent.map((s) => (
              <li key={s.code}>
                <button
                  type="button"
                  onClick={() => onOpen(s.code)}
                  className="group flex w-full cursor-pointer items-center gap-3 rounded-lg border border-line bg-slate-950/50 p-3 text-left transition-colors hover:border-neon/60"
                >
                  <span className="rounded-md bg-neon/10 px-2 py-1 font-mono text-sm font-bold tracking-widest text-neon">
                    {s.code}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-white">{s.label ?? 'Séance sans nom'}</span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <CalendarClock className="size-3" /> {dateFormat.format(new Date(s.created_at))}
                    </span>
                  </span>
                  <ChevronRight className="size-4 text-slate-500 group-hover:text-neon" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
