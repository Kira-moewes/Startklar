import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { journeys } from '../data'
import { useProfile } from '../hooks/useProfile'
import { useCountUp } from '../hooks/useCountUp'
import { useInView } from '../hooks/useInView'
import { istRelevant, relevanteTasks } from '../data/visibility'
import KlaroPlane from '../components/KlaroPlane'
import MarqueeTiles from '../components/MarqueeTiles'
import Hero from '../components/Hero'
import Reveal from '../components/Reveal'
import StoryRail from '../components/StoryRail'

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

const SCHRITTE = [
  {
    nr: '01',
    titel: '7 Fragen beantworten',
    text: 'Unter 2 Minuten, ohne Konto und ohne E-Mail. Deine Antworten bleiben auf deinem Gerät.',
  },
  {
    nr: '02',
    titel: 'Deinen Plan bekommen',
    text: 'Startklar blendet alles aus, was für dich gerade nicht zählt — übrig bleibt eine klare Liste.',
  },
  {
    nr: '03',
    titel: 'Schritt für Schritt abhaken',
    text: 'Jede Anleitung in Klartext, mit Fristen, Dokumenten-Checklisten und Klaro an deiner Seite.',
  },
]

const PRINZIPIEN = [
  {
    titel: 'Neutral & werbefrei',
    text: 'Startklar nennt Anbieter als sachliche Info — ohne Provision, ohne Links, ohne Ranking.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3l7 3v5c0 4.4-2.9 8.2-7 9.5C7.9 19.2 5 15.4 5 11V6l7-3z" />
        <path d="M9.5 12l1.8 1.8L15 10" />
      </svg>
    ),
  },
  {
    titel: '100 % lokal',
    text: 'Profil, Fortschritt und Vergleiche liegen nur auf deinem Gerät — mit Export und Import als JSON.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="7" y="3" width="10" height="18" rx="2.5" />
        <path d="M11 17.5h2" />
      </svg>
    ),
  },
  {
    titel: 'Klartext statt Amtsdeutsch',
    text: 'To-dos, von denen dir niemand erzählt hat — erklärt, wie es eine gute Freundin tun würde.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12a8 8 0 01-8 8H4l1.6-3.2A8 8 0 1121 12z" />
        <path d="M9 11h6M9 14h3" />
      </svg>
    ),
  },
  {
    titel: 'Kein Konto nötig',
    text: 'Einfach loslegen. Keine Registrierung, kein Newsletter, kein Haken im Kleingedruckten.',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <circle cx="9" cy="11" r="2.2" />
        <path d="M6 16c.7-1.5 1.8-2.2 3-2.2s2.3.7 3 2.2M15 9.5h4M15 13h3" />
      </svg>
    ),
  },
]

