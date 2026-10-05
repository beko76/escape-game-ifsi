import { Check, Copy, QrCode } from 'lucide-react'
import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { joinLink } from '../online/client'

/** Code, lien et QR code à projeter pour que les équipes rejoignent la séance. */
export function JoinPanel({ code, label }: { code: string; label: string | null }) {
  const link = joinLink(code)
  const [qr, setQr] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    void QRCode.toDataURL(link, { margin: 1, width: 360, color: { dark: '#020617', light: '#ffffff' } }).then(setQr)
  }, [link])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* presse-papiers indisponible : le lien reste sélectionnable */
    }
  }

  return (
    <Card className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
      {qr ? (
        <img src={qr} alt={`QR code pour rejoindre la séance ${code}`} className="mx-auto size-36 rounded-xl bg-white p-1 sm:mx-0" />
      ) : (
        <div className="mx-auto grid size-36 place-items-center rounded-xl bg-slate-900 sm:mx-0">
          <QrCode className="size-10 text-slate-600" />
        </div>
      )}
      <div className="min-w-0 flex-1 text-center sm:text-left">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">{label ?? 'Code de séance'}</p>
        <p className="mt-1 font-mono text-5xl font-black tracking-[0.25em] text-neon text-glow">{code}</p>
        <p className="mt-2 text-sm text-slate-400">
          Les équipes scannent le QR code, ou ouvrent le jeu et saisissent ce code avec leur nom d'équipe.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <code className="min-w-0 truncate rounded-md border border-line bg-slate-950 px-3 py-2 text-xs text-slate-300 select-all">
            {link}
          </code>
          <Button variant="outline" size="sm" onClick={copy} className="shrink-0">
            {copied ? <Check /> : <Copy />} {copied ? 'Copié' : 'Copier le lien'}
          </Button>
        </div>
      </div>
    </Card>
  )
}
