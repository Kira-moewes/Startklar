import { Link } from 'react-router-dom'
import { vergleichsKategorien } from '../data/vergleich'
import { angeboteFuerKategorie } from '../data/anbieter'

const qualitaetsCheck = [
  'Das Produkt ist für 18-Jährige ohne Vermögen sinnvoll nutzbar.',
  'Kein Abo und keine Kostenfalle, wenn es eine gleichwertige kostenlose Lösung gibt.',
  'Die Kosten stehen transparent auf der Zielseite.',
  'Der Anbieter ist seriös (reguliert bzw. etabliert).',
  'Kündigung oder Ausstieg sind einfach möglich.',
]

export default function Transparenz() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 flex flex-col gap-10">
      <div>
        <h1 className="font-serif text-4xl font-bold text-pine">Transparenz</h1>
        <p className="mt-2 text-lg text-ink/80">
          Startklar ist für dich kostenlos. Hier steht ehrlich, womit wir Geld
          verdienen – und womit bewusst nicht.
        </p>
      </div>

      <section className="rounded-card bg-cream-card border border-pine-mist p-6 flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-pine">So funktioniert unser Modell</h2>
        <p className="text-ink/85">
          In jeder Vergleichskategorie zeigen wir höchstens zwei <strong>Partner-Angebote</strong>.
          Schließt du über so einen Link ab, zahlt der Anbieter Startklar eine Provision –
          dein Preis ändert sich dadurch nicht. Diese Angebote sind immer mit
          <span className="mx-1 rounded-pill bg-coral px-2 py-0.5 text-xs font-display font-semibold text-white">Anzeige · Partner-Link</span>
          gekennzeichnet.
        </p>
        <p className="text-ink/85">
          Daneben steht in jeder Kategorie mindestens eine Empfehlung mit
          <span className="mx-1 rounded-pill bg-pine px-2 py-0.5 text-xs font-display font-semibold text-cream">Ohne Provision empfohlen</span>
          – daran verdienen wir nichts. Die Kriterien, Tipps und die Reihenfolge
          innerhalb der Angebote sind redaktionell und nie von der Provisionshöhe bestimmt.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-pine">Unser Qualitäts-Check</h2>
        <p className="text-ink/80 text-sm">
          Ein Partner kommt nur in die App, wenn alle fünf Punkte erfüllt sind –
          egal wie hoch die Provision wäre:
        </p>
        <ul className="flex flex-col gap-2">
          {qualitaetsCheck.map((punkt, i) => (
            <li key={i} className="flex gap-3 rounded-card bg-cream-card border border-pine-mist p-3 text-sm text-ink/85">
              <span className="text-coral font-bold shrink-0">✓</span>{punkt}
            </li>
          ))}
        </ul>
        <p className="text-sm text-ink/60">
          Beispiel: Ein kostenpflichtiges Bonitäts-Abo bewerben wir nicht, weil es
          deinen SCHUFA-Score auch kostenlos gibt – auch wenn das Abo mehr Provision brächte.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-xl font-semibold text-pine">Womit Startklar verdient</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-ink/60">
                <th className="p-2 font-medium">Kategorie</th>
                <th className="p-2 font-medium">Partner (Provision)</th>
                <th className="p-2 font-medium">Ohne Provision</th>
              </tr>
            </thead>
            <tbody>
              {vergleichsKategorien.map((k, i) => {
                const angebote = angeboteFuerKategorie(k.id)
                const partner = angebote.filter(a => a.monetarisierung === 'partner')
                const frei = angebote.filter(a => a.monetarisierung === 'provisionsfrei')
                return (
                  <tr key={k.id} className={i % 2 === 0 ? 'bg-pine-mist/30' : ''}>
                    <td className="p-2 font-medium text-pine">
                      <Link to={`/vergleich/${k.id}`} className="underline underline-offset-2 hover:text-coral-deep">{k.titel}</Link>
                    </td>
                    <td className="p-2 text-ink/80">{partner.length > 0 ? partner.map(a => a.anbieter).join(', ') : '–'}</td>
                    <td className="p-2 text-ink/80">{frei.length > 0 ? frei.map(a => a.anbieter).join(', ') : '–'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-card border-2 border-pine-mist bg-cream p-6 flex flex-col gap-2">
        <h2 className="font-display text-lg font-semibold text-pine">Womit wir bewusst nicht verdienen</h2>
        <ul className="text-ink/85 text-sm space-y-1.5 list-disc list-inside">
          <li>Aufgaben, Anleitungen und das Lern-Modul – reiner Inhalt, keine Werbung.</li>
          <li>Keine Provision bei Versicherungs-Beratung: Wir leiten nur zu Vergleichsportalen weiter und beraten nicht (Tippgeber-Modell).</li>
          <li>Kein Verkauf deiner Daten, kein Tracking: Partner-Links enthalten nur eine Kategorie-Kennung, keine Personendaten.</li>
        </ul>
      </section>

      <p className="text-sm text-ink/60">
        Fragen dazu? Schreib uns – Kontakt im <Link to="/impressum" className="underline underline-offset-2">Impressum</Link>.
      </p>
    </div>
  )
}
