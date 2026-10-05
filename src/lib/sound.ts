// Sons synthétisés via Web Audio : aucun fichier à charger.
let ctx: AudioContext | null = null

function audio() {
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function tone(freq: number, start: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  const a = audio()
  if (!a) return
  const osc = a.createOscillator()
  const gain = a.createGain()
  osc.type = type
  osc.frequency.value = freq
  const t = a.currentTime + start
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(volume, t + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration)
  osc.connect(gain).connect(a.destination)
  osc.start(t)
  osc.stop(t + duration + 0.05)
}

export const sound = {
  click: () => tone(880, 0, 0.05, 'square', 0.04),
  success: () => {
    tone(660, 0, 0.15)
    tone(990, 0.1, 0.25)
  },
  error: () => {
    tone(160, 0, 0.18, 'sawtooth', 0.12)
    tone(120, 0.15, 0.25, 'sawtooth', 0.12)
  },
  unlock: () => {
    tone(180, 0, 0.08, 'square', 0.1)
    tone(240, 0.08, 0.08, 'square', 0.1)
    const notes = [523, 659, 784, 1047]
    notes.forEach((f, i) => tone(f, 0.25 + i * 0.11, 0.4, 'triangle', 0.16))
  },
  alarm: () => {
    tone(880, 0, 0.12, 'square', 0.06)
    tone(660, 0.15, 0.12, 'square', 0.06)
  },
}
