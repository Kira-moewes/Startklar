import { normalisiere } from '../lib/retrieval'

// Kuratierter Anbieter-Katalog mit unverbindlichen RICHTWERTEN als Starthilfe.
// Alle Werte sind grobe Orientierungsspannen für eine junge Einzelperson,
// KEINE Angebote und KEINE geprüften Fakten (geprueft: null). Sie werden im
// UI als Richtwert markiert (≈, gestrichelt) und bleiben voll editierbar.
// Reihenfolge alphabetisch – kein Anbieter wird hervorgehoben, keine Provision.
// TODO(redaktion): Werte und `stand` regelmäßig prüfen, dann `geprueft` setzen.

export type AnbieterRichtwerte = {
  name: string
  aliasse?: string[]
  werte: Record<string, string>   // kriteriumKey → Richtwert-Text
  stand: string                   // 'YYYY-MM' – Monat der Erhebung
  geprueft: string | null         // Datum redaktioneller Prüfung; null = ungeprüft
}

const STAND = '2026-07'
const u = (werte: Record<string, string>, name: string, aliasse?: string[]): AnbieterRichtwerte =>
  ({ name, aliasse, werte, stand: STAND, geprueft: null })

// kategorieId → Anbieterliste (alphabetisch). Erstbestand: haftpflicht, hausrat, kfz.
export const anbieterKatalog: Record<string, AnbieterRichtwerte[]> = {
  haftpflicht: [
    u({ beitrag: '55–75 €', deckung: '50 Mio. €', selbstbeteiligung: '0 €', ausfalldeckung: 'ja' }, 'Allianz'),
    u({ beitrag: '45–65 €', deckung: '10 Mio. €', selbstbeteiligung: '0 €', ausfalldeckung: 'gegen Aufpreis' }, 'ARAG'),
    u({ beitrag: '50–70 €', deckung: '30 Mio. €', selbstbeteiligung: '0 €', ausfalldeckung: 'ja' }, 'AXA'),
    u({ beitrag: '45–65 €', deckung: '20 Mio. €', selbstbeteiligung: '0 €', ausfalldeckung: 'gegen Aufpreis' }, 'CosmosDirekt', ['cosmos']),
    u({ beitrag: '45–65 €', deckung: '15 Mio. €', selbstbeteiligung: '0 €', ausfalldeckung: 'ja' }, 'Die Bayerische', ['bayerische']),
    u({ beitrag: '50–70 €', deckung: '50 Mio. €', selbstbeteiligung: '0 €', ausfalldeckung: 'ja' }, 'ERGO'),
    u({ beitrag: '35–55 €', deckung: '10 Mio. €', selbstbeteiligung: '0 €', ausfalldeckung: 'gegen Aufpreis' }, 'Getsafe'),
    u({ beitrag: '30–50 €', deckung: '50 Mio. €', selbstbeteiligung: '0 €', ausfalldeckung: 'ja' }, 'HUK-COBURG', ['huk coburg', 'huk']),
    u({ beitrag: '30–45 €', deckung: '50 Mio. €', selbstbeteiligung: '0 €', ausfalldeckung: 'ja' }, 'HUK24', ['huk 24', 'huk']),
    u({ beitrag: '40–60 €', deckung: '50 Mio. €', selbstbeteiligung: '0 €', ausfalldeckung: 'ja' }, 'VHV'),
  ],
  hausrat: [
    u({ beitrag: '70–110 €', summe: '650 €/m²', selbstbeteiligung: '0–150 €', fahrrad: 'gegen Aufpreis' }, 'Allianz'),
    u({ beitrag: '65–100 €', summe: '650 €/m²', selbstbeteiligung: '0–150 €', fahrrad: 'gegen Aufpreis' }, 'AXA'),
    u({ beitrag: '55–90 €', summe: '650 €/m²', selbstbeteiligung: '0 €', fahrrad: 'gegen Aufpreis' }, 'CosmosDirekt', ['cosmos']),
    u({ beitrag: '55–90 €', summe: '650 €/m²', selbstbeteiligung: '0 €', fahrrad: 'gegen Aufpreis' }, 'Die Bayerische', ['bayerische']),
    u({ beitrag: '65–100 €', summe: '650 €/m²', selbstbeteiligung: '0–150 €', fahrrad: 'gegen Aufpreis' }, 'ERGO'),
    u({ beitrag: '50–85 €', summe: '650 €/m²', selbstbeteiligung: '0 €', fahrrad: 'bis 1 % der Summe' }, 'Getsafe'),
    u({ beitrag: '60–95 €', summe: '650 €/m²', selbstbeteiligung: '0–150 €', fahrrad: 'gegen Aufpreis' }, 'Gothaer'),
    u({ beitrag: '45–80 €', summe: '650 €/m²', selbstbeteiligung: '0 €', fahrrad: 'gegen Aufpreis' }, 'HUK-COBURG', ['huk coburg', 'huk']),
    u({ beitrag: '45–75 €', summe: '650 €/m²', selbstbeteiligung: '0 €', fahrrad: 'gegen Aufpreis' }, 'HUK24', ['huk 24', 'huk']),
    u({ beitrag: '55–90 €', summe: '650 €/m²', selbstbeteiligung: '0–150 €', fahrrad: 'gegen Aufpreis' }, 'VHV'),
  ],
  // Kfz bewusst OHNE beitrag – der ist zu individuell (Alter, Region, SF-Klasse).
  kfz: [
    u({ schutz: 'Haftpflicht / Teilkasko / Vollkasko', selbstbeteiligung: 'TK 150 € / VK 300 €', 'sf-klasse': 'Übernahme/Zweitwagen möglich' }, 'Allianz'),
    u({ schutz: 'Haftpflicht / Teilkasko / Vollkasko', selbstbeteiligung: 'TK 150 € / VK 300 €', 'sf-klasse': 'Übernahme/Zweitwagen möglich' }, 'AXA'),
    u({ schutz: 'Haftpflicht / Teilkasko / Vollkasko', selbstbeteiligung: 'TK 150 € / VK 300 €', 'sf-klasse': 'Übernahme/Zweitwagen möglich' }, 'CosmosDirekt', ['cosmos']),
    u({ schutz: 'Haftpflicht / Teilkasko / Vollkasko', selbstbeteiligung: 'TK 150 € / VK 300 €', 'sf-klasse': 'Übernahme/Zweitwagen möglich' }, 'DEVK'),
    u({ schutz: 'Haftpflicht / Teilkasko / Vollkasko', selbstbeteiligung: 'TK 150 € / VK 300 €', 'sf-klasse': 'Übernahme/Zweitwagen möglich' }, 'HUK-COBURG', ['huk coburg', 'huk']),
    u({ schutz: 'Haftpflicht / Teilkasko / Vollkasko', selbstbeteiligung: 'TK 150 € / VK 300 €', 'sf-klasse': 'Übernahme/Zweitwagen möglich' }, 'HUK24', ['huk 24', 'huk']),
    u({ schutz: 'Haftpflicht / Teilkasko / Vollkasko', selbstbeteiligung: 'TK 150 € / VK 300 €', 'sf-klasse': 'Übernahme/Zweitwagen möglich' }, 'LVM'),
    u({ schutz: 'Haftpflicht / Teilkasko / Vollkasko', selbstbeteiligung: 'TK 150 € / VK 300 €', 'sf-klasse': 'Übernahme/Zweitwagen möglich' }, 'R+V', ['r v', 'ruv']),
    u({ schutz: 'Haftpflicht / Teilkasko / Vollkasko', selbstbeteiligung: 'TK 150 € / VK 300 €', 'sf-klasse': 'Übernahme/Zweitwagen möglich' }, 'Verti'),
    u({ schutz: 'Haftpflicht / Teilkasko / Vollkasko', selbstbeteiligung: 'TK 150 € / VK 300 €', 'sf-klasse': 'Übernahme/Zweitwagen möglich' }, 'VHV'),
  ],
}

// Gibt es für diese Kategorie überhaupt Katalog-Einträge?
export function hatKatalog(kategorieId: string): boolean {
  return (anbieterKatalog[kategorieId]?.length ?? 0) > 0
}

// Autocomplete: Präfix-/Substring-Suche über name + aliasse (normalisiert).
// Präfix-Treffer werden vor reinen Substring-Treffern gelistet. Max. 6.
export function findeAnbieter(kategorieId: string, eingabe: string): AnbieterRichtwerte[] {
  const q = normalisiere(eingabe.trim())
  if (q.length < 2) return []
  const liste = anbieterKatalog[kategorieId] ?? []
  const treffer = liste
    .map(a => {
      const namen = [a.name, ...(a.aliasse ?? [])].map(normalisiere)
      const praefix = namen.some(n => n.startsWith(q))
      const enthalten = namen.some(n => n.includes(q))
      return { a, rang: praefix ? 0 : enthalten ? 1 : 2 }
    })
    .filter(t => t.rang < 2)
    .sort((x, y) => x.rang - y.rang)
    .map(t => t.a)
  return treffer.slice(0, 6)
}
