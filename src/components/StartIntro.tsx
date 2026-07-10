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

  // Zielpunkt: Position relativ zum Radar-Radius (−1..1), per Finger/Maus
  // verschiebbar. Erst wenn er im Fadenkreuz einrastet, öffnet sich die App.
  const radarRef = useRef<HTMLDivElement>(null)
  const [ziel, setZiel] = useState({ x: 0.46, y: -0.34 })
  const [gefasst, setGefasst] = useState(false)
  const zieht = useRef(false)
  const startPunkt = useRef({ x: 0, y: 0 })

  const fasse = () => setGefasst(true)

  const punktRunter = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (gefasst) return
    zieht.current = true
    startPunkt.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const punktBewegt = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!zieht.current || gefasst) return
    const feld = radarRef.current?.getBoundingClientRect()
    if (!feld) return
    const radius = feld.width / 2
    let x = (e.clientX - (feld.left + radius)) / radius
    let y = (e.clientY - (feld.top + feld.height / 2)) / radius
    const abstand = Math.hypot(x, y)
    if (abstand > 0.82) {
      // sanft am Ringrand halten
      x = (x / abstand) * 0.82
      y = (y / abstand) * 0.82
    }
    // Instrumenten-Gefühl: Position rastet in ein feines Gitter ein und
    // folgt dem Finger dadurch tickend statt butterweich (wie im Original).
    const schritt = 0.05
    x = Math.round(x / schritt) * schritt
    y = Math.round(y / schritt) * schritt
    setZiel({ x, y })
    if (Math.hypot(x, y) < 0.09) fasse() // im Fadenkreuz → einrasten
  }
  const punktLos = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!zieht.current) return
    zieht.current = false
    // Ein ruhiger Tipp (kaum Bewegung) auf den Zielpunkt rastet ebenfalls
    // ein – barrierefreier Ersatz fürs Ziehen (Motorik, Screenreader).
    const dx = e.clientX - startPunkt.current.x
    const dy = e.clientY - startPunkt.current.y
    if (!gefasst && Math.hypot(dx, dy) < 6) fasse()
  }

  useEffect(() => {
    if (!gefasst) return
    const t = setTimeout(() => setPhase('hebt'), 700)
    return () => clearTimeout(t)
  }, [gefasst])

  useEffect(() => {
    if (phase === 'fertig') return
    try {
      sessionStorage.setItem(SITZUNGS_MARKE, '1')
    } catch {
      /* ohne Storage läuft das Intro schlimmstenfalls beim Reload erneut */
    }
    // Phase „zeigt" wartet aufs Einrasten des Zielpunkts – kein Auto-Weiter.
    // Nur die Hebe-Phase bekommt ein Sicherheitsnetz, falls transitionend
    // nie feuert (Tab im Hintergrund).
    if (phase === 'hebt') {
      timer.current = setTimeout(() => setPhase('fertig'), 1400)
    }
    return () => clearTimeout(timer.current)
  }, [phase])

  if (phase === 'fertig') return null

  return (
    <div
      className={`sintro${phase === 'hebt' ? ' sintro--hebt' : ''}`}
      aria-label="Start-Intro"
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

      {/* Radar-Zielscheibe: Ring, rotierender Suchstrahl, Papierflieger-Punkte
          und der verschiebbare Zielpunkt, der im Fadenkreuz einrastet */}
      <div className={`sintro__radar${gefasst ? ' is--gefasst' : ''}`} ref={radarRef}>
        <Radar />
        <div className="sintro__sweep" />
        <Blip className="sintro__blip is--1" />
        <Blip className="sintro__blip is--2" />
        <Blip className="sintro__blip is--3" />
        <div className="sintro__fang" aria-hidden="true" />
        <button
          type="button"
          className="sintro__ziel"
          style={{
            left: `${50 + (gefasst ? 0 : ziel.x * 50)}%`,
            top: `${50 + (gefasst ? 0 : ziel.y * 50)}%`,
          }}
          aria-label="Zielpunkt – zieh ihn ins Fadenkreuz oder drück Enter, um zu starten"
          onPointerDown={punktRunter}
          onPointerMove={punktBewegt}
          onPointerUp={punktLos}
          onPointerCancel={() => { zieht.current = false }}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') fasse()
          }}
        >
          <Blip className="sintro__zielflieger" />
        </button>
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
        <span className="sintro__start">
          {gefasst ? '[ Ziel erfasst' : '[ Zieh den Flieger ins Fadenkreuz'}
        </span>
        <span className="sintro__kreuz" />
      </div>
    </div>
  )
}
