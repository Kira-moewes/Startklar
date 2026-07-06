import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { journeys } from '../data'
import { kategorie, aufgabeFuerKategorie } from '../data/vergleich'
import { anbieterAngebot, ablageFuerKategorie, PROVISIONSHINWEIS } from '../data/anbieter'
import { useWallet, maskiereIban } from '../hooks/useWallet'
import { dokumentAblegen } from '../hooks/useDokumente'
import { useTaskListProgress } from '../hooks/useProgress'

const schritte = ['Angebot prüfen', 'Daten bestätigen', 'Abschließen'] as const

export default function Checkout() {
  const { kategorieId = '', angebotId = '' } = useParams()
  const kat = kategorie(kategorieId)
  const angebot = anbieterAngebot(angebotId)
  const {
    zahlungsmittel, checkoutDaten, addZahlungsmittel, addAbschluss,
    speichereCheckoutDaten, loading,
  } = useWallet()

  const [schritt, setSchritt] = useState<1 | 2 | 3 | 'fertig'>(1)
  const [name, setName] = useState('')
  const [adresse, setAdresse] = useState('')
  const [geburtsdatum, setGeburtsdatum] = useState('')
  const [zahlungsWahl, setZahlungsWahl] = useState<string>('neu')
  const [neueIban, setNeueIban] = useState('')
  const [merken, setMerken] = useState(true)
  const [agb, setAgb] = useState(false)
  const [dokumentThemaId, setDokumentThemaId] = useState<string | null>(null)

  // Vorbefüllen, sobald Wallet-Daten geladen sind.
  useEffect(() => {
    if (loading) return
    setName(prev => prev || (checkoutDaten.name ?? ''))
    setAdresse(prev => prev || (checkoutDaten.adresse ?? ''))
    setGeburtsdatum(prev => prev || (checkoutDaten.geburtsdatum ?? ''))
    setZahlungsWahl(prev => (prev === 'neu' && zahlungsmittel.length > 0 ? zahlungsmittel[0].id : prev))
  }, [loading, checkoutDaten, zahlungsmittel])

  // Aufgabe, die zu diesem Vergleichsmodul gehört (für den Erledigt-Vorschlag).
  const verknuepfteAufgabe = useMemo(() => aufgabeFuerKategorie(kategorieId, journeys), [kategorieId])
  const progressItems = useMemo(
    () => (verknuepfteAufgabe ? [{ journeyId: verknuepfteAufgabe.journeyId, taskId: verknuepfteAufgabe.taskId }] : []),
    [verknuepfteAufgabe]
  )
  const { done, toggle } = useTaskListProgress(progressItems)
  const aufgabeKey = verknuepfteAufgabe ? `${verknuepfteAufgabe.journeyId}:${verknuepfteAufgabe.taskId}` : ''

  if (!kat || !angebot || angebot.kategorieId !== kat.id) {
    return (
      <p className="p-6">
        Dieses Angebot gibt es nicht. <Link to="/vergleich" className="underline">Zum Vergleich</Link>
      </p>
    )
  }

  // Nur echte API-Partner ('app') laufen über den In-App-Checkout. Partner-
  // und Direkt-Links werden beim Anbieter abgeschlossen (§ 34d GewO Tippgeber).
  if (angebot.abschluss !== 'app') {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="rounded-card bg-cream-card border border-pine-mist p-6 text-ink/80">
          Dieses Angebot schließt du direkt beim Anbieter bzw. Partner-Portal ab.{' '}
          <Link to={`/vergleich/${kat.id}`} className="underline underline-offset-2 text-pine">
            Zurück zum Vergleich
          </Link>
        </p>
      </div>
    )
  }

  const datenOk =
    name.trim().length > 1 &&
    adresse.trim().length > 5 &&
    geburtsdatum.trim().length >= 8 &&
    (zahlungsWahl !== 'neu' || neueIban.replaceAll(/\s+/g, '').length >= 15)

  const abschliessen = async () => {
    if (!agb || !datenOk) return
    let zmId = zahlungsWahl
    if (zahlungsWahl === 'neu') {
      const neu = addZahlungsmittel({
        typ: 'sepa',
        label: `SEPA · ${maskiereIban(neueIban)}`,
        details: { inhaber: name.trim(), iban: maskiereIban(neueIban) },
      })
      zmId = neu.id
    }
    if (merken) speichereCheckoutDaten({ name: name.trim(), adresse: adresse.trim(), geburtsdatum: geburtsdatum.trim() })

    const ablage = ablageFuerKategorie[kat.id] ?? { themaId: 'finanzen', unterordner: 'Verträge' }
    const heute = new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    const inhalt = [
      'Startklar – Abschlussbestätigung',
      '',
      `Anbieter: ${angebot.anbieter}`,
      `Kategorie: ${kat.titel}`,
      `Tarif: ${angebot.preisAb}`,
      `Datum: ${heute}`,
      'Status: Eingereicht – der Anbieter meldet sich zur Bestätigung.',
      '',
      PROVISIONSHINWEIS,
    ].join('\n')
    const dokument = await dokumentAblegen({
      titel: `Abschlussbestätigung ${angebot.anbieter}`,
      themaId: ablage.themaId,
      unterordner: ablage.unterordner,
      quelle: 'abschluss',
      mimeType: 'text/plain',
      dateiName: `abschluss-${angebot.anbieter.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}.txt`,
      blob: new Blob([inhalt], { type: 'text/plain;charset=utf-8' }),
    })
    addAbschluss({
      angebotId: angebot.id,
      kategorieId: kat.id,
      anbieter: angebot.anbieter,
      zahlungsmittelId: zmId,
      dokumentId: dokument.id,
    })
    setDokumentThemaId(ablage.themaId)
    setSchritt('fertig')
  }

  if (schritt === 'fertig') {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 flex flex-col gap-6">
        <div className="rounded-card bg-pine p-8 text-cream">
          <p className="text-4xl" aria-hidden="true">🎉</p>
          <h1 className="mt-3 font-serif text-3xl font-bold">Abschluss eingereicht!</h1>
          <p className="mt-2 text-cream/85">
            Dein Antrag bei <strong>{angebot.anbieter}</strong> ({kat.titel}) ist raus.
            Der Anbieter meldet sich zur Bestätigung – den Status siehst du im Wallet.
          </p>
        </div>

        {dokumentThemaId && (
          <Link to={`/dokumente/${dokumentThemaId}`} className="rounded-card bg-cream-card border border-pine-mist p-5 hover:border-coral transition">
            <p className="font-display font-semibold text-pine">📄 Bestätigung automatisch abgelegt</p>
            <p className="mt-1 text-sm text-ink/70">Liegt in deinen Dokumenten im passenden Themenordner.</p>
          </Link>
        )}

        <Link
          to={`/termine?neu=1&titel=${encodeURIComponent(`Alten ${kat.titel}-Vertrag kündigen`)}`}
          className="rounded-card bg-cream-card border border-pine-mist p-5 hover:border-coral transition"
        >
          <p className="font-display font-semibold text-pine">📅 Erinnerung anlegen: alten Vertrag kündigen?</p>
          <p className="mt-1 text-sm text-ink/70">Damit du nicht doppelt zahlst – ein Klick, fertig.</p>
        </Link>

        {verknuepfteAufgabe && !done[aufgabeKey] && (
          <button
            onClick={() => toggle(verknuepfteAufgabe.journeyId, verknuepfteAufgabe.taskId)}
            className="text-left rounded-card bg-cream-card border border-pine-mist p-5 hover:border-coral transition"
          >
            <p className="font-display font-semibold text-pine">✓ Aufgabe „{verknuepfteAufgabe.titel}" als erledigt markieren?</p>
            <p className="mt-1 text-sm text-ink/70">Du hast sie mit diesem Abschluss ja praktisch erledigt.</p>
          </button>
        )}
        {verknuepfteAufgabe && done[aufgabeKey] && (
          <p className="rounded-card border-2 border-pine-mist bg-cream p-5 text-pine font-medium">
            ✓ Aufgabe „{verknuepfteAufgabe.titel}" ist als erledigt markiert.
          </p>
        )}

        <div className="flex flex-wrap gap-4">
          <Link to="/wallet" className="rounded-pill bg-coral px-6 py-3 font-display font-semibold text-white hover:bg-coral-deep transition">
            Zum Wallet
          </Link>
          <Link to={`/vergleich/${kat.id}`} className="rounded-pill border-2 border-pine px-6 py-3 font-display font-semibold text-pine hover:bg-pine-mist/50 transition">
            Zurück zum Vergleich
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 flex flex-col gap-8">
      <div>
        <Link to={`/vergleich/${kat.id}`} className="text-sm text-pine underline underline-offset-2">← Zurück zum Vergleich</Link>
        <h1 className="mt-3 font-serif text-3xl font-bold text-pine">
          {angebot.logoEmoji} {angebot.anbieter} abschließen
        </h1>
      </div>

      <ol className="flex flex-wrap gap-2" aria-label="Checkout-Schritte">
        {schritte.map((label, i) => {
          const nr = (i + 1) as 1 | 2 | 3
          const aktiv = schritt === nr
          const fertig = typeof schritt === 'number' && schritt > nr
          return (
            <li
              key={label}
              aria-current={aktiv ? 'step' : undefined}
              className={`flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-display font-semibold ${
                aktiv ? 'bg-pine text-cream' : fertig ? 'bg-pine-mist text-pine' : 'border border-pine-mist text-ink/50'
              }`}
            >
              <span>{fertig ? '✓' : nr}</span> {label}
            </li>
          )
        })}
      </ol>

      {schritt === 1 && (
        <section className="flex flex-col gap-5">
          <div className="rounded-card bg-cream-card border border-pine-mist p-6">
            <p className="font-serif text-3xl font-bold text-coral">{angebot.preisAb}</p>
            <ul className="mt-3 text-ink/80 space-y-1.5">
              {angebot.kurzFeatures.map((f, i) => (
                <li key={i} className="flex gap-2"><span className="text-coral shrink-0">✓</span>{f}</li>
              ))}
            </ul>
            <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {kat.kriterien.filter(k => angebot.werte[k.key]).map(k => (
                <div key={k.key} className="flex justify-between gap-3 border-b border-pine-mist/60 py-1.5">
                  <dt className="text-ink/60">{k.label}</dt>
                  <dd className="font-medium text-pine text-right">{angebot.werte[k.key]}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-ink/50">Redaktioneller Stand: {angebot.standDaten}. Endgültige Konditionen bestätigt der Anbieter.</p>
          </div>
          <button
            onClick={() => setSchritt(2)}
            className="self-start rounded-pill bg-coral px-8 py-3 font-display text-lg font-semibold text-white hover:bg-coral-deep transition"
          >
            Weiter
          </button>
        </section>
      )}

      {schritt === 2 && (
        <section className="flex flex-col gap-4">
          <div className="rounded-card bg-cream-card border border-pine-mist p-6 flex flex-col gap-4">
            <label className="text-sm text-ink/70">
              Vollständiger Name
              <input value={name} onChange={e => setName(e.target.value)} autoComplete="name"
                     className="mt-1 w-full rounded-field border border-pine-mist bg-cream px-4 py-3 focus:outline-2 focus:outline-coral" />
            </label>
            <label className="text-sm text-ink/70">
              Adresse (Straße, PLZ, Ort)
              <input value={adresse} onChange={e => setAdresse(e.target.value)} autoComplete="street-address"
                     className="mt-1 w-full rounded-field border border-pine-mist bg-cream px-4 py-3 focus:outline-2 focus:outline-coral" />
            </label>
            <label className="text-sm text-ink/70">
              Geburtsdatum
              <input type="date" value={geburtsdatum} onChange={e => setGeburtsdatum(e.target.value)} autoComplete="bday"
                     className="mt-1 w-full rounded-field border border-pine-mist bg-cream px-4 py-3 focus:outline-2 focus:outline-coral" />
            </label>
            <label className="text-sm text-ink/70">
              Zahlungsmittel
              <select
                value={zahlungsWahl}
                onChange={e => setZahlungsWahl(e.target.value)}
                className="mt-1 w-full rounded-field border border-pine-mist bg-cream px-3 py-3 text-ink"
              >
                {zahlungsmittel.map(z => <option key={z.id} value={z.id}>{z.label}</option>)}
                <option value="neu">Neu: IBAN eintragen</option>
              </select>
            </label>
            {zahlungsWahl === 'neu' && (
              <input
                value={neueIban}
                onChange={e => setNeueIban(e.target.value)}
                placeholder="IBAN (z. B. DE89 3704 0044 0532 0130 00)"
                aria-label="IBAN"
                className="rounded-field border border-pine-mist bg-cream px-4 py-3 focus:outline-2 focus:outline-coral"
              />
            )}
            <label className="flex items-center gap-3 text-sm text-ink/80">
              <input type="checkbox" checked={merken} onChange={e => setMerken(e.target.checked)} className="size-5 accent-[#F47B5B]" />
              Für nächstes Mal merken (bleibt auf deinem Gerät)
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSchritt(3)}
              disabled={!datenOk}
              className="rounded-pill bg-coral px-8 py-3 font-display text-lg font-semibold text-white hover:bg-coral-deep transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Weiter
            </button>
            <button onClick={() => setSchritt(1)} className="text-sm text-ink/50 underline underline-offset-2">Zurück</button>
          </div>
        </section>
      )}

      {schritt === 3 && (
        <section className="flex flex-col gap-4">
          <div className="rounded-card bg-cream-card border border-pine-mist p-6 flex flex-col gap-3">
            <p className="font-display font-semibold text-pine">Zusammenfassung</p>
            <dl className="text-sm space-y-1.5">
              <div className="flex justify-between gap-3"><dt className="text-ink/60">Angebot</dt><dd className="font-medium text-pine">{angebot.anbieter} · {angebot.preisAb}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-ink/60">Name</dt><dd className="font-medium text-pine">{name}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-ink/60">Adresse</dt><dd className="font-medium text-pine text-right">{adresse}</dd></div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink/60">Zahlung</dt>
                <dd className="font-medium text-pine">
                  {zahlungsWahl === 'neu' ? `SEPA · ${maskiereIban(neueIban)}` : zahlungsmittel.find(z => z.id === zahlungsWahl)?.label}
                </dd>
              </div>
            </dl>
            <label className="mt-2 flex items-start gap-3 text-sm text-ink/80">
              <input type="checkbox" checked={agb} onChange={e => setAgb(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[#F47B5B]" />
              Ich habe die Vertragsbedingungen von {angebot.anbieter} gelesen und bin einverstanden.
            </label>
            <p className="text-xs text-ink/50">{PROVISIONSHINWEIS}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => void abschliessen()}
              disabled={!agb}
              className="rounded-pill bg-coral px-8 py-3 font-display text-lg font-semibold text-white hover:bg-coral-deep transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Jetzt kostenpflichtig abschließen
            </button>
            <button onClick={() => setSchritt(2)} className="text-sm text-ink/50 underline underline-offset-2">Zurück</button>
          </div>
        </section>
      )}
    </div>
  )
}
