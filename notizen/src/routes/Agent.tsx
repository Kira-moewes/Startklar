import { useState } from 'react'
import { ConversationList } from '../components/ConversationList'
import { AgentChatPanel } from '../components/AgentChatPanel'

export function Agent() {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)

  return (
    <div className="flex h-full">
      <div className="w-64 shrink-0 overflow-y-auto border-r border-mist">
        <ConversationList activeConversationId={activeConversationId} onSelect={setActiveConversationId} />
      </div>
      <div className="flex-1 overflow-hidden">
        <AgentChatPanel
          conversationId={activeConversationId}
          onConversationCreated={setActiveConversationId}
        />
      </div>
    </div>
  )
}
