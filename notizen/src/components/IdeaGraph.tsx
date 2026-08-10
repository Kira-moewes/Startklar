import { useMemo, useState } from 'react'
import ForceGraph2D, { type NodeObject, type LinkObject } from 'react-force-graph-2d'
import { useContainerSize } from '../hooks/useContainerSize'
import type { GraphEdge, GraphNode } from '../lib/graph'

interface IdeaGraphProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  onSelectIdea: (id: string) => void
}

const NODE_COLOR: Record<GraphNode['kind'], string> = {
  idea: '#d98e3e',
  note: '#7c9473',
}

export function IdeaGraph({ nodes, edges, onSelectIdea }: IdeaGraphProps) {
  const { ref, size } = useContainerSize<HTMLDivElement>()
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const graphData = useMemo(
    () => ({
      nodes: nodes.map((n) => ({ ...n })),
      links: edges.map((e) => ({ ...e })),
    }),
    [nodes, edges],
  )

  const connectedIds = useMemo(() => {
    if (!hoveredId) return null
    const set = new Set<string>([hoveredId])
    for (const edge of edges) {
      if (edge.source === hoveredId) set.add(edge.target)
      if (edge.target === hoveredId) set.add(edge.source)
    }
    return set
  }, [hoveredId, edges])

  return (
    <div ref={ref} role="img" aria-label={`Verknüpfungsgraph mit ${nodes.length} Ideen und ${edges.length} Verknüpfungen`} className="h-full w-full">
      {/* Canvas-Graph ist nicht per Screenreader befahrbar — Textliste als zugängliche Alternative. */}
      <ul className="sr-only">
        {nodes.map((n) => (
          <li key={n.id}>
            <button type="button" onClick={() => onSelectIdea(n.id)}>
              {n.title}
            </button>
          </li>
        ))}
      </ul>
      {size.width > 0 && (
        <ForceGraph2D
          graphData={graphData}
          width={size.width}
          height={size.height}
          nodeId="id"
          nodeLabel="title"
          nodeRelSize={5}
          linkWidth={(link: LinkObject<GraphNode, GraphEdge>) => 0.5 + (link.score ?? 0) * 3}
          linkColor={() => 'rgba(91, 91, 102, 0.35)'}
          nodeColor={(node: NodeObject<GraphNode>) => {
            if (connectedIds && !connectedIds.has(node.id as string)) return 'rgba(91, 91, 102, 0.15)'
            return NODE_COLOR[node.kind] ?? '#3f4e9c'
          }}
          onNodeHover={(node) => setHoveredId((node as NodeObject<GraphNode> | null)?.id?.toString() ?? null)}
          onNodeClick={(node) => onSelectIdea((node as NodeObject<GraphNode>).id as string)}
          backgroundColor="rgba(0,0,0,0)"
        />
      )}
    </div>
  )
}
