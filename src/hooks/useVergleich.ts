import { useCallback, useEffect, useState } from 'react'
import { vergleichStore } from '../lib/stores'

export type Angebot = {
  id: string
  anbieter: string
  werte: Record<string, string>
  favorit: boolean
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

  const setWert = useCallback((angebotId: string, key: string, wert: string) => {
    setAngebote(prev => {
      const next = prev.map(a => a.id === angebotId ? { ...a, werte: { ...a.werte, [key]: wert } } : a)
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

  return { angebote, add, setWert, setAnbieter, toggleFavorit, remove, persist, loading }
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
