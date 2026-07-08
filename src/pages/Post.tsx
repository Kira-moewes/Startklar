import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { briefarten, findeBriefarten, type Briefart, type Dringlichkeit } from '../data/briefe'

const DRINGLICHKEIT: Record<Dringlichkeit, { label: string; farbe: string }> = {
  niedrig: { label: 'Kein Zeitdruck', farbe: '#5F8A5A' },
  mittel: { label: 'Bald kümmern', farbe: '#B7833B' },
  hoch: { label: 'Zeitnah', farbe: '#C4623F' },
}

export default function Post() {
  const navigate = useNavigate()
  const [suche, setSuche] = useState('')
  const [gewaehlt, setGewaehlt] = useState<Briefart | null>(null)
  const treffer = findeBriefarten(suche)

  // Ruhiges „Morgenhimmel"-Register: stiller, blasser Verlauf, keine
  // Spiel-Elemente – erst wenn der erste Schritt gewählt ist, geht es weiter.
  const himmel = 'linear-gradient(180deg, #EAF1F3 0%, #F3EFE6 60%, #F7F3E8 100%)'

  return (
    <div className="min-h-dvh" style={{ background: himmel }}>
      <div className="mx-auto max-w-[640px] px-6 pt-14 pb-24">
        {!gewaehlt ? (
          <>
            <p className="m-0 text-[13px] font-semibold uppercase tracking-[0.16em] text-pine/55">
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
              className="mt-6 w-full rounded-field border border-pine/20 bg-white/70 px-4 py-3 text-[15px] text-pine outline-none focus:border-olive"
            />

            <ul className="mt-4 m-0 p-0 list-none flex flex-col gap-3">
              {treffer.map(b => (
                <li key={b.id}>
                  <button
                    onClick={() => setGewaehlt(b)}
                    className="w-full text-left rounded-[18px] border border-pine/15 bg-white/75 px-5 py-4 hover:border-olive transition"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-pine leading-tight">{b.titel}</span>
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
              onClick={() => setGewaehlt(null)}
              className="text-sm font-semibold text-olive"
            >
              ← Anderer Brief
            </button>
            <h1 className="mt-4 mb-0 font-serif font-normal text-[clamp(26px,4.4vw,38px)] leading-[1.14] text-pine">
              {gewaehlt.titel}
            </h1>

            <div className="mt-6 rounded-[20px] border border-pine/15 bg-white/80 p-6">
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
      </div>
    </div>
  )
}
