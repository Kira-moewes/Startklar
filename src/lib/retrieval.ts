import type { WissensEintrag } from '../data/agent/types'
import { synonyme } from '../data/agent/synonyme'

// Gemeinsames Such-/Scoring-Modul für die Suche (/suche) und Klaro.

export function normalisiere(s: string): string {
  return s.toLowerCase().replaceAll('ä', 'ae').replaceAll('ö', 'oe').replaceAll('ü', 'ue').replaceAll('ß', 'ss')
}

const STOPP = new Set([
  'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'einer',
  'und', 'oder', 'aber', 'auch', 'noch', 'schon', 'jetzt', 'dann', 'wenn', 'weil',
  'ich', 'du', 'wir', 'mir', 'mich', 'dir', 'dich', 'es', 'man', 'mein', 'meine', 'meinen',
  'wie', 'was', 'wo', 'wer', 'wann', 'warum', 'wieso', 'welche', 'welcher',
  'ist', 'sind', 'war', 'hat', 'habe', 'hab', 'haben', 'kann', 'muss', 'soll', 'will', 'moechte',
  'fuer', 'mit', 'von', 'bei', 'nach', 'vor', 'auf', 'aus', 'zu', 'zum', 'zur', 'im', 'in', 'an', 'am', 'um',
  'nicht', 'kein', 'keine', 'bitte', 'mal', 'denn', 'doch', 'so', 'da', 'hier', 'brauche', 'geht',
])

export function tokenisiere(s: string): string[] {
  const roh = normalisiere(s).split(/[^a-z0-9]+/).filter(t => t.length >= 2 && !STOPP.has(t))
  const tokens = new Set<string>(roh)
  for (const t of roh) {
    for (const ziel of synonyme[t] ?? []) tokens.add(ziel)
  }
  return [...tokens]
}

export type Treffer = { eintrag: WissensEintrag; punkte: number }

export function score(tokens: string[], eintrag: WissensEintrag): number {
  let punkte = 0
  for (const t of tokens) {
    if (eintrag.normTitel.includes(t)) punkte += 3
    else if (eintrag.normText.includes(t)) punkte += 1
    else if (t.length >= 5) {
      // Präfix-Treffer zählen halb („kaut" findet „kaution")
      const praefix = t.slice(0, 4)
      if (eintrag.normTitel.includes(praefix)) punkte += 1.5
      else if (eintrag.normText.includes(praefix)) punkte += 0.5
    }
  }
  return punkte
}

export function suche(query: string, eintraege: WissensEintrag[], limit = 5): Treffer[] {
  const tokens = tokenisiere(query)
  if (tokens.length === 0) return []
  return eintraege
    .map(eintrag => ({ eintrag, punkte: score(tokens, eintrag) }))
    .filter(t => t.punkte > 0)
    .sort((a, b) => b.punkte - a.punkte)
    .slice(0, limit)
}
