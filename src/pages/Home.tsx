import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { journeys } from '../data'
import { useProfile } from '../hooks/useProfile'
import { useCountUp } from '../hooks/useCountUp'
import { useInView } from '../hooks/useInView'
import { istRelevant, relevanteTasks } from '../data/visibility'
import KlaroPlane from '../components/KlaroPlane'
import Hero from '../components/Hero'
import Reveal from '../components/Reveal'

// Magnetische Buttons: ziehen sich ein paar Pixel zum Cursor (CSS .magnet)
const magnetMove = (e: React.MouseEvent<HTMLElement>) => {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${(((e.clientX - r.left) / r.width) - 0.5) * 10}px`)
  el.style.setProperty('--my', `${(((e.clientY - r.top) / r.height) - 0.5) * 8}px`)
}
const magnetLeave = (e: React.MouseEvent<HTMLElement>) => {
  e.currentTarget.style.setProperty('--mx', '0px')
  e.currentTarget.style.setProperty('--my', '0px')
}

export default function Home() {
  const { profile, loading } = useProfile()
  const heroRef = useRef<HTMLElement>(null)
  const statsView = useInView<HTMLDivElement>()

  const sichtbar = journeys
    .map(j => ({ journey: j, tasks: relevanteTasks(j, profile) }))
    .filter(({ journey, tasks }) => istRelevant(profile, journey.id) && tasks.length > 0)

  const totalTasks = sichtbar.reduce((n, s) => n + s.tasks.length, 0)
  const statBereiche = useCountUp(sichtbar.length, 1400, statsView.inView)
  const statSchritte = useCountUp(totalTasks, 1400, statsView.inView)

  // Sanfte Parallaxe des Papierfliegers zur Mausposition (wie im Redesign)
  const heroMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = heroRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--px', (((e.clientX - r.left) / r.width) - 0.5).toFixed(3))
    el.style.setProperty('--py', (((e.clientY - r.top) / r.height) - 0.5).toFixed(3))
  }

  return (
    <div className="flex flex-col">
      {/* Video-Hero (Higgsfield) — CTA scrollt zum Inhalt darunter */}
      <Hero />

      {/* Hero – editorial, mehrschichtig, viel Luft */}
      <section id="start" ref={heroRef} onMouseMove={heroMove} className="relative overflow-hidden px-7 pt-24 pb-20">
        <div className="relative h-[480px] flex items-center justify-center">
          {/* dünne Orbit-Linien */}
          <div aria-hidden="true" className="absolute top-1/2 left-1/2 size-[720px] -mt-[360px] -ml-[360px] border border-pine/10 rounded-full pointer-events-none" />
          <div aria-hidden="true" className="absolute top-1/2 left-1/2 size-[480px] -mt-[240px] -ml-[240px] border border-pine/14 rounded-full pointer-events-none" />

          {/* Flugbahn – zeichnet sich beim Laden selbst */}
          <svg viewBox="0 0 1100 420" aria-hidden="true" className="absolute top-1/2 left-1/2 w-[1100px] h-[420px] -mt-[210px] -ml-[550px] pointer-events-none overflow-visible">
            <path
              d="M -40 360 C 220 420, 380 180, 560 190 S 900 120, 1060 60"
              fill="none" stroke="color-mix(in srgb, var(--t-akzent) 45%, transparent)" strokeWidth="2" strokeDasharray="7 9"
              style={{ animation: 'drawPath 2.6s cubic-bezier(.4,0,.2,1) both' }}
            />
          </svg>

          {/* das große Wort – Buchstabe für Buchstabe */}
          <div className="relative text-center pointer-events-none">
            <h1 className="m-0 whitespace-nowrap font-serif font-normal leading-none text-pine tracking-[-.01em] text-[clamp(72px,12.5vw,190px)]">
              {'startklar'.split('').map((c, i) => (
                <span
                  key={i}
                  className="inline-block"
                  style={{ animation: `rise .9s var(--ease-expo) ${0.2 + i * 0.05}s both` }}
                >
                  {c}
                </span>
              ))}
            </h1>
          </div>

          {/* Papierflieger: fliegt ein, gleitet dann */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -mt-[186px] ml-14 sm:ml-[220px] pointer-events-none transition-transform duration-300"
            style={{ transform: 'translate(calc(var(--px, 0) * 20px), calc(var(--py, 0) * 16px))', transitionTimingFunction: 'cubic-bezier(.2,.7,.2,1)' }}
          >
            <div style={{ animation: 'flyIn 2.4s cubic-bezier(.3,.6,.2,1) both' }}>
              <div style={{ animation: 'glide 5s ease-in-out 2.4s infinite' }}>
                <KlaroPlane />
              </div>
            </div>
          </div>
        </div>

        {/* Copy-Zeile */}
        <div className="relative mt-14 mx-auto max-w-[1100px] w-full flex flex-wrap items-end justify-between gap-8" style={{ animation: 'rise 1s cubic-bezier(.2,.7,.2,1) .25s both' }}>
          <div>
            <p className="m-0 text-xs font-semibold tracking-[.24em] uppercase text-olive">Behörden · Geld · Wohnung</p>
            <p className="mt-3 max-w-[440px] text-[17px] leading-relaxed text-pine/75">
              Erwachsen werden — aber machbar. To-dos, von denen dir niemand erzählt hat, ein Schritt nach dem anderen.
            </p>
          </div>
          <div className="flex flex-wrap gap-3.5">
            <Link to="/onboarding" onMouseMove={magnetMove} onMouseLeave={magnetLeave} className="magnet rounded-pill bg-olive text-on-akzent px-7.5 py-4 text-[15px] font-semibold transition-colors hover:bg-olive-deep active:scale-98">
              In 2 Minuten loslegen
            </Link>
            <Link to="/so-gehts" onMouseMove={magnetMove} onMouseLeave={magnetLeave} className="magnet rounded-pill border-[1.5px] border-pine/30 text-pine px-7.5 py-4 text-[15px] font-semibold transition-colors hover:border-pine active:scale-98">
              So funktioniert's
            </Link>
          </div>
        </div>

        {/* Angst-Moment-Einstieg – auch ohne Spiel-Modus erreichbar (r7 Kap. 4b.2:
            der Brief-Pfad ist der Kern, nicht das Nebenfeature). Ruhiger Ton. */}
        <Link
          to="/post"
          className="relative mt-8 mx-auto max-w-[1100px] w-full flex items-center gap-4 rounded-[20px] border-[1.5px] border-pine/20 bg-cream-card/70 px-6 py-5 hover:border-olive transition"
          style={{ animation: 'rise 1s cubic-bezier(.2,.7,.2,1) .3s both' }}
        >
          <span className="grid place-items-center size-12 flex-none rounded-full bg-olive/12 text-2xl">✉️</span>
          <span className="flex-1">
            <span className="block text-[16.5px] font-semibold text-pine">Post bekommen und nicht verstanden?</span>
            <span className="block text-[14px] text-pine/65">Wir schauen gemeinsam drauf – ruhig, kein Notfall, ein Schritt nach dem anderen.</span>
          </span>
          <span className="flex-none text-olive font-semibold text-lg">→</span>
        </Link>
      </section>

      {/* Zahlen – luftige Reihe auf Creme, zählen beim Scrollen hoch */}
      <section className="mx-auto max-w-[1100px] w-full px-7 pb-4">
        <div ref={statsView.ref} className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-11 border-t border-pine/12 pt-12">
          {[
            { wert: <>{statBereiche}</>, label: 'Bereiche fürs echte Leben' },
            { wert: <>{statSchritte}</>, label: 'Schritt-für-Schritt-Anleitungen' },
            { wert: <>2<span className="text-[26px]"> Min</span></>, label: 'bis dein Plan persönlich ist' },
            { wert: <>100<span className="text-[26px]"> %</span></>, label: 'lokal — Daten bleiben bei dir' },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 90}>
              <p className="m-0 font-serif text-[clamp(44px,6vw,64px)] leading-none text-pine">{stat.wert}</p>
              <p className="mt-2.5 m-0 text-sm text-pine/60">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Bereiche – dunkles Band, das Herzstück, großzügig gesetzt */}
      <section id="bereiche" className="bg-band rounded-[56px] mx-3.5 mt-16 text-paper scroll-mt-16">
        <div className="mx-auto max-w-[1200px] px-7 py-20">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-5">
              <h2 className="m-0 font-serif font-normal text-[clamp(34px,4.5vw,52px)]">
                Deine <em className="text-olive-soft">Bereiche</em>
              </h2>
              <p className="m-0 text-[15px] text-paper/60 max-w-[340px]">
                Beantworte 7 Fragen und wir blenden alles aus, was für dich gerade nicht zählt.
              </p>
            </div>
          </Reveal>
          <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
            {sichtbar.map(({ journey, tasks }, i) => (
              <Reveal key={journey.id} delay={i * 80} className="h-full">
                <Link
                  to={`/journey/${journey.id}`}
                  className="group h-full text-left bg-cream text-pine border border-paper/10 rounded-[22px] p-8 flex flex-col gap-2.5 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(0,0,0,.28)]"
                >
                  <span className="text-[13px] font-semibold tracking-[.14em] text-olive">0{i + 1}</span>
                  <span className="font-serif text-[28px] font-medium leading-[1.15] transition-colors duration-300 group-hover:text-olive-deep">{journey.title}</span>
                  <span className="text-[14.5px] leading-relaxed text-pine/70">{journey.subtitle}</span>
                  <span className="mt-auto pt-3 flex items-center justify-between gap-2.5">
                    <span className="text-[13px] font-semibold text-olive border border-olive/40 rounded-pill px-3 py-1.25">
                      {tasks.length} {tasks.length === 1 ? 'Schritt' : 'Schritte'} für dich
                    </span>
                    <span className="text-xl transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true">→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          {!loading && profile && sichtbar.length === 0 && (
            <p className="mt-8 border border-paper/20 rounded-[22px] p-7 text-paper/85">
              Gerade steht bei dir nichts an – stark! Ändert sich was, pass einfach dein Profil an.
            </p>
          )}
        </div>
      </section>

      {/* Ruhiger Abschluss – führt zur Erklärseite bzw. zum Fortschritt */}
      <section className="mx-auto max-w-[760px] w-full px-7 py-28 text-center">
        <Reveal>
          {!loading && !profile ? (
            <>
              <p className="m-0 text-xs font-semibold tracking-[.24em] uppercase text-olive">Neugierig?</p>
              <h2 className="mt-4 m-0 font-serif font-normal text-pine text-[clamp(30px,4.5vw,46px)] leading-[1.1]">
                Ein Schritt nach dem <em className="text-olive">anderen.</em>
              </h2>
              <p className="mt-4 mx-auto m-0 max-w-[440px] text-[16px] leading-relaxed text-pine/70">
                Schau dir in Ruhe an, wie Startklar funktioniert — oder leg direkt los. 7 Fragen, unter 2 Minuten, kein Konto.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3.5">
                <Link to="/onboarding" onMouseMove={magnetMove} onMouseLeave={magnetLeave} className="magnet rounded-pill bg-olive text-on-akzent px-8 py-4 text-base font-semibold transition-colors hover:bg-olive-deep active:scale-98">
                  In 2 Minuten loslegen
                </Link>
                <Link to="/so-gehts" className="rounded-pill border-[1.5px] border-pine/30 text-pine px-8 py-4 text-base font-semibold transition hover:border-pine">
                  So funktioniert's →
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="m-0 text-xs font-semibold tracking-[.24em] uppercase text-olive">Willkommen zurück</p>
              <h2 className="mt-4 m-0 font-serif font-normal text-pine text-[clamp(30px,4.5vw,46px)] leading-[1.1]">
                Dein Plan wartet <em className="text-olive">auf dich.</em>
              </h2>
              <p className="mt-4 mx-auto m-0 max-w-[440px] text-[16px] leading-relaxed text-pine/70">
                Die Bereiche oben sind auf dich zugeschnitten. Ändert sich deine Situation, passt du einfach dein Profil an.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3.5">
                <Link to="/fortschritt" onMouseMove={magnetMove} onMouseLeave={magnetLeave} className="magnet rounded-pill bg-olive text-on-akzent px-8 py-4 text-base font-semibold transition-colors hover:bg-olive-deep active:scale-98">
                  Zum Fortschritt →
                </Link>
                <Link to="/profil" className="rounded-pill border-[1.5px] border-pine/30 text-pine px-8 py-4 text-base font-semibold transition hover:border-pine">
                  Profil anpassen
                </Link>
              </div>
            </>
          )}
        </Reveal>
      </section>
    </div>
  )
}
