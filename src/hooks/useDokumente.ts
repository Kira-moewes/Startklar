import { useCallback, useEffect, useState } from 'react'
import { dokumenteStore } from '../lib/stores'
import {
  MAX_DATEI_BYTES, MAX_DATEIEN_PRO_BEZUG, groesseLabel, typErlaubt, type Dokument,
} from '../data/dokumente'

function alsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden.'))
    reader.readAsDataURL(file)
  })
}

// Dokumente zu einem Bezugs-Schlüssel (task:… / vergleich:…), Muster wie useVergleich.
export function useDokumente(bezugKey: string) {
  const [dokumente, setDokumente] = useState<Dokument[]>([])
  const [fehler, setFehler] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    void dokumenteStore.getItem<Dokument[]>(bezugKey).then(list => {
      if (active) {
        setDokumente(list ?? [])
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [bezugKey])

  const hinzufuegen = useCallback(async (file: File) => {
    setFehler(null)
    if (!typErlaubt(file.type)) {
      setFehler('Nur PDF oder Bilder (z. B. ein Foto der Unterlage) sind möglich.')
      return
    }
    if (file.size > MAX_DATEI_BYTES) {
      setFehler(`Die Datei ist zu groß (${groesseLabel(file.size)}) – maximal ${groesseLabel(MAX_DATEI_BYTES)} pro Datei.`)
      return
    }
    const aktuelle = (await dokumenteStore.getItem<Dokument[]>(bezugKey)) ?? []
    if (aktuelle.length >= MAX_DATEIEN_PRO_BEZUG) {
      setFehler(`Maximal ${MAX_DATEIEN_PRO_BEZUG} Dateien pro Stelle – lösche erst eine alte.`)
      return
    }
    try {
      const datenUrl = await alsDataUrl(file)
      const neu: Dokument = {
        id: crypto.randomUUID(),
        name: file.name,
        typ: file.type,
        groesse: file.size,
        datenUrl,
        angelegtAm: new Date().toISOString(),
      }
      const next = [...aktuelle, neu]
      await dokumenteStore.setItem(bezugKey, next)
      setDokumente(next)
    } catch {
      // z. B. Speicherplatz voll (QuotaExceeded) oder Lesefehler – nicht still verschlucken.
      setFehler('Die Datei konnte nicht gespeichert werden – womöglich ist der Speicher deines Geräts voll. Versuch es mit einer kleineren Datei oder lösche zuerst alte Unterlagen.')
    }
  }, [bezugKey])

  const entfernen = useCallback(async (id: string) => {
    const next = dokumente.filter(d => d.id !== id)
    if (next.length === 0) {
      await dokumenteStore.removeItem(bezugKey)
    } else {
      await dokumenteStore.setItem(bezugKey, next)
    }
    setDokumente(next)
  }, [bezugKey, dokumente])

  return { dokumente, hinzufuegen, entfernen, fehler, setFehler, loading }
}

// Öffnet ein gespeichertes Dokument in einem neuen Tab (Base64 → Blob-URL,
// damit auch große PDFs zuverlässig öffnen).
export function oeffneDokument(d: Dokument): void {
  const base64 = d.datenUrl.split(',')[1] ?? ''
  const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
  const blob = new Blob([bytes], { type: d.typ })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank', 'noopener')
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
