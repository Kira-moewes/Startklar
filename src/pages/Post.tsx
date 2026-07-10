import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { briefarten, findeBriefarten, krisenhilfen, type Briefart, type Dringlichkeit } from '../data/briefe'

const DRINGLICHKEIT: Record<Dringlichkeit, { label: string; farbe: string }> = {
  niedrig: { label: 'Kein Zeitdruck', farbe: '#5F8A5A' },
  mittel: { label: 'Bald kümmern', farbe: '#B7833B' },
  hoch: { label: 'Zeitnah', farbe: '#C4623F' },
}

export default function Post() {
  const navigate = useNavigate()
  const [suche, setSuche] = useState('')
  const [gewaehlt, setGewaehlt] = useState<Briefart | null>(null)
  const [zuSpaetOffen, setZuSpaetOffen] = useState(false)
  const [kopiert, setKopiert] = useState(false)
  const treffer = findeBriefarten(suche)

  // Beim Wechsel auf einen Brief die aufklappbaren Bereiche zurücksetzen –
  // jeder Brief startet ruhig und unaufdringlich.
  const waehle = (b: Briefart | null) => {
    setGewaehlt(b)
    setZuSpaetOffen(false)
    setKopiert(false)
  }

  const kopiereSkript = async (text: string) => {
    try {
      await navigator.clipboard?.writeText(text)
      setKopiert(true)
      setTimeout(() => setKopiert(false), 2200)
    } catch {
      // Zwischenablage nicht verfügbar – der Text steht ohnehin sichtbar da.
    }
  }

  // Sitzt auf dem warmen Creme-Hintergrund der App (aus Layout) – gleiche
  // Bildsprache wie alle Unterseiten, keine eigene Hintergrundfarbe mehr.
  return (
    <div className="mx-auto max-w-[640px] w-full px-7 pt-14 pb-24">
        {!gewaehlt ? (
          <>
            <p className="m-0 text-[13px] font-semibold uppercase tracking-[0.16em] text-olive">
              Ganz ruhig
            </p>
            <h1 className="mt-2 mb-0 font-serif font-normal text-[clamp(28px,4.6vw,42px)] leading-[1.12] text-pine">
              Du hast Post, die du nicht verstehst?
            </h1>
            <p className="mt-3 m-0 text-[16px] leading-[1.55] text-pine/70">
              Atme kurz durch. Wir schauen gemeinsam drauf – meistens ist es viel
              harmloser, als es aussieht. Wähle, was am ehesten passt:
            </p>

            <input
              value={suche}
              onChange={e => setSuche(e.target.value)}
              placeholder="Absender oder Stichwort (z. B. Rundfunk, Kaution)"
              className="mt-6 w-full rounded-field border border-pine/20 bg-cream-card px-4 py-3 text-[15px] text-pine outline-none focus:border-olive"
            />

            <ul className="mt-4 m-0 p-0 list-none flex flex-col gap-3">
              {treffer.map(b => (
                <li key={b.id}>
                  <button
                    onClick={() => waehle(b)}
                    className="group w-full text-left rounded-[18px] border border-pine/15 bg-cream-card px-5 py-4 transition duration-300 hover:border-olive hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(40,54,24,.08)]"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-pine leading-tight transition-colors group-hover:text-olive-deep">{b.titel}</span>
                      <span
                        className="flex-none rounded-pill px-2.5 py-1 text-[11.5px] font-semibold text-white"
                        style={{ background: DRINGLICHKEIT[b.dringlichkeit].farbe }}
                      >
                        {DRINGLICHKEIT[b.dringlichkeit].label}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
              {treffer.length === 0 && (
                <li className="rounded-[18px] border border-dashed border-pine/25 px-5 py-6 text-center text-[14.5px] text-pine/60">
                  Dazu haben wir noch keine Erklärung. Frag Klaro unten rechts – oder
                  such nach einem der {briefarten.length} bekannten Briefe.
                </li>
              )}
            </ul>
          </>
        ) : (
          <>
            <button
              onClick={() => waehle(null)}
              className="text-sm font-semibold text-olive"
            >
              ← Anderer Brief
            </button>
            <h1 className="mt-4 mb-0 font-serif font-normal text-[clamp(26px,4.4vw,38px)] leading-[1.14] text-pine">
              {gewaehlt.titel}
            </h1>

            <div className="mt-6 rounded-[20px] border border-pine/14 bg-cream-card p-6">
              <p className="m-0 text-[16.5px] leading-[1.6] text-pine/85">{gewaehlt.einordnung}</p>

              <div className="mt-5 flex items-start gap-3">
                <span className="mt-0.5 grid place-items-center size-6 rounded-full text-white text-[12px] font-bold"
                  style={{ background: DRINGLICHKEIT[gewaehlt.dringlichkeit].farbe }}>
                  ⏱
                </span>
                <p className="m-0 text-[15px] leading-[1.55] text-pine/80">
                  <strong className="text-pine">Zeit:</strong> {gewaehlt.frist}
                </p>
              </div>

              <div className="mt-4 rounded-[16px] bg-olive/10 border border-olive/25 px-5 py-4">
                <p className="m-0 text-[13px] font-semibold uppercase tracking-wide text-olive">
                  Erster Schritt – 2 Minuten
                </p>
                <p className="mt-1.5 m-0 text-[15.5px] leading-[1.55] text-pine/85">
                  {gewaehlt.ersterSchritt}
                </p>
              </div>

              {/* „Mach's allein"-Skript: die wörtliche Formulierung zum Mitnehmen –
                  senkt die Aktivierungsenergie fürs Telefonat (r7 Kap. 4b.2). */}
              <div className="mt-4 rounded-[16px] border border-pine/12 bg-cream px-5 py-4">
                <p className="m-0 text-[13px] font-semibold uppercase tracking-wide text-pine/55">
                  Niemanden zum Fragen? Sag oder schreib genau das
                </p>
                <p className="mt-2 m-0 text-[15.5px] leading-[1.6] text-pine/85 italic">
                  {gewaehlt.alleinSkript}
                </p>
                <button
                  onClick={() => kopiereSkript(gewaehlt.alleinSkript)}
                  className="mt-3 rounded-pill border border-olive/40 px-4 py-1.5 text-[13.5px] font-semibold text-olive hover:bg-olive/10 transition"
                >
                  {kopiert ? 'Kopiert ✓' : 'Text kopieren'}
                </button>
              </div>
            </div>

            {/* „Schon zu spät?"-Zweig: schamfrei, standardmäßig eingeklappt, damit
                er niemanden beunruhigt, der noch in der Frist ist (r7 Kap. 2.4). */}
            <div className="mt-4 rounded-[16px] border border-pine/14 bg-cream-card">
              <button
                onClick={() => setZuSpaetOffen(o => !o)}
                aria-expanded={zuSpaetOffen}
                className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left"
              >
                <span className="text-[15px] font-semibold text-pine">Schon zu spät? Das geht trotzdem noch</span>
                <span className="text-pine/50 text-lg leading-none">{zuSpaetOffen ? '−' : '+'}</span>
              </button>
              {zuSpaetOffen && (
                <p className="m-0 px-5 pb-4 text-[15px] leading-[1.6] text-pine/80">
                  {gewaehlt.zuSpaet}
                </p>
              )}
            </div>

            <button
              onClick={() => navigate(`/journey/${gewaehlt.quest.journeyId}/task/${gewaehlt.quest.taskId}`)}
              className="mt-6 w-full min-h-14 rounded-pill bg-olive text-on-akzent text-[16px] font-semibold transition hover:scale-[1.02]"
            >
              Alles klar – zeig mir die Schritte
            </button>
            <p className="mt-3 text-center text-[13px] text-pine/55">
              Keine Rechtsberatung. Wenn dich etwas wirklich belastet, hol dir echte
              Hilfe – du musst das nicht allein tragen.
            </p>
          </>
        )}

        {/* Krisen-Weiche: immer erreichbar, ruhig. Steckt hinter der Post echte
            Not, tritt das Produkt zurück und verweist auf echte Hilfe (r7 Kap. 2.4). */}
        <details className="mt-10 rounded-[16px] border border-pine/12 bg-cream-card [&_summary]:list-none">
          <summary className="cursor-pointer px-5 py-3.5 text-[14.5px] font-semibold text-pine/70 marker:hidden">
            Es geht dir gerade wirklich schlecht?
          </summary>
          <div className="px-5 pb-5">
            <p className="mt-0 mb-4 text-[14px] leading-[1.6] text-pine/70">
              Wenn hinter dem Brief mehr steckt – Geldsorgen, Angst, das Gefühl,
              allein nicht mehr weiterzukommen: Das hier kostet nichts, ist anonym,
              und du darfst dich einfach melden.
            </p>
            <ul className="m-0 p-0 list-none flex flex-col gap-3">
              {krisenhilfen.map(h => (
                <li key={h.titel} className="rounded-[14px] border border-pine/12 bg-cream px-4 py-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[14.5px] font-semibold text-pine">{h.titel}</span>
                    <span className="flex-none text-[14.5px] font-semibold text-olive">{h.kontakt}</span>
                  </div>
                  <p className="mt-1 m-0 text-[13px] leading-[1.5] text-pine/60">{h.hinweis}</p>
                </li>
              ))}
            </ul>
          </div>
        </details>
    </div>
  )
}
