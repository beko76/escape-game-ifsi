import { Printer, ShieldCheck } from 'lucide-react'
import { GOLDEN_RULES } from '../game/config'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'

export function GoldenRulesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          <ShieldCheck /> Les 5 règles d'or du soignant connecté
        </Button>
      </DialogTrigger>
      <DialogContent
        title="Les 5 règles d'or du soignant connecté"
        description="À garder dans sa poche de blouse… et en tête."
        className="max-w-2xl"
        icon={<ShieldCheck className="mt-0.5 size-6 text-med" />}
      >
        <div id="print-area">
          <div className="mb-4 hidden print:block">
            <h1 className="text-2xl font-bold">Les 5 règles d'or du soignant connecté</h1>
            <p className="text-sm">Escape Game IFSI · Confidentialité médicale et réseaux sociaux</p>
          </div>
          <ol className="space-y-3">
            {GOLDEN_RULES.map((r, i) => (
              <li key={r.title} className="flex gap-4 rounded-xl border border-line bg-panel-2/70 p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-med/15 font-mono text-lg font-bold text-med">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-white">{r.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">{r.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-slate-500">
            Rappel : violation du secret professionnel (Art. 226-13 Code pénal) = 1 an d'emprisonnement et 15 000 €
            d'amende, sans préjudice des sanctions disciplinaires.
          </p>
          <div className="print-hide mt-5 flex justify-end">
            <Button onClick={() => window.print()}>
              <Printer /> Imprimer la fiche
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
