import { lazy, Suspense, useMemo } from 'react'
import { useSettings } from '../../hooks/useSettings'
import PaperPlane from '../PaperPlane'

// Lädt die 3D-Welt als eigenen Chunk – nur wenn wirklich gezeigt.
const FlugWelt3D = lazy(() => import('./FlugWelt3D'))

// Entscheidet 2D vs. 3D: 3D nur, wenn eingeschaltet, keine reduzierten
// Animationen gewünscht sind UND das Gerät WebGL kann. Sonst der ruhige
// 2D-Himmel – damit die App auf jedem Handy läuft (design for the margins).
function kannWebGL(): boolean {
  if (typeof document === 'undefined') return false
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl') || c.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

function Himmel2D() {
  return (
    <div
      className="absolute inset-0"
      style={{ background: 'linear-gradient(180deg, var(--sky-1) 0%, var(--sky-2) 55%, var(--sky-3) 100%)' }}
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div style={{ animation: 'glide 5s ease-in-out infinite' }}>
          <PaperPlane width={140} height={112} />
        </div>
      </div>
    </div>
  )
}

export default function FlugWeltHero({ className = '' }: { className?: string }) {
  const { einstellungen } = useSettings()
  const reduziert = einstellungen.wenigerAnimation ||
    (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  const webgl = useMemo(kannWebGL, [])
  const zeige3d = einstellungen.effekte3d && !reduziert && webgl

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {zeige3d ? (
        <Suspense fallback={<Himmel2D />}>
          <FlugWelt3D />
        </Suspense>
      ) : (
        <Himmel2D />
      )}
      {/* sanfter Verlauf nach unten, damit der Inhalt darunter lesbar anschließt */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent, var(--sky-1))' }}
      />
    </div>
  )
}
