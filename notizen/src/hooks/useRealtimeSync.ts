import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthProvider'

/**
 * Subscribes to Postgres changes for the current user's data so that edits
 * made on another device show up here without a manual refresh.
 */
export function useRealtimeSync() {
  const { session } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!session) return

    const channel = supabase
      .channel('user-data-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'folders', filter: `user_id=eq.${session.user.id}` },
        () => queryClient.invalidateQueries({ queryKey: ['folders'] }),
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ideas', filter: `user_id=eq.${session.user.id}` },
        () => queryClient.invalidateQueries({ queryKey: ['ideas'] }),
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'idea_links', filter: `user_id=eq.${session.user.id}` },
        () => queryClient.invalidateQueries({ queryKey: ['idea_links'] }),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session, queryClient])
}
