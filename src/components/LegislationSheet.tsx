import { BookOpenText } from 'lucide-react'
import { LAWS } from '../game/config'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'

const GROUP_TITLES = { loi: 'Textes de loi & repères', guide: 'Bonnes pratiques des réseaux sociaux' } as const

export function LegislationSheet({ compact = false }: { compact?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={compact ? 'icon' : 'md'} aria-label="Bibliothèque légale et guide MACSF">
          <BookOpenText />
          {!compact && <span>Bibliothèque légale</span>}
        </Button>
      </DialogTrigger>
      <DialogContent
        side="right"
        title="Bibliothèque légale & guide MACSF"
        description="Les textes et bonnes pratiques à connaître pour résoudre l'enquête."
        icon={<BookOpenText className="mt-0.5 size-6 text-neon" />}
      >
        <div className="space-y-4">
          {LAWS.map((law, i) => (
            <div key={law.ref} className="space-y-4">
              {law.group !== LAWS[i - 1]?.group && (
                <h3 className="pt-2 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">{GROUP_TITLES[law.group]}</h3>
              )}
              <article className="rounded-xl border border-line bg-panel-2/70 p-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-neon/10 text-neon">
                    <law.icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-neon">{law.ref}</p>
                    <h3 className="font-semibold text-white">{law.title}</h3>
                  </div>
                </div>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300">
                  {law.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-neon/70" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          ))}
          <p className="text-xs text-slate-500">
            Rappel : les étudiants en soins infirmiers sont soumis au secret professionnel dès leur entrée en stage.
            Synthèse du guide « Bonnes pratiques des réseaux sociaux », Fondation MACSF.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
