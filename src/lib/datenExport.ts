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

// Ersetzt den kompletten lokalen Zustand durch die Datei (kein Merge –
// vorhersagbar). Danach ist ein Reload nötig, damit alle Hooks neu laden.
export async function importiereAlles(file: File): Promise<ImportZusammenfassung> {
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
