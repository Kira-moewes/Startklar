import { useFolders } from '../hooks/useFolders'
import { useMoveIdea } from '../hooks/useIdeas'
import type { Idea } from '../lib/types'

interface FilingConfirmationChipProps {
  idea: Idea
}

export function FilingConfirmationChip({ idea }: FilingConfirmationChipProps) {
  const { data: folders = [] } = useFolders()
  const moveIdea = useMoveIdea()
  const folder = folders.find((f) => f.id === idea.folder_id)

  return (
    <div className="mx-8 mt-4 flex flex-wrap items-center gap-3 rounded-card border border-amber/30 bg-amber/10 px-4 py-3 text-sm">
      <span className="text-graphite">
        {folder ? (
          <>
            Automatisch einsortiert in <strong>{folder.name}</strong>
            {idea.filing_confidence != null && (
              <> ({Math.round(idea.filing_confidence * 100)}% sicher)</>
            )}{' '}
            — passt das?
          </>
        ) : (
          'Diese Idee konnte nicht sicher einsortiert werden.'
        )}
      </span>
      <button
        type="button"
        onClick={() => moveIdea.mutate({ id: idea.id, folderId: idea.folder_id })}
        className="rounded-pill bg-sage px-3 py-1 text-white"
      >
        Bestätigen
      </button>
      <button
        type="button"
        onClick={() => {
          const name = window.prompt('In welchen Ordner soll die Idee stattdessen?')
          if (!name) return
          const target = folders.find((f) => f.name.toLowerCase() === name.toLowerCase())
          moveIdea.mutate({ id: idea.id, folderId: target?.id ?? null })
        }}
        className="rounded-pill border border-mist px-3 py-1 text-graphite-soft hover:bg-mist"
      >
        Anders einsortieren
      </button>
    </div>
  )
}
