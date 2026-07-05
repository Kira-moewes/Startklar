import { useCallback, useEffect, useState } from 'react'
import localforage from 'localforage'

export type Angebot = {
  id: string
  anbieter: string
  werte: Record<string, string>
  favorit: boolean
}

const store = localforage.createInstance({ name: 'startklar', storeName: 'vergleich' })

export function useVergleich(kategorieId: string) {
  const [angebote, setAngebote] = useState<Angebot[]>([])
  // Favorit unter den kuratierten Startklar-Angeboten (AnbieterAngebot.id);
  // es gibt insgesamt nur einen Favoriten pro Kategorie – eigener ODER kuratierter.
  const [kuratierterFavorit, setKuratierterFavorit] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const favoritKey = `${kategorieId}#favorit`

  useEffect(() => {
    let active = true
    setLoading(true)
    void Promise.all([
      store.getItem<Angebot[]>(kategorieId),
      store.getItem<string>(favoritKey),
    ]).then(([list, fav]) => {
      if (active) {
        setAngebote(list ?? [])
        setKuratierterFavorit(fav ?? null)
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [kategorieId, favoritKey])

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
    setKuratierterFavorit(null)
    void store.removeItem(favoritKey)
  }, [kategorieId, favoritKey])

  // Favorit auf ein kuratiertes Angebot setzen (hebt eigenen Favoriten auf).
  const toggleKuratierterFavorit = useCallback((angebotId: string) => {
    setKuratierterFavorit(prev => {
      const next = prev === angebotId ? null : angebotId
      if (next) void store.setItem(favoritKey, next)
      else void store.removeItem(favoritKey)
      return next
    })
    setAngebote(prev => {
      const next = prev.map(a => ({ ...a, favorit: false }))
      void store.setItem(kategorieId, next)
      return next
    })
  }, [kategorieId, favoritKey])

  const remove = useCallback((angebotId: string) => {
    setAngebote(prev => {
      const next = prev.filter(a => a.id !== angebotId)
      void store.setItem(kategorieId, next)
      return next
    })
  }, [kategorieId])

  return {
    angebote,
    kuratierterFavorit,
    add,
    setWert,
    setAnbieter,
    toggleFavorit,
    toggleKuratierterFavorit,
    remove,
    persist,
    loading,
  }
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
