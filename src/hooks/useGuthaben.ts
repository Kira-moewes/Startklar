import { useEffect, useState } from 'react'
import {
  aktuellesGuthaben,
  abonniere,
  deabonniere,
  ladeGuthaben,
  standardGuthaben,
  passPreisCent,
  formatiereEuro,
  freischalten,
  passAktivieren,
  kaufeSterneDemo,
  type Guthaben,
} from '../lib/guthaben'

// Dünner React-Wrapper um die Guthaben-Engine (useProfile-Pattern: alle
// Instanzen teilen sich den Zustand über die Modul-Listener der lib).
export function useGuthaben() {
  const [guthaben, setGuthaben] = useState<Guthaben>(() => aktuellesGuthaben() ?? standardGuthaben)
  const [loading, setLoading] = useState(aktuellesGuthaben() === null)

  useEffect(() => {
    let active = true
    void ladeGuthaben().then(g => {
      if (active) {
        setGuthaben(g)
        setLoading(false)
      }
    })
    abonniere(setGuthaben)
    return () => {
      active = false
      deabonniere(setGuthaben)
    }
  }, [])

  const preisCent = passPreisCent(guthaben.sterne)

  return {
    guthaben,
    loading,
    // Aktionen der Engine (durchgereicht)
    freischalten,
    passAktivieren,
    kaufeSterneDemo,
    // abgeleitete Werte
    passPreisCent: preisCent,
    passPreisText: formatiereEuro(preisCent),
    istFreigeschaltet: (appId: string) => guthaben.freigeschaltet.includes(appId),
  }
}
