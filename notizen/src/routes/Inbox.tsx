import { useState } from 'react'
import { IdeaList } from '../components/IdeaList'
import { IdeaEditor } from '../components/IdeaEditor'
import { useInboxIdeas } from '../hooks/useIdeas'

export function Inbox() {
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null)
  const { data: ideas = [], isLoading } = useInboxIdeas()

  return (
    <div className="flex h-full">
      <div className="w-80 shrink-0 overflow-y-auto border-r border-mist">
        <div className="border-b border-mist px-4 py-3">
          <h2 className="font-display text-lg text-graphite">Inbox</h2>
          <p className="text-sm text-graphite-soft">Unsortiert oder unsicher einsortiert</p>
        </div>
        <IdeaList
          ideas={ideas}
          isLoading={isLoading}
          selectedIdeaId={selectedIdeaId}
          onSelectIdea={setSelectedIdeaId}
          emptyLabel="Alles einsortiert — nichts zu tun."
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {selectedIdeaId ? (
          <IdeaEditor key={selectedIdeaId} ideaId={selectedIdeaId} onDeleted={() => setSelectedIdeaId(null)} />
        ) : (
          <div className="flex h-full items-center justify-center text-graphite-soft">
            Wähle eine Idee aus der Inbox aus.
          </div>
        )}
      </div>
    </div>
  )
}