export default function Home() {
  const { profile, loading } = useProfile()
  const heroRef = useRef<HTMLElement>(null)
  const statsView = useInView<HTMLDivElement>()
  const finaleView = useInView<HTMLElement>('0px 0px -30% 0px')

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
      {/* Kapitel-Leiste: Klaro fliegt die Story entlang (ab 1360px) */}
      <StoryRail />

      {/* Video-Hero (Higgsfield) — CTA scrollt zum Inhalt darunter */}
      <Hero />

      {/* Hero – editorial, mehrschichtig */}
      <section id="start" ref={heroRef} onMouseMove={heroMove} className="relative overflow-hidden px-7 pt-18 pb-16">
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
            <h2 className="m-0 whitespace-nowrap font-serif font-normal leading-none text-pine tracking-[-.01em] text-[clamp(72px,12.5vw,190px)]">
              {'startklar'.split('').map((c, i) => (
                <span
                  key={i}
                  className="inline-block"
                  style={{ animation: `rise .9s var(--ease-expo) ${0.2 + i * 0.05}s both` }}
                >
                  {c}
                </span>
              ))}
            </h2>
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
        <div className="relative mt-12 mx-auto max-w-[1200px] w-full flex flex-wrap items-end justify-between gap-8" style={{ animation: 'rise 1s cubic-bezier(.2,.7,.2,1) .25s both' }}>
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
            <Link to="/fortschritt" onMouseMove={magnetMove} onMouseLeave={magnetLeave} className="magnet rounded-pill border-[1.5px] border-pine/30 text-pine px-7.5 py-4 text-[15px] font-semibold transition-colors hover:border-pine active:scale-98">
              Dein Fortschritt
            </Link>
          </div>
        </div>
      </section>

      {/* Dunkles Band: Marquee + Zahlen + Bereiche */}
      <section id="bereiche" className="bg-band rounded-t-[56px] pt-18 pb-[90px] text-paper scroll-mt-16">
        <MarqueeTiles />

        {/* Zahlen – zählen hoch, sobald sie ins Bild scrollen */}
        <div ref={statsView.ref} className="mx-auto max-w-[1200px] px-7 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4.5">
          {[
            { wert: <>{statBereiche}</>, label: 'Bereiche fürs echte Leben' },
            { wert: <>{statSchritte}</>, label: 'Schritt-für-Schritt-Anleitungen' },
            { wert: <>2<span className="text-[28px]"> Min</span></>, label: 'bis dein Plan persönlich ist' },
            { wert: <>100<span className="text-[28px]"> %</span></>, label: 'lokal — Daten bleiben bei dir' },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 90}>
              <div className="h-full border border-paper/16 rounded-[20px] p-6.5 transition-colors duration-300 hover:border-paper/35">
                <p className="m-0 font-serif text-[56px] leading-none">{stat.wert}</p>
                <p className="mt-2.5 text-sm text-paper/65">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bereiche */}
        <div className="mx-auto max-w-[1200px] mt-18 px-7">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-5">
              <h2 className="m-0 font-serif font-normal text-[clamp(32px,4vw,48px)]">
                <span className="block text-xs font-sans font-semibold tracking-[.24em] uppercase text-olive-soft mb-3">Kapitel 01</span>
                Deine <em className="text-olive-soft">Bereiche</em>
              </h2>
              <p className="m-0 text-[15px] text-paper/60 max-w-[340px]">
                Beantworte 7 Fragen und wir blenden alles aus, was für dich gerade nicht zählt.
              </p>
            </div>
          </Reveal>
          <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4.5">
            {sichtbar.map(({ journey, tasks }, i) => (
              <Reveal key={journey.id} delay={i * 80} className="h-full">
                <Link
                  to={`/journey/${journey.id}`}
                  className="group h-full text-left bg-cream text-pine border border-paper/10 rounded-[22px] p-7 flex flex-col gap-2.5 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(0,0,0,.28)]"
                >
                  <span className="text-[13px] font-semibold tracking-[.14em] text-olive">0{i + 1}</span>
                  <span className="font-serif text-[28px] font-medium leading-[1.15] transition-colors duration-300 group-hover:text-olive-deep">{journey.title}</span>
                  <span className="text-[14.5px] leading-relaxed text-pine/70">{journey.subtitle}</span>
                  <span className="mt-auto pt-2 flex items-center justify-between gap-2.5">
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

      {/* So funktioniert's */}
      <section id="ablauf" className="mx-auto max-w-[1200px] w-full px-7 pt-20 pb-6 scroll-mt-16">
        <Reveal>
          <p className="m-0 text-xs font-semibold tracking-[.24em] uppercase text-olive">Kapitel 02 · So funktioniert's</p>
          <h2 className="mt-3 m-0 font-serif font-normal text-pine text-[clamp(32px,4.5vw,52px)] leading-[1.08] max-w-[16ch]">
            Von <em className="text-olive">„keine Ahnung"</em> zu erledigt — in drei Schritten.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4.5 md:grid-cols-3">
          {SCHRITTE.map((s, i) => (
            <Reveal key={s.nr} delay={i * 110} className="h-full">
              <div className="relative h-full bg-cream-card border border-pine/10 rounded-[22px] p-8 overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(40,54,24,.12)]">
                <span aria-hidden="true" className="absolute -top-5 right-4 font-serif italic text-[104px] leading-none text-pine/8 select-none">{s.nr}</span>
                <p className="m-0 text-[13px] font-semibold tracking-[.14em] text-olive">{s.nr}</p>
                <h3 className="mt-3 m-0 font-serif text-[26px] font-medium text-pine leading-[1.15]">{s.titel}</h3>
                <p className="mt-3 m-0 text-[15px] leading-relaxed text-pine/70">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Feature: Vergleich & Bedarfscheck */}
      <section id="werkzeuge" className="mx-auto max-w-[1200px] w-full px-7 py-16 grid gap-12 md:grid-cols-2 md:items-center scroll-mt-16">
        <Reveal>
          <p className="m-0 text-xs font-semibold tracking-[.24em] uppercase text-olive">Kapitel 03 · Vergleich & Bedarfscheck</p>
          <h2 className="mt-3 m-0 font-serif font-normal text-pine text-[clamp(28px,3.6vw,42px)] leading-[1.1]">
            Erst dein Bedarf, <em className="text-olive">dann</em> der Vergleich.
          </h2>
          <p className="mt-4 m-0 text-[16px] leading-relaxed text-pine/75 max-w-[480px]">
            Drei bis vier kurze Fragen zeigen, ob und wie viel du wirklich brauchst. Danach prüft eine Ampel
            deine Angebote gegen deinen Bedarf — mit Richtwerten bekannter Anbieter, ohne Provision und ohne Marktranking.
          </p>
          <Link to="/vergleich" className="mt-7 inline-flex items-center gap-2 rounded-pill border-[1.5px] border-pine/30 text-pine px-6 py-3 text-[15px] font-semibold transition hover:border-pine hover:-translate-y-0.5">
            Zum Vergleich <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
        <Reveal delay={140}>
          {/* dekorative Mini-Vergleichstabelle */}
          <div aria-hidden="true" className="bg-cream-card border border-pine/10 rounded-[26px] p-7 shadow-[0_24px_60px_rgba(40,54,24,.10)]">
            <div className="flex items-center justify-between">
              <p className="m-0 font-serif text-[20px] text-pine">Haftpflicht</p>
              <span className="text-[12px] font-semibold text-olive border border-olive/40 rounded-pill px-3 py-1">Dein Bedarf</span>
            </div>
            <div className="mt-5 flex flex-col gap-3.5">
              {[
                { label: 'Deckungssumme', breite: 'w-3/4', farbe: 'bg-olive' },
                { label: 'Selbstbeteiligung', breite: 'w-1/2', farbe: 'bg-olive-soft' },
                { label: 'Monatsbeitrag', breite: 'w-2/3', farbe: 'bg-olive' },
              ].map(r => (
                <div key={r.label} className="flex items-center gap-4">
                  <span className="w-[140px] flex-none text-[13px] text-pine/65">{r.label}</span>
                  <span className="h-2.5 rounded-pill bg-pine/10 flex-1 overflow-hidden">
                    <span className={`block h-full rounded-pill ${r.farbe} ${r.breite}`} />
                  </span>
                  <span className={`size-3 flex-none rounded-full ${r.farbe}`} />
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[14px] bg-olive/12 border border-olive/25 px-4 py-3 text-[13.5px] font-semibold text-olive-deep">
              ✓ Passt am besten zu deinem Bedarf — unter deinen Eingaben
            </div>
          </div>
        </Reveal>
      </section>

      {/* Feature: Klaro */}
      <section id="begleiter" className="mx-auto max-w-[1200px] w-full px-7 py-4 pb-16 grid gap-12 md:grid-cols-2 md:items-center scroll-mt-16">
        <Reveal delay={140} className="order-last md:order-first">
          {/* dekorativer Chat-Ausschnitt */}
          <div aria-hidden="true" className="bg-band text-paper rounded-[26px] p-7 shadow-[0_24px_60px_rgba(40,54,24,.18)]">
            <div className="flex items-center gap-3">
              <span className="size-10 rounded-full bg-olive-soft flex items-center justify-center font-serif text-lg text-band">K</span>
              <div>
                <p className="m-0 text-[15px] font-semibold">Klaro</p>
                <p className="m-0 text-[12.5px] text-paper/55">antwortet lokal auf deinem Gerät</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <p className="m-0 self-end max-w-[80%] rounded-[16px] rounded-br-[4px] bg-paper/12 px-4 py-2.5 text-[14px]">
                Was brauche ich für die Anmeldung beim Bürgeramt?
              </p>
              <div className="self-start max-w-[85%] rounded-[16px] rounded-bl-[4px] bg-tile px-4 py-3 text-[14px] leading-relaxed">
                Du brauchst deinen Ausweis und die Wohnungsgeberbestätigung. Ich hab dir den passenden Schritt verlinkt:
                <span className="mt-2.5 flex">
                  <span className="rounded-pill bg-olive text-on-akzent px-3.5 py-1.5 text-[12.5px] font-semibold">Bürgeramt-Anmeldung öffnen →</span>
                </span>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal>
          <p className="m-0 text-xs font-semibold tracking-[.24em] uppercase text-olive">Kapitel 04 · Klaro, dein Assistent</p>
          <h2 className="mt-3 m-0 font-serif font-normal text-pine text-[clamp(28px,3.6vw,42px)] leading-[1.1]">
            Fragen kostet nichts. <em className="text-olive">Wirklich.</em>
          </h2>
          <p className="mt-4 m-0 text-[16px] leading-relaxed text-pine/75 max-w-[480px]">
            Klaro kennt jeden Schritt, deinen Fortschritt und deine Termine — und antwortet standardmäßig komplett
            lokal, ohne dass etwas dein Gerät verlässt. Er verlinkt immer die passende Stelle in der App und
            bereitet auf Wunsch Termine vor.
          </p>
        </Reveal>
      </section>

      {/* Prinzipien */}
      <section id="haltung" className="bg-band rounded-[56px] mx-3.5 text-paper scroll-mt-16">
        <div className="mx-auto max-w-[1200px] px-7 py-18">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-5">
              <h2 className="m-0 font-serif font-normal text-[clamp(30px,4vw,46px)]">
                <span className="block text-xs font-sans font-semibold tracking-[.24em] uppercase text-olive-soft mb-3">Kapitel 05 · Unsere Haltung</span>
                Was Startklar <em className="text-olive-soft">anders</em> macht
              </h2>
              <p className="m-0 text-[15px] text-paper/60 max-w-[340px]">
                Keine Rechtsberatung, kein Verkauf — nur ein ruhiger Überblick über das, was ansteht.
              </p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
            {PRINZIPIEN.map((p, i) => (
              <Reveal key={p.titel} delay={i * 90} className="h-full">
                <div className="h-full border border-paper/16 rounded-[22px] p-7 transition-colors duration-300 hover:border-paper/40">
                  <span className="text-olive-soft">{p.icon}</span>
                  <h3 className="mt-4 m-0 font-serif text-[22px] font-medium leading-[1.2]">{p.titel}</h3>
                  <p className="mt-2.5 m-0 text-[14px] leading-relaxed text-paper/65">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Großes Text-Laufband */}
      <div aria-hidden="true" className="overflow-hidden py-14 select-none">
        <div className="mq-track flex w-max" style={{ animation: 'mq 42s linear infinite' }}>
          {[0, 1].map(k => (
            <span key={k} className="whitespace-nowrap font-serif italic leading-none text-pine/10 text-[clamp(60px,9vw,128px)]">
              Behörden · Geld · Wohnung · Mobilität · Versicherung · Fristen ·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Schluss-CTA – Klaro fliegt mit Looping ein */}
      <section id="finale" ref={finaleView.ref} className="mx-auto max-w-[1200px] w-full px-7 pb-20 scroll-mt-16">
        <div aria-hidden="true" className="relative mx-auto hidden md:block w-[900px] max-w-full h-[240px] -mb-6">
          <svg viewBox="0 0 900 240" width="900" height="240" className={`finale-pfad absolute inset-0 ${finaleView.inView ? 'flieg' : ''}`}>
            <path
              d="M -60 200 C 100 130, 300 70, 440 130 C 480 148, 500 160, 520 160 C 575 160, 575 60, 520 60 C 465 60, 465 160, 520 160 C 560 160, 700 170, 880 120"
              fill="none"
              stroke="color-mix(in srgb, var(--t-akzent) 40%, transparent)"
              strokeWidth="2"
              strokeDasharray="7 9"
            />
          </svg>
          <div className={`finale-flug absolute top-0 left-0 ${finaleView.inView ? 'flieg' : ''}`}>
            <KlaroPlane width={64} height={51} shadow={false} />
          </div>
        </div>
        <Reveal>
          {!loading && !profile && (
            <div className="bg-olive text-cream rounded-[30px] px-9 py-14 md:px-14 flex flex-wrap items-center justify-between gap-8">
              <div className="max-w-[560px]">
                <h2 className="m-0 font-serif font-normal text-[clamp(30px,4vw,44px)] leading-[1.1]">Bereit, wenn du es bist.</h2>
                <p className="mt-3 m-0 text-base text-cream/85 leading-[1.55]">
                  7 Fragen, unter 2 Minuten — danach siehst du nur, was für dich zählt. Kein Konto, keine E-Mail.
                </p>
              </div>
              <Link to="/onboarding" onMouseMove={magnetMove} onMouseLeave={magnetLeave} className="magnet flex-none rounded-pill bg-cream text-pine px-8 py-4 text-base font-semibold active:scale-98">
                Los geht's →
              </Link>
            </div>
          )}
          {!loading && profile && (
            <div className="bg-olive text-cream rounded-[30px] px-9 py-12 md:px-14 flex flex-wrap items-center justify-between gap-7">
              <div className="max-w-[560px]">
                <h2 className="m-0 font-serif font-normal text-[clamp(28px,3.6vw,40px)] leading-[1.1]">Dein Plan wartet auf dich.</h2>
                <p className="mt-3 m-0 text-base text-cream/85 leading-[1.55]">
                  Die Bereiche oben sind auf dich zugeschnitten. Ändert sich deine Situation, passt du einfach dein Profil an.
                </p>
              </div>
              <div className="flex flex-wrap gap-3.5">
                <Link to="/fortschritt" className="rounded-pill bg-cream text-pine px-7 py-3.5 text-[15px] font-semibold transition hover:scale-104 active:scale-100">
                  Zum Fortschritt →
                </Link>
                <Link to="/profil" className="rounded-pill border-[1.5px] border-cream/50 text-cream px-7 py-3.5 text-[15px] font-semibold transition hover:border-cream">
                  Profil anpassen
                </Link>
              </div>
            </div>
          )}
        </Reveal>
      </section>
    </div>
  )
}
