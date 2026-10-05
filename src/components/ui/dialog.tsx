import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

type ContentProps = Omit<ComponentProps<typeof DialogPrimitive.Content>, 'title'> & {
  title: ReactNode
  description?: ReactNode
  /** "center" = modale, "right" = tiroir latéral */
  side?: 'center' | 'right'
  icon?: ReactNode
}

export function DialogContent({ className, children, title, description, side = 'center', icon, ...props }: ContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm" />
      <DialogPrimitive.Content
        className={cn(
          'fixed z-50 flex flex-col border border-line bg-panel text-slate-200 shadow-2xl outline-none',
          side === 'center' &&
            'left-1/2 top-1/2 max-h-[90dvh] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl',
          side === 'right' && 'inset-y-0 right-0 h-dvh w-full max-w-md border-y-0 border-r-0',
          className,
        )}
        {...props}
      >
        <div className="print-hide flex items-start justify-between gap-4 border-b border-line p-5">
          <div className="flex items-start gap-3">
            {icon}
            <div>
              <DialogPrimitive.Title className="text-lg font-semibold text-white">{title}</DialogPrimitive.Title>
              <DialogPrimitive.Description className={description ? 'mt-1 text-sm text-slate-400' : 'sr-only'}>
                {description ?? 'Fenêtre'}
              </DialogPrimitive.Description>
            </div>
          </div>
          <DialogPrimitive.Close
            className="cursor-pointer rounded-md p-1 text-slate-400 hover:bg-white/5 hover:text-white"
            aria-label="Fermer"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
