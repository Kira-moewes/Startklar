import { Link } from 'react-router-dom'
import { vergleichsKategorien } from '../data/vergleich'
import { useVergleichsUebersicht } from '../hooks/useVergleich'
import { hatBedarfsCheck } from '../data/bedarf'
import { useBedarfUebersicht } from '../hooks/useBedarf'

export default function Vergleich() {
  const anzahl = useVergleichsUebersicht(vergleichsKategorien.map(k => k.id))
  const bedarf = useBedarfUebersicht(vergleichsKategorien.map(k => k.id))

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 flex flex-col gap-10">
      <div>
        <h1 className="font-serif text-5xl font-normal text-pine">Anbieter vergleichen</h1>
        <p className="mt-2 text-lg text-ink/80">
          Strom, Konto, Versicherung – du sammelst die Angebote, wir geben dir die Kriterien.
          Neutral: Startklar empfiehlt keine Anbieter und verdient an nichts mit.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {vergleichsKategorien.map(k => (
          <Link
            key={k.id}
            to={`/vergleich/${k.id}`}
            className="block rounded-card bg-cream-card border border-pine-mist p-6 hover:border-coral transition"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-serif text-2xl font-medium text-pine">{k.titel}</h2>
              {hatBedarfsCheck(k.id) && (
                <span className={`shrink-0 rounded-pill px-2.5 py-1 text-xs font-display font-semibold ${
                  bedarf[k.id] ? 'bg-olive text-cream' : 'bg-coral/15 text-coral-deep'
                }`}>
                  {bedarf[k.id] ? 'Bedarf geklärt ✓' : 'Bedarf checken'}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-ink/70">{k.intro}</p>
            <p className="mt-3 text-sm font-display font-semibold text-coral-deep">
              {anzahl[k.id] ? `${anzahl[k.id]} ${anzahl[k.id] === 1 ? 'Angebot' : 'Angebote'} eingetragen` : 'Vergleich starten →'}
            </p>
          </Link>
        ))}
      </div>

      <div className="rounded-card border-2 border-pine-mist bg-cream p-6">
        <h2 className="font-display text-lg font-semibold text-pine">So funktioniert's</h2>
        <ol className="mt-3 space-y-2 text-ink/80 list-decimal list-inside">
          <li>Hol dir 2–3 Angebote (Websites der Anbieter, Aushänge, Empfehlungen).</li>
          <li>Trag sie hier mit den wichtigsten Eckdaten ein.</li>
          <li>Vergleich sie Kriterium für Kriterium und markiere deinen Favoriten.</li>
        </ol>
        <p className="mt-3 text-sm text-ink/60">
          Alles bleibt auf deinem Gerät gespeichert – nichts wird irgendwohin geschickt.
        </p>
      </div>
    </div>
  )
}
