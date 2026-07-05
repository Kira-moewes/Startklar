import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { Folder } from '../lib/types'

const FOLDERS_KEY = ['folders'] as const

export function useFolders() {
  return useQuery({
    queryKey: FOLDERS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .order('name', { ascending: true })
      if (error) throw error
      return data as Folder[]
    },
  })
}

export function useCreateFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ name, parentId }: { name: string; parentId: string | null }) => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error('Nicht angemeldet')
      const { data, error } = await supabase
        .from('folders')
        .insert({ name, parent_id: parentId, user_id: userData.user.id })
        .select()
        .single()
      if (error) throw error
      return data as Folder
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FOLDERS_KEY }),
  })
}

export function useRenameFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase.from('folders').update({ name }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FOLDERS_KEY }),
  })
}

export function useMoveFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, parentId }: { id: string; parentId: string | null }) => {
      const { error } = await supabase.from('folders').update({ parent_id: parentId }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FOLDERS_KEY }),
  })
}

export function useDeleteFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('folders').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOLDERS_KEY })
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
    },
  })
}
