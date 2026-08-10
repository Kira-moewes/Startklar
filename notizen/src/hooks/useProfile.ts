import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthProvider'

export interface Profile {
  id: string
  display_name: string | null
  theme: 'light' | 'dark'
  auto_filing_enabled: boolean
}

const PROFILE_KEY = ['profile'] as const

export function useProfile() {
  const { session } = useAuth()
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').single()
      if (error) throw error
      return data as Profile
    },
    enabled: !!session,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (patch: Partial<Pick<Profile, 'theme' | 'auto_filing_enabled' | 'display_name'>>) => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error('Nicht angemeldet')
      const { error } = await supabase.from('profiles').update(patch).eq('id', userData.user.id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFILE_KEY }),
  })
}

/** Applies the stored theme preference to <html data-theme="…"> as soon as it's known. */
export function useApplyTheme() {
  const { data: profile } = useProfile()

  useEffect(() => {
    if (profile?.theme) {
      document.documentElement.setAttribute('data-theme', profile.theme)
    }
  }, [profile?.theme])
}
