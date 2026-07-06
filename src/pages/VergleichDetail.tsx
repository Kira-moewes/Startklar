import { useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { kategorie } from '../data/vergleich'
import { findeAnbieter, hatKatalog, type AnbieterRichtwerte } from '../data/anbieter'
import { useVergleich } from '../hooks/useVergleich'

// 'YYYY-MM' → 'MM/JJJJ' für die Anzeige.
function standLabel(stand: string): string {
  const [j, m] = stand.split('-')
  return m ? `${m}/${j}` : stand
}

// Ist der Richtwert-Stand älter als 12 Monate?
function istVeraltet(stand: string): boolean {
  const [j, m] = stand.split('-').map(Number)
  if (!j || !m) return false
  const standDatum = new Date(j, m - 1, 1)
  const grenze = new Date()
  grenze.setMonth(grenze.getMonth() - 12)
  return standDatum < grenze
}

export default function VergleichDetail() {
  const { kategorieId = '' } = useParams()
  const kat = kategorie(kategorieId)
  const { angebote, add, addMitRichtwerten, setWert, setAnbieter, toggleFavorit, remove, loading } = useVergleich(kategorieId)

  const [neuerName, setNeuerName] = useState('')
  const [offen, setOffen] = useState(false)
  const [aktiv, setAktiv] = useState(-1)
  const [unbekannt, setUnbekannt] = useState(false)
  const [zuletztBefuellt, setZuletztBefuellt] = useState<{ name: string; stand: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const vorschlaege = useMemo(
    () => (offen ? findeAnbieter(kategorieId, neuerName) : []),
    [offen, kategorieId, neuerName],
  )

  const veraltet = angebote.some(a => a.richtwertStand && istVeraltet(a.richtwertStand))

  if (!kat) {
    return (
      <p className="p-6">
        Diesen Vergleich gibt es nicht. <Link to="/vergleich" className="underline">Zur Übersicht</Link>
      </p>
    )
  }

  const uebernehmen = (eintrag: AnbieterRichtwerte) => {
    addMitRichtwerten(eintrag.name, eintrag.werte, eintrag.stand)
    setZuletztBefuellt({ name: eintrag.name, stand: eintrag.stand })
    setUnbekannt(false)
    setNeuerName('')
    setOffen(false)
    setAktiv(-1)
    inputRef.current?.focus()
  }

  const freitextHinzufuegen = () => {
    const name = neuerName.trim()
    if (!name) return
    add(name)
    setUnbekannt(hatKatalog(kategorieId) && findeAnbieter(kategorieId, name).length === 0)
    setZuletztBefuellt(null)
    setNeuerName('')
    setOffen(false)
    setAktiv(-1)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (offen && aktiv >= 0 && vorschlaege[aktiv]) {
      uebernehmen(vorschlaege[aktiv])
    } else {
      freitextHinzufuegen()
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOffen(true)
      setAktiv(a => Math.min(a + 1, vorschlaege.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setAktiv(a => Math.max(a - 1, 0))
    } else if (e.key === 'Escape') {
      setOffen(false)
      setAktiv(-1)
    }
  }

  const listboxId = 'anbieter-vorschlaege'

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

      <div>
        <form onSubmit={onSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              value={neuerName}
              onChange={e => { setNeuerName(e.target.value); setOffen(true); setAktiv(-1); setUnbekannt(false) }}
              onKeyDown={onKeyDown}
              onFocus={() => setOffen(true)}
              onBlur={() => setTimeout(() => setOffen(false), 120)}
              placeholder={hatKatalog(kategorieId) ? 'Name des Anbieters – wir schlagen dir welche vor' : 'Name des Anbieters oder Tarifs'}
              aria-label="Neues Angebot hinzufügen"
              role="combobox"
              aria-expanded={offen && vorschlaege.length > 0}
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={aktiv >= 0 ? `${listboxId}-${aktiv}` : undefined}
              className="w-full rounded-field border border-pine-mist bg-cream-card px-4 py-3 focus:outline-2 focus:outline-coral"
            />
            {offen && vorschlaege.length > 0 && (
              <ul
                id={listboxId}
                role="listbox"
                className="absolute z-10 mt-1 w-full rounded-field border border-pine-mist bg-cream-card shadow-lg overflow-hidden"
              >
                {vorschlaege.map((v, i) => (
                  <li
                    key={v.name}
                    id={`${listboxId}-${i}`}
                    role="option"
                    aria-selected={i === aktiv}
                    onMouseDown={e => { e.preventDefault(); uebernehmen(v) }}
                    onMouseEnter={() => setAktiv(i)}
                    className={`px-4 py-2.5 cursor-pointer flex items-center justify-between gap-2 ${i === aktiv ? 'bg-pine text-cream' : 'text-pine'}`}
                  >
                    <span className="font-display font-semibold">{v.name}</span>
                    <span className={`text-xs ${i === aktiv ? 'text-cream/70' : 'text-ink/50'}`}>Richtwerte übernehmen</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit" className="rounded-pill bg-coral px-6 py-3 font-display font-semibold text-white hover:bg-coral-deep transition shrink-0">
            + Angebot
          </button>
        </form>

        {zuletztBefuellt && (
          <p className="mt-2 text-sm text-pine">
            Richtwerte für <strong>{zuletztBefuellt.name}</strong> eingetragen (Stand {standLabel(zuletztBefuellt.stand)}) –
            bitte mit dem echten Angebot abgleichen.
          </p>
        )}
        {unbekannt && (
          <p className="mt-2 text-sm text-ink/70">
            Diesen Anbieter kennen wir noch nicht – trag die Werte einfach aus deinem Angebot ein.
          </p>
        )}
      </div>

      {!loading && angebote.length === 0 && (
        <div className="rounded-card bg-cream-card border border-pine-mist p-8 text-ink/80">
          <p>
            Noch keine Angebote. Trag oben den ersten Anbieter ein – ab zwei Angeboten
            wird der Vergleich spannend.
          </p>
        </div>
      )}

      {veraltet && (
        <p className="rounded-field border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-coral-deep">
          ⚠ Einige Richtwerte sind älter als ein Jahr – prüfe sie besonders kritisch beim Anbieter.
        </p>
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
                  {angebote.map(a => {
                    const istRichtwert = !!a.richtwert?.[krit.key]
                    return (
                      <td key={a.id} className={`p-2 align-top ${a.favorit ? 'bg-pine/5' : ''} ${ri % 2 === 0 ? 'bg-pine-mist/30' : ''}`}>
                        <div className="relative">
                          {istRichtwert && (
                            <span aria-hidden className="absolute left-2 top-1/2 -translate-y-1/2 text-coral-deep font-semibold pointer-events-none">≈</span>
                          )}
                          <input
                            value={a.werte[krit.key] ?? ''}
                            onChange={e => setWert(a.id, krit.key, e.target.value)}
                            placeholder={krit.typ === 'euro' ? '€' : '–'}
                            aria-label={`${krit.label} für ${a.anbieter}`}
                            aria-description={istRichtwert && a.richtwertStand ? `Richtwert, Stand ${standLabel(a.richtwertStand)} – bitte beim Anbieter bestätigen` : undefined}
                            title={istRichtwert && a.richtwertStand ? `Richtwert, Stand ${standLabel(a.richtwertStand)} – bitte beim Anbieter bestätigen` : undefined}
                            className={`w-full rounded-field border bg-cream-card py-2 text-sm focus:outline-2 focus:outline-coral ${
                              istRichtwert ? 'border-dashed border-coral/60 pl-7 pr-3' : 'border-pine-mist px-3'
                            }`}
                          />
                        </div>
                      </td>
                    )
                  })}
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
        Neutraler Vergleich: keine Werbung, keine Provision. Vorausgefüllte Werte sind
        unverbindliche Richtwerte (≈), keine Angebote – Startklar bewertet keine Anbieter.
        Deine Eingaben bleiben nur auf diesem Gerät.
      </p>
    </div>
  )
}
