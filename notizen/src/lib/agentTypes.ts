export interface AgentConversation {
  id: string
  user_id: string
  title: string | null
  created_at: string
  updated_at: string
}

export type AgentContentBlock =
  | { type: 'text'; text: string }
  | { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> }
  | { type: 'tool_result'; tool_use_id: string; content: string }

export interface AgentMessage {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'tool'
  content: AgentContentBlock[]
  referenced_idea_ids: string[] | null
  created_at: string
}
