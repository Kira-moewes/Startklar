import { KONTAKT_EMAIL } from '../data/kontakt'

// Struktur-Entwurf einer Datenschutzerklärung nach Art. 13 DSGVO, abgestimmt
// auf die echte Technik von Startklar (lokale Speicherung, Hosting bei Vercel,
// optionaler KI-Modus über die Claude-API von Anthropic). Die mit {…}
// markierten Felder füllt Kira; die rechtsverbindliche Endfassung wird über
// eRecht24 erstellt.
type Abschnitt = { titel: string; absaetze: string[] }

const abschnitte: Abschnitt[] = [
  {
    titel: '1. Verantwortlicher',
    absaetze: [
      'Verantwortlich für die Datenverarbeitung auf dieser Website ist:',
      '{DEIN_NAME}, {STRASSE_HAUSNUMMER}, {PLZ_ORT}, Deutschland.',
      `E-Mail: ${KONTAKT_EMAIL}.`,
    ],
  },
  {
    titel: '2. Der Grundsatz: Deine Daten bleiben auf deinem Gerät',
    absaetze: [
      'Startklar ist bewusst datensparsam. Es gibt kein Nutzerkonto und keine Anmeldung. Alle Inhalte, die du in der App erzeugst – deine 7 Onboarding-Antworten (Profil), dein Fortschritt und Erledigt-Daten, deine Termine, deine Vergleiche und Bedarfschecks, abgelegte Unterlagen (PDF/Foto) und der Klaro-Chatverlauf – werden ausschließlich lokal in deinem Browser gespeichert (IndexedDB) und nicht an uns übertragen.',
      'Wir setzen keine Cookies zu Analyse- oder Werbezwecken ein und binden keine Tracking- oder Analysedienste ein. Es findet kein Profiling statt.',
    ],
  },
  {
    titel: '3. Aufruf der Website (Hosting)',
    absaetze: [
      'Die App wird bei der Vercel Inc. (440 N Barranca Ave #4133, Covina, CA 91723, USA) gehostet. Beim Aufruf verarbeitet der Hoster technisch notwendige Server-Logdaten (z. B. IP-Adresse, Zeitpunkt, aufgerufene Datei, Browsertyp), um die Auslieferung und Sicherheit der Seite zu gewährleisten.',
      'Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren, funktionsfähigen Angebot (Art. 6 Abs. 1 lit. f DSGVO). Mit Vercel besteht ein Auftragsverarbeitungsvertrag; die Übermittlung in die USA wird über die Standardvertragsklauseln der EU-Kommission abgesichert.',
    ],
  },
  {
    titel: '4. KI-Modus (optional, nur mit deiner Einwilligung)',
    absaetze: [
      'Der Assistent „Klaro" antwortet standardmäßig komplett auf deinem Gerät, ohne Datenübertragung. Nur wenn du in den Einstellungen den KI-Modus aktiv einschaltest, wird deine eingegebene Frage an unsere Serverfunktion und von dort zur Beantwortung an die Claude-API der Anthropic PBC (San Francisco, USA) übermittelt.',
      'Nur wenn du zusätzlich „Kontext mitschicken" aktivierst, wird außerdem eine kurze Zusammenfassung deines Profils/Fortschritts mitgesendet. Bitte gib in den Chat keine sensiblen personenbezogenen Daten ein, die du nicht übertragen möchtest.',
      'Zweck ist die Beantwortung deiner Frage. Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die du vor der ersten Nutzung ausdrücklich erteilst und jederzeit mit Wirkung für die Zukunft widerrufen kannst, indem du den KI-Modus wieder ausschaltest. Nach den Bedingungen der kommerziellen Claude-API werden die Inhalte dort nicht dauerhaft gespeichert und nicht zum Training von Modellen verwendet. Die Übermittlung in die USA wird über die Standardvertragsklauseln abgesichert.',
    ],
  },
  {
    titel: '5. Empfänger / Auftragsverarbeiter',
    absaetze: [
      'Vercel Inc. (Hosting) – bei jedem Seitenaufruf.',
      'Anthropic PBC (Claude-API) – ausschließlich, wenn du den KI-Modus aktivierst und eine Frage sendest.',
      'Darüber hinaus geben wir keine Daten an Dritte weiter.',
    ],
  },
  {
    titel: '6. Speicherdauer',
    absaetze: [
      'Deine in der App erzeugten Daten bleiben lokal auf deinem Gerät gespeichert, bis du sie selbst löschst (in den Einstellungen unter „Deine Daten" oder durch Löschen der Browserdaten). Da es keinen Account und keine serverseitige Speicherung deiner Inhalte gibt, bleibt bei uns nichts übrig.',
    ],
  },
  {
    titel: '7. Deine Rechte',
    absaetze: [
      'Du hast das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Eine bereits erteilte Einwilligung (KI-Modus) kannst du jederzeit widerrufen.',
      'Auskunft und Übertragbarkeit kannst du unmittelbar selbst ausüben: In den Einstellungen exportierst du alle deine Daten als JSON-Datei und löschst sie mit zwei Klicks vollständig.',
      'Zudem hast du das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.',
    ],
  },
  {
    titel: '8. Minderjährige',
    absaetze: [
      'Startklar richtet sich an Menschen ab 16 Jahren. Der KI-Modus (die einzige Funktion mit Datenübermittlung) lässt sich erst nach einer ausdrücklichen Bestätigung aktivieren. Alle übrigen Funktionen laufen ohne Datenübertragung lokal auf dem Gerät.',
    ],
  },
]

export default function Datenschutz() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-serif text-4xl font-normal text-pine">Datenschutzerklärung</h1>

      <div className="mt-6 rounded-[16px] border border-olive/40 bg-olive/8 px-5 py-4 text-[14px] text-pine/85">
        <strong>Hinweis (Entwurf):</strong> Dieser Text beschreibt die tatsächliche Datenverarbeitung
        von Startklar und dient als Grundlage. Die mit geschweiften Klammern markierten Felder werden
        noch gefüllt, und die rechtsverbindliche Endfassung wird über einen geprüften Generator
        (eRecht24) bzw. rechtlich geprüft erstellt.
      </div>

      <div className="mt-8 flex flex-col gap-7">
        {abschnitte.map(a => (
          <section key={a.titel}>
            <h2 className="font-serif text-xl font-medium text-pine">{a.titel}</h2>
            <div className="mt-2 flex flex-col gap-2 text-ink/85 leading-relaxed">
              {a.absaetze.map((p, i) => (
                <p key={i} className="m-0">{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
