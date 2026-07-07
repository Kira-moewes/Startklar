import { Link } from 'react-router-dom'
import { useSpiel } from '../hooks/useSpiel'
import { useSettings } from '../hooks/useSettings'
import { useAlleBedarfsErgebnisse } from '../hooks/useBedarf'
import Flieger from '../components/spiel/Flieger'

const STUFE_LABEL: Record<string, string> = {
  wichtig: 'Wichtig für dich',
  pruefen: 'Solltest du prüfen',
  verzichtbar: 'Für dich verzichtbar',
}

export default function Sammlung() {
  const { state } = useSpiel()
  const { einstellungen } = useSettings()
  const steckbriefe = useAlleBedarfsErgebnisse()

  return (
    <div className="mx-auto max-w-[760px] px-6 pt-12 pb-24">
      <div className="flex items-center gap-4">
        <Flieger size={92} zustand="fliegen" ausruestung={einstellungen.ausruestung} />
        <div>
          <p className="m-0 text-[13px] font-semibold uppercase tracking-[0.16em] text-pine/55">Deine Sammlung</p>
          <h1 className="mt-1 mb-0 font-serif font-normal text-[clamp(28px,4.4vw,40px)] leading-[1.1] text-pine">
            Flugbuch & Beweisstücke
          </h1>
        </div>
      </div>
      <p className="mt-3 m-0 text-[15.5px] leading-[1.55] text-pine/70">
        Alles hier ist echt und bleibt dir – nichts verfällt. Es zeigt, was du
        wirklich schon kannst.
      </p>

      {/* Flugbuch – Meilensteine */}
      <section className="mt-9">
        <h2 className="m-0 font-serif font-medium text-2xl text-pine">Flugbuch</h2>
        {state.flugbuch.length === 0 ? (
          <p className="mt-3 text-[15px] text-pine/60">
            Noch leer. Erledige deine erste Aufgabe oder fülle einen Fragebogen aus –
            dann trägt sich hier dein erster Meilenstein ein.
          </p>
        ) : (
          <ol className="mt-4 m-0 p-0 list-none flex flex-col gap-2.5">
            {state.flugbuch.map((e, i) => (
              <li key={i} className="flex items-center gap-3 rounded-[16px] border border-pine/12 bg-cream-card px-4 py-3">
                <span className="text-olive text-lg">✦</span>
                <span className="flex-1 text-[15px] text-pine">{e.text}</span>
                <span className="text-[12.5px] text-pine/50">{e.datum}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Steckbriefe – Artefakte aus den Fragebögen */}
      <section className="mt-10">
        <h2 className="m-0 font-serif font-medium text-2xl text-pine">Deine Steckbriefe</h2>
        {steckbriefe.length === 0 ? (
          <p className="mt-3 text-[15px] text-pine/60">
            Noch keine. Ein ausgefüllter Bedarfs-Fragebogen (z. B. Hausrat) erzeugt hier
            einen druckbaren Steckbrief – zum Mitnehmen ins Beratungsgespräch.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {steckbriefe.map(s => (
              <article key={s.kategorieId} className="rounded-[20px] border border-pine/14 bg-cream-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="m-0 font-serif text-xl text-pine">{s.titel}</h3>
                  <span className="rounded-pill bg-olive/12 text-olive text-[12px] font-semibold px-2.5 py-1">
                    {STUFE_LABEL[s.ergebnis.stufe] ?? s.ergebnis.stufe}
                  </span>
                </div>
                <p className="mt-2 m-0 text-[14px] leading-[1.5] text-pine/75">{s.ergebnis.titel}</p>
                {s.ergebnis.bausteine && s.ergebnis.bausteine.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.ergebnis.bausteine.map((b, i) => (
                      <span key={i} className="rounded-pill border border-pine/20 px-2.5 py-1 text-[12px] text-pine/70">{b}</span>
                    ))}
                  </div>
                )}
                <Link to={`/vergleich/${s.kategorieId}/check`} className="mt-3 inline-block text-sm font-semibold text-olive hover:underline">
                  Ansehen & drucken →
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="mt-10">
        <Link to="/" className="font-semibold text-olive hover:underline">← Zurück in den Himmel</Link>
      </div>
    </div>
  )
}
