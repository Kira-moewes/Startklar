const absaetze: string[] = [
  '[Datenschutz-Text folgt – von Kira, via eRecht24]',
  'Partner-Links: Einige Angebote im Vergleich sind als „Anzeige · Partner-Link" gekennzeichnet. Klickst du darauf, wirst du zum jeweiligen Anbieter oder Vergleichsportal weitergeleitet; Startklar erhält bei einem Abschluss eine Provision. Der Link enthält lediglich eine Kategorie-Kennung (z. B. „startklar-strom") zur aggregierten Abrechnung – keine personenbezogenen Daten. Startklar setzt selbst keine Tracking-Cookies. Für die Datenverarbeitung auf den Zielseiten sind die jeweiligen Anbieter verantwortlich; Details stehen in deren Datenschutzerklärungen.',
  'Alle deine Eingaben in Startklar (Profil, Fortschritt, Termine, Dokumente, Wallet) bleiben lokal auf deinem Gerät (IndexedDB) und werden nicht an Server von Startklar übertragen.',
]

export default function Datenschutz() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-pine">Datenschutz</h1>
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
