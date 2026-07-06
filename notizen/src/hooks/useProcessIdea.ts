import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export function useProcessIdea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (ideaId: string) => {
      const { data, error } = await supabase.functions.invoke('process-idea', {
        body: { ideaId },
      })
      if (error) throw error
      return data
    },
    onSuccess: (_data, ideaId) => {
      queryClient.invalidateQueries({ queryKey: ['idea', ideaId] })
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
    },
  })
}
