import { useCallback, useEffect, useState } from 'react'
import localforage from 'localforage'

export type Termin = {
  id: string
  titel: string
  datum: string // ISO yyyy-mm-dd
  uhrzeit?: string // HH:MM
  ort?: string
  notiz?: string
  journeyId?: string
  taskId?: string
  erledigt: boolean
}

const store = localforage.createInstance({ name: 'startklar', storeName: 'termine' })
const KEY = 'liste'

export function useTermine() {
  const [termine, setTermine] = useState<Termin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void store.getItem<Termin[]>(KEY).then(list => {
      setTermine(list ?? [])
      setLoading(false)
    })
  }, [])

  const persist = useCallback((next: Termin[]) => {
    setTermine(next)
    void store.setItem(KEY, next)
  }, [])

  const add = useCallback((t: Omit<Termin, 'id' | 'erledigt'>) => {
    const neu: Termin = { ...t, id: crypto.randomUUID(), erledigt: false }
    setTermine(prev => {
      const next = [...prev, neu]
      void store.setItem(KEY, next)
      return next
    })
    return neu
  }, [])

  const update = useCallback((id: string, patch: Partial<Termin>) => {
    setTermine(prev => {
      const next = prev.map(t => (t.id === id ? { ...t, ...patch } : t))
      void store.setItem(KEY, next)
      return next
    })
  }, [])

  const remove = useCallback((id: string) => {
    setTermine(prev => {
      const next = prev.filter(t => t.id !== id)
      void store.setItem(KEY, next)
      return next
    })
  }, [])

  return { termine, add, update, remove, persist, loading }
}

// Baut eine ICS-Datei für einen Termin und löst den Download aus.
export function terminAlsIcs(t: Termin) {
  const dt = t.datum.replaceAll('-', '')
  const time = t.uhrzeit ? t.uhrzeit.replace(':', '') + '00' : null
  const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Startklar//DE',
    'BEGIN:VEVENT',
    `UID:${t.id}@startklar`,
    `DTSTAMP:${stamp}`,
    time ? `DTSTART:${dt}T${time}` : `DTSTART;VALUE=DATE:${dt}`,
    `SUMMARY:${t.titel.replace(/[,;\\]/g, m => '\\' + m)}`,
    t.ort ? `LOCATION:${t.ort.replace(/[,;\\]/g, m => '\\' + m)}` : null,
    t.notiz ? `DESCRIPTION:${t.notiz.replace(/[,;\\]/g, m => '\\' + m).replaceAll('\n', '\\n')}` : null,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean)
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${t.titel.toLowerCase().replace(/[^a-z0-9äöüß]+/gi, '-')}.ics`
  a.click()
  URL.revokeObjectURL(url)
}
