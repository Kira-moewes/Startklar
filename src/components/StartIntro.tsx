import { useEffect, useRef, useState } from 'react'
import './StartIntro.css'

/**
 * Start-Intro beim Öffnen der App: ein kurzer „Cockpit-Check" (≈2,8 s) –
 * Sucher-Ecken, Mess-Skalen, die Wortmarke STARTKLAR hebt sich, dann gibt
 * die Fläche die App frei.
 *
 * Leitplanken (r7):
 *  - läuft nur EINMAL pro Sitzung (sessionStorage), nie bei jeder Navigation
 *  - wartet wie ein Titelbildschirm auf einen Tipp („Tippen zum Starten") –
 *    das Radar läuft solange ruhig weiter, nichts drängt
 *  - bei reduzierter Bewegung (System ODER App-Einstellung) entfällt es ganz
 */
const SITZUNGS_MARKE = 'startklar-startintro'

/**
 * Radar-Zielscheibe: Kompassring mit Strichen und Gradzahlen, komplett
 * programmatisch erzeugt (keine handgezeichneten Pfaddaten). Der rotierende
 * Suchstrahl und die Papierflieger-Punkte liegen als CSS-Ebenen darüber.
 */
function Radar() {
  const M = 210 // Mittelpunkt im viewBox-Raster 0..420
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5)
  const zahlen = Array.from({ length: 18 }, (_, i) => i * 20)
  return (
    <svg className="sintro__radarring" viewBox="0 0 420 420" aria-hidden="true">
      {/* Außenring + zwei stille Innenkreise */}
      <circle cx={M} cy={M} r={186} fill="none" stroke="currentColor" strokeOpacity={0.55} />
      <circle cx={M} cy={M} r={124} fill="none" stroke="currentColor" strokeOpacity={0.16} />
      <circle cx={M} cy={M} r={62} fill="none" stroke="currentColor" strokeOpacity={0.16} />
      {/* Skalenstriche: alle 5°, länger an den 20°-Marken */}
      {ticks.map(g => (
        <line
          key={g}
          x1={M} y1={24} x2={M} y2={g % 20 === 0 ? 34 : 29}
          stroke="currentColor"
          strokeOpacity={g % 20 === 0 ? 0.75 : 0.4}
          transform={`rotate(${g} ${M} ${M})`}
        />
      ))}
      {/* Gradzahlen, tangential am Ring entlang wie auf einem Kompass */}
      {zahlen.map(g => (
        <text
          key={g}
          x={M} y={16}
          textAnchor="middle"
          fontSize={10}
          letterSpacing={1}
          fill="currentColor"
          fillOpacity={0.5}
          transform={`rotate(${g} ${M} ${M})`}
        >
          {g}
        </text>
      ))}
      {/* Fadenkreuz in der Mitte, bewusst klein und ruhig */}
      <g stroke="currentColor" strokeOpacity={0.9}>
        <line x1={M} y1={M - 16} x2={M} y2={M - 7} />
        <line x1={M} y1={M + 7} x2={M} y2={M + 16} />
        <line x1={M - 16} y1={M} x2={M - 7} y2={M} />
        <line x1={M + 7} y1={M} x2={M + 16} y2={M} />
      </g>
    </svg>
  )
}

/** Kleiner Papierflieger als Radar-Punkt (eigene, simple Silhouette). */
function Blip({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12 L22 4 L14 22 L11 14 Z" fill="currentColor" />
    </svg>
  )
}

function sofortUeberspringen(): boolean {
  if (typeof window === 'undefined') return true
  try {
    if (sessionStorage.getItem(SITZUNGS_MARKE)) return true
  } catch {
    /* privater Modus o. Ä. – dann lieber einmal zu oft zeigen als crashen */
  }
  // data-motion setzt das Pre-Paint-Skript aus index.html schon vor React
  if (document.documentElement.dataset.motion === 'reduziert') return true
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return true
  return false
}

export default function StartIntro() {
  const [phase, setPhase] = useState<'zeigt' | 'hebt' | 'fertig'>(() =>
    sofortUeberspringen() ? 'fertig' : 'zeigt',
  )
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (phase === 'fertig') return
    try {
      sessionStorage.setItem(SITZUNGS_MARKE, '1')
    } catch {
      /* ohne Storage läuft das Intro schlimmstenfalls beim Reload erneut */
    }
    // Phase „zeigt" wartet auf den Tipp – kein Auto-Weiter, wie ein
    // Titelbildschirm. Nur die Hebe-Phase bekommt ein Sicherheitsnetz,
    // falls transitionend nie feuert (Tab im Hintergrund).
    if (phase === 'hebt') {
      timer.current = setTimeout(() => setPhase('fertig'), 1200)
    }
    return () => clearTimeout(timer.current)
  }, [phase])

  if (phase === 'fertig') return null

  return (
    <div
      className={`sintro${phase === 'hebt' ? ' sintro--hebt' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Startklar öffnen"
      onClick={() => setPhase('hebt')}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') setPhase('hebt')
      }}
      onTransitionEnd={e => {
        if (e.target === e.currentTarget) setPhase('fertig')
      }}
    >
      <div className="sintro__grain" />
      <span className="sintro__ecke is--tl" />
      <span className="sintro__ecke is--tr" />
      <span className="sintro__ecke is--bl" />
      <span className="sintro__ecke is--br" />
      <div className="sintro__skala is--links" />
      <div className="sintro__skala is--rechts" />

      {/* Radar-Zielscheibe: Ring, rotierender Suchstrahl, Papierflieger-Punkte */}
      <div className="sintro__radar">
        <Radar />
        <div className="sintro__sweep" />
        <Blip className="sintro__blip is--1" />
        <Blip className="sintro__blip is--2" />
        <Blip className="sintro__blip is--3" />
      </div>

      <div className="sintro__mitte">
        <p className="sintro__label">
          <b>[</b> Bereit fürs echte Leben
        </p>
        <div className="sintro__wortmaske">
          <span className="sintro__wort">Startklar</span>
        </div>
        <div className="sintro__linie" />
      </div>

      <div className="sintro__fuss">
        <span className="sintro__start">[ Tippen zum Starten</span>
        <span className="sintro__kreuz" />
      </div>
    </div>
  )
}
