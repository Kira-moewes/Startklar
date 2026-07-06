import type { IdeaLink } from './types'
import type { GraphIdea } from '../hooks/useGraphData'

export interface GraphNode {
  id: string
  title: string
  folderId: string | null
  kind: GraphIdea['kind']
}

export interface GraphEdge {
  source: string
  target: string
  relation: IdeaLink['relation']
  score: number
}

export function toGraphData(ideas: GraphIdea[], links: IdeaLink[]): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes = ideas.map((idea) => ({
    id: idea.id,
    title: idea.title || 'Ohne Titel',
    folderId: idea.folder_id,
    kind: idea.kind,
  }))
  const edges = links.map((link) => ({
    source: link.source_id,
    target: link.target_id,
    relation: link.relation,
    score: link.score,
  }))
  return { nodes, edges }
}

/**
 * Deterministische Breitensuche über die Verknüpfungskanten ab den
 * Seed-Ideen, bis zur angegebenen Tiefe. Kein LLM beteiligt — die Mindmap
 * liest ausschließlich die bereits vorhandenen `idea_links`-Daten.
 */
export function bfsSubgraph(
  nodes: GraphNode[],
  edges: GraphEdge[],
  seedIds: string[],
  depth: number,
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  if (seedIds.length === 0) return { nodes, edges }

  const nodeById = new Map(nodes.map((n) => [n.id, n]))
  const neighborsOf = new Map<string, Set<string>>()
  for (const edge of edges) {
    if (!neighborsOf.has(edge.source)) neighborsOf.set(edge.source, new Set())
    if (!neighborsOf.has(edge.target)) neighborsOf.set(edge.target, new Set())
    neighborsOf.get(edge.source)!.add(edge.target)
    neighborsOf.get(edge.target)!.add(edge.source)
  }

  const visited = new Set<string>(seedIds)
  let frontier = new Set<string>(seedIds)

  for (let hop = 0; hop < depth; hop++) {
    const next = new Set<string>()
    for (const id of frontier) {
      for (const neighbor of neighborsOf.get(id) ?? []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          next.add(neighbor)
        }
      }
    }
    frontier = next
    if (frontier.size === 0) break
  }

  const includedNodes = [...visited].map((id) => nodeById.get(id)).filter((n): n is GraphNode => !!n)
  const includedEdges = edges.filter((e) => visited.has(e.source) && visited.has(e.target))
  return { nodes: includedNodes, edges: includedEdges }
}
