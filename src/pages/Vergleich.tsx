import { Link } from 'react-router-dom'
import { vergleichsKategorien } from '../data/vergleich'
import { useVergleichsUebersicht } from '../hooks/useVergleich'
import { hatBedarfsCheck } from '../data/bedarf'
import { useBedarfUebersicht } from '../hooks/useBedarf'
import PageHead from '../components/PageHead'
import Reveal from '../components/Reveal'

const SCHRITTE = [
  'Hol dir 2–3 Angebote (Websites der Anbieter, Aushänge, Empfehlungen).',
  'Trag sie hier mit den wichtigsten Eckdaten ein.',
  'Vergleich sie Kriterium für Kriterium und markiere deinen Favoriten.',
]

export default function Vergleich() {
  const anzahl = useVergleichsUebersicht(vergleichsKategorien.map(k => k.id))
  const bedarf = useBedarfUebersicht(vergleichsKategorien.map(k => k.id))

  return (
    <div className="mx-auto max-w-[900px] w-full px-7 pt-14 pb-24">
      <PageHead
        eyebrow="Vergleich"
        title={<>Anbieter <em className="text-olive">vergleichen</em></>}
        intro="Strom, Konto, Versicherung – du sammelst die Angebote, wir geben dir die Kriterien. Neutral: Startklar empfiehlt keine Anbieter und verdient an nichts mit."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {vergleichsKategorien.map((k, i) => (
          <Reveal key={k.id} delay={i * 70} className="h-full">
            <Link
              to={`/vergleich/${k.id}`}
              className="group flex h-full flex-col rounded-[22px] bg-cream-card border border-pine/14 p-6 transition duration-300 hover:border-olive hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(40,54,24,.10)]"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-serif text-2xl font-medium text-pine transition-colors group-hover:text-olive-deep">{k.titel}</h2>
                {hatBedarfsCheck(k.id) && (
                  <span className={`shrink-0 rounded-pill px-2.5 py-1 text-xs font-semibold ${
                    bedarf[k.id] ? 'bg-olive text-on-akzent' : 'border border-olive/40 text-olive'
                  }`}>
                    {bedarf[k.id] ? 'Bedarf geklärt ✓' : 'Bedarf checken'}
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-pine/70">{k.intro}</p>
              <p className="mt-auto pt-4 flex items-center gap-1.5 text-sm font-semibold text-olive">
                {anzahl[k.id] ? `${anzahl[k.id]} ${anzahl[k.id] === 1 ? 'Angebot' : 'Angebote'} eingetragen` : 'Vergleich starten'}
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
              </p>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal className="block">
        <div className="mt-10 rounded-[22px] bg-band text-paper p-8">
          <h2 className="font-serif text-2xl font-medium">So funktioniert's</h2>
          <ol className="mt-5 flex flex-col gap-4">
            {SCHRITTE.map((s, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="flex-none size-7 rounded-full bg-olive-soft text-band text-[13px] font-bold flex items-center justify-center">{i + 1}</span>
                <span className="text-paper/85 leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-paper/55">
            Alles bleibt auf deinem Gerät gespeichert – nichts wird irgendwohin geschickt.
          </p>
        </div>
      </Reveal>
    </div>
  )
}
