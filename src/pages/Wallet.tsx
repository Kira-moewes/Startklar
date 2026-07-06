import { useState } from 'react'
import { Link } from 'react-router-dom'
import { kategorie } from '../data/vergleich'
import { ablageFuerKategorie } from '../data/anbieter'
import { useWallet, maskiereIban, type AbschlussStatus, type ZahlungsmittelTyp } from '../hooks/useWallet'
import NachfrageKarte from '../components/NachfrageKarte'

const statusLabel: Record<AbschlussStatus, { text: string; cls: string }> = {
  angeklickt: { text: 'Offen: abgeschlossen?', cls: 'bg-pine-mist text-pine' },
  selbst_bestaetigt: { text: 'Bestätigt', cls: 'bg-olive-soft text-white' },
  aktiv: { text: 'Aktiv', cls: 'bg-pine text-cream' },
  gekuendigt: { text: 'Gekündigt', cls: 'bg-cream border border-pine-mist text-ink/60' },
}

const typIcon: Record<ZahlungsmittelTyp, string> = { sepa: '🏦', paypal: '💙', karte: '💳' }

function formatDatum(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Wallet() {
  const {
    zahlungsmittel, abschluesse, verlauf,
    addZahlungsmittel, removeZahlungsmittel, loading,
  } = useWallet()
  const [zeigeFormular, setZeigeFormular] = useState(false)
  const [typ, setTyp] = useState<ZahlungsmittelTyp>('sepa')
  const [feld1, setFeld1] = useState('') // Inhaber / E-Mail / Karteninhaber
  const [feld2, setFeld2] = useState('') // IBAN / – / Kartennummer

  const hinzufuegen = (e: React.FormEvent) => {
    e.preventDefault()
    if (typ === 'sepa') {
      if (!feld1.trim() || feld2.replaceAll(/\s+/g, '').length < 8) return
      addZahlungsmittel({
        typ,
        label: `SEPA · ${maskiereIban(feld2)}`,
        details: { inhaber: feld1.trim(), iban: maskiereIban(feld2) },
      })
    } else if (typ === 'paypal') {
      if (!feld1.includes('@')) return
      addZahlungsmittel({ typ, label: `PayPal · ${feld1.trim()}`, details: { email: feld1.trim() } })
    } else {
      const nummer = feld2.replaceAll(/\s+/g, '')
      if (!feld1.trim() || nummer.length < 8) return
      addZahlungsmittel({
        typ,
        label: `Karte · **** ${nummer.slice(-4)}`,
        details: { inhaber: feld1.trim(), nummer: `**** ${nummer.slice(-4)}` },
      })
    }
    setFeld1('')
    setFeld2('')
    setZeigeFormular(false)
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 flex flex-col gap-10">
      <div>
        <h1 className="font-serif text-4xl font-bold text-pine">Wallet</h1>
        <p className="mt-2 text-lg text-ink/80">
          Daten einmal hinterlegen, Verträge in unter einer Minute abschließen.
          Kostenlos für dich – die Provision zahlt der Anbieter.
        </p>
      </div>

      <section aria-label="Zahlungsmittel" className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold text-pine">Zahlungsmittel & Daten</h2>
        {zahlungsmittel.map(z => (
          <div key={z.id} className="rounded-card bg-cream-card border border-pine-mist p-4 flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">{typIcon[z.typ]}</span>
            <div className="flex-1">
              <p className="font-display font-semibold text-pine">{z.label}</p>
              {z.details.inhaber && <p className="text-sm text-ink/60">{z.details.inhaber}</p>}
            </div>
            <button
              onClick={() => { if (confirm(`${z.label} entfernen?`)) removeZahlungsmittel(z.id) }}
              className="text-sm text-ink/40 underline underline-offset-2 hover:text-coral-deep"
            >
              Entfernen
            </button>
          </div>
        ))}
        {!loading && zahlungsmittel.length === 0 && !zeigeFormular && (
          <p className="text-ink/70 text-sm">
            Noch kein Zahlungsmittel hinterlegt. Mit hinterlegtem Zahlungsmittel dauert
            ein Abschluss keine 60 Sekunden.
          </p>
        )}
        {!zeigeFormular ? (
          <button
            onClick={() => setZeigeFormular(true)}
            className="self-start rounded-pill bg-pine px-6 py-3 font-display font-semibold text-cream hover:bg-forest transition"
          >
            + Hinzufügen
          </button>
        ) : (
          <form onSubmit={hinzufuegen} className="rounded-card bg-cream-card border border-pine-mist p-5 flex flex-col gap-3">
            <label className="text-sm text-ink/70">
              Art
              <select
                value={typ}
                onChange={e => { setTyp(e.target.value as ZahlungsmittelTyp); setFeld1(''); setFeld2('') }}
                className="mt-1 w-full rounded-field border border-pine-mist bg-cream px-3 py-2.5 text-ink"
              >
                <option value="sepa">SEPA-Lastschrift (IBAN)</option>
                <option value="paypal">PayPal</option>
                <option value="karte">Debit-/Kreditkarte</option>
              </select>
            </label>
            <input
              value={feld1}
              onChange={e => setFeld1(e.target.value)}
              placeholder={typ === 'paypal' ? 'PayPal-E-Mail-Adresse' : 'Name der Kontoinhaber:in'}
              aria-label={typ === 'paypal' ? 'PayPal-E-Mail-Adresse' : 'Name der Kontoinhaber:in'}
              className="rounded-field border border-pine-mist bg-cream px-4 py-3 focus:outline-2 focus:outline-coral"
            />
            {typ !== 'paypal' && (
              <input
                value={feld2}
                onChange={e => setFeld2(e.target.value)}
                placeholder={typ === 'sepa' ? 'IBAN (z. B. DE89 3704 0044 0532 0130 00)' : 'Kartennummer'}
                aria-label={typ === 'sepa' ? 'IBAN' : 'Kartennummer'}
                className="rounded-field border border-pine-mist bg-cream px-4 py-3 focus:outline-2 focus:outline-coral"
              />
            )}
            <div className="flex gap-3">
              <button type="submit" className="rounded-pill bg-coral px-6 py-2.5 font-display font-semibold text-white hover:bg-coral-deep transition">
                Speichern
              </button>
              <button type="button" onClick={() => setZeigeFormular(false)} className="text-sm text-ink/50 underline underline-offset-2">
                Abbrechen
              </button>
            </div>
            <p className="text-xs text-ink/50">
              Wird nur maskiert auf deinem Gerät gespeichert und erst beim Abschluss an den
              jeweiligen Anbieter übertragen.
            </p>
          </form>
        )}
      </section>

      <NachfrageKarte />

      <section aria-label="Abschlüsse" className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold text-pine">Deine Abschlüsse</h2>
        {abschluesse.filter(a => a.status !== 'angeklickt').length === 0 && !loading && (
          <p className="rounded-card border-2 border-pine-mist bg-cream p-5 text-ink/80">
            Noch keine Abschlüsse. Stöbere im <Link to="/vergleich" className="underline">Vergleich</Link> –
            Angebote mit „Über Startklar abschließen" wickelst du direkt hier ab.
          </p>
        )}
        {[...abschluesse].filter(a => a.status !== 'angeklickt').reverse().map(a => {
          const kat = kategorie(a.kategorieId)
          const ablage = ablageFuerKategorie[a.kategorieId]
          const status = statusLabel[a.status]
          return (
            <div key={a.id} className="rounded-card bg-cream-card border border-pine-mist p-5 flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="flex-1 min-w-40 font-display text-lg font-semibold text-pine">{a.anbieter}</p>
                <span className={`rounded-pill px-3 py-1 text-xs font-display font-semibold ${status.cls}`}>{status.text}</span>
              </div>
              <p className="text-sm text-ink/70">{kat?.titel ?? a.kategorieId} · {formatDatum(a.datum)}</p>
              {a.dokumentId && ablage && (
                <Link to={`/dokumente/${ablage.themaId}`} className="text-sm text-pine underline underline-offset-2 hover:text-coral-deep self-start">
                  📄 Bestätigung in den Dokumenten ansehen
                </Link>
              )}
            </div>
          )
        })}
      </section>

      {verlauf.length > 0 && (
        <section aria-label="Verlauf" className="flex flex-col gap-3">
          <h2 className="font-display text-xl font-semibold text-pine">Verlauf</h2>
          <ul className="flex flex-col gap-2">
            {verlauf.map(e => (
              <li key={e.id} className="flex gap-3 text-sm text-ink/80">
                <span className="text-ink/50 whitespace-nowrap">{formatDatum(e.datum)}</span>
                <span>{e.text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-xs text-ink/50">
        Hinweis: Startklar erhält bei Abschlüssen eine Provision vom jeweiligen Anbieter.
        Für dich bleibt alles kostenlos; alle Daten bleiben auf deinem Gerät.
      </p>
    </div>
  )
}
