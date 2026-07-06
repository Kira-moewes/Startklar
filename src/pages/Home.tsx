import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { journeys } from '../data'
import { useProfile } from '../hooks/useProfile'
import { useCountUp } from '../hooks/useCountUp'
import { istRelevant, relevanteTasks } from '../data/visibility'
import PaperPlane from '../components/PaperPlane'
import MarqueeTiles from '../components/MarqueeTiles'

export default function Home() {
  const { profile, loading } = useProfile()
  const heroRef = useRef<HTMLElement>(null)

  const sichtbar = journeys
    .map(j => ({ journey: j, tasks: relevanteTasks(j, profile) }))
    .filter(({ journey, tasks }) => istRelevant(profile, journey.id) && tasks.length > 0)

  const totalTasks = sichtbar.reduce((n, s) => n + s.tasks.length, 0)
  const statBereiche = useCountUp(sichtbar.length)
  const statSchritte = useCountUp(totalTasks)

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
      {/* Hero – editorial, mehrschichtig */}
      <section ref={heroRef} onMouseMove={heroMove} className="relative overflow-hidden px-7 pt-18 pb-16">
        <div className="relative h-[480px] flex items-center justify-center">
          {/* dünne Orbit-Linien */}
          <div aria-hidden="true" className="absolute top-1/2 left-1/2 size-[720px] -mt-[360px] -ml-[360px] border border-pine/10 rounded-full pointer-events-none" />
          <div aria-hidden="true" className="absolute top-1/2 left-1/2 size-[480px] -mt-[240px] -ml-[240px] border border-pine/14 rounded-full pointer-events-none" />

          {/* Flugbahn – zeichnet sich beim Laden selbst */}
          <svg viewBox="0 0 1100 420" aria-hidden="true" className="absolute top-1/2 left-1/2 w-[1100px] h-[420px] -mt-[210px] -ml-[550px] pointer-events-none overflow-visible">
            <path
              d="M -40 360 C 220 420, 380 180, 560 190 S 900 120, 1060 60"
              fill="none" stroke="rgba(96,108,56,.45)" strokeWidth="2" strokeDasharray="7 9"
              style={{ animation: 'drawPath 2.6s cubic-bezier(.4,0,.2,1) both' }}
            />
          </svg>

          {/* das große Wort */}
          <div className="relative text-center pointer-events-none" style={{ animation: 'rise 1.1s cubic-bezier(.2,.7,.2,1) .2s both' }}>
            <h1 className="m-0 whitespace-nowrap font-serif font-normal leading-none text-pine tracking-[-.01em] text-[clamp(72px,12.5vw,190px)]">
              startklar
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
                <PaperPlane />
              </div>
            </div>
          </div>
        </div>

        {/* Copy-Zeile */}
        <div className="relative mt-12 mx-auto max-w-[1200px] w-full flex flex-wrap items-end justify-between gap-8" style={{ animation: 'rise 1s cubic-bezier(.2,.7,.2,1) .25s both' }}>
          <div>
            <p className="m-0 text-xs font-semibold tracking-[.24em] uppercase text-olive">Behörden · Geld · Wohnung</p>
            <p className="mt-3 max-w-[440px] text-[17px] leading-relaxed text-pine/75">
              Erwachsen werden — aber machbar. To-dos, von denen dir niemand erzählt hat, ein Schritt nach dem anderen.
            </p>
          </div>
          <div className="flex flex-wrap gap-3.5">
            <Link to="/onboarding" className="rounded-pill bg-pine text-cream px-7.5 py-4 text-[15px] font-semibold hover:bg-olive transition">
              In 2 Minuten loslegen
            </Link>
            <Link to="/fortschritt" className="rounded-pill border-[1.5px] border-pine/30 text-pine px-7.5 py-4 text-[15px] font-semibold hover:border-pine transition">
              Dein Fortschritt
            </Link>
          </div>
        </div>
      </section>

      {/* Dunkles Band: Marquee + Zahlen + Bereiche */}
      <section className="bg-band rounded-t-[56px] pt-18 pb-[90px] text-paper">
        <MarqueeTiles />

        {/* Zahlen */}
        <div className="mx-auto max-w-[1200px] px-7 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4.5">
          <div className="border border-paper/16 rounded-[20px] p-6.5">
            <p className="m-0 font-serif text-[56px] leading-none">{statBereiche}</p>
            <p className="mt-2.5 text-sm text-paper/65">Bereiche fürs echte Leben</p>
          </div>
          <div className="border border-paper/16 rounded-[20px] p-6.5">
            <p className="m-0 font-serif text-[56px] leading-none">{statSchritte}</p>
            <p className="mt-2.5 text-sm text-paper/65">Schritt-für-Schritt-Anleitungen</p>
          </div>
          <div className="border border-paper/16 rounded-[20px] p-6.5">
            <p className="m-0 font-serif text-[56px] leading-none">2<span className="text-[28px]"> Min</span></p>
            <p className="mt-2.5 text-sm text-paper/65">bis dein Plan persönlich ist</p>
          </div>
          <div className="border border-paper/16 rounded-[20px] p-6.5">
            <p className="m-0 font-serif text-[56px] leading-none">100<span className="text-[28px]"> %</span></p>
            <p className="mt-2.5 text-sm text-paper/65">lokal — Daten bleiben bei dir</p>
          </div>
        </div>

        {/* Bereiche */}
        <div className="mx-auto max-w-[1200px] mt-18 px-7">
          <div className="flex flex-wrap items-baseline justify-between gap-5">
            <h2 className="m-0 font-serif font-normal text-[clamp(32px,4vw,48px)]">
              Deine <em className="text-olive-soft">Bereiche</em>
            </h2>
            <p className="m-0 text-[15px] text-paper/60 max-w-[340px]">
              Beantworte 7 Fragen und wir blenden alles aus, was für dich gerade nicht zählt.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4.5">
            {sichtbar.map(({ journey, tasks }, i) => (
              <Link
                key={journey.id}
                to={`/journey/${journey.id}`}
                className="text-left bg-cream text-pine border border-paper/10 rounded-[22px] p-7 flex flex-col gap-2.5 transition duration-250 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(0,0,0,.28)]"
              >
                <span className="text-[13px] font-semibold tracking-[.14em] text-olive">0{i + 1}</span>
                <span className="font-serif text-[28px] font-medium leading-[1.15]">{journey.title}</span>
                <span className="text-[14.5px] leading-relaxed text-pine/70">{journey.subtitle}</span>
                <span className="mt-2 flex items-center justify-between gap-2.5">
                  <span className="text-[13px] font-semibold text-olive border border-olive/40 rounded-pill px-3 py-1.25">
                    {tasks.length} {tasks.length === 1 ? 'Schritt' : 'Schritte'} für dich
                  </span>
                  <span className="text-xl" aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
          {!loading && profile && sichtbar.length === 0 && (
            <p className="mt-8 border border-paper/20 rounded-[22px] p-7 text-paper/85">
              Gerade steht bei dir nichts an – stark! Ändert sich was, pass einfach dein Profil an.
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="mx-auto max-w-[1200px] mt-14 px-7">
          {!loading && !profile && (
            <div className="bg-olive text-cream rounded-[26px] p-11 flex flex-wrap items-center justify-between gap-7">
              <div className="max-w-[560px]">
                <h3 className="m-0 font-serif font-normal text-[32px]">Zeig uns kurz deine Situation</h3>
                <p className="mt-2.5 text-base text-cream/85 leading-[1.55]">
                  7 Fragen, unter 2 Minuten — danach siehst du nur, was für dich zählt. Kein Konto, keine E-Mail.
                </p>
              </div>
              <Link to="/onboarding" className="flex-none rounded-pill bg-cream text-pine px-8 py-4 text-base font-semibold transition hover:scale-104">
                Los geht's →
              </Link>
            </div>
          )}
          {!loading && profile && (
            <div className="border border-paper/20 rounded-[26px] px-9 py-7 flex flex-wrap items-center justify-between gap-5">
              <p className="m-0 text-base text-paper/85">Dein Profil ist eingerichtet — die Bereiche oben sind auf dich zugeschnitten.</p>
              <Link to="/profil" className="rounded-pill border-[1.5px] border-paper/40 text-paper px-5.5 py-2.75 text-sm font-semibold hover:border-paper transition">
                Profil anpassen
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
