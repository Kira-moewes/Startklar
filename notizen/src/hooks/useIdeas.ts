import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { Idea } from '../lib/types'

const ideasKey = (folderId: string | null) => ['ideas', 'folder', folderId] as const
const inboxKey = ['ideas', 'inbox'] as const
const ideaKey = (id: string) => ['idea', id] as const

export function useIdeasByFolder(folderId: string | null) {
  return useQuery({
    queryKey: ideasKey(folderId),
    queryFn: async () => {
      let query = supabase.from('ideas').select('*').order('updated_at', { ascending: false })
      query = folderId === null ? query.is('folder_id', null) : query.eq('folder_id', folderId)
      const { data, error } = await query
      if (error) throw error
      return data as Idea[]
    },
  })
}

export function useInboxIdeas() {
  return useQuery({
    queryKey: inboxKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .or('folder_id.is.null,needs_review.eq.true')
        .order('updated_at', { ascending: false })
      if (error) throw error
      return data as Idea[]
    },
  })
}

export function useIdea(id: string | null) {
  return useQuery({
    queryKey: id ? ideaKey(id) : ['idea', 'none'],
    queryFn: async () => {
      const { data, error } = await supabase.from('ideas').select('*').eq('id', id).single()
      if (error) throw error
      return data as Idea
    },
    enabled: !!id,
  })
}

function invalidateIdeaLists(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['ideas'] })
}

export function useCreateIdea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ folderId }: { folderId: string | null }) => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error('Nicht angemeldet')
      const { data, error } = await supabase
        .from('ideas')
        .insert({ folder_id: folderId, user_id: userData.user.id, title: 'Neue Idee', content: {} })
        .select()
        .single()
      if (error) throw error
      return data as Idea
    },
    onSuccess: () => invalidateIdeaLists(queryClient),
  })
}

export function useUpdateIdea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      title,
      content,
      contentText,
    }: {
      id: string
      title?: string
      content?: Record<string, unknown>
      contentText?: string
    }) => {
      const patch: Record<string, unknown> = {}
      if (title !== undefined) patch.title = title
      if (content !== undefined) patch.content = content
      if (contentText !== undefined) patch.content_text = contentText
      const { error } = await supabase.from('ideas').update(patch).eq('id', id)
      if (error) throw error
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ideaKey(variables.id) })
      invalidateIdeaLists(queryClient)
    },
  })
}

export function useMoveIdea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, folderId }: { id: string; folderId: string | null }) => {
      const { error } = await supabase
        .from('ideas')
        .update({ folder_id: folderId, needs_review: false })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ideaKey(variables.id) })
      invalidateIdeaLists(queryClient)
    },
  })
}

export function useDeleteIdea() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('ideas').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => invalidateIdeaLists(queryClient),
  })
}
