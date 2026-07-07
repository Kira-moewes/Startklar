import { useCallback, useEffect, useState } from 'react'
import { spielStore as store } from '../lib/stores'
import {
  applyEreignis,
  leererSpielState,
  type Belohnung,
  type SpielEreignis,
  type SpielState,
} from '../lib/spiel'

const STATE_KEY = 'state'

// Alle Hook-Instanzen teilen sich den Zustand (gleiches Muster wie useProfile):
// feuert eine Stelle ein Ereignis, erfahren es Himmelskarte, Quest-Screen und
// Sammlung sofort.
const listeners = new Set<(s: SpielState) => void>()
let cache: SpielState | null = null
let ladeVersprechen: Promise<SpielState> | null = null

async function ladeState(): Promise<SpielState> {
  if (cache) return cache
  if (!ladeVersprechen) {
    ladeVersprechen = store.getItem<SpielState>(STATE_KEY).then(s => {
      cache = s ?? leererSpielState
      return cache
    })
  }
  return ladeVersprechen
}

// Zentrale Ereignis-Verarbeitung – von der UI (useSpiel().sende) UND vom
// Fortschritts-Choke-Point (schreibeErledigt) genutzt. Liefert die Belohnungen
// für Feedback zurück.
export async function sendeSpielEreignis(e: SpielEreignis): Promise<Belohnung[]> {
  const vorher = await ladeState()
  const { state, belohnungen } = applyEreignis(vorher, e)
  cache = state
  await store.setItem(STATE_KEY, state)
  listeners.forEach(fn => fn(state))
  return belohnungen
}

export function useSpiel() {
  const [state, setState] = useState<SpielState>(cache ?? leererSpielState)
  const [loading, setLoading] = useState(cache === null)

  useEffect(() => {
    let aktiv = true
    void ladeState().then(s => {
      if (aktiv) {
        setState(s)
        setLoading(false)
      }
    })
    listeners.add(setState)
    return () => { listeners.delete(setState) }
  }, [])

  const sende = useCallback((e: SpielEreignis) => sendeSpielEreignis(e), [])

  return { state, sende, loading }
}
