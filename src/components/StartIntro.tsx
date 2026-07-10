import { useEffect, useRef, useState } from 'react'
import './StartIntro.css'

/**
 * Start-Intro beim Öffnen der App: ein kurzer „Cockpit-Check" (≈2,8 s) –
 * Sucher-Ecken, Mess-Skalen, die Wortmarke STARTKLAR hebt sich, dann gibt
 * die Fläche die App frei.
 *
 * Leitplanken (r7):
 *  - läuft nur EINMAL pro Sitzung (sessionStorage), nie bei jeder Navigation
 *  - ein Tipp überspringt sofort – niemand muss zuschauen
 *  - bei reduzierter Bewegung (System ODER App-Einstellung) entfällt es ganz
 */
const SITZUNGS_MARKE = 'startklar-startintro'

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
    if (phase === 'zeigt') {
      timer.current = setTimeout(() => setPhase('hebt'), 2050)
    } else {
      // Sicherheitsnetz: auch wenn transitionend nie feuert (Tab im
      // Hintergrund), verschwindet das Intro garantiert.
      timer.current = setTimeout(() => setPhase('fertig'), 1200)
    }
    return () => clearTimeout(timer.current)
  }, [phase])

  if (phase === 'fertig') return null

  return (
    <div
      className={`sintro${phase === 'hebt' ? ' sintro--hebt' : ''}`}
      aria-hidden="true"
      onClick={() => setPhase('hebt')}
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
        <span>Tippen zum Überspringen</span>
        <span className="sintro__kreuz" />
      </div>
    </div>
  )
}
