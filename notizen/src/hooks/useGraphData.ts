import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { Idea, IdeaLink } from '../lib/types'

export type GraphIdea = Pick<Idea, 'id' | 'title' | 'folder_id' | 'kind'>

export function useGraphData() {
  const ideasQuery = useQuery({
    queryKey: ['ideas', 'graph-nodes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('ideas').select('id, title, folder_id, kind')
      if (error) throw error
      return data as GraphIdea[]
    },
  })

  const linksQuery = useQuery({
    queryKey: ['idea_links'],
    queryFn: async () => {
      const { data, error } = await supabase.from('idea_links').select('*')
      if (error) throw error
      return data as IdeaLink[]
    },
  })

  return {
    ideas: ideasQuery.data ?? [],
    links: linksQuery.data ?? [],
    isLoading: ideasQuery.isLoading || linksQuery.isLoading,
  }
}
