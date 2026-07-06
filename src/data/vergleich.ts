// Neutraler Anbieter-Vergleich: Startklar nennt bekannte Anbieter mit
// unverbindlichen Richtwerten als Starthilfe, bewertet und verlinkt sie aber
// nicht und erhält keine Provision. Verglichen wird nur, was du selbst
// einträgst oder übernimmst.

export type Kriterium = {
  key: string
  label: string
  hinweis?: string
  typ: 'text' | 'euro'
  // Für Bedarfs-Ampel & Best-Match: in welche Richtung ist ein Wert "besser"?
  richtung?: 'niedriger-besser' | 'hoeher-besser'
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
      { key: 'beitrag', label: 'Beitrag / Jahr', typ: 'euro', richtung: 'niedriger-besser' },
      { key: 'deckung', label: 'Deckungssumme', typ: 'text', richtung: 'hoeher-besser' },
      { key: 'selbstbeteiligung', label: 'Selbstbeteiligung', typ: 'euro', richtung: 'niedriger-besser' },
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
      { key: 'beitrag', label: 'Beitrag / Jahr', typ: 'euro', richtung: 'niedriger-besser' },
      { key: 'summe', label: 'Versicherungssumme', typ: 'text', richtung: 'hoeher-besser' },
      { key: 'selbstbeteiligung', label: 'Selbstbeteiligung', typ: 'euro', richtung: 'niedriger-besser' },
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
    id: 'kfz',
    titel: 'Kfz-Versicherung',
    intro: 'Pflicht fürs erste Auto. Als Fahranfänger:in zahlst du viel – mit ein paar Tricks wird es günstiger.',
    tipps: [
      'Als Zweitwagen der Eltern oder mit deren Schadenfreiheitsklasse startest du oft deutlich günstiger.',
      'Teilkasko lohnt sich meist, Vollkasko nur bei neueren Autos.',
      'Werkstattbindung und jährliche Zahlweise drücken den Preis.',
    ],
    kriterien: [
      { key: 'beitrag', label: 'Beitrag / Jahr', typ: 'euro', richtung: 'niedriger-besser' },
      { key: 'schutz', label: 'Haftpflicht / Teilkasko / Vollkasko', typ: 'text' },
      { key: 'selbstbeteiligung', label: 'Selbstbeteiligung', typ: 'euro', richtung: 'niedriger-besser' },
      { key: 'sf-klasse', label: 'Einstufung (SF-Klasse)', typ: 'text' },
      { key: 'notizen', label: 'Notizen', typ: 'text' },
    ],
  },
  {
    id: 'krankenkasse',
    titel: 'Krankenkasse',
    intro: 'Alle gesetzlichen Kassen bieten ~95 % gleiche Leistungen – Unterschiede stecken im Zusatzbeitrag und in den Extras.',
    tipps: [
      'Der Zusatzbeitrag ist der wichtigste Preisunterschied – er wird direkt vom Gehalt abgezogen.',
      'Extras vergleichen: Zahnreinigung, Bonusprogramme, digitale Services – je nachdem, was DU nutzt.',
      'Der Wechsel ist einfach: neue Kasse beantragen, die kümmert sich um die Kündigung.',
    ],
    kriterien: [
      { key: 'zusatzbeitrag', label: 'Zusatzbeitrag', typ: 'text', hinweis: 'in %', richtung: 'niedriger-besser' },
      { key: 'zahnreinigung', label: 'Zahnreinigung bezuschusst?', typ: 'text' },
      { key: 'bonusprogramm', label: 'Bonusprogramm', typ: 'text' },
      { key: 'digital', label: 'App / Online-Service', typ: 'text' },
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
  'mobilitaet:kfz-versicherung': ['kfz'],
  'start:vertraege': ['handy'],
  'start:krankenkasse-check': ['krankenkasse'],
  'start:krankenkassen-wechsel': ['krankenkasse'],
}
