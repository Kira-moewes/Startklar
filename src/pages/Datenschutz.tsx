import PageHead from '../components/PageHead'

const absaetze: string[] = [
  '[Datenschutz-Text folgt – von Kira, via eRecht24]',
  'Baustein KI-Modus (für den finalen Text): Alle Daten von Startklar (Profil, Fortschritt, Termine, Vergleiche, Chatverlauf) werden ausschließlich lokal auf deinem Gerät gespeichert. Der Assistent „Klaro" antwortet standardmäßig komplett auf deinem Gerät. Nur wenn du in den Einstellungen den KI-Modus aktivierst, wird deine Frage (und – nur mit separater Zustimmung „Kontext mitschicken" – eine kurze Zusammenfassung deines Fortschritts) an unseren Server übermittelt und zur Beantwortung an die Claude-API von Anthropic weitergegeben. Die Anfragen werden dort nicht dauerhaft gespeichert und nicht für Training verwendet. Du kannst den KI-Modus jederzeit wieder ausschalten.',
]

export default function Datenschutz() {
  return (
    <div className="mx-auto max-w-[720px] w-full px-7 pt-14 pb-24">
      <PageHead eyebrow="Rechtliches" title="Datenschutz" />
      <div className="flex flex-col gap-4">
        {absaetze.map((a, i) => (
          <p key={i} className="m-0 text-pine/85 leading-relaxed">
            {a}
          </p>
        ))}
      </div>
    </div>
  )
}
