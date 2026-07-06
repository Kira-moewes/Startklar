import { useCallback, useEffect, useState } from 'react'
import { bedarfStore } from '../lib/stores'
import { bedarfsCheck } from '../data/bedarf'
import type { BedarfsErgebnis } from '../data/bedarf/types'
import { useProfile } from './useProfile'

type Gespeichert = { antworten: Record<string, string>; stand: string }

// Lädt/speichert die Antworten eines Bedarfschecks (per Kategorie) und leitet
// das Ergebnis bei jedem Rendern frisch aus den Antworten + Profil ab, damit
// Regelverbesserungen rückwirkend greifen.
export function useBedarf(kategorieId: string) {
  const { profile } = useProfile()
  const [antworten, setAntworten] = useState<Record<string, string> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    void bedarfStore.getItem<Gespeichert>(kategorieId).then(g => {
      if (active) {
        setAntworten(g?.antworten ?? null)
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [kategorieId])

  const speichern = useCallback(async (neu: Record<string, string>) => {
    await bedarfStore.setItem<Gespeichert>(kategorieId, { antworten: neu, stand: new Date().toISOString() })
    setAntworten(neu)
  }, [kategorieId])

  const zuruecksetzen = useCallback(async () => {
    await bedarfStore.removeItem(kategorieId)
    setAntworten(null)
  }, [kategorieId])

  const check = bedarfsCheck(kategorieId)
  const ergebnis: BedarfsErgebnis | null = antworten && check ? check.auswerten(antworten, profile) : null

  return { antworten, ergebnis, speichern, zuruecksetzen, loading }
}

// Für die Übersicht: welche Kategorien haben einen abgeschlossenen Check?
export function useBedarfUebersicht(kategorieIds: string[]) {
  const [status, setStatus] = useState<Record<string, boolean>>({})
  const signature = kategorieIds.join('|')

  useEffect(() => {
    let active = true
    const ids = signature ? signature.split('|') : []
    void (async () => {
      const map: Record<string, boolean> = {}
      for (const id of ids) map[id] = (await bedarfStore.getItem(id)) != null
      if (active) setStatus(map)
    })()
    return () => { active = false }
  }, [signature])

  return status
}
