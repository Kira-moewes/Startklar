import { useMemo, useState } from 'react'
import type { Folder } from '../lib/types'
import {
  useCreateFolder,
  useDeleteFolder,
  useFolders,
  useMoveFolder,
  useRenameFolder,
} from '../hooks/useFolders'
import { useMoveIdea } from '../hooks/useIdeas'

interface FolderTreeProps {
  selectedFolderId: string | null
  onSelectFolder: (id: string | null) => void
}

export function FolderTree({ selectedFolderId, onSelectFolder }: FolderTreeProps) {
  const { data: folders = [], isLoading } = useFolders()
  const createFolder = useCreateFolder()

  const childrenByParent = useMemo(() => {
    const map = new Map<string | null, Folder[]>()
    for (const folder of folders) {
      const key = folder.parent_id
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(folder)
    }
    return map
  }, [folders])

  const rootFolders = childrenByParent.get(null) ?? []

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => onSelectFolder(null)}
        className={`rounded-field px-3 py-1.5 text-left text-sm transition ${
          selectedFolderId === null ? 'bg-indigo text-white' : 'text-graphite-soft hover:bg-mist'
        }`}
      >
        Alle Ideen
      </button>

      {isLoading ? (
        <p className="px-3 text-sm text-graphite-soft">Lädt…</p>
      ) : (
        rootFolders.map((folder) => (
          <FolderNode
            key={folder.id}
            folder={folder}
            depth={0}
            childrenByParent={childrenByParent}
            selectedFolderId={selectedFolderId}
            onSelectFolder={onSelectFolder}
          />
        ))
      )}

      <button
        type="button"
        onClick={() => {
          const name = window.prompt('Name des neuen Ordners?')
          if (name) createFolder.mutate({ name, parentId: null })
        }}
        className="mt-2 rounded-field border border-dashed border-mist px-3 py-1.5 text-left text-sm text-graphite-soft hover:border-indigo hover:text-indigo"
      >
        + Neuer Ordner
      </button>
    </div>
  )
}

interface FolderNodeProps {
  folder: Folder
  depth: number
  childrenByParent: Map<string | null, Folder[]>
  selectedFolderId: string | null
  onSelectFolder: (id: string | null) => void
}

function FolderNode({ folder, depth, childrenByParent, selectedFolderId, onSelectFolder }: FolderNodeProps) {
  const [expanded, setExpanded] = useState(true)
  const [isDragOver, setIsDragOver] = useState(false)
  const children = childrenByParent.get(folder.id) ?? []
  const createFolder = useCreateFolder()
  const renameFolder = useRenameFolder()
  const deleteFolder = useDeleteFolder()
  const moveFolder = useMoveFolder()
  const moveIdea = useMoveIdea()

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    const ideaId = e.dataTransfer.getData('application/x-idea-id')
    const draggedFolderId = e.dataTransfer.getData('application/x-folder-id')
    if (ideaId) {
      moveIdea.mutate({ id: ideaId, folderId: folder.id })
    } else if (draggedFolderId && draggedFolderId !== folder.id) {
      moveFolder.mutate({ id: draggedFolderId, parentId: folder.id })
    }
  }

  return (
    <div>
      <div
        draggable
        onDragStart={(e) => e.dataTransfer.setData('application/x-folder-id', folder.id)}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        style={{ paddingLeft: `${depth * 14}px` }}
        className={`group flex items-center gap-1 rounded-field px-1 py-0.5 text-sm transition ${
          isDragOver ? 'bg-indigo/10 ring-1 ring-indigo' : ''
        }`}
      >
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-4 shrink-0 text-graphite-soft"
          aria-label={expanded ? 'Einklappen' : 'Ausklappen'}
        >
          {children.length > 0 ? (expanded ? '▾' : '▸') : ''}
        </button>
        <button
          type="button"
          onClick={() => onSelectFolder(folder.id)}
          aria-current={selectedFolderId === folder.id ? 'true' : undefined}
          className={`flex-1 truncate rounded-field px-2 py-1 text-left ${
            selectedFolderId === folder.id ? 'bg-indigo text-white' : 'text-graphite-soft hover:bg-mist'
          }`}
        >
          {folder.name}
        </button>
        <div className="hidden gap-0.5 group-hover:flex">
          <button
            type="button"
            title="Unterordner anlegen"
            aria-label={`Unterordner in "${folder.name}" anlegen`}
            onClick={() => {
              const name = window.prompt('Name des Unterordners?')
              if (name) createFolder.mutate({ name, parentId: folder.id })
            }}
            className="rounded px-1 text-graphite-soft hover:text-indigo"
          >
            +
          </button>
          <button
            type="button"
            title="Umbenennen"
            aria-label={`Ordner "${folder.name}" umbenennen`}
            onClick={() => {
              const name = window.prompt('Neuer Name?', folder.name)
              if (name) renameFolder.mutate({ id: folder.id, name })
            }}
            className="rounded px-1 text-graphite-soft hover:text-indigo"
          >
            ✎
          </button>
          <button
            type="button"
            title="Löschen"
            aria-label={`Ordner "${folder.name}" löschen`}
            onClick={() => {
              if (window.confirm(`Ordner "${folder.name}" wirklich löschen?`)) {
                deleteFolder.mutate(folder.id)
                if (selectedFolderId === folder.id) onSelectFolder(null)
              }
            }}
            className="rounded px-1 text-graphite-soft hover:text-amber"
          >
            ×
          </button>
        </div>
      </div>
      {expanded &&
        children.map((child) => (
          <FolderNode
            key={child.id}
            folder={child}
            depth={depth + 1}
            childrenByParent={childrenByParent}
            selectedFolderId={selectedFolderId}
            onSelectFolder={onSelectFolder}
          />
        ))}
    </div>
  )
}
