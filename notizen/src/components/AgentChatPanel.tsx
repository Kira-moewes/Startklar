import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useConversationMessages, useSendAgentMessage } from '../hooks/useAgent'
import type { AgentContentBlock, AgentMessage } from '../lib/agentTypes'

interface AgentChatPanelProps {
  conversationId: string | null
  onConversationCreated: (id: string) => void
}

function textOf(blocks: AgentContentBlock[]) {
  return blocks
    .filter((b): b is Extract<AgentContentBlock, { type: 'text' }> => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
}

function mindmapCalls(blocks: AgentContentBlock[]) {
  return blocks.filter(
    (b): b is Extract<AgentContentBlock, { type: 'tool_use' }> => b.type === 'tool_use' && b.name === 'render_mindmap',
  )
}

function MessageBubble({ message }: { message: AgentMessage }) {
  const text = textOf(message.content)
  const mindmaps = message.role === 'assistant' ? mindmapCalls(message.content) : []

  if (!text && mindmaps.length === 0) return null

  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-card px-4 py-2 text-sm ${
          isUser ? 'bg-indigo text-white' : 'bg-paper-card text-graphite ring-1 ring-mist'
        }`}
      >
        {text && <p className="whitespace-pre-wrap">{text}</p>}
        {mindmaps.map((call, i) => {
          const seedIds = (call.input.seed_idea_ids as string[]) ?? []
          if (seedIds.length === 0) return null
          return (
            <Link
              key={i}
              to={`/graph/${seedIds[0]}`}
              className="mt-2 inline-block rounded-pill bg-amber/15 px-3 py-1 text-xs text-amber hover:bg-amber/25"
            >
              Mindmap öffnen
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function AgentChatPanel({ conversationId, onConversationCreated }: AgentChatPanelProps) {
  const { data: messages = [] } = useConversationMessages(conversationId)
  const sendMessage = useSendAgentMessage()
  const [draft, setDraft] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!draft.trim()) return
    const text = draft
    setDraft('')
    sendMessage.mutate(
      { conversationId, message: text },
      {
        onSuccess: (data) => {
          if (!conversationId) onConversationCreated(data.conversationId)
        },
      },
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto px-6 py-6">
        {messages.length === 0 && (
          <p className="text-graphite-soft">
            Schreib mir, worüber du nachdenkst — ich helfe dir, es weiterzuspinnen.
          </p>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {sendMessage.isPending && <p className="text-sm text-graphite-soft">Denkt nach…</p>}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-mist px-6 py-4">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Was beschäftigt dich gerade?"
          className="flex-1 rounded-field border border-mist bg-paper-card px-3 py-2 text-graphite outline-none focus:border-indigo"
        />
        <button
          type="submit"
          disabled={sendMessage.isPending}
          className="rounded-pill bg-indigo px-4 py-2 text-white hover:bg-indigo-deep disabled:opacity-60"
        >
          Senden
        </button>
      </form>
    </div>
  )
}
