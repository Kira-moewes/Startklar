// Lokale Dokumenten-Ablage: Unterlagen (PDF/Bild) werden als Base64-Data-URL
// gespeichert. Bewusst KEINE Blobs im Store – der JSON-Datenexport
// (src/lib/datenExport.ts) kann nur serialisierbare Werte sichern; Strings
// überstehen den Export/Import-Roundtrip verlustfrei.

export type Dokument = {
  id: string
  name: string          // Dateiname
  typ: string           // MIME-Type, z. B. 'application/pdf'
  groesse: number       // Bytes (Originaldatei)
  datenUrl: string      // 'data:<typ>;base64,…'
  angelegtAm: string    // ISO-Timestamp
}

// Bezugs-Schlüssel: an welcher Stelle der App hängt das Dokument?
export function dokumentKeyTask(journeyId: string, taskId: string): string {
  return `task:${journeyId}:${taskId}`
}
export function dokumentKeyVergleich(kategorieId: string): string {
  return `vergleich:${kategorieId}`
}

export const MAX_DATEI_BYTES = 4 * 1024 * 1024   // 4 MB pro Datei
export const MAX_DATEIEN_PRO_BEZUG = 10

// PDF und alle Bildformate (Foto der Unterlage reicht oft).
export function typErlaubt(mime: string): boolean {
  return mime === 'application/pdf' || mime.startsWith('image/')
}

export function groesseLabel(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`
}
