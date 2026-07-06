// Kuratierte Anbieter-Angebote für den Vergleich (KONZEPT.md §4,
// KONZEPT-PROVISIONEN.md §2–§5). Slot-Modell: Pro Kategorie max. 2
// Partner-Angebote (höchste Provision nach redaktionellem Mindest-Check,
// gekennzeichnet als „Anzeige · Partner-Link") + mindestens eine
// provisionsfreie Empfehlung. Redaktionelle Richtwerte Stand 07/2026.
//
// Affiliate-Deeplinks: Bis die Programme freigeschaltet sind, bleibt
// `affiliateUrl` leer und der Button nutzt die normale Anbieter-URL.
// Nach Freischaltung eintragen – Suchmarker: PROGRAMM-NOCH-NICHT-FREIGESCHALTET

export type PartnerNetzwerk = 'awin' | 'financeads' | 'tarifcheck' | 'direkt'

export type AnbieterAngebot = {
  id: string
  kategorieId: string
  anbieter: string
  logoEmoji: string
  preisAb: string
  kurzFeatures: [string, string, string]
  zielgruppe?: string
  werte: Record<string, string>
  // 'app' = In-App-Checkout (derzeit unbelegt, für künftige API-Partner),
  // 'partnerlink' = vergüteter externer Link, 'extern' = unvergüteter Link.
  abschluss: 'app' | 'extern' | 'partnerlink'
  url: string
  standDaten: string
  monetarisierung: 'partner' | 'provisionsfrei'
  partnerNetzwerk?: PartnerNetzwerk
  provisionCa?: string // nur intern / Transparenzseite, nie am Angebot selbst
  affiliateUrl?: string // Deeplink inkl. {SUBID}-Platzhalter
  ab18?: boolean // Partner-Button bei volljaehrig === 'nein' ausblenden
  bonusFuerNutzer?: number // Neukundenbonus in €, für den Boni-Zähler
  qualitaetsCheck?: string // Datum des redaktionellen Mindest-Checks
}

export const PROVISIONSHINWEIS =
  'Kostenlos für dich – Startklar erhält bei Abschluss eine Provision vom Anbieter.'

// SubID identifiziert nur die Kategorie (aggregierte Auswertung im
// Netzwerk-Dashboard), keine Nutzerdaten.
export function partnerUrl(a: AnbieterAngebot, kategorieId: string): string {
  const basis = a.affiliateUrl ?? a.url
  return basis.replaceAll('{SUBID}', `startklar-${kategorieId}`)
}

