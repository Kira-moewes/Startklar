import type { Folder } from '../lib/types'

interface GraphFilterBarProps {
  folders: Folder[]
  selectedFolderId: string | null
  onSelectFolder: (id: string | null) => void
  depth: number
  onChangeDepth: (depth: number) => void
  hasSeed: boolean
  onClearSeed: () => void
}

export function GraphFilterBar({
  folders,
  selectedFolderId,
  onSelectFolder,
  depth,
  onChangeDepth,
  hasSeed,
  onClearSeed,
}: GraphFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-mist px-6 py-3">
      <select
        value={selectedFolderId ?? ''}
        onChange={(e) => onSelectFolder(e.target.value || null)}
        className="rounded-field border border-mist bg-paper-card px-2 py-1 text-sm text-graphite"
      >
        <option value="">Alle Ordner</option>
        {folders.map((folder) => (
          <option key={folder.id} value={folder.id}>
            {folder.name}
          </option>
        ))}
      </select>

      {hasSeed && (
        <>
          <label className="flex items-center gap-2 text-sm text-graphite-soft">
            Tiefe
            <input
              type="range"
              min={1}
              max={4}
              value={depth}
              onChange={(e) => onChangeDepth(Number(e.target.value))}
            />
            {depth}
          </label>
          <button
            type="button"
            onClick={onClearSeed}
            className="rounded-pill border border-mist px-3 py-1 text-sm text-graphite-soft hover:bg-mist"
          >
            Ganzen Graph zeigen
          </button>
        </>
      )}
    </div>
  )
}
