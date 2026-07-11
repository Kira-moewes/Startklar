import { Link } from 'react-router-dom'
import { useInView } from '../hooks/useInView'
import KlaroPlane from '../components/KlaroPlane'
import MarqueeTiles from '../components/MarqueeTiles'
import Reveal from '../components/Reveal'
import StoryRail from '../components/StoryRail'
import PageHead from '../components/PageHead'

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

export default function SoGehts() {
  const finaleView = useInView<HTMLElement>('0px 0px -30% 0px')

  return (
    <div className="flex flex-col">
      {/* Kapitel-Leiste: Klaro fliegt die Story entlang (ab 1360px) */}
      <StoryRail />

      {/* Intro */}
      <section id="ablauf" className="mx-auto max-w-[1200px] w-full px-7 pt-16 pb-6 scroll-mt-16">
        <PageHead
          eyebrow="Prolog · So funktioniert's"
          title={<>Von <em className="text-olive">„keine Ahnung"</em> zu erledigt.</>}
          intro="In drei Schritten von der ersten Frage bis zum abgehakten To-do — verständlich, neutral und komplett auf deinem Gerät."
        />
        <div className="mt-6 grid gap-5 md:grid-cols-3">
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

      {/* Ruhiges Kachel-Band als Trenner */}
      <MarqueeTiles />

      {/* Feature: Vergleich & Bedarfscheck */}
      <section id="werkzeuge" className="mx-auto max-w-[1200px] w-full px-7 py-20 grid gap-14 md:grid-cols-2 md:items-center scroll-mt-16">
        <Reveal>
          <p className="m-0 text-xs font-semibold tracking-[.24em] uppercase text-olive">Kapitel 01 · Vergleich & Bedarfscheck</p>
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
      <section id="begleiter" className="mx-auto max-w-[1200px] w-full px-7 py-20 grid gap-14 md:grid-cols-2 md:items-center scroll-mt-16">
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
          <p className="m-0 text-xs font-semibold tracking-[.24em] uppercase text-olive">Kapitel 02 · Klaro, dein Assistent</p>
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
        <div className="mx-auto max-w-[1200px] px-7 py-20">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-5">
              <h2 className="m-0 font-serif font-normal text-[clamp(30px,4vw,46px)]">
                <span className="block text-xs font-sans font-semibold tracking-[.24em] uppercase text-olive-soft mb-3">Kapitel 03 · Unsere Haltung</span>
                Was Startklar <em className="text-olive-soft">anders</em> macht
              </h2>
              <p className="m-0 text-[15px] text-paper/60 max-w-[340px]">
                Keine Rechtsberatung, kein Verkauf — nur ein ruhiger Überblick über das, was ansteht.
              </p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Schluss-CTA – Klaro fliegt mit Looping ein */}
      <section id="finale" ref={finaleView.ref} className="mx-auto max-w-[1200px] w-full px-7 pt-24 pb-24 scroll-mt-16">
        <div aria-hidden="true" className="relative mx-auto hidden min-[1000px]:block w-[900px] max-w-full h-[240px] -mb-6 overflow-hidden">
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
        </Reveal>
      </section>
    </div>
  )
}
