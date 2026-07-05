import { useConversations } from '../hooks/useAgent'

interface ConversationListProps {
  activeConversationId: string | null
  onSelect: (id: string | null) => void
}

export function ConversationList({ activeConversationId, onSelect }: ConversationListProps) {
  const { data: conversations = [], isLoading } = useConversations()

  return (
    <div className="flex flex-col gap-1 p-3">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`rounded-field px-3 py-2 text-left text-sm transition ${
          activeConversationId === null ? 'bg-indigo text-white' : 'text-graphite-soft hover:bg-mist'
        }`}
      >
        + Neue Unterhaltung
      </button>

      {isLoading ? (
        <p className="px-3 text-sm text-graphite-soft">Lädt…</p>
      ) : (
        conversations.map((conv) => (
          <button
            key={conv.id}
            type="button"
            onClick={() => onSelect(conv.id)}
            className={`truncate rounded-field px-3 py-2 text-left text-sm transition ${
              activeConversationId === conv.id ? 'bg-indigo/10 ring-1 ring-indigo' : 'hover:bg-mist'
            }`}
          >
            {conv.title || 'Ohne Titel'}
          </button>
        ))
      )}
    </div>
  )
}
