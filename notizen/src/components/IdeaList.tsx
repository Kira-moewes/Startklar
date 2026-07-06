import type { Idea } from '../lib/types'

interface IdeaListProps {
  ideas: Idea[]
  isLoading: boolean
  selectedIdeaId: string | null
  onSelectIdea: (id: string) => void
  emptyLabel?: string
}

export function IdeaList({ ideas, isLoading, selectedIdeaId, onSelectIdea, emptyLabel }: IdeaListProps) {
  if (isLoading) {
    return <p className="p-4 text-sm text-graphite-soft">Lädt…</p>
  }

  if (ideas.length === 0) {
    return <p className="p-4 text-sm text-graphite-soft">{emptyLabel ?? 'Noch keine Ideen hier.'}</p>
  }

  return (
    <ul className="flex flex-col gap-1 p-2">
      {ideas.map((idea) => (
        <li key={idea.id}>
          <button
            type="button"
            draggable
            onDragStart={(e) => e.dataTransfer.setData('application/x-idea-id', idea.id)}
            onClick={() => onSelectIdea(idea.id)}
            className={`flex w-full flex-col items-start gap-0.5 rounded-card px-3 py-2 text-left transition ${
              selectedIdeaId === idea.id ? 'bg-indigo/10 ring-1 ring-indigo' : 'hover:bg-mist'
            }`}
          >
            <span className="flex w-full items-center justify-between gap-2">
              <span className="truncate font-medium text-graphite">{idea.title || 'Ohne Titel'}</span>
              {idea.needs_review && (
                <span className="shrink-0 rounded-pill bg-amber/15 px-2 py-0.5 text-xs text-amber">
                  prüfen
                </span>
              )}
            </span>
            {idea.content_text && (
              <span className="line-clamp-2 text-sm text-graphite-soft">{idea.content_text}</span>
            )}
          </button>
        </li>
      ))}
    </ul>
  )
}
