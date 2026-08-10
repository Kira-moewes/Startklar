import type { Angebot } from '../hooks/useVergleich'
import type { BedarfsErgebnis } from '../data/bedarf/types'
import { anbieterKatalog, type AnbieterRichtwerte } from '../data/anbieter'
import { normalisiere } from './retrieval'

// Alle Parser sind bewusst konservativ: Was nicht sicher lesbar ist, gibt null
// (bzw. 'unklar') zurück und zählt in der Bewertung weder positiv noch negativ.

// Deutsche Euro-Angabe → Zahl. Bei Spannen ('40–70 €') die Obergrenze.
// '1.200 €' → 1200, '0 €' → 0, '35' → 35. Nicht lesbar → null.
export function parseEuro(text: string): number | null {
  const treffer = text.match(/\d[\d.]*(?:,\d+)?/g)
  if (!treffer) return null
  const zahlen = treffer.map(t => Number(t.replaceAll('.', '').replace(',', '.'))).filter(n => !Number.isNaN(n))
  if (zahlen.length === 0) return null
  return Math.max(...zahlen)
}

// '50 Mio. €' → 50, '10 Millionen' → 10. Ohne Mio/Millionen-Bezug → null.
export function parseMillionen(text: string): number | null {
  const l = text.toLowerCase()
  if (!l.includes('mio') && !l.includes('million')) return null
  const m = l.match(/\d+(?:[.,]\d+)?/)
  if (!m) return null
  const n = Number(m[0].replace(',', '.'))
  return Number.isNaN(n) ? null : n
}

// 'ja'/'inkl.'/'enthalten' → true, 'nein'/'ohne' → false, sonst null.
export function enthaeltJa(text: string): boolean | null {
  const l = normalisiere(text)
  if (!l.trim()) return null
  if (/\b(nein|ohne|nicht|kein)\b/.test(l)) return false
  if (/\b(ja|inkl|inklusive|enthalten|eingeschlossen|dabei)\b/.test(l)) return true
  return null
}

export type AnbieterMatch = { eintrag: AnbieterRichtwerte; erfuellt: number; pruefbar: number }

// Welche Katalog-Anbieter erfüllen laut ihren RICHTWERTEN alle prüfbaren
// Zielwerte des Bedarfschecks? Reine Information, keine Empfehlung:
// Es werden nur Voll-Erfüller zurückgegeben, in Katalog-Reihenfolge
// (alphabetisch), ohne jede Reihung untereinander.
export function passendeAnbieter(kategorieId: string, ergebnis: BedarfsErgebnis): { treffer: AnbieterMatch[]; pruefbar: number } {
  const pruefbar = ergebnis.zielwerte.filter(z => z.pruefe && z.kriteriumKey)
  if (pruefbar.length === 0) return { treffer: [], pruefbar: 0 }
  const treffer = (anbieterKatalog[kategorieId] ?? [])
    .map(eintrag => ({
      eintrag,
      pruefbar: pruefbar.length,
      erfuellt: pruefbar.filter(z => z.pruefe!(eintrag.werte[z.kriteriumKey!] ?? '') === 'erfuellt').length,
    }))
    .filter(m => m.erfuellt === m.pruefbar)
  return { treffer, pruefbar: pruefbar.length }
}

export type BestMatch = { angebotId: string; erfuellt: number; pruefbar: number }

// Ermittelt das Angebot, das die prüfbaren Zielwerte am besten erfüllt.
// Nur ab 2 Angeboten und ≥1 prüfbarem Ziel; sonst / bei nicht auflösbarem
// Gleichstand → null (lieber keine Empfehlung als eine willkürliche).
export function besteWahl(angebote: Angebot[], ergebnis: BedarfsErgebnis): BestMatch | null {
  if (angebote.length < 2) return null
  const pruefbar = ergebnis.zielwerte.filter(z => z.pruefe && z.kriteriumKey)
  if (pruefbar.length === 0) return null

  const punkte = angebote.map(a => ({
    a,
    erfuellt: pruefbar.filter(z => z.pruefe!(a.werte[z.kriteriumKey!] ?? '') === 'erfuellt').length,
  }))
  const max = Math.max(...punkte.map(p => p.erfuellt))
  if (max === 0) return null

  const beste = punkte.filter(p => p.erfuellt === max)
  if (beste.length === 1) {
    return { angebotId: beste[0].a.id, erfuellt: max, pruefbar: pruefbar.length }
  }
  // Gleichstand → günstigerer Beitrag/Preis/Gebühr gewinnt.
  const mitKosten = beste
    .map(p => ({ id: p.a.id, kosten: parseEuro(p.a.werte.beitrag ?? p.a.werte.preis ?? p.a.werte.gebuehr ?? '') }))
    .filter((p): p is { id: string; kosten: number } => p.kosten !== null)
  if (mitKosten.length !== beste.length) return null
  const minKosten = Math.min(...mitKosten.map(p => p.kosten))
  const gewinner = mitKosten.filter(p => p.kosten === minKosten)
  if (gewinner.length !== 1) return null
  return { angebotId: gewinner[0].id, erfuellt: max, pruefbar: pruefbar.length }
}
