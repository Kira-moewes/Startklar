import { useCallback, useEffect, useState } from 'react'
import localforage from 'localforage'

export type DokumentQuelle = 'upload' | 'abschluss' | 'institution'

export type Dokument = {
  id: string
  titel: string
  themaId: string
  unterordner: string
  quelle: DokumentQuelle
  mimeType: string
  datum: string // ISO yyyy-mm-dd (Eingangsdatum)
  dateiName: string
  blob: Blob
}

const store = localforage.createInstance({ name: 'startklar', storeName: 'dokumente' })
const KEY = 'liste'

export function useDokumente() {
  const [dokumente, setDokumente] = useState<Dokument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void store.getItem<Dokument[]>(KEY).then(list => {
      setDokumente(list ?? [])
      setLoading(false)
    })
  }, [])

  const add = useCallback((d: Omit<Dokument, 'id' | 'datum'>) => {
    const neu: Dokument = { ...d, id: crypto.randomUUID(), datum: new Date().toISOString().slice(0, 10) }
    setDokumente(prev => {
      const next = [...prev, neu]
      void store.setItem(KEY, next)
      return next
    })
    return neu
  }, [])

  const verschieben = useCallback((id: string, themaId: string, unterordner: string) => {
    setDokumente(prev => {
      const next = prev.map(d => (d.id === id ? { ...d, themaId, unterordner } : d))
      void store.setItem(KEY, next)
      return next
    })
  }, [])

  const remove = useCallback((id: string) => {
    setDokumente(prev => {
      const next = prev.filter(d => d.id !== id)
      void store.setItem(KEY, next)
      return next
    })
  }, [])

  return { dokumente, add, verschieben, remove, loading }
}

// Wird auch außerhalb von React gebraucht (Checkout legt die
// Abschluss-Bestätigung direkt ab).
export async function dokumentAblegen(d: Omit<Dokument, 'id' | 'datum'>): Promise<Dokument> {
  const neu: Dokument = { ...d, id: crypto.randomUUID(), datum: new Date().toISOString().slice(0, 10) }
  const list = (await store.getItem<Dokument[]>(KEY)) ?? []
  await store.setItem(KEY, [...list, neu])
  return neu
}

// Öffnet/lädt ein Dokument über eine temporäre Objekt-URL herunter.
export function dokumentHerunterladen(d: Dokument) {
  const url = URL.createObjectURL(d.blob)
  const a = document.createElement('a')
  a.href = url
  a.download = d.dateiName || d.titel
  a.click()
  URL.revokeObjectURL(url)
}
