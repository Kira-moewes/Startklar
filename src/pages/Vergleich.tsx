import { Link } from 'react-router-dom'
import { vergleichsKategorien } from '../data/vergleich'
import { angeboteFuerKategorie, PROVISIONSHINWEIS } from '../data/anbieter'
import { useVergleichsUebersicht } from '../hooks/useVergleich'

export default function Vergleich() {
  const anzahl = useVergleichsUebersicht(vergleichsKategorien.map(k => k.id))

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 flex flex-col gap-10">
      <div>
        <h1 className="font-serif text-4xl font-bold text-pine">Anbieter vergleichen</h1>
        <p className="mt-2 text-lg text-ink/80">
          Strom, Konto, Versicherung – konkrete Angebote für den Start, plus die Kriterien,
          auf die es ankommt. Viele Angebote kannst du direkt über Startklar abschließen.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {vergleichsKategorien.map(k => (
          <Link
            key={k.id}
            to={`/vergleich/${k.id}`}
            className="block rounded-card bg-cream-card border border-pine-mist p-6 hover:border-coral transition"
          >
            <h2 className="font-display text-xl font-semibold text-pine">{k.titel}</h2>
            <p className="mt-1 text-sm text-ink/70">{k.intro}</p>
            <p className="mt-3 text-sm font-display font-semibold text-coral-deep">
              {(() => {
                const kuratiert = angeboteFuerKategorie(k.id).length
                const eigene = anzahl[k.id] ?? 0
                if (kuratiert === 0 && eigene === 0) return 'Vergleich starten →'
                const teile = []
                if (kuratiert > 0) teile.push(`${kuratiert} Angebote von Startklar`)
                if (eigene > 0) teile.push(`${eigene} eigene`)
                return teile.join(' · ')
              })()}
            </p>
          </Link>
        ))}
      </div>

      <div className="rounded-card border-2 border-pine-mist bg-cream p-6">
        <h2 className="font-display text-lg font-semibold text-pine">So funktioniert's</h2>
        <ol className="mt-3 space-y-2 text-ink/80 list-decimal list-inside">
          <li>Schau dir die von Startklar kuratierten Angebote an – geprüft und mit Stand-Datum.</li>
          <li>Ergänze eigene Angebote und vergleiche Kriterium für Kriterium.</li>
          <li>Markiere deinen Favoriten und schließe direkt über Startklar ab – die Bestätigung landet automatisch in deinen Dokumenten.</li>
        </ol>
        <p className="mt-3 text-sm text-ink/60">
          {PROVISIONSHINWEIS} Kriterien, Tipps und Reihenfolge bleiben redaktionell
          unabhängig. Deine eigenen Eingaben bleiben auf deinem Gerät.
        </p>
      </div>
    </div>
  )
}
