// Startklar Hero — Higgsfield-Video mit Poster-Fallback
// Assets: public/hero.mp4 · public/hero.jpg
import './Hero.css'

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

      <div className="hero__content">
        <p className="hero__eyebrow">Startklar</p>
        <h1 className="hero__title">
          Bereit fürs <em>echte</em> Leben.
        </h1>
        <a className="hero__cta" href="#start">
          Jetzt startklar werden
        </a>
      </div>
    </section>
  )
}
