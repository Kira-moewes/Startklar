import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { AgentConversation, AgentMessage } from '../lib/agentTypes'

export function useConversations() {
  return useQuery({
    queryKey: ['agent_conversations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agent_conversations')
        .select('*')
        .order('updated_at', { ascending: false })
      if (error) throw error
      return data as AgentConversation[]
    },
  })
}

export function useConversationMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ['agent_messages', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agent_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data as AgentMessage[]
    },
    enabled: !!conversationId,
  })
}

export function useSendAgentMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ conversationId, message }: { conversationId: string | null; message: string }) => {
      const { data, error } = await supabase.functions.invoke('agent-chat', {
        body: { conversationId, message },
      })
      if (error) throw error
      return data as { conversationId: string; reply: string }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['agent_messages', data.conversationId] })
      queryClient.invalidateQueries({ queryKey: ['agent_conversations'] })
    },
  })
}
