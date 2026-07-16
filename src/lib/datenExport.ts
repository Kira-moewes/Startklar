import { alleStores } from './stores'

// Export/Import/Löschen aller lokalen Daten (Datenhoheit).
// Format: { version, exportiertAm, stores: { <storeName>: { <key>: <wert> } } }

export type ExportDatei = {
  version: 1
  exportiertAm: string
  stores: Record<string, Record<string, unknown>>
}

export async function exportiereAlles(): Promise<void> {
  const daten: ExportDatei = { version: 1, exportiertAm: new Date().toISOString(), stores: {} }
  for (const [name, store] of Object.entries(alleStores)) {
    const inhalt: Record<string, unknown> = {}
    await store.iterate((wert, key) => { inhalt[key] = wert })
    daten.stores[name] = inhalt
  }
  const blob = new Blob([JSON.stringify(daten, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `startklar-backup-${daten.exportiertAm.slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export type ImportZusammenfassung = { stores: number; eintraege: number }

// Liest und validiert eine Sicherungsdatei, ohne etwas zu schreiben –
// Grundlage für die Import-Vorschau.
export async function liesSicherung(file: File): Promise<ExportDatei> {
  const text = await file.text()
  let daten: ExportDatei
  try {
    daten = JSON.parse(text)
  } catch {
    throw new Error('Die Datei ist kein gültiges JSON.')
  }
  if (daten?.version !== 1 || typeof daten.stores !== 'object' || daten.stores === null) {
    throw new Error('Das ist keine Startklar-Sicherung (Format nicht erkannt).')
  }
  return daten
}

// Menschenlesbare Zusammenfassung: was steckt in der Sicherung?
export function beschreibeSicherung(daten: ExportDatei): string[] {
  const anzahl = (store: string) => Object.keys(daten.stores[store] ?? {}).length
  const teile: string[] = []
  if (anzahl('profil') > 0) teile.push('Profil vorhanden')
  const erledigt = Object.values(daten.stores['progress'] ?? {}).filter(Boolean).length
  if (erledigt > 0) teile.push(`${erledigt} erledigte ${erledigt === 1 ? 'Schritt' : 'Schritte'}`)
  const termine = anzahl('termine')
  if (termine > 0) teile.push(`${termine} Termin${termine === 1 ? '' : 'e'}`)
  const vergleiche = anzahl('vergleich')
  if (vergleiche > 0) teile.push(`${vergleiche} Vergleich${vergleiche === 1 ? '' : 'e'}`)
  const checks = anzahl('bedarf')
  if (checks > 0) teile.push(`${checks} Bedarfscheck${checks === 1 ? '' : 's'}`)
  const unterlagen = anzahl('dokumente')
  if (unterlagen > 0) teile.push(`${unterlagen} ${unterlagen === 1 ? 'Unterlage' : 'Unterlagen'}`)
  const chat = anzahl('agent-chat')
  if (chat > 0) teile.push('Klaro-Chatverlauf')
  // Guthaben liegt als EIN Objekt unter dem Key 'guthaben' – Anzahl der Keys
  // wäre immer 1, deshalb das verschachtelte Objekt auslesen.
  const g = daten.stores['guthaben']?.['guthaben'] as
    | { sterne?: number; freigeschaltet?: string[] }
    | undefined
  if (g && ((g.sterne ?? 0) > 0 || (g.freigeschaltet?.length ?? 0) > 0)) {
    teile.push(`${g.sterne ?? 0} Sterne`)
  }
  if (anzahl('einstellungen') > 0) teile.push('Einstellungen')
  if (teile.length === 0) teile.push('Die Sicherung ist leer.')
  return teile
}

// Ersetzt den kompletten lokalen Zustand durch die Sicherung (kein Merge –
// vorhersagbar). Danach ist ein Reload nötig, damit alle Hooks neu laden.
export async function importiereAlles(daten: ExportDatei): Promise<ImportZusammenfassung> {
  let eintraege = 0
  let stores = 0
  for (const [name, store] of Object.entries(alleStores)) {
    await store.clear()
    const inhalt = daten.stores[name]
    if (!inhalt) continue
    stores += 1
    for (const [key, wert] of Object.entries(inhalt)) {
      await store.setItem(key, wert)
      eintraege += 1
    }
  }
  return { stores, eintraege }
}

export async function loescheAlles(): Promise<void> {
  for (const store of Object.values(alleStores)) {
    await store.clear()
  }
  try { localStorage.removeItem('startklar-anzeige') } catch { /* egal */ }
}
