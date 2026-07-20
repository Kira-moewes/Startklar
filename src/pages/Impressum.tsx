import { KONTAKT_EMAIL } from '../data/kontakt'

// Struktur-Entwurf nach § 5 DDG (ehem. § 5 TMG) + § 18 Abs. 2 MStV.
// Die mit {…} markierten Felder muss Kira mit ihren echten Daten füllen;
// die rechtsverbindliche Endfassung wird über eRecht24 erstellt.
type Abschnitt = { titel: string; zeilen: string[] }

const abschnitte: Abschnitt[] = [
  {
    titel: 'Angaben gemäß § 5 DDG',
    zeilen: ['{DEIN_NAME}', '{STRASSE_HAUSNUMMER}', '{PLZ_ORT}', 'Deutschland'],
  },
  {
    titel: 'Kontakt',
    zeilen: [`E-Mail: ${KONTAKT_EMAIL}`],
  },
  {
    titel: 'Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)',
    zeilen: ['{DEIN_NAME}', '{STRASSE_HAUSNUMMER}', '{PLZ_ORT}'],
  },
  {
    titel: 'Streitschlichtung',
    zeilen: [
      'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr.',
      'Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
    ],
  },
  {
    titel: 'Haftung für Inhalte',
    zeilen: [
      'Die Inhalte von Startklar werden mit größter Sorgfalt erstellt, sind aber allgemeine Orientierung und ersetzen keine Rechts-, Steuer- oder Versicherungsberatung. Für die Richtigkeit, Vollständigkeit und Aktualität wird keine Gewähr übernommen; Fristen und Beträge können sich ändern.',
    ],
  },
]

export default function Impressum() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-serif text-4xl font-normal text-pine">Impressum</h1>

      <div className="mt-6 rounded-[16px] border border-olive/40 bg-olive/8 px-5 py-4 text-[14px] text-pine/85">
        <strong>Hinweis (Entwurf):</strong> Diese Seite ist ein Struktur-Entwurf. Die mit
        geschweiften Klammern markierten Felder werden noch mit echten Angaben gefüllt, und die
        rechtsverbindliche Endfassung wird über einen geprüften Impressums-Generator (eRecht24)
        erstellt.
      </div>

      <div className="mt-8 flex flex-col gap-7">
        {abschnitte.map(a => (
          <section key={a.titel}>
            <h2 className="font-serif text-xl font-medium text-pine">{a.titel}</h2>
            <div className="mt-2 flex flex-col gap-1 text-ink/85 leading-relaxed">
              {a.zeilen.map((z, i) => (
                <p key={i} className="m-0">{z}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
