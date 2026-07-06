// Anbieter-Vergleich mit transparentem Provisionsmodell: Kostenlos für
// Nutzer:innen – schließt jemand über Startklar ab, zahlt der Anbieter eine
// Provision (siehe KONZEPT.md §1). Kriterien, Tipps und Reihenfolge bleiben
// redaktionell unabhängig. Kuratierte Angebote liegen in `anbieter.ts`,
// eigene Angebote trägt man weiterhin selbst ein.

export type Kriterium = {
  key: string
  label: string
  hinweis?: string
  typ: 'text' | 'euro'
}

export type VergleichsKategorie = {
  id: string
  titel: string
  intro: string
  tipps: string[]
  kriterien: Kriterium[]
}

export const vergleichsKategorien: VergleichsKategorie[] = [
  {
    id: 'strom',
    titel: 'Stromanbieter',
    intro: 'Für die erste eigene Wohnung. Ohne eigenen Vertrag landest du in der teuren Grundversorgung.',
    tipps: [
      'Rechne mit ca. 1.500 kWh pro Jahr für eine Person – damit kannst du Preise vergleichen.',
      'Boni gelten oft nur im ersten Jahr. Vergleiche den Preis ab dem zweiten Jahr.',
      'Kurze Laufzeit und kurze Kündigungsfrist geben dir Flexibilität.',
    ],
    kriterien: [
      { key: 'grundpreis', label: 'Grundpreis / Monat', typ: 'euro' },
      { key: 'arbeitspreis', label: 'Preis pro kWh', typ: 'text', hinweis: 'in Cent' },
      { key: 'laufzeit', label: 'Vertragslaufzeit', typ: 'text' },
      { key: 'kuendigungsfrist', label: 'Kündigungsfrist', typ: 'text' },
      { key: 'oekostrom', label: 'Ökostrom?', typ: 'text' },
      { key: 'notizen', label: 'Notizen', typ: 'text' },
    ],
  },
  {
    id: 'internet',
    titel: 'Internetanbieter',
    intro: 'Prüfe zuerst, was an deiner Adresse überhaupt verfügbar ist – dann lohnt der Vergleich.',
    tipps: [
      'Für Streaming und Homeoffice reichen meist 50–100 Mbit/s.',
      'Achte auf den Preis nach der Rabattphase – oft steigt er ab Monat 7 oder 13.',
      'Frag nach Bereitstellungsgebühr und Router-Miete, die stecken oft im Kleingedruckten.',
    ],
    kriterien: [
      { key: 'preis', label: 'Preis / Monat', typ: 'euro', hinweis: 'nach der Rabattphase' },
      { key: 'geschwindigkeit', label: 'Geschwindigkeit', typ: 'text' },
      { key: 'laufzeit', label: 'Vertragslaufzeit', typ: 'text' },
      { key: 'einmalkosten', label: 'Einmalkosten', typ: 'euro', hinweis: 'Anschluss, Router' },
      { key: 'notizen', label: 'Notizen', typ: 'text' },
    ],
  },
  {
    id: 'haftpflicht',
    titel: 'Haftpflichtversicherung',
    intro: 'Die wichtigste freiwillige Versicherung überhaupt. Prüfe zuerst, ob du noch über deine Eltern mitversichert bist.',
    tipps: [
      'In Ausbildung/Studium bist du oft noch bei den Eltern mitversichert – einmal nachfragen spart Geld.',
      'Deckungssumme: mindestens 10 Mio. €, besser 50 Mio. € – der Preisunterschied ist klein.',
      '„Ausfalldeckung" zahlt, wenn jemand ohne Versicherung DIR einen Schaden zufügt.',
    ],
    kriterien: [
      { key: 'beitrag', label: 'Beitrag / Jahr', typ: 'euro' },
      { key: 'deckung', label: 'Deckungssumme', typ: 'text' },
      { key: 'selbstbeteiligung', label: 'Selbstbeteiligung', typ: 'euro' },
      { key: 'ausfalldeckung', label: 'Ausfalldeckung?', typ: 'text' },
      { key: 'notizen', label: 'Notizen', typ: 'text' },
    ],
  },
  {
    id: 'hausrat',
    titel: 'Hausratversicherung',
    intro: 'Schützt deine Sachen bei Feuer, Einbruch und Wasserschaden. Sinnvoll, sobald dein Hausrat mehr wert ist, als du locker ersetzen könntest.',
    tipps: [
      'Überschlage den Wert deiner Sachen – bei wenig Besitz ist die Versicherung verzichtbar.',
      'Achte auf die Quadratmeter-Pauschale: zu niedrig versichert heißt im Schadensfall weniger Geld.',
      'Fahrraddiebstahl ist oft nur gegen Aufpreis mitversichert.',
    ],
    kriterien: [
      { key: 'beitrag', label: 'Beitrag / Jahr', typ: 'euro' },
      { key: 'summe', label: 'Versicherungssumme', typ: 'text' },
      { key: 'selbstbeteiligung', label: 'Selbstbeteiligung', typ: 'euro' },
      { key: 'fahrrad', label: 'Fahrrad mitversichert?', typ: 'text' },
      { key: 'notizen', label: 'Notizen', typ: 'text' },
    ],
  },
  {
    id: 'girokonto',
    titel: 'Girokonto',
    intro: 'Dein erstes eigenes Konto. Für Schüler:innen, Azubis und Studierende gibt es meist kostenlose Modelle.',
    tipps: [
      'Kostenlos heißt: keine Kontoführungsgebühr UND kostenlose Girocard.',
      'Prüfe, wo du kostenlos Bargeld abheben kannst – das unterscheidet sich stark.',
      'Manche Konten sind nur bis zu einem bestimmten Alter oder mit Gehaltseingang gratis.',
    ],
    kriterien: [
      { key: 'gebuehr', label: 'Kontoführung / Monat', typ: 'euro' },
      { key: 'karte', label: 'Karte(n) inklusive', typ: 'text' },
      { key: 'bargeld', label: 'Bargeld abheben', typ: 'text' },
      { key: 'bedingungen', label: 'Bedingungen', typ: 'text', hinweis: 'z. B. Gehaltseingang, Altersgrenze' },
      { key: 'notizen', label: 'Notizen', typ: 'text' },
    ],
  },
  {
    id: 'depot',
    titel: 'Depot & ETF-Sparplan',
    intro: 'Fürs langfristige Sparen. Neobroker machen den Einstieg günstig – wichtig sind niedrige Orderkosten und kostenlose Sparpläne.',
    tipps: [
      'Für den Start reicht ein breit gestreuter Welt-ETF im Sparplan – schon ab 1 € oder 25 € im Monat.',
      'Achte auf 0-€-Sparpläne und niedrige Orderkosten, nicht auf Aktien-Gimmicks.',
      'Zinsen aufs Verrechnungskonto sind ein Plus, aber kein Grund für ein schlechtes Depot.',
    ],
    kriterien: [
      { key: 'orderkosten', label: 'Kosten pro Order', typ: 'euro' },
      { key: 'sparplan', label: 'ETF-Sparplan-Kosten', typ: 'text' },
      { key: 'zinsen', label: 'Zinsen auf Guthaben', typ: 'text' },
      { key: 'mindestrate', label: 'Mindest-Sparrate', typ: 'euro' },
      { key: 'notizen', label: 'Notizen', typ: 'text' },
    ],
  },
  {
    id: 'steuer',
    titel: 'Steuer-Software',
    intro: 'Die erste Steuererklärung ist mit einer App in unter einer Stunde erledigt – und bringt im Schnitt mehrere hundert Euro zurück.',
    tipps: [
      'Apps wie Taxfix führen dich mit Fragen durch – gut, wenn du noch nie eine Erklärung gemacht hast.',
      'ELSTER ist komplett kostenlos, aber ohne Führung – für einfache Fälle trotzdem machbar.',
      'Bezahlt wird meist erst bei Abgabe – die Erstattungs-Schätzung vorher ist kostenlos.',
    ],
    kriterien: [
      { key: 'preis', label: 'Preis pro Erklärung', typ: 'euro' },
      { key: 'modus', label: 'Bedienung', typ: 'text' },
      { key: 'foto', label: 'Belege abfotografieren?', typ: 'text' },
      { key: 'schaetzung', label: 'Erstattungs-Schätzung vorab?', typ: 'text' },
      { key: 'notizen', label: 'Notizen', typ: 'text' },
    ],
  },
  {
    id: 'schufa',
    titel: 'SCHUFA & Bonität',
    intro: 'Vor der Wohnungssuche brauchst du oft eine Bonitätsauskunft – und deinen Score zu kennen kostet nichts.',
    tipps: [
      'Die vollständige Datenkopie nach Art. 15 DSGVO ist gesetzlich kostenlos – lass dir nichts anderes verkaufen.',
      'Kostenpflichtige SCHUFA-Abos brauchst du als Berufseinsteiger:in praktisch nie.',
      'Prüfe die Daten auf Fehler – falsche Einträge kannst du korrigieren lassen.',
    ],
    kriterien: [
      { key: 'kosten', label: 'Kosten', typ: 'euro' },
      { key: 'umfang', label: 'Umfang der Auskunft', typ: 'text' },
      { key: 'aktualisierung', label: 'Aktualisierung', typ: 'text' },
      { key: 'dauer', label: 'Wie schnell?', typ: 'text' },
      { key: 'notizen', label: 'Notizen', typ: 'text' },
    ],
  },
  {
    id: 'altersvorsorge',
    titel: 'Altersvorsorge',
    intro: 'Kein Produkt-Druck: Erst verstehen (siehe Lernen), dann vergleichen. Zeit ist beim Vorsorgen dein größter Vorteil.',
    tipps: [
      'Hol dir zuerst die kostenlose Renteninformation – sie zeigt, wo du stehst.',
      'Niedrige Kosten schlagen langfristig fast jedes Versprechen – achte auf die Kostenquote.',
      'Schließe nichts ab, was du nicht erklären kannst. Im Zweifel: unabhängige Beratung (Verbraucherzentrale).',
    ],
    kriterien: [
      { key: 'kostenquote', label: 'Kostenquote', typ: 'text' },
      { key: 'flexibilitaet', label: 'Flexibilität (Pause/Ausstieg)', typ: 'text' },
      { key: 'foerderung', label: 'Staatliche Förderung', typ: 'text' },
      { key: 'notizen', label: 'Notizen', typ: 'text' },
    ],
  },
  {
    id: 'kfz',
    titel: 'Kfz-Versicherung',
    intro: 'Pflicht fürs erste Auto. Als Fahranfänger:in zahlst du viel – mit ein paar Tricks wird es günstiger.',
    tipps: [
      'Als Zweitwagen der Eltern oder mit deren Schadenfreiheitsklasse startest du oft deutlich günstiger.',
      'Teilkasko lohnt sich meist, Vollkasko nur bei neueren Autos.',
      'Werkstattbindung und jährliche Zahlweise drücken den Preis.',
    ],
    kriterien: [
      { key: 'beitrag', label: 'Beitrag / Jahr', typ: 'euro' },
      { key: 'schutz', label: 'Haftpflicht / Teilkasko / Vollkasko', typ: 'text' },
      { key: 'selbstbeteiligung', label: 'Selbstbeteiligung', typ: 'euro' },
      { key: 'sf-klasse', label: 'Einstufung (SF-Klasse)', typ: 'text' },
      { key: 'notizen', label: 'Notizen', typ: 'text' },
    ],
  },
  {
    id: 'handy',
    titel: 'Handytarif',
    intro: 'Läuft dein Vertrag noch über deine Eltern? Der Wechsel in einen eigenen Tarif ist ein guter Anlass zum Vergleichen.',
    tipps: [
      'Prepaid oder monatlich kündbar ist für den Start meist die bessere Wahl als 24 Monate Laufzeit.',
      'Schau auf dein tatsächliches Datenvolumen der letzten Monate statt auf „unbegrenzt"-Versprechen.',
      'Netzqualität zählt: Frag Freunde vor Ort, welches Netz bei euch gut funktioniert.',
    ],
    kriterien: [
      { key: 'preis', label: 'Preis / Monat', typ: 'euro' },
      { key: 'daten', label: 'Datenvolumen', typ: 'text' },
      { key: 'netz', label: 'Netz', typ: 'text' },
      { key: 'laufzeit', label: 'Laufzeit', typ: 'text' },
      { key: 'notizen', label: 'Notizen', typ: 'text' },
    ],
  },
]

