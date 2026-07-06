const absaetze: string[] = [
  '[Datenschutz-Text folgt – von Kira, via eRecht24]',
  'Baustein KI-Modus (für den finalen Text): Alle Daten von Startklar (Profil, Fortschritt, Termine, Vergleiche, Chatverlauf) werden ausschließlich lokal auf deinem Gerät gespeichert. Der Assistent „Klaro" antwortet standardmäßig komplett auf deinem Gerät. Nur wenn du in den Einstellungen den KI-Modus aktivierst, wird deine Frage (und – nur mit separater Zustimmung „Kontext mitschicken" – eine kurze Zusammenfassung deines Fortschritts) an unseren Server übermittelt und zur Beantwortung an die Claude-API von Anthropic weitergegeben. Die Anfragen werden dort nicht dauerhaft gespeichert und nicht für Training verwendet. Du kannst den KI-Modus jederzeit wieder ausschalten.',
]

export default function Datenschutz() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-serif text-4xl font-normal text-pine">Datenschutz</h1>
      <div className="mt-6 flex flex-col gap-4">
        {absaetze.map((a, i) => (
          <p key={i} className="text-ink/85 leading-relaxed">
            {a}
          </p>
        ))}
      </div>
    </div>
  )
}
