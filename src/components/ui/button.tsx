import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/70 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97] select-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-neon text-slate-950 hover:bg-cyan-300 glow-neon',
        success: 'bg-med text-slate-950 hover:bg-emerald-300 glow-med',
        danger: 'bg-alert text-white hover:bg-rose-400',
        outline: 'border border-line bg-panel/70 text-slate-200 hover:border-neon/60 hover:text-neon',
        ghost: 'text-slate-300 hover:bg-white/5 hover:text-white',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
)

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
