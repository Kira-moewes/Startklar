import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { fehler: boolean }

// Fängt Render-/Laufzeitfehler in der App ab, damit statt eines weißen
// Bildschirms eine freundliche Seite mit Auswegen erscheint. Bewusst schlicht
// (kein externes Error-Reporting – passt zur lokal-first/kein-Tracking-Linie).
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { fehler: false }

  static getDerivedStateFromError(): State {
    return { fehler: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Nur lokal in der Konsole – nichts wird übertragen.
    console.error('Startklar-Fehler:', error, info)
  }

  render() {
    if (!this.state.fehler) return this.props.children
    return (
      <div className="mx-auto max-w-[680px] w-full px-7 pt-20 pb-24 text-center">
        <h1 className="m-0 font-serif font-normal text-[clamp(34px,5vw,52px)] text-pine">
          Da ist etwas <em className="text-olive">schiefgelaufen</em>
        </h1>
        <p className="mt-4 m-0 text-[17px] text-pine/70">
          Keine Sorge – deine Daten liegen sicher auf deinem Gerät. Lade die Seite neu; meist ist der
          Fehler dann weg.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="rounded-pill bg-olive px-7 py-3.5 font-semibold text-on-akzent hover:bg-olive-deep transition"
          >
            Seite neu laden
          </button>
          <a href="/" className="rounded-pill border-[1.5px] border-pine/30 text-pine px-7 py-3.5 font-semibold hover:border-pine transition">
            Zur Startseite
          </a>
        </div>
      </div>
    )
  }
}
