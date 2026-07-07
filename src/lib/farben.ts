// Farb-Ableitungen für die freie Akzentfarbe: aus einem Hex-Wert entstehen
// die drei Akzent-Stufen (base/soft/deep) und die passende Schriftfarbe.

export type AkzentAbleitung = { base: string; soft: string; deep: string; onAkzent: string }

function hexZuRgb(hex: string): [number, number, number] | null {
  const m = hex.trim().match(/^#?([0-9a-f]{6})$/i)
  if (!m) return null
  const n = parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbZuHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h: number
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
  else if (max === gn) h = ((bn - rn) / d + 2) / 6
  else h = ((rn - gn) / d + 4) / 6
  return [h, s, l]
}

function hslZuHex(h: number, s: number, l: number): string {
  const f = (n: number) => {
    const k = (n + h * 12) % 12
    const a = s * Math.min(l, 1 - l)
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    return Math.round(c * 255).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

// Relative Luminanz (WCAG), 0 = schwarz, 1 = weiß.
export function luminanz(hex: string): number {
  const rgb = hexZuRgb(hex)
  if (!rgb) return 0
  const [r, g, b] = rgb.map(v => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// Passende Schriftfarbe für einen Akzent: dunkle (#283618) oder cremefarbene
// (#FEFAE0) Schrift – je nachdem, welche den höheren WCAG-Kontrast liefert.
// Kontrastbasiert statt fester Luminanzschwelle, damit auch die im Dunkelmodus
// aufgehellten Mitteltöne die lesbarere Variante bekommen.
export function onAkzent(hex: string): string {
  const DUNKEL = '#283618', CREME = '#FEFAE0'
  const bg = luminanz(hex)
  const kontrast = (fg: number) => (Math.max(bg, fg) + 0.05) / (Math.min(bg, fg) + 0.05)
  return kontrast(luminanz(DUNKEL)) >= kontrast(luminanz(CREME)) ? DUNKEL : CREME
}

// Mischt einen Hex-Wert anteilig mit einem anderen (0..1) im sRGB-Raum –
// grobe Näherung der Dark-Mode-Aufhellung (color-mix mit Creme in index.css),
// um die Schriftfarbe gegen den tatsächlich gerenderten Akzent zu bestimmen.
export function mischen(hex: string, mitHex: string, anteil: number): string {
  const a = hexZuRgb(hex), b = hexZuRgb(mitHex)
  if (!a || !b) return hex
  const m = a.map((v, i) => Math.round(v * (1 - anteil) + b[i] * anteil))
  return `#${m.map(v => v.toString(16).padStart(2, '0')).join('')}`
}

export function ableitungen(hex: string): AkzentAbleitung {
  const rgb = hexZuRgb(hex)
  if (!rgb) return { base: '#606C38', soft: '#7C8A4E', deep: '#4A5426', onAkzent: '#FEFAE0' }
  const [h, s, l] = rgbZuHsl(rgb[0], rgb[1], rgb[2])
  return {
    base: hslZuHex(h, s, l),
    soft: hslZuHex(h, s, Math.min(0.92, l + 0.12)),
    deep: hslZuHex(h, s, Math.max(0.08, l - 0.12)),
    onAkzent: onAkzent(hex),
  }
}
