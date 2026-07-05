import { synonyme } from './synonyme'

// Kleinschreibung, Umlaute vereinheitlichen, Satzzeichen/Bindestriche zu
// Leerzeichen – so trifft „kfz versicherung" auch „KFZ-Versicherung".
export function normalisiere(s: string) {
  return s
    .toLowerCase()
    .replaceAll('ä', 'ae')
    .replaceAll('ö', 'oe')
    .replaceAll('ü', 'ue')
    .replaceAll('ß', 'ss')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function tokensAus(query: string) {
  return normalisiere(query).split(' ').filter(Boolean)
}

// Jeder Suchtoken muss vorkommen (UND-Logik); pro Token genügt auch ein
// Synonym-Treffer (z. B. „gez" findet „Rundfunkbeitrag").
export function passt(heuhaufen: string, tokens: string[]) {
  return tokens.every(token => {
    const varianten = [token, ...(synonyme[token] ?? [])]
    return varianten.some(v => heuhaufen.includes(v))
  })
}
