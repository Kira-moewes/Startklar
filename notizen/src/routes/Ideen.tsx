import { useState } from 'react'
import { FolderTree } from '../components/FolderTree'
import { IdeaList } from '../components/IdeaList'
import { IdeaEditor } from '../components/IdeaEditor'
import { useCreateIdea, useIdeasByFolder } from '../hooks/useIdeas'

export function Ideen() {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null)
  const { data: ideas = [], isLoading } = useIdeasByFolder(selectedFolderId)
  const createIdea = useCreateIdea()

  return (
    <div className="flex h-full">
      <div className="w-56 shrink-0 overflow-y-auto border-r border-mist px-3 py-6">
        <FolderTree
          selectedFolderId={selectedFolderId}
          onSelectFolder={(id) => {
            setSelectedFolderId(id)
            setSelectedIdeaId(null)
          }}
        />
      </div>

      <div className="w-80 shrink-0 overflow-y-auto border-r border-mist">
        <div className="flex items-center justify-between border-b border-mist px-4 py-3">
          <h2 className="font-display text-lg text-graphite">Ideen</h2>
          <button
            type="button"
            onClick={() => {
              createIdea.mutate(
                { folderId: selectedFolderId },
                { onSuccess: (idea) => setSelectedIdeaId(idea.id) },
              )
            }}
            className="rounded-pill bg-indigo px-3 py-1 text-sm text-white hover:bg-indigo-deep"
          >
            + Neue Idee
          </button>
        </div>
        <IdeaList
          ideas={ideas}
          isLoading={isLoading}
          selectedIdeaId={selectedIdeaId}
          onSelectIdea={setSelectedIdeaId}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedIdeaId ? (
          <IdeaEditor key={selectedIdeaId} ideaId={selectedIdeaId} onDeleted={() => setSelectedIdeaId(null)} />
        ) : (
          <div className="flex h-full items-center justify-center text-graphite-soft">
            Wähle eine Idee aus oder lege eine neue an.
          </div>
        )}
      </div>
    </div>
  )
}
