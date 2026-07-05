import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useDebouncedCallback } from '../hooks/useDebouncedCallback'
import { useDeleteIdea, useIdea, useUpdateIdea } from '../hooks/useIdeas'
import { useProcessIdea } from '../hooks/useProcessIdea'
import { useProfile } from '../hooks/useProfile'
import { FilingConfirmationChip } from './FilingConfirmationChip'

interface IdeaEditorProps {
  ideaId: string
  onDeleted: () => void
}

export function IdeaEditor({ ideaId, onDeleted }: IdeaEditorProps) {
  const { data: idea } = useIdea(ideaId)
  const updateIdea = useUpdateIdea()
  const deleteIdea = useDeleteIdea()
  const processIdea = useProcessIdea()
  const { data: profile } = useProfile()
  const [title, setTitle] = useState('')

  // Läuft die KI-Einsortierung/-Verknüpfung erst 3s nach der letzten Änderung an,
  // damit nicht bei jedem Autosave ein Claude-/Voyage-Aufruf ausgelöst wird.
  const debouncedProcess = useDebouncedCallback(() => {
    if (profile?.auto_filing_enabled ?? true) {
      processIdea.mutate(ideaId)
    }
  }, 3000)

  const debouncedSaveContent = useDebouncedCallback((content: Record<string, unknown>, contentText: string) => {
    updateIdea.mutate(
      { id: ideaId, content, contentText },
      { onSuccess: () => debouncedProcess() },
    )
  }, 800)

  const debouncedSaveTitle = useDebouncedCallback((value: string) => {
    updateIdea.mutate({ id: ideaId, title: value }, { onSuccess: () => debouncedProcess() })
  }, 800)

  const editor = useEditor({
    extensions: [StarterKit],
    content: idea?.content && Object.keys(idea.content).length > 0 ? idea.content : '',
    onUpdate: ({ editor }) => {
      debouncedSaveContent(editor.getJSON(), editor.getText())
    },
  })

  // Load the idea's content into the editor once it arrives (editor is created
  // before the query resolves, so this syncs it in afterwards). A brand-new
  // idea has `content: {}` (no ProseMirror doc yet) — leave the editor's own
  // empty document as-is rather than handing ProseMirror an invalid doc.
  useEffect(() => {
    const hasStoredContent = idea?.content && Object.keys(idea.content).length > 0
    if (idea && editor && hasStoredContent && !editor.isFocused) {
      const current = JSON.stringify(editor.getJSON())
      const incoming = JSON.stringify(idea.content)
      if (current !== incoming) {
        editor.commands.setContent(idea.content)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idea?.id, idea?.updated_at, editor])

  useEffect(() => {
    setTitle(idea?.title ?? '')
  }, [idea?.id, idea?.title])

  if (!idea) {
    return <div className="p-8 text-graphite-soft">Lädt…</div>
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4 border-b border-mist px-8 py-4">
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            debouncedSaveTitle(e.target.value)
          }}
          placeholder="Titel der Idee"
          className="w-full font-display text-2xl text-graphite outline-none placeholder:text-graphite-soft/50"
        />
        <div className="flex shrink-0 gap-2">
          <Link
            to={`/graph/${ideaId}`}
            className="rounded-field px-3 py-1.5 text-sm text-graphite-soft hover:bg-mist hover:text-indigo"
          >
            Als Mindmap anzeigen
          </Link>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Diese Idee wirklich löschen?')) {
                deleteIdea.mutate(ideaId)
                onDeleted()
              }
            }}
            className="rounded-field px-3 py-1.5 text-sm text-graphite-soft hover:bg-mist hover:text-amber"
          >
            Löschen
          </button>
        </div>
      </div>

      {processIdea.isError && (
        <p className="mx-8 mt-3 rounded-field bg-amber/10 px-3 py-2 text-sm text-amber">
          Automatische Einsortierung ist gerade nicht erreichbar — deine Idee ist trotzdem gespeichert.
        </p>
      )}

      {idea.needs_review && <FilingConfirmationChip idea={idea} />}

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <EditorContent editor={editor} className="prose-tiptap min-h-full text-graphite" />
      </div>
    </div>
  )
}
