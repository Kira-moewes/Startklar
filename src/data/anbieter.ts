// Kuratierte Anbieter-Angebote für den Vergleich (KONZEPT.md §4).
// Redaktionelle Richtwerte, Web-Recherche Stand 07/2026 – vor Launch
// verifizieren. `werte` füllt die Kriterien-Spalten der jeweiligen Kategorie.

export type AnbieterAngebot = {
  id: string
  kategorieId: string
  anbieter: string
  logoEmoji: string
  preisAb: string
  kurzFeatures: [string, string, string]
  zielgruppe?: string
  werte: Record<string, string>
  abschluss: 'app' | 'extern'
  url: string
  standDaten: string
}

export const PROVISIONSHINWEIS =
  'Kostenlos für dich – Startklar erhält bei Abschluss eine Provision vom Anbieter.'

export const anbieterAngebote: AnbieterAngebot[] = [
  // --- Strom ---
  {
    id: 'strom-tibber',
    kategorieId: 'strom',
    anbieter: 'Tibber',
    logoEmoji: '⚡',
    preisAb: '5,99 € / Monat + Börsenpreis',
    kurzFeatures: ['Dynamischer Tarif zum Einkaufspreis', 'Sehr gute App mit Live-Verbrauch', 'Monatlich kündbar'],
    zielgruppe: 'Gut, wenn du alles per App steuern willst.',
    werte: { grundpreis: '5,99 €', arbeitspreis: 'Börsenpreis + Netz', laufzeit: 'keine', kuendigungsfrist: 'monatlich', oekostrom: 'Ja' },
    abschluss: 'app',
    url: 'https://tibber.com/de',
    standDaten: '2026-07',
  },
  {
    id: 'strom-ostrom',
    kategorieId: 'strom',
    anbieter: 'Ostrom',
    logoEmoji: '🌱',
    preisAb: 'ca. 6 € / Monat + Börsenpreis',
    kurzFeatures: ['Ein einfacher Tarif, alles digital', 'Monatlich kündbar', 'Ökostrom inklusive'],
    zielgruppe: 'Gut für den unkomplizierten Start.',
    werte: { grundpreis: 'ca. 6 €', arbeitspreis: 'Börsenpreis + Netz', laufzeit: 'keine', kuendigungsfrist: 'monatlich', oekostrom: 'Ja' },
    abschluss: 'app',
    url: 'https://www.ostrom.de',
    standDaten: '2026-07',
  },
  {
    id: 'strom-rabot',
    kategorieId: 'strom',
    anbieter: 'Rabot Energy',
    logoEmoji: '🔌',
    preisAb: 'dynamisch, ohne Smart Meter nutzbar',
    kurzFeatures: ['Dynamischer Tarif auch ohne Smart Meter', 'Monatlich kündbar', 'Ökostrom'],
    werte: { grundpreis: 'ca. 5–7 €', arbeitspreis: 'Börsenpreis + Netz', laufzeit: 'keine', kuendigungsfrist: 'monatlich', oekostrom: 'Ja' },
    abschluss: 'extern',
    url: 'https://www.rabot.energy',
    standDaten: '2026-07',
  },
  // --- Internet ---
  {
    id: 'internet-congstar',
    kategorieId: 'internet',
    anbieter: 'congstar Zuhause',
    logoEmoji: '📶',
    preisAb: 'ca. 36 € / Monat',
    kurzFeatures: ['Flexible Laufzeiten', 'Telekom-Netz', 'Auch als Glasfaser-Tarif'],
    zielgruppe: 'Gut für Azubis/Studis: flexibel statt 24 Monate.',
    werte: { preis: 'ca. 36 €', geschwindigkeit: '50–100 Mbit/s', laufzeit: 'flexibel', einmalkosten: 'je nach Aktion' },
    abschluss: 'app',
    url: 'https://www.congstar.de',
    standDaten: '2026-07',
  },
  {
    id: 'internet-o2',
    kategorieId: 'internet',
    anbieter: 'o2 Home',
    logoEmoji: '🌐',
    preisAb: 'je nach Verfügbarkeit',
    kurzFeatures: ['Oft günstige Neukunden-Aktionen', 'DSL, Kabel oder Glasfaser', 'Junge-Leute-Rabatte'],
    werte: { preis: 'aktionsabhängig', geschwindigkeit: 'bis Glasfaser', laufzeit: '12–24 Monate', einmalkosten: 'aktionsabhängig' },
    abschluss: 'extern',
    url: 'https://www.o2online.de',
    standDaten: '2026-07',
  },
  // --- Haftpflicht ---
  {
    id: 'haftpflicht-huk24',
    kategorieId: 'haftpflicht',
    anbieter: 'HUK24',
    logoEmoji: '🛡️',
    preisAb: 'ab ca. 3 € / Monat',
    kurzFeatures: ['Stiftung Warentest „sehr gut"', 'Sehr günstiger Direktversicherer', 'Kombi mit Hausrat möglich'],
    zielgruppe: 'Solide Standardwahl ohne Schnickschnack.',
    werte: { beitrag: 'ab ca. 34 €', deckung: '50 Mio. €', selbstbeteiligung: '0 €', ausfalldeckung: 'Ja' },
    abschluss: 'app',
    url: 'https://www.huk24.de',
    standDaten: '2026-07',
  },
  {
    id: 'haftpflicht-getsafe',
    kategorieId: 'haftpflicht',
    anbieter: 'Getsafe',
    logoEmoji: '📱',
    preisAb: 'ab ca. 4 € / Monat',
    kurzFeatures: ['Alles per App, monatlich kündbar', 'Schaden in Minuten melden', 'Flexibel anpassbar'],
    zielgruppe: 'Gut, wenn du Versicherung nur per App willst.',
    werte: { beitrag: 'ab ca. 48 €', deckung: 'bis 50 Mio. €', selbstbeteiligung: 'wählbar', ausfalldeckung: 'Ja' },
    abschluss: 'app',
    url: 'https://www.hellogetsafe.com',
    standDaten: '2026-07',
  },
  // --- Hausrat ---
  {
    id: 'hausrat-huk24',
    kategorieId: 'hausrat',
    anbieter: 'HUK24',
    logoEmoji: '🏠',
    preisAb: 'ab ca. 26 € / Jahr',
    kurzFeatures: ['Sehr günstig für kleine Wohnungen', 'Kombi-Rabatt mit Haftpflicht', 'Direktversicherer'],
    werte: { beitrag: 'ab ca. 26 €', summe: 'qm-Pauschale', selbstbeteiligung: 'wählbar', fahrrad: 'gegen Aufpreis' },
    abschluss: 'app',
    url: 'https://www.huk24.de',
    standDaten: '2026-07',
  },
  {
    id: 'hausrat-lemonade',
    kategorieId: 'hausrat',
    anbieter: 'Lemonade',
    logoEmoji: '🍋',
    preisAb: 'ab ca. 4 € / Monat',
    kurzFeatures: ['Abschluss in wenigen Minuten', 'Alles digital, monatlich kündbar', 'Höhere Selbstbeteiligung = günstiger'],
    werte: { beitrag: 'ab ca. 48 €', summe: 'individuell', selbstbeteiligung: 'bis 1.000 € wählbar', fahrrad: 'optional' },
    abschluss: 'extern',
    url: 'https://www.lemonade.com/de',
    standDaten: '2026-07',
  },
  // --- Girokonto ---
  {
    id: 'girokonto-traderepublic',
    kategorieId: 'girokonto',
    anbieter: 'Trade Republic',
    logoEmoji: '💳',
    preisAb: '0 € / Monat',
    kurzFeatures: ['Ohne Bedingungen kostenlos', 'ca. 2,25 % Zinsen aufs Guthaben', 'Depot direkt integriert'],
    zielgruppe: 'Gut, wenn du Konto + Sparen in einer App willst.',
    werte: { gebuehr: '0 €', karte: 'Visa (digital, Karte optional)', bargeld: 'weltweit ab 100 €', bedingungen: 'keine' },
    abschluss: 'app',
    url: 'https://traderepublic.com',
    standDaten: '2026-07',
  },
  {
    id: 'girokonto-scalable',
    kategorieId: 'girokonto',
    anbieter: 'Scalable Capital',
    logoEmoji: '📈',
    preisAb: '0 € / Monat',
    kurzFeatures: ['ca. 2,5 % Zinsen aufs Guthaben', 'Depot integriert', 'Kostenlose Sparpläne'],
    werte: { gebuehr: '0 €', karte: 'Visa', bargeld: 'je nach Modell', bedingungen: 'keine' },
    abschluss: 'extern',
    url: 'https://de.scalable.capital',
    standDaten: '2026-07',
  },
  // --- Depot ---
  {
    id: 'depot-traderepublic',
    kategorieId: 'depot',
    anbieter: 'Trade Republic',
    logoEmoji: '📊',
    preisAb: '1 € pro Order',
    kurzFeatures: ['ETF-Sparpläne kostenlos', 'Sparplan ab 1 €', 'ca. 2,25 % Zinsen aufs Guthaben'],
    zielgruppe: 'Der Klassiker für den ETF-Start.',
    werte: { orderkosten: '1 €', sparplan: '0 €', zinsen: 'ca. 2,25 %', mindestrate: '1 €' },
    abschluss: 'app',
    url: 'https://traderepublic.com',
    standDaten: '2026-07',
  },
  {
    id: 'depot-fnzero',
    kategorieId: 'depot',
    anbieter: 'finanzen.net zero',
    logoEmoji: '0️⃣',
    preisAb: '0 € ab 500 € Ordervolumen',
    kurzFeatures: ['Orders ab 500 € kostenlos', 'ETF-Sparpläne kostenlos', 'Einfache App'],
    werte: { orderkosten: '0 € (ab 500 €), sonst 1 €', sparplan: '0 €', zinsen: 'keine', mindestrate: '25 €' },
    abschluss: 'app',
    url: 'https://www.finanzen.net/zero',
    standDaten: '2026-07',
  },
  {
    id: 'depot-scalable',
    kategorieId: 'depot',
    anbieter: 'Scalable Capital',
    logoEmoji: '📈',
    preisAb: '0,99 € pro Order (Free-Modell)',
    kurzFeatures: ['Kostenlose ETF-Sparpläne', 'ca. 2,5 % Zinsen aufs Guthaben', 'Auch Flat-Modell verfügbar'],
    werte: { orderkosten: '0,99 €', sparplan: '0 €', zinsen: 'ca. 2,5 %', mindestrate: '1 €' },
    abschluss: 'extern',
    url: 'https://de.scalable.capital',
    standDaten: '2026-07',
  },
  // --- Kfz ---
  {
    id: 'kfz-huk24',
    kategorieId: 'kfz',
    anbieter: 'HUK24',
    logoEmoji: '🚗',
    preisAb: 'individuell (Rechner)',
    kurzFeatures: ['Günstiger Direktversicherer', 'Werkstattbindung spart extra', 'Zweitwagen-Regelung der Eltern nutzbar'],
    werte: { beitrag: 'individuell', schutz: 'Haftpflicht/Teil-/Vollkasko', selbstbeteiligung: 'wählbar', 'sf-klasse': 'Übernahme möglich' },
    abschluss: 'app',
    url: 'https://www.huk24.de',
    standDaten: '2026-07',
  },
  {
    id: 'kfz-verti',
    kategorieId: 'kfz',
    anbieter: 'Verti',
    logoEmoji: '🚙',
    preisAb: 'individuell (Rechner)',
    kurzFeatures: ['Oft günstig für Fahranfänger:innen', 'Direktversicherer', 'Telematik-Tarif möglich'],
    werte: { beitrag: 'individuell', schutz: 'Haftpflicht/Teil-/Vollkasko', selbstbeteiligung: 'wählbar', 'sf-klasse': 'Einstufung individuell' },
    abschluss: 'extern',
    url: 'https://www.verti.de',
    standDaten: '2026-07',
  },
  // --- Handy ---
  {
    id: 'handy-fraenk',
    kategorieId: 'handy',
    anbieter: 'fraenk',
    logoEmoji: '📱',
    preisAb: '10 € / Monat',
    kurzFeatures: ['30 GB im Telekom-Netz', 'Monatlich kündbar', 'Alles per App in 5 Minuten'],
    zielgruppe: 'Bester Start-Tarif: günstig, gutes Netz, flexibel.',
    werte: { preis: '10 €', daten: '30 GB', netz: 'Telekom', laufzeit: 'monatlich kündbar' },
    abschluss: 'app',
    url: 'https://fraenk.de',
    standDaten: '2026-07',
  },
  {
    id: 'handy-congstar',
    kategorieId: 'handy',
    anbieter: 'congstar Young',
    logoEmoji: '🎧',
    preisAb: 'ab ca. 10 € / Monat',
    kurzFeatures: ['Unter 28: doppeltes Datenvolumen', 'Telekom-Netz', 'Flexible Laufzeit wählbar'],
    werte: { preis: 'ab ca. 10 €', daten: 'tarifabhängig (x2 unter 28)', netz: 'Telekom', laufzeit: 'flexibel' },
    abschluss: 'extern',
    url: 'https://www.congstar.de',
    standDaten: '2026-07',
  },
]

export function angeboteFuerKategorie(kategorieId: string): AnbieterAngebot[] {
  return anbieterAngebote.filter(a => a.kategorieId === kategorieId)
}

export function anbieterAngebot(id: string): AnbieterAngebot | null {
  return anbieterAngebote.find(a => a.id === id) ?? null
}

// Wohin eine Abschluss-Bestätigung in der Dokumentenablage einsortiert wird.
export const ablageFuerKategorie: Record<string, { themaId: string; unterordner: string }> = {
  strom: { themaId: 'wohnen', unterordner: 'Strom & Internet' },
  internet: { themaId: 'wohnen', unterordner: 'Strom & Internet' },
  haftpflicht: { themaId: 'versicherungen', unterordner: 'Policen' },
  hausrat: { themaId: 'versicherungen', unterordner: 'Policen' },
  kfz: { themaId: 'versicherungen', unterordner: 'Policen' },
  girokonto: { themaId: 'finanzen', unterordner: 'Verträge' },
  depot: { themaId: 'finanzen', unterordner: 'Verträge' },
  handy: { themaId: 'finanzen', unterordner: 'Verträge' },
}
