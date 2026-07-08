// Startklar Hero — Higgsfield-Video mit Poster-Fallback
// Assets: public/hero.mp4 · public/hero.jpg
import './Hero.css'

const WORTE: Array<{ text: string; em?: boolean }> = [
  { text: 'Bereit' },
  { text: 'fürs' },
  { text: 'echte', em: true },
  { text: 'Leben.' },
]

export default function Hero() {
  return (
    <section className="hero">
      <video
        className="hero__media"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero.jpg"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      <div className="hero__scrim" />
      <div className="hero__fade" />

      <div className="hero__content">
        <p className="hero__eyebrow">Startklar</p>
        <h1 className="hero__title">
          {WORTE.map((w, i) => (
            <span key={w.text} className="hero__w">
              <span style={{ animationDelay: `${0.25 + i * 0.11}s` }}>
                {w.em ? <em>{w.text}</em> : w.text}
              </span>
            </span>
          ))}
        </h1>
        <a className="hero__cta" href="#start">
          Jetzt startklar werden
        </a>
      </div>

      <a className="hero__cue" href="#start" aria-label="Zum Inhalt scrollen">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  )
}