export function kategorie(id: string): VergleichsKategorie | null {
  return vergleichsKategorien.find(k => k.id === id) ?? null
}

// Verknüpft Aufgaben (`journeyId:taskId`) mit passenden Vergleichs-Kategorien.
export const vergleichFuerTask: Record<string, string[]> = {
  'erste-wohnung:strom-internet': ['strom', 'internet'],
  'erste-wohnung:hausrat': ['hausrat'],
  'finanzen:girokonto': ['girokonto'],
  'finanzen:haftpflicht': ['haftpflicht'],
  'finanzen:depot-etf': ['depot'],
  'finanzen:haushaltsbudget': ['girokonto'],
  'finanzen:steuererklaerung': ['steuer'],
  'finanzen:schufa': ['schufa'],
  'finanzen:altersvorsorge': ['altersvorsorge'],
  'mobilitaet:kfz-versicherung': ['kfz'],
  'mobilitaet:kfz-anmelden': ['kfz'],
  'start:vertraege': ['handy'],
}

// „Dazu passt"-Querverweise auf Themenseiten (KONZEPT-PROVISIONEN.md §5.7).
export const vergleichFuerThema: Record<string, string[]> = {
  wohnen: ['strom', 'internet', 'hausrat'],
  finanzen: ['girokonto', 'depot', 'steuer', 'schufa'],
  versicherungen: ['haftpflicht', 'hausrat', 'kfz'],
  mobilitaet: ['kfz'],
  arbeit: ['steuer'],
}

// Erste Aufgabe, die zu einer Vergleichskategorie gehört (für den
// „Aufgabe erledigt?"-Vorschlag nach einem bestätigten Abschluss).
export function aufgabeFuerKategorie(
  kategorieId: string,
  journeys: Array<{ id: string; tasks: Array<{ id: string; title: string }> }>
): { journeyId: string; taskId: string; titel: string } | null {
  for (const [key, kats] of Object.entries(vergleichFuerTask)) {
    if (!kats.includes(kategorieId)) continue
    const [journeyId, taskId] = key.split(':')
    const journey = journeys.find(j => j.id === journeyId)
    const task = journey?.tasks.find(t => t.id === taskId)
    if (task) return { journeyId, taskId, titel: task.title }
  }
  return null
}
