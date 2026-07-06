import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IdeaGraph } from '../components/IdeaGraph'
import { GraphFilterBar } from '../components/GraphFilterBar'
import { IdeaEditor } from '../components/IdeaEditor'
import { useGraphData } from '../hooks/useGraphData'
import { useFolders } from '../hooks/useFolders'
import { toGraphData, bfsSubgraph } from '../lib/graph'

export function Graph() {
  const { ideaId: seedIdeaId } = useParams<{ ideaId?: string }>()
  const navigate = useNavigate()
  const { ideas, links, isLoading } = useGraphData()
  const { data: folders = [] } = useFolders()
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [depth, setDepth] = useState(2)
  const [openIdeaId, setOpenIdeaId] = useState<string | null>(null)

  const { nodes, edges } = useMemo(() => toGraphData(ideas, links), [ideas, links])

  const filtered = useMemo(() => {
    let base = { nodes, edges }
    if (selectedFolderId) {
      const allowed = new Set(base.nodes.filter((n) => n.folderId === selectedFolderId).map((n) => n.id))
      base = {
        nodes: base.nodes.filter((n) => allowed.has(n.id)),
        edges: base.edges.filter((e) => allowed.has(e.source) && allowed.has(e.target)),
      }
    }
    if (seedIdeaId) {
      base = bfsSubgraph(base.nodes, base.edges, [seedIdeaId], depth)
    }
    return base
  }, [nodes, edges, selectedFolderId, seedIdeaId, depth])

  if (isLoading) {
    return <div className="p-8 text-graphite-soft">Lädt…</div>
  }

  return (
    <div className="flex h-full flex-col">
      <GraphFilterBar
        folders={folders}
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
        depth={depth}
        onChangeDepth={setDepth}
        hasSeed={!!seedIdeaId}
        onClearSeed={() => navigate('/graph')}
      />
      <div className="relative flex-1">
        {filtered.nodes.length === 0 ? (
          <div className="flex h-full items-center justify-center text-graphite-soft">
            Noch keine verknüpften Ideen zum Anzeigen.
          </div>
        ) : (
          <IdeaGraph nodes={filtered.nodes} edges={filtered.edges} onSelectIdea={setOpenIdeaId} />
        )}

        {openIdeaId && (
          <div className="absolute inset-y-0 right-0 w-[28rem] max-w-full border-l border-mist bg-paper-card shadow-xl">
            <div className="flex items-center justify-between border-b border-mist px-4 py-2">
              <span className="text-sm text-graphite-soft">Idee</span>
              <button
                type="button"
                onClick={() => setOpenIdeaId(null)}
                className="rounded-field px-2 py-1 text-graphite-soft hover:bg-mist"
              >
                ✕
              </button>
            </div>
            <div className="h-[calc(100%-2.5rem)]">
              <IdeaEditor key={openIdeaId} ideaId={openIdeaId} onDeleted={() => setOpenIdeaId(null)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
