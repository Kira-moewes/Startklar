import { useCallback, useEffect, useState } from 'react'
import type { Profile } from '../data/profile'
import { profilStore as store } from '../lib/stores'

// Alle Hook-Instanzen teilen sich den Zustand: Speichert eine Instanz
// (z. B. das Onboarding), erfahren es auch Layout & Co. sofort.
const listeners = new Set<(p: Profile | null) => void>()

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void store.getItem<Profile>('profil').then(p => {
      setProfile(p ?? null)
      setLoading(false)
    })
    listeners.add(setProfile)
    return () => { listeners.delete(setProfile) }
  }, [])

  const save = useCallback(async (p: Profile) => {
    await store.setItem('profil', p)
    listeners.forEach(fn => fn(p))
  }, [])

  return { profile, save, loading }
}
