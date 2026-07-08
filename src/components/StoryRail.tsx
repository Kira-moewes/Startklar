import { useEffect, useRef, useState } from 'react'
import KlaroPlane from './KlaroPlane'

// Kapitel-Leiste der Startseite: eine vertikale „Flugroute" am linken
// Rand. Der Klaro-Flieger wandert mit dem (geglätteten) Scroll-Fortschritt
// die Route entlang und neigt sich je nach Scroll-Geschwindigkeit —
// alles transform-basiert, in einem einzigen rAF-Loop.
const KAPITEL = [
  { id: 'ablauf', label: 'Prolog · So geht’s' },
  { id: 'werkzeuge', label: 'Kapitel 01 · Deine Werkzeuge' },
  { id: 'begleiter', label: 'Kapitel 02 · Dein Begleiter' },
  { id: 'haltung', label: 'Kapitel 03 · Unsere Haltung' },
  { id: 'finale', label: 'Finale · Bereit?' },
]

export default function StoryRail() {
  const railRef = useRef<HTMLElement>(null)
  const [aktiv, setAktiv] = useState(0)

  useEffect(() => {
    const reduziert = () =>
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.dataset.motion === 'reduziert'

    let raf = 0
    let gezeigt = 0
    let zuletzt = 0
    const tick = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const ziel = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      // Träge Annäherung wie eine Kamerafahrt; ohne Bewegung direkt ans Ziel
      gezeigt = reduziert() ? ziel : gezeigt + (ziel - gezeigt) * 0.1
      const neigung = reduziert() ? 0 : Math.max(-1, Math.min(1, (gezeigt - zuletzt) * 260))
      zuletzt = gezeigt

      const el = railRef.current
      if (el) {
        el.style.setProperty('--p', gezeigt.toFixed(4))
        el.style.setProperty('--bank', neigung.toFixed(3))
      }

      let a = 0
      for (let i = 0; i < KAPITEL.length; i++) {
        const s = document.getElementById(KAPITEL[i].id)
        if (s && s.getBoundingClientRect().top < window.innerHeight * 0.55) a = i
      }
      setAktiv(prev => (prev === a ? prev : a))

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <nav
      ref={railRef}
      aria-label="Kapitel dieser Seite"
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden min-[1360px]:block"
    >
      <div className="relative h-[46vh] w-9">
        {/* Route + gefüllter Fortschritt */}
        <span aria-hidden="true" className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-pine/15" />
        <span
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-[2px] rounded-pill bg-olive origin-top"
          style={{ transform: 'translateX(-50%) scaleY(var(--p, 0))' }}
        />

        {/* Kapitel-Punkte */}
        {KAPITEL.map((k, i) => (
          <a
            key={k.id}
            href={`#${k.id}`}
            aria-label={k.label}
            aria-current={aktiv === i ? 'true' : undefined}
            className="group absolute left-1/2 flex items-center"
            style={{ top: `${(i / (KAPITEL.length - 1)) * 100}%`, transform: 'translate(-50%, -50%)' }}
          >
            <span
              className={`block size-[9px] rounded-full border-[1.5px] transition-all duration-300 ${
                aktiv >= i ? 'bg-olive border-olive scale-110' : 'bg-cream border-pine/30 group-hover:border-olive'
              }`}
            />
            <span
              className="absolute left-6 whitespace-nowrap text-[11px] font-semibold tracking-[.14em] uppercase text-olive-deep bg-cream-card border border-pine/15 rounded-pill px-3 py-1.5 shadow-[0_6px_18px_rgba(40,54,24,.10)] opacity-0 -translate-x-1.5 transition-all duration-300 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0"
            >
              {k.label}
            </span>
          </a>
        ))}

        {/* Klaro fliegt die Route entlang */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-0 block"
          style={{ transform: 'translate(-50%, calc(var(--p, 0) * 46vh)) translateY(-50%) rotate(calc(90deg + var(--bank, 0) * 24deg))' }}
        >
          <KlaroPlane width={34} height={27} shadow={false} />
        </span>
      </div>
    </nav>
  )
}
