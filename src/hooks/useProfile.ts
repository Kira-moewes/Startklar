import { useCallback, useEffect, useState } from 'react'
import localforage from 'localforage'
import type { Profile } from '../data/profile'

const store = localforage.createInstance({ name: 'startklar', storeName: 'profil' })

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void store.getItem<Profile>('profil').then(p => {
      setProfile(p ?? null)
      setLoading(false)
    })
  }, [])

  const save = useCallback(async (p: Profile) => {
    await store.setItem('profil', p)
    setProfile(p)
  }, [])

  return { profile, save, loading }
}