export const anbieterAngebote: AnbieterAngebot[] = [
  // --- Strom ---
  {
    id: 'strom-verivox',
    kategorieId: 'strom',
    anbieter: 'Verivox Stromvergleich',
    logoEmoji: '🔍',
    preisAb: 'Vergleich kostenlos',
    kurzFeatures: ['Hunderte Tarife an deiner Adresse', 'Wechselservice inklusive', 'Bonus-Tarife filterbar'],
    zielgruppe: 'Gut, wenn du den ganzen Markt sehen willst.',
    werte: { grundpreis: 'tarifabhängig', arbeitspreis: 'tarifabhängig', laufzeit: 'filterbar', kuendigungsfrist: 'filterbar', oekostrom: 'filterbar' },
    abschluss: 'partnerlink',
    url: 'https://www.verivox.de/strom/',
    // PROGRAMM-NOCH-NICHT-FREIGESCHALTET (Awin): affiliateUrl eintragen
    standDaten: '2026-07',
    monetarisierung: 'partner',
    partnerNetzwerk: 'awin',
    provisionCa: '~20 € pro Wechsel',
    qualitaetsCheck: '2026-07',
  },
  {
    id: 'strom-tibber',
    kategorieId: 'strom',
    anbieter: 'Tibber',
    logoEmoji: '⚡',
    preisAb: '5,99 € / Monat + Börsenpreis',
    kurzFeatures: ['Dynamischer Tarif zum Einkaufspreis', 'Sehr gute App mit Live-Verbrauch', 'Monatlich kündbar'],
    zielgruppe: 'Gut, wenn du alles per App steuern willst.',
    werte: { grundpreis: '5,99 €', arbeitspreis: 'Börsenpreis + Netz', laufzeit: 'keine', kuendigungsfrist: 'monatlich', oekostrom: 'Ja' },
    abschluss: 'extern',
    url: 'https://tibber.com/de',
    standDaten: '2026-07',
    monetarisierung: 'provisionsfrei',
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
    abschluss: 'extern',
    url: 'https://www.ostrom.de',
    standDaten: '2026-07',
    monetarisierung: 'provisionsfrei',
  },
  // --- Internet ---
  {
    id: 'internet-verivox',
    kategorieId: 'internet',
    anbieter: 'Verivox DSL-Vergleich',
    logoEmoji: '🔍',
    preisAb: 'Vergleich kostenlos',
    kurzFeatures: ['Verfügbarkeits-Check an deiner Adresse', 'DSL, Kabel und Glasfaser', 'Preis nach Rabattphase sichtbar'],
    werte: { preis: 'tarifabhängig', geschwindigkeit: 'filterbar', laufzeit: 'filterbar', einmalkosten: 'tarifabhängig' },
    abschluss: 'partnerlink',
    url: 'https://www.verivox.de/internet/',
    // PROGRAMM-NOCH-NICHT-FREIGESCHALTET (Awin): affiliateUrl eintragen
    standDaten: '2026-07',
    monetarisierung: 'partner',
    partnerNetzwerk: 'awin',
    provisionCa: '~30–55 € pro Abschluss',
    qualitaetsCheck: '2026-07',
  },
  {
    id: 'internet-congstar',
    kategorieId: 'internet',
    anbieter: 'congstar Zuhause',
    logoEmoji: '📶',
    preisAb: 'ca. 36 € / Monat',
    kurzFeatures: ['Flexible Laufzeiten', 'Telekom-Netz', 'Auch als Glasfaser-Tarif'],
    zielgruppe: 'Gut für Azubis/Studis: flexibel statt 24 Monate.',
    werte: { preis: 'ca. 36 €', geschwindigkeit: '50–100 Mbit/s', laufzeit: 'flexibel', einmalkosten: 'je nach Aktion' },
    abschluss: 'extern',
    url: 'https://www.congstar.de',
    standDaten: '2026-07',
    monetarisierung: 'provisionsfrei',
  },
  // --- Haftpflicht (Versicherung: nur Tippgeber-Link, § 34d GewO) ---
  {
    id: 'haftpflicht-tarifcheck',
    kategorieId: 'haftpflicht',
    anbieter: 'Tarifcheck Haftpflicht-Vergleich',
    logoEmoji: '🔍',
    preisAb: 'Vergleich kostenlos',
    kurzFeatures: ['Viele Versicherer im Vergleich', 'Deckungssumme filterbar', 'Abschluss direkt beim Portal'],
    zielgruppe: 'Gut, um Preise breit zu vergleichen.',
    werte: { beitrag: 'tarifabhängig', deckung: 'filterbar', selbstbeteiligung: 'filterbar', ausfalldeckung: 'filterbar' },
    abschluss: 'partnerlink',
    url: 'https://www.tarifcheck.de/haftpflichtversicherung/',
    // PROGRAMM-NOCH-NICHT-FREIGESCHALTET (Tarifcheck): affiliateUrl eintragen
    standDaten: '2026-07',
    monetarisierung: 'partner',
    partnerNetzwerk: 'tarifcheck',
    provisionCa: 'bis ~100 € pro Abschluss',
    ab18: true,
    qualitaetsCheck: '2026-07',
  },
  {
    id: 'haftpflicht-huk24',
    kategorieId: 'haftpflicht',
    anbieter: 'HUK24',
    logoEmoji: '🛡️',
    preisAb: 'ab ca. 3 € / Monat',
    kurzFeatures: ['Stiftung Warentest „sehr gut"', 'Sehr günstiger Direktversicherer', 'Kombi mit Hausrat möglich'],
    zielgruppe: 'Solide Standardwahl ohne Schnickschnack.',
    werte: { beitrag: 'ab ca. 34 €', deckung: '50 Mio. €', selbstbeteiligung: '0 €', ausfalldeckung: 'Ja' },
    abschluss: 'extern',
    url: 'https://www.huk24.de',
    standDaten: '2026-07',
    monetarisierung: 'provisionsfrei',
  },
  // --- Hausrat ---
  {
    id: 'hausrat-tarifcheck',
    kategorieId: 'hausrat',
    anbieter: 'Tarifcheck Hausrat-Vergleich',
    logoEmoji: '🔍',
    preisAb: 'Vergleich kostenlos',
    kurzFeatures: ['Viele Versicherer im Vergleich', 'Quadratmeter-Pauschale einstellbar', 'Fahrrad-Baustein filterbar'],
    werte: { beitrag: 'tarifabhängig', summe: 'einstellbar', selbstbeteiligung: 'filterbar', fahrrad: 'filterbar' },
    abschluss: 'partnerlink',
    url: 'https://www.tarifcheck.de/hausratversicherung/',
    // PROGRAMM-NOCH-NICHT-FREIGESCHALTET (Tarifcheck): affiliateUrl eintragen
    standDaten: '2026-07',
    monetarisierung: 'partner',
    partnerNetzwerk: 'tarifcheck',
    provisionCa: '~20–55 € pro Abschluss',
    ab18: true,
    qualitaetsCheck: '2026-07',
  },
  {
    id: 'hausrat-huk24',
    kategorieId: 'hausrat',
    anbieter: 'HUK24',
    logoEmoji: '🏠',
    preisAb: 'ab ca. 26 € / Jahr',
    kurzFeatures: ['Sehr günstig für kleine Wohnungen', 'Kombi-Rabatt mit Haftpflicht', 'Direktversicherer'],
    werte: { beitrag: 'ab ca. 26 €', summe: 'qm-Pauschale', selbstbeteiligung: 'wählbar', fahrrad: 'gegen Aufpreis' },
    abschluss: 'extern',
    url: 'https://www.huk24.de',
    standDaten: '2026-07',
    monetarisierung: 'provisionsfrei',
  },
  // --- Girokonto ---
  {
    id: 'girokonto-c24',
    kategorieId: 'girokonto',
    anbieter: 'C24 Bank',
    logoEmoji: '🏦',
    preisAb: '0 € / Monat',
    kurzFeatures: ['Kostenloses Girokonto ohne Bedingungen', 'Zinsen aufs Guthaben', 'Multibanking in einer App'],
    zielgruppe: 'Vollwertiges Gratis-Konto mit App-Fokus.',
    werte: { gebuehr: '0 €', karte: 'Mastercard (virtuell inkl.)', bargeld: 'mehrmals/Monat kostenlos', bedingungen: 'keine' },
    abschluss: 'partnerlink',
    url: 'https://www.c24.de',
    // PROGRAMM-NOCH-NICHT-FREIGESCHALTET (financeAds): affiliateUrl eintragen
    standDaten: '2026-07',
    monetarisierung: 'partner',
    partnerNetzwerk: 'financeads',
    provisionCa: '~50 € pro Konto',
    ab18: true,
    qualitaetsCheck: '2026-07',
  },
  {
    id: 'girokonto-tarifcheck',
    kategorieId: 'girokonto',
    anbieter: 'Tarifcheck Girokonto-Vergleich',
    logoEmoji: '🔍',
    preisAb: 'Vergleich kostenlos',
    kurzFeatures: ['Viele Banken im Vergleich (ING, 1822 …)', 'Neukunden-Boni bis 200 € sichtbar', 'Gebühren und Bargeld-Optionen filterbar'],
    werte: { gebuehr: 'filterbar', karte: 'bankabhängig', bargeld: 'bankabhängig', bedingungen: 'bankabhängig' },
    abschluss: 'partnerlink',
    url: 'https://www.tarifcheck.de/girokonto/',
    // PROGRAMM-NOCH-NICHT-FREIGESCHALTET (Tarifcheck): affiliateUrl eintragen
    standDaten: '2026-07',
    monetarisierung: 'partner',
    partnerNetzwerk: 'tarifcheck',
    provisionCa: '~40 € pro Konto',
    ab18: true,
    bonusFuerNutzer: 200,
    qualitaetsCheck: '2026-07',
  },
  {
    id: 'girokonto-traderepublic',
    kategorieId: 'girokonto',
    anbieter: 'Trade Republic',
    logoEmoji: '💳',
    preisAb: '0 € / Monat',
    kurzFeatures: ['Ohne Bedingungen kostenlos', 'ca. 2,25 % Zinsen aufs Guthaben', 'Depot direkt integriert'],
    zielgruppe: 'Gut, wenn du Konto + Sparen in einer App willst.',
    werte: { gebuehr: '0 €', karte: 'Visa (digital, Karte optional)', bargeld: 'weltweit ab 100 €', bedingungen: 'keine' },
    abschluss: 'extern',
    url: 'https://traderepublic.com',
    standDaten: '2026-07',
    monetarisierung: 'provisionsfrei',
  },
  // --- Depot ---
  {
    id: 'depot-comdirect',
    kategorieId: 'depot',
    anbieter: 'comdirect',
    logoEmoji: '🏛️',
    preisAb: '3 Jahre kostenlos, dann Bedingungen',
    kurzFeatures: ['Etablierte Bank (Commerzbank-Marke)', 'Große ETF-Sparplan-Auswahl', 'Persönlicher Support'],
    zielgruppe: 'Gut, wenn du eine Vollbank hinter dem Depot willst.',
    werte: { orderkosten: 'ab 3,90 € (Aktionen)', sparplan: 'viele kostenlose Aktions-ETFs', zinsen: 'kontoabhängig', mindestrate: '25 €' },
    abschluss: 'partnerlink',
    url: 'https://www.comdirect.de/depot/',
    // PROGRAMM-NOCH-NICHT-FREIGESCHALTET (financeAds): affiliateUrl eintragen
    standDaten: '2026-07',
    monetarisierung: 'partner',
    partnerNetzwerk: 'financeads',
    provisionCa: '~140 € pro Depot',
    ab18: true,
    qualitaetsCheck: '2026-07',
  },
  {
    id: 'depot-consorsbank',
    kategorieId: 'depot',
    anbieter: 'Consorsbank',
    logoEmoji: '🏦',
    preisAb: 'Depot 0 €, Order ab ca. 5 €',
    kurzFeatures: ['Etablierte Direktbank (BNP Paribas)', 'Junge-Leute-Konditionen', 'Viele kostenlose Sparplan-ETFs'],
    werte: { orderkosten: 'ab ca. 5 €', sparplan: 'viele 0-€-Aktions-ETFs', zinsen: 'aktionsabhängig', mindestrate: '10 €' },
    abschluss: 'partnerlink',
    url: 'https://www.consorsbank.de',
    // PROGRAMM-NOCH-NICHT-FREIGESCHALTET (financeAds): affiliateUrl eintragen
    standDaten: '2026-07',
    monetarisierung: 'partner',
    partnerNetzwerk: 'financeads',
    provisionCa: '~80 € pro Depot',
    ab18: true,
    qualitaetsCheck: '2026-07',
  },
  {
    id: 'depot-fnzero',
    kategorieId: 'depot',
    anbieter: 'finanzen.net zero',
    logoEmoji: '0️⃣',
    preisAb: '0 € ab 500 € Ordervolumen',
    kurzFeatures: ['Orders ab 500 € kostenlos', 'ETF-Sparpläne kostenlos', 'Einfache App'],
    werte: { orderkosten: '0 € (ab 500 €), sonst 1 €', sparplan: '0 €', zinsen: 'keine', mindestrate: '25 €' },
    abschluss: 'extern',
    url: 'https://www.finanzen.net/zero',
    standDaten: '2026-07',
    monetarisierung: 'provisionsfrei',
  },
  {
    id: 'depot-traderepublic',
    kategorieId: 'depot',
    anbieter: 'Trade Republic',
    logoEmoji: '📊',
    preisAb: '1 € pro Order',
    kurzFeatures: ['ETF-Sparpläne kostenlos', 'Sparplan ab 1 €', 'ca. 2,25 % Zinsen aufs Guthaben'],
    zielgruppe: 'Der Klassiker für den ETF-Start.',
    werte: { orderkosten: '1 €', sparplan: '0 €', zinsen: 'ca. 2,25 %', mindestrate: '1 €' },
    abschluss: 'extern',
    url: 'https://traderepublic.com',
    standDaten: '2026-07',
    monetarisierung: 'provisionsfrei',
  },
  // --- Kfz ---
  {
    id: 'kfz-tarifcheck',
    kategorieId: 'kfz',
    anbieter: 'Tarifcheck Kfz-Vergleich',
    logoEmoji: '🔍',
    preisAb: 'Vergleich kostenlos',
    kurzFeatures: ['Viele Versicherer im Vergleich', 'SF-Klassen-Übernahme filterbar', 'Werkstattbindung wählbar'],
    zielgruppe: 'Gut, um als Fahranfänger:in Preise zu drücken.',
    werte: { beitrag: 'tarifabhängig', schutz: 'filterbar', selbstbeteiligung: 'filterbar', 'sf-klasse': 'filterbar' },
    abschluss: 'partnerlink',
    url: 'https://www.tarifcheck.de/kfz-versicherung/',
    // PROGRAMM-NOCH-NICHT-FREIGESCHALTET (Tarifcheck): affiliateUrl eintragen
    standDaten: '2026-07',
    monetarisierung: 'partner',
    partnerNetzwerk: 'tarifcheck',
    provisionCa: '~10–20 € pro Vergleich, mehr bei Abschluss',
    ab18: true,
    qualitaetsCheck: '2026-07',
  },
  {
    id: 'kfz-huk24',
    kategorieId: 'kfz',
    anbieter: 'HUK24',
    logoEmoji: '🚗',
    preisAb: 'individuell (Rechner)',
    kurzFeatures: ['Günstiger Direktversicherer', 'Werkstattbindung spart extra', 'Zweitwagen-Regelung der Eltern nutzbar'],
    werte: { beitrag: 'individuell', schutz: 'Haftpflicht/Teil-/Vollkasko', selbstbeteiligung: 'wählbar', 'sf-klasse': 'Übernahme möglich' },
    abschluss: 'extern',
    url: 'https://www.huk24.de',
    standDaten: '2026-07',
    monetarisierung: 'provisionsfrei',
  },
  // --- Handy ---
  {
    id: 'handy-tarifcheck',
    kategorieId: 'handy',
    anbieter: 'Tarifcheck Handytarif-Vergleich',
    logoEmoji: '🔍',
    preisAb: 'Vergleich kostenlos',
    kurzFeatures: ['Alle Netze im Vergleich', 'Laufzeit und Datenvolumen filterbar', 'Junge-Leute-Tarife markiert'],
    werte: { preis: 'tarifabhängig', daten: 'filterbar', netz: 'alle', laufzeit: 'filterbar' },
    abschluss: 'partnerlink',
    url: 'https://www.tarifcheck.de/handytarife/',
    // PROGRAMM-NOCH-NICHT-FREIGESCHALTET (Tarifcheck): affiliateUrl eintragen
    standDaten: '2026-07',
    monetarisierung: 'partner',
    partnerNetzwerk: 'tarifcheck',
    provisionCa: 'produktabhängig',
    qualitaetsCheck: '2026-07',
  },
  {
    id: 'handy-fraenk',
    kategorieId: 'handy',
    anbieter: 'fraenk',
    logoEmoji: '📱',
    preisAb: '10 € / Monat',
    kurzFeatures: ['30 GB im Telekom-Netz', 'Monatlich kündbar', 'Alles per App in 5 Minuten'],
    zielgruppe: 'Bester Start-Tarif: günstig, gutes Netz, flexibel.',
    werte: { preis: '10 €', daten: '30 GB', netz: 'Telekom', laufzeit: 'monatlich kündbar' },
    abschluss: 'extern',
    url: 'https://fraenk.de',
    standDaten: '2026-07',
    monetarisierung: 'provisionsfrei',
  },
  // --- Steuer-Software (neu) ---
  {
    id: 'steuer-taxfix',
    kategorieId: 'steuer',
    anbieter: 'Taxfix',
    logoEmoji: '🧾',
    preisAb: 'ca. 40 € pro Erklärung',
    kurzFeatures: ['Frage-Antwort-Modus fürs Handy', 'Lohnsteuerbescheinigung abfotografieren', 'Erstattungs-Schätzung vor dem Bezahlen'],
    zielgruppe: 'Gut für die allererste Steuererklärung.',
    werte: { preis: 'ca. 40 €', modus: 'geführtes Interview', foto: 'Ja', schaetzung: 'Ja, vorab' },
    abschluss: 'partnerlink',
    url: 'https://taxfix.de',
    // PROGRAMM-NOCH-NICHT-FREIGESCHALTET (Awin/direkt): affiliateUrl eintragen
    standDaten: '2026-07',
    monetarisierung: 'partner',
    partnerNetzwerk: 'awin',
    provisionCa: '~23 € pro Lead',
    qualitaetsCheck: '2026-07',
  },
  {
    id: 'steuer-wiso',
    kategorieId: 'steuer',
    anbieter: 'WISO Steuer',
    logoEmoji: '💻',
    preisAb: 'ca. 30–46 € pro Jahr',
    kurzFeatures: ['Testsieger-Software, sehr vollständig', 'Web, App und Desktop', 'Übernahme vom Vorjahr'],
    zielgruppe: 'Gut, wenn es etwas mehr sein darf (Nebenjob, Werbungskosten).',
    werte: { preis: 'ca. 30–46 €', modus: 'geführt + Expertenmodus', foto: 'Ja', schaetzung: 'Ja, live' },
    abschluss: 'partnerlink',
    url: 'https://www.buhl.de/wiso-steuer/',
    // PROGRAMM-NOCH-NICHT-FREIGESCHALTET (Awin): affiliateUrl eintragen
    standDaten: '2026-07',
    monetarisierung: 'partner',
    partnerNetzwerk: 'awin',
    provisionCa: '~15 € pro Abschluss',
    qualitaetsCheck: '2026-07',
  },
  {
    id: 'steuer-elster',
    kategorieId: 'steuer',
    anbieter: 'ELSTER',
    logoEmoji: '🏛️',
    preisAb: '0 € (staatlich)',
    kurzFeatures: ['Offizielles Portal der Finanzverwaltung', 'Komplett kostenlos', 'Vorausgefüllte Erklärung abrufbar'],
    zielgruppe: 'Kostenlos, aber ohne Händchenhalten – Amtsdeutsch inklusive.',
    werte: { preis: '0 €', modus: 'Formulare (wenig Führung)', foto: 'Nein', schaetzung: 'Nein' },
    abschluss: 'extern',
    url: 'https://www.elster.de',
    standDaten: '2026-07',
    monetarisierung: 'provisionsfrei',
  },
  // --- SCHUFA & Bonität (neu) ---
  {
    id: 'schufa-bonify',
    kategorieId: 'schufa',
    anbieter: 'bonify',
    logoEmoji: '📈',
    preisAb: '0 €',
    kurzFeatures: ['SCHUFA-Score kostenlos einsehen', 'Digital und sofort', 'Von der SCHUFA lizenziert'],
    zielgruppe: 'Der schnelle, kostenlose Blick auf deine Bonität.',
    werte: { kosten: '0 €', umfang: 'Score + wichtigste Daten', aktualisierung: 'laufend', dauer: 'sofort' },
    abschluss: 'partnerlink',
    url: 'https://www.bonify.de',
    // PROGRAMM-NOCH-NICHT-FREIGESCHALTET (financeAds): affiliateUrl eintragen
    standDaten: '2026-07',
    monetarisierung: 'partner',
    partnerNetzwerk: 'financeads',
    provisionCa: '~5 € pro Registrierung',
    qualitaetsCheck: '2026-07',
  },
  {
    id: 'schufa-datenkopie',
    kategorieId: 'schufa',
    anbieter: 'SCHUFA-Datenkopie (Art. 15 DSGVO)',
    logoEmoji: '📄',
    preisAb: '0 € (gesetzlicher Anspruch)',
    kurzFeatures: ['Vollständige Kopie aller Daten', 'Kostenlos per Gesetz', 'Kommt per Post (1–2 Wochen)'],
    zielgruppe: 'Die gründlichste Variante – gut vor Wohnungssuche.',
    werte: { kosten: '0 €', umfang: 'alle gespeicherten Daten', aktualisierung: 'einmalige Kopie', dauer: 'ca. 1–2 Wochen' },
    abschluss: 'extern',
    url: 'https://www.schufa.de/datenkopie/',
    standDaten: '2026-07',
    monetarisierung: 'provisionsfrei',
  },
  // --- Altersvorsorge (neu, Info-lastig; Versicherung → nur Tippgeber-Link) ---
  {
    id: 'altersvorsorge-verivox',
    kategorieId: 'altersvorsorge',
    anbieter: 'Verivox Renten-Vergleich',
    logoEmoji: '🔍',
    preisAb: 'Vergleich kostenlos',
    kurzFeatures: ['Private Rentenversicherungen vergleichen', 'Beratung über das Portal möglich', 'Unverbindlich anfragen'],
    zielgruppe: 'Erst informieren (siehe Lernen), dann vergleichen.',
    werte: { kostenquote: 'tarifabhängig', flexibilitaet: 'tarifabhängig', foerderung: 'tarifabhängig' },
    abschluss: 'partnerlink',
    url: 'https://www.verivox.de/rentenversicherung/',
    // PROGRAMM-NOCH-NICHT-FREIGESCHALTET (Awin): affiliateUrl eintragen
    standDaten: '2026-07',
    monetarisierung: 'partner',
    partnerNetzwerk: 'awin',
    provisionCa: 'produktabhängig',
    ab18: true,
    qualitaetsCheck: '2026-07',
  },
  {
    id: 'altersvorsorge-drv',
    kategorieId: 'altersvorsorge',
    anbieter: 'Deutsche Rentenversicherung',
    logoEmoji: '🏛️',
    preisAb: '0 € (gesetzlich)',
    kurzFeatures: ['Kostenlose Renteninformation & Beratung', 'Neutraler Überblick über deine Ansprüche', 'Basis für jede weitere Entscheidung'],
    zielgruppe: 'Der richtige erste Schritt vor jedem Vertrag.',
    werte: { kostenquote: '0 €', flexibilitaet: '–', foerderung: 'gesetzliche Rente' },
    abschluss: 'extern',
    url: 'https://www.deutsche-rentenversicherung.de',
    standDaten: '2026-07',
    monetarisierung: 'provisionsfrei',
  },
]

export function angeboteFuerKategorie(kategorieId: string): AnbieterAngebot[] {
  // Partner-Slot zuerst (als Anzeige gekennzeichnet), dann provisionsfrei.
  return anbieterAngebote
    .filter(a => a.kategorieId === kategorieId)
    .sort((a, b) => Number(b.monetarisierung === 'partner') - Number(a.monetarisierung === 'partner'))
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
  altersvorsorge: { themaId: 'versicherungen', unterordner: 'Policen' },
  girokonto: { themaId: 'finanzen', unterordner: 'Verträge' },
  depot: { themaId: 'finanzen', unterordner: 'Verträge' },
  handy: { themaId: 'finanzen', unterordner: 'Verträge' },
  steuer: { themaId: 'finanzen', unterordner: 'Bescheide' },
  schufa: { themaId: 'finanzen', unterordner: 'Nachweise' },
}

// Kategorien, bei denen sich nach ~1 Jahr ein neuer Preis-Check lohnt
// (Jahres-Check-Erinnerung, KONZEPT-PROVISIONEN.md §5.7).
export const jahresCheckKategorien = ['strom', 'internet', 'kfz', 'handy']
