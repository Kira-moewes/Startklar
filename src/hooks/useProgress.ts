import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { progressStore as store, progressDatesStore as dateStore } from '../lib/stores'
const keyOf = (j: string, t: string) => `${j}:${t}`

const heute = () => new Date().toISOString().slice(0, 10)

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
      void store.setItem(keyOf(journeyId, taskId), next[taskId])
      if (next[taskId]) void dateStore.setItem(keyOf(journeyId, taskId), heute())
      else void dateStore.removeItem(keyOf(journeyId, taskId))
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
