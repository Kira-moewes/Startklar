import { useCallback, useEffect, useState } from 'react'
import { vergleichStore } from '../lib/stores'

export type Angebot = {
  id: string
  anbieter: string
  werte: Record<string, string>
  favorit: boolean
  // Keys, deren Wert aus dem Anbieter-Katalog vorbefüllt wurde (Richtwert).
  // Wird beim manuellen Editieren der Zelle entfernt.
  richtwert?: Record<string, true>
  // Stand (MM/JJJJ bzw. YYYY-MM) des Katalog-Eintrags, aus dem vorbefüllt wurde.
  richtwertStand?: string
}

const store = vergleichStore

export function useVergleich(kategorieId: string) {
  const [angebote, setAngebote] = useState<Angebot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    void store.getItem<Angebot[]>(kategorieId).then(list => {
      if (active) {
        setAngebote(list ?? [])
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [kategorieId])

  const persist = useCallback((next: Angebot[]) => {
    setAngebote(next)
    void store.setItem(kategorieId, next)
  }, [kategorieId])

  const add = useCallback((anbieter: string) => {
    setAngebote(prev => {
      const next = [...prev, { id: crypto.randomUUID(), anbieter, werte: {}, favorit: false }]
      void store.setItem(kategorieId, next)
      return next
    })
  }, [kategorieId])

  // Legt ein Angebot mit vorbefüllten Richtwerten aus dem Anbieter-Katalog an.
  const addMitRichtwerten = useCallback((anbieter: string, werte: Record<string, string>, stand: string) => {
    setAngebote(prev => {
      const richtwert: Record<string, true> = {}
      for (const key of Object.keys(werte)) richtwert[key] = true
      const neu: Angebot = { id: crypto.randomUUID(), anbieter, werte: { ...werte }, favorit: false, richtwert, richtwertStand: stand }
      const next = [...prev, neu]
      void store.setItem(kategorieId, next)
      return next
    })
  }, [kategorieId])

  const setWert = useCallback((angebotId: string, key: string, wert: string) => {
    setAngebote(prev => {
      const next = prev.map(a => {
        if (a.id !== angebotId) return a
        // Eigene Eingabe schlägt den Richtwert – Marker für dieses Feld entfernen.
        const richtwert = a.richtwert ? { ...a.richtwert } : undefined
        if (richtwert) delete richtwert[key]
        return { ...a, werte: { ...a.werte, [key]: wert }, richtwert }
      })
      void store.setItem(kategorieId, next)
      return next
    })
  }, [kategorieId])

  const setAnbieter = useCallback((angebotId: string, anbieter: string) => {
    setAngebote(prev => {
      const next = prev.map(a => a.id === angebotId ? { ...a, anbieter } : a)
      void store.setItem(kategorieId, next)
      return next
    })
  }, [kategorieId])

  // Nur ein Favorit pro Kategorie; erneutes Klicken hebt die Wahl auf.
  const toggleFavorit = useCallback((angebotId: string) => {
    setAngebote(prev => {
      const next = prev.map(a => ({ ...a, favorit: a.id === angebotId ? !a.favorit : false }))
      void store.setItem(kategorieId, next)
      return next
    })
  }, [kategorieId])

  const remove = useCallback((angebotId: string) => {
    setAngebote(prev => {
      const next = prev.filter(a => a.id !== angebotId)
      void store.setItem(kategorieId, next)
      return next
    })
  }, [kategorieId])

  return { angebote, add, addMitRichtwerten, setWert, setAnbieter, toggleFavorit, remove, persist, loading }
}

// Zählt Kategorien mit mindestens einem eingetragenen Angebot (für Übersicht).
export function useVergleichsUebersicht(kategorieIds: string[]) {
  const [anzahl, setAnzahl] = useState<Record<string, number>>({})
  const signature = kategorieIds.join('|')

  useEffect(() => {
    let active = true
    const ids = signature ? signature.split('|') : []
    void (async () => {
      const map: Record<string, number> = {}
      for (const id of ids) {
        const list = await store.getItem<Angebot[]>(id)
        map[id] = list?.length ?? 0
      }
      if (active) setAnzahl(map)
    })()
    return () => { active = false }
  }, [signature])

  return anzahl
}
