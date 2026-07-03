import { useCallback, useEffect, useMemo, useState } from 'react'
import localforage from 'localforage'

const store = localforage.createInstance({ name: 'startklar', storeName: 'progress' })
const keyOf = (j: string, t: string) => `${j}:${t}`

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
      return next
    })
  }, [journeyId])

  const doneCount = Object.values(done).filter(Boolean).length
  return { done, toggle, doneCount, loading }
}
