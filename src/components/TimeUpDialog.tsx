import { AlarmClockOff } from 'lucide-react'
import { useEffect } from 'react'
import { useGame } from '../game/GameContext'
import { sound } from '../lib/sound'
import { Button } from './ui/button'
import { Dialog, DialogClose, DialogContent } from './ui/dialog'

/** S'affiche une fois quand les 45 minutes sont écoulées ; la partie peut continuer en temps additionnel. */
export function TimeUpDialog() {
  const { state, remainingMs, acknowledgeTimeUp } = useGame()
  const show = state.phase === 'playing' && remainingMs <= 0 && !state.timeUpAcknowledged

  useEffect(() => {
    if (show) sound.alarm()
  }, [show])

  return (
    <Dialog open={show} onOpenChange={(o) => !o && acknowledgeTimeUp()}>
      <DialogContent
        title="Temps écoulé !"
        description="Les 45 minutes sont passées : la fuite continue de se propager…"
        icon={<AlarmClockOff className="mt-0.5 size-6 text-alert" />}
        className="border-alert/50"
      >
        <p className="text-sm leading-relaxed text-slate-300">
          Vous pouvez poursuivre l'enquête en <strong className="text-alert">temps additionnel</strong> : le chronomètre
          affichera le dépassement. Votre temps final apparaîtra au débriefing.
        </p>
        <DialogClose asChild>
          <Button variant="danger" className="mt-5 w-full">
            Continuer en temps additionnel
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
