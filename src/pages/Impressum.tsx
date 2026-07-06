const absaetze: string[] = [
  '[Impressum-Text folgt – von Kira, via eRecht24]',
  'Hinweis zur Finanzierung: Startklar arbeitet mit Affiliate-Partnerprogrammen (u. a. Awin, financeAds, Tarifcheck). Als „Anzeige · Partner-Link" gekennzeichnete Angebote sind Werbung; bei einem Abschluss erhält Startklar eine Provision vom Anbieter. Details: siehe Transparenzseite. [Nach Gewerbeanmeldung ergänzen: Betreiberin, Anschrift, Verantwortliche i. S. d. § 18 Abs. 2 MStV]',
]

export default function Impressum() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-pine">Impressum</h1>
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
