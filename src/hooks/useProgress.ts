import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { progressStore as store, progressDatesStore as dateStore } from '../lib/stores'
import { belohneSchritt } from '../lib/guthaben'
const keyOf = (j: string, t: string) => `${j}:${t}`

const heute = () => new Date().toISOString().slice(0, 10)

// Zentrale Schreiblogik (Store + Erledigt-Datum konsistent) – wird vom
// Hook-Toggle und von Klaros „erledigt-vorschlag" gleichermaßen genutzt.
export async function schreibeErledigt(journeyId: string, taskId: string, erledigt: boolean): Promise<void> {
  const key = keyOf(journeyId, taskId)
  await store.setItem(key, erledigt)
  if (erledigt) {
    await dateStore.setItem(key, heute())
    // Sterne fürs Erledigen gutschreiben (einmalig pro Schritt; die Engine ist
    // idempotent). Fire-and-forget, damit die Checkbox sofort reagiert.
    void belohneSchritt(journeyId, taskId)
  } else {
    await dateStore.removeItem(key)
  }
}

// Toggle-Semantik ohne React-State (z. B. aus dem Agent-Panel): liest den
// aktuellen Stand und invertiert ihn. Liefert den neuen Wert zurück.
export async function markiereErledigt(journeyId: string, taskId: string): Promise<boolean> {
  const aktuell = (await store.getItem<boolean>(keyOf(journeyId, taskId))) ?? false
  await schreibeErledigt(journeyId, taskId, !aktuell)
  return !aktuell
}

export function useProgress(journeyId: string, taskIds: string[]) {
  const ids = useMemo(() => taskIds, [taskIds.join('|')])
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      const map: Record<string, boolean> = {}
      for (const t of ids) map[t] = (await store.getItem<boolean>(keyOf(journeyId, t))) ?? false
      if (active) { setDone(map); setLoading(false) }
    })()
    return () => { active = false }
  }, [journeyId, ids])

  const toggle = useCallback((taskId: string) => {
    setDone(prev => {
      const next = { ...prev, [taskId]: !prev[taskId] }
      void schreibeErledigt(journeyId, taskId, next[taskId])
      return next
    })
  }, [journeyId])

  const doneCount = Object.values(done).filter(Boolean).length
  return { done, toggle, doneCount, loading }
}

export type JourneyProgress = {
  journeyId: string
  done: Record<string, boolean>
  doneCount: number
  taskCount: number
}

// Lädt den Fortschritt aller Journeys in einem Rutsch – inkl. Erledigt-Datum
// je Aufgabe (Schlüssel `journeyId:taskId`, Wert ISO-Datum).
export function useAllProgress(items: { journeyId: string; taskIds: string[] }[]) {
  const signature = items.map(i => `${i.journeyId}=${i.taskIds.join(',')}`).join('|')
  const [progress, setProgress] = useState<JourneyProgress[]>([])
  const [dates, setDates] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const itemsRef = useRef(items)
  itemsRef.current = items

  useEffect(() => {
    let active = true
    ;(async () => {
      const result: JourneyProgress[] = []
      const dateMap: Record<string, string> = {}
      for (const item of itemsRef.current) {
        const done: Record<string, boolean> = {}
        for (const t of item.taskIds) {
          const key = keyOf(item.journeyId, t)
          done[t] = (await store.getItem<boolean>(key)) ?? false
          if (done[t]) {
            const d = await dateStore.getItem<string>(key)
            if (d) dateMap[key] = d
          }
        }
        result.push({
          journeyId: item.journeyId,
          done,
          doneCount: Object.values(done).filter(Boolean).length,
          taskCount: item.taskIds.length,
        })
      }
      if (active) {
        setProgress(result)
        setDates(dateMap)
        setLoading(false)
      }
    })()
    return () => { active = false }
  }, [signature])

  return { progress, dates, loading }
}
