import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { kategorie } from '../data/vergleich'
import { angeboteFuerKategorie, partnerUrl, PROVISIONSHINWEIS, type AnbieterAngebot } from '../data/anbieter'
import { useVergleich } from '../hooks/useVergleich'
import { useProfile } from '../hooks/useProfile'
import { useWallet } from '../hooks/useWallet'
import NachfrageKarte from '../components/NachfrageKarte'

export default function VergleichDetail() {
  const { kategorieId = '' } = useParams()
  const kat = kategorie(kategorieId)
  const kuratiert = angeboteFuerKategorie(kategorieId)
  const {
    angebote, kuratierterFavorit, add, setWert, setAnbieter,
    toggleFavorit, toggleKuratierterFavorit, remove, loading,
  } = useVergleich(kategorieId)
  const { profile } = useProfile()
  const { addVormerkung } = useWallet()
  const [neuerName, setNeuerName] = useState('')
  const minderjaehrig = profile?.volljaehrig === 'nein'

  const angebotsButton = (a: AnbieterAngebot) => {
    if (a.abschluss === 'partnerlink') {
      if (a.ab18 && minderjaehrig) {
        return (
          <p className="rounded-field bg-pine-mist/50 px-4 py-2.5 text-center text-sm text-ink/70">
            Ab 18 – schau dir solange die Kriterien an.
          </p>
        )
      }
      return (
        <a
          href={partnerUrl(a, kategorieId)}
          target="_blank"
          rel="sponsored noopener"
          onClick={() => addVormerkung({ angebotId: a.id, kategorieId, anbieter: a.anbieter })}
          className="rounded-pill bg-coral px-5 py-2.5 text-center font-display font-semibold text-white hover:bg-coral-deep transition"
        >
          Zum Partner-Angebot ↗
        </a>
      )
    }
    if (a.abschluss === 'app') {
      return (
        <Link
          to={`/vergleich/${kategorieId}/abschluss/${a.id}`}
          className="rounded-pill bg-coral px-5 py-2.5 text-center font-display font-semibold text-white hover:bg-coral-deep transition"
        >
          Über Startklar abschließen
        </Link>
      )
    }
    return (
      <a
        href={a.url}
        target="_blank"
        rel="noopener"
        className="rounded-pill border-2 border-pine px-5 py-2.5 text-center font-display font-semibold text-pine hover:bg-pine-mist/50 transition"
      >
        Zum Anbieter →
      </a>
    )
  }

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
        <h1 className="mt-3 font-serif text-4xl font-bold text-pine">{kat.titel}</h1>
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

      <NachfrageKarte kategorieId={kategorieId} />

      {kuratiert.length > 0 && (
        <section aria-label="Angebote für dich" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-xl font-semibold text-pine">Angebote für dich</h2>
            <details className="relative text-sm">
              <summary className="cursor-pointer text-pine underline underline-offset-2 hover:text-coral-deep list-none">
                ⓘ Wie verdient Startklar Geld?
              </summary>
              <div className="mt-2 rounded-card border border-pine-mist bg-cream-card p-4 text-ink/80 sm:absolute sm:right-0 sm:z-10 sm:w-80">
                Angebote mit „Anzeige · Partner-Link" bringen Startklar eine Provision,
                wenn du darüber abschließt – für dich kostet das nichts. Jede Kategorie
                enthält außerdem eine Empfehlung ganz ohne Provision. Kriterien und
                Tipps bleiben redaktionell unabhängig.{' '}
                <Link to="/transparenz" className="underline underline-offset-2 text-pine">Mehr auf der Transparenzseite</Link>
              </div>
            </details>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {kuratiert.map(a => (
              <div key={a.id} className="rounded-card bg-cream-card border border-pine-mist p-5 flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {a.monetarisierung === 'partner' ? (
                    <span className="rounded-pill bg-coral px-2.5 py-0.5 text-xs font-display font-semibold text-white">
                      Anzeige · Partner-Link
                    </span>
                  ) : (
                    <span className="rounded-pill bg-pine px-2.5 py-0.5 text-xs font-display font-semibold text-cream">
                      Ohne Provision empfohlen
                    </span>
                  )}
                  <span className="ml-auto text-xs text-ink/50 rounded-pill border border-pine-mist px-2 py-0.5 whitespace-nowrap">
                    Stand {a.standDaten}
                  </span>
                </div>
                <p className="font-display text-lg font-semibold text-pine">
                  <span aria-hidden="true">{a.logoEmoji}</span> {a.anbieter}
                </p>
                <p className="font-serif text-2xl font-bold text-coral leading-tight">{a.preisAb}</p>
                <ul className="text-sm text-ink/80 space-y-1">
                  {a.kurzFeatures.map((f, i) => (
                    <li key={i} className="flex gap-2"><span className="text-coral shrink-0">✓</span>{f}</li>
                  ))}
                </ul>
                {a.zielgruppe && <p className="text-xs text-ink/60">{a.zielgruppe}</p>}
                <div className="mt-auto flex flex-col gap-2">
                  {angebotsButton(a)}
                  <button
                    onClick={() => toggleKuratierterFavorit(a.id)}
                    aria-pressed={kuratierterFavorit === a.id}
                    className={`rounded-pill px-2 py-1 text-xs font-display font-semibold transition ${
                      kuratierterFavorit === a.id ? 'bg-coral text-white' : 'bg-pine-mist text-pine hover:bg-coral hover:text-white'
                    }`}
                  >
                    {kuratierterFavorit === a.id ? '★ Mein Favorit' : '☆ Favorit'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-ink/60">{PROVISIONSHINWEIS} Auswahl und Kriterien bleiben redaktionell unabhängig – Reihenfolge nie nach Provision.</p>
        </section>
      )}

      <section aria-label="Eigenes Angebot" className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-pine">Eigene Angebote ergänzen</h2>
        <form onSubmit={hinzufuegen} className="flex gap-3">
          <input
            value={neuerName}
            onChange={e => setNeuerName(e.target.value)}
            placeholder="Name des Anbieters oder Tarifs"
            aria-label="Neues Angebot hinzufügen"
            className="flex-1 min-w-0 rounded-field border border-pine-mist bg-cream-card px-4 py-3 focus:outline-2 focus:outline-coral"
          />
          <button type="submit" className="rounded-pill bg-coral px-6 py-3 font-display font-semibold text-white hover:bg-coral-deep transition shrink-0">
            + Angebot
          </button>
        </form>
      </section>

      {!loading && angebote.length === 0 && kuratiert.length === 0 && (
        <div className="rounded-card bg-cream-card border border-pine-mist p-8 text-ink/80">
          <p>
            Noch keine Angebote. Trag oben den ersten Anbieter ein – ab zwei Angeboten
            wird der Vergleich spannend.
          </p>
        </div>
      )}

      {(angebote.length > 0 || kuratiert.length > 0) && (
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[560px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="text-left align-bottom p-3 text-sm font-medium text-ink/60 w-40">Kriterium</th>
                {kuratiert.map(a => {
                  const fav = kuratierterFavorit === a.id
                  return (
                    <th key={a.id} className={`align-bottom p-3 rounded-t-card ${fav ? 'bg-pine text-cream' : 'bg-cream-card'}`}>
                      <p className={`min-w-28 px-2 py-1.5 font-display font-semibold text-center ${fav ? 'text-cream' : 'text-pine'}`}>
                        {a.logoEmoji} {a.anbieter}
                      </p>
                      <p className={`text-center text-[10px] font-display uppercase tracking-widest ${fav ? 'text-cream/70' : 'text-ink/50'}`}>
                        Startklar-Angebot
                      </p>
                      <button
                        onClick={() => toggleKuratierterFavorit(a.id)}
                        aria-pressed={fav}
                        className={`mt-2 w-full rounded-pill px-2 py-1 text-xs font-display font-semibold transition ${
                          fav ? 'bg-coral text-white' : 'bg-pine-mist text-pine hover:bg-coral hover:text-white'
                        }`}
                      >
                        {fav ? '★ Mein Favorit' : '☆ Favorit'}
                      </button>
                    </th>
                  )
                })}
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
                  {kuratiert.map(a => (
                    <td
                      key={a.id}
                      className={`p-3 align-top text-sm text-ink/90 ${kuratierterFavorit === a.id ? 'bg-pine/5' : ''} ${ri % 2 === 0 ? 'bg-pine-mist/30' : ''}`}
                    >
                      {a.werte[krit.key] ?? '–'}
                    </td>
                  ))}
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
              {angebote.length > 0 && (
                <tr>
                  <td />
                  {kuratiert.map(a => <td key={a.id} />)}
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
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-sm text-ink/60">
        {PROVISIONSHINWEIS} Deine eigenen Eingaben bleiben nur auf diesem Gerät.
      </p>
    </div>
  )
}
