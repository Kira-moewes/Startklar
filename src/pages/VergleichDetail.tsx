import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { kategorie } from '../data/vergleich'
import { useVergleich } from '../hooks/useVergleich'

export default function VergleichDetail() {
  const { kategorieId = '' } = useParams()
  const kat = kategorie(kategorieId)
  const { angebote, add, setWert, setAnbieter, toggleFavorit, remove, loading } = useVergleich(kategorieId)
  const [neuerName, setNeuerName] = useState('')

  if (!kat) {
    return (
      <p className="p-6">
        Diesen Vergleich gibt es nicht. <Link to="/vergleich" className="underline">Zur Übersicht</Link>
      </p>
    )
  }

  const hinzufuegen = (e: React.FormEvent) => {
    e.preventDefault()
    const name = neuerName.trim()
    if (!name) return
    add(name)
    setNeuerName('')
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 flex flex-col gap-8">
      <div>
        <Link to="/vergleich" className="text-sm text-pine underline underline-offset-2">← Alle Vergleiche</Link>
        <h1 className="mt-3 font-serif text-5xl font-normal text-pine">{kat.titel}</h1>
        <p className="mt-2 text-lg text-ink/80">{kat.intro}</p>
      </div>

      <section aria-label="Worauf achten" className="rounded-card border-2 border-pine-mist bg-cream p-6">
        <h2 className="font-display text-lg font-semibold text-pine">Worauf du achten solltest</h2>
        <ul className="mt-3 space-y-2 text-ink/80">
          {kat.tipps.map((tipp, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-coral font-bold shrink-0">→</span>
              <span>{tipp}</span>
            </li>
          ))}
        </ul>
      </section>

      <form onSubmit={hinzufuegen} className="flex gap-3">
        <input
          value={neuerName}
          onChange={e => setNeuerName(e.target.value)}
          placeholder="Name des Anbieters oder Tarifs"
          aria-label="Neues Angebot hinzufügen"
          className="flex-1 rounded-field border border-pine-mist bg-cream-card px-4 py-3 focus:outline-2 focus:outline-coral"
        />
        <button type="submit" className="rounded-pill bg-coral px-6 py-3 font-display font-semibold text-white hover:bg-coral-deep transition shrink-0">
          + Angebot
        </button>
      </form>

      {!loading && angebote.length === 0 && (
        <div className="rounded-card bg-cream-card border border-pine-mist p-8 text-ink/80">
          <p>
            Noch keine Angebote. Trag oben den ersten Anbieter ein – ab zwei Angeboten
            wird der Vergleich spannend.
          </p>
        </div>
      )}

      {angebote.length > 0 && (
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[560px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="text-left align-bottom p-3 text-sm font-medium text-ink/60 w-40">Kriterium</th>
                {angebote.map(a => (
                  <th key={a.id} className={`align-bottom p-3 rounded-t-card ${a.favorit ? 'bg-pine text-cream' : 'bg-cream-card'}`}>
                    <input
                      value={a.anbieter}
                      onChange={e => setAnbieter(a.id, e.target.value)}
                      aria-label="Anbietername"
                      className={`w-full min-w-28 rounded-field border px-2 py-1.5 font-display font-semibold text-center ${
                        a.favorit ? 'bg-pine border-cream/30 text-cream' : 'bg-cream border-pine-mist text-pine'
                      }`}
                    />
                    <button
                      onClick={() => toggleFavorit(a.id)}
                      aria-pressed={a.favorit}
                      className={`mt-2 w-full rounded-pill px-2 py-1 text-xs font-display font-semibold transition ${
                        a.favorit ? 'bg-coral text-white' : 'bg-pine-mist text-pine hover:bg-coral hover:text-white'
                      }`}
                    >
                      {a.favorit ? '★ Mein Favorit' : '☆ Favorit'}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kat.kriterien.map((krit, ri) => (
                <tr key={krit.key}>
                  <td className={`p-3 text-sm align-top ${ri % 2 === 0 ? 'bg-pine-mist/30' : ''}`}>
                    <span className="font-medium text-pine">{krit.label}</span>
                    {krit.hinweis && <span className="block text-xs text-ink/50">{krit.hinweis}</span>}
                  </td>
                  {angebote.map(a => (
                    <td key={a.id} className={`p-2 align-top ${a.favorit ? 'bg-pine/5' : ''} ${ri % 2 === 0 ? 'bg-pine-mist/30' : ''}`}>
                      <input
                        value={a.werte[krit.key] ?? ''}
                        onChange={e => setWert(a.id, krit.key, e.target.value)}
                        placeholder={krit.typ === 'euro' ? '€' : '–'}
                        aria-label={`${krit.label} für ${a.anbieter}`}
                        className="w-full rounded-field border border-pine-mist bg-cream-card px-3 py-2 text-sm focus:outline-2 focus:outline-coral"
                      />
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td />
                {angebote.map(a => (
                  <td key={a.id} className="p-2 text-center">
                    <button
                      onClick={() => remove(a.id)}
                      className="text-xs text-ink/40 underline underline-offset-2 hover:text-coral-deep"
                    >
                      Entfernen
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <p className="text-sm text-ink/60">
        Neutraler Vergleich: keine Werbung, keine Provision. Deine Eingaben bleiben nur auf diesem Gerät.
      </p>
    </div>
  )
}
