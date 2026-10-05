import { BookOpenText } from 'lucide-react'
import { LAWS } from '../game/config'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'

export function LegislationSheet({ compact = false }: { compact?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={compact ? 'icon' : 'md'} aria-label="Fiche Législation">
          <BookOpenText />
          {!compact && <span>Fiche Législation</span>}
        </Button>
      </DialogTrigger>
      <DialogContent
        side="right"
        title="Fiche Législation"
        description="Les textes à connaître pour résoudre l'enquête."
        icon={<BookOpenText className="mt-0.5 size-6 text-neon" />}
      >
        <div className="space-y-4">
          {LAWS.map((law) => (
            <article key={law.ref} className="rounded-xl border border-line bg-panel-2/70 p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-neon/10 text-neon">
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
          ))}
          <p className="text-xs text-slate-500">
            Rappel : les étudiants en soins infirmiers sont soumis au secret professionnel dès leur entrée en stage.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
