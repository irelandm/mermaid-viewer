/**
 * Utility functions for finding and manipulating connected nodes/edges in Mermaid SVG diagrams.
 *
 * Mermaid v11 SVG structure (dagre layout):
 * - Nodes: <g class="nodes"> > <g class="node default" id="flowchart-A-0">
 * - Edges: <g class="edgePaths"> > <path id="L_A_B_0" class="...flowchart-link">
 * - Edge IDs: L_{sourceBarId}_{targetBareId}_{counter}
 * - Node DOM IDs: flowchart-{bareId}-{counter}
 */

/**
 * Extract the bare node ID from a Mermaid DOM ID.
 * "flowchart-A-0" → "A", "flowchart-myNode-5" → "myNode"
 * Strips the "flowchart-" prefix and the trailing "-{counter}" suffix.
 */
export function extractBareId(domId: string): string {
  // Strip "flowchart-" prefix
  let bare = domId.replace(/^flowchart-/, '')
  // Strip the last "-{digits}" suffix (the vertex counter)
  bare = bare.replace(/-\d+$/, '')
  return bare
}

/**
 * Build a mapping of all node bare IDs to their DOM IDs from the SVG.
 */
export function buildNodeIdMap(svg: Element): Map<string, string> {
  const bareIdToDomId = new Map<string, string>()
  const nodes = svg.querySelectorAll('g.node')

  nodes.forEach((node) => {
    const domId = node.id
    if (domId) {
      const bareId = extractBareId(domId)
      bareIdToDomId.set(bareId, domId)
    }
  })

  return bareIdToDomId
}

/**
 * Parse a Mermaid edge ID to extract source and target bare node IDs.
 *
 * Edge ID format: L_{source}_{target}_{counter}
 * e.g. "L_A_B_0" → { source: "A", target: "B" }
 *
 * For node IDs with underscores (e.g., "my_node"), we try all known bare IDs
 * longest-first to resolve ambiguity.
 */
export function parseEdgeId(
  edgeId: string,
  knownBareIds: string[]
): { source: string; target: string } | null {
  if (!edgeId.startsWith('L_')) return null

  // Strip "L_" prefix
  const withoutPrefix = edgeId.substring(2)
  // Strip trailing "_{counter}" (last _digits)
  const withoutSuffix = withoutPrefix.replace(/_\d+$/, '')

  // Sort known IDs longest-first for greedy matching
  const sorted = [...knownBareIds].sort((a, b) => b.length - a.length)

  for (const candidateSource of sorted) {
    if (
      withoutSuffix.startsWith(candidateSource + '_')
    ) {
      const rest = withoutSuffix.substring(candidateSource.length + 1)
      if (knownBareIds.includes(rest)) {
        return { source: candidateSource, target: rest }
      }
    }
  }

  return null
}

/**
 * Build the full edge adjacency structure: for each bare node ID,
 * which other bare node IDs are connected, and which edge elements link them.
 */
export interface EdgeInfo {
  element: Element
  source: string
  target: string
}

export function buildEdgeMap(
  svg: Element,
  knownBareIds: string[]
): EdgeInfo[] {
  const edges: EdgeInfo[] = []
  // Mermaid v11 edges: <path> elements inside <g class="edgePaths"> with class "flowchart-link"
  const edgePaths = svg.querySelectorAll(
    '.edgePaths > path, path.flowchart-link'
  )

  edgePaths.forEach((edgePath) => {
    const edgeId = edgePath.id || ''
    const parsed = parseEdgeId(edgeId, knownBareIds)
    if (parsed) {
      edges.push({
        element: edgePath,
        source: parsed.source,
        target: parsed.target,
      })
    }
  })

  return edges
}

/**
 * Find connected edge elements and connected node DOM IDs for a given selected node.
 */
export function findConnections(
  selectedDomId: string,
  svg: Element
): {
  connectedNodeDomIds: string[]
  connectedEdgeElements: Element[]
} {
  const bareIdToDomId = buildNodeIdMap(svg)
  const knownBareIds = Array.from(bareIdToDomId.keys())
  const selectedBareId = extractBareId(selectedDomId)

  const edges = buildEdgeMap(svg, knownBareIds)

  const connectedBareIds = new Set<string>()
  const connectedEdgeElements: Element[] = []

  edges.forEach((edge) => {
    if (edge.source === selectedBareId) {
      connectedBareIds.add(edge.target)
      connectedEdgeElements.push(edge.element)
    } else if (edge.target === selectedBareId) {
      connectedBareIds.add(edge.source)
      connectedEdgeElements.push(edge.element)
    }
  })

  // Map bare IDs back to DOM IDs
  const connectedNodeDomIds = Array.from(connectedBareIds)
    .map((bareId) => bareIdToDomId.get(bareId))
    .filter((domId): domId is string => domId !== undefined)

  return { connectedNodeDomIds, connectedEdgeElements }
}

/**
 * Clear connected classes from all nodes and edges in the SVG
 */
export function clearConnectedClasses(svg: Element): void {
  svg.querySelectorAll('.node-connected').forEach((el) => {
    el.classList.remove('node-connected')
  })
  svg.querySelectorAll('.edge-connected').forEach((el) => {
    el.classList.remove('edge-connected')
  })
}

/**
 * Apply connected highlighting to nodes and edges related to a selected node.
 * selectedNodeId is the DOM ID (e.g., "flowchart-A-0").
 */
export function applyConnectedHighlighting(
  selectedNodeId: string,
  svg: Element
): void {
  clearConnectedClasses(svg)

  const { connectedNodeDomIds, connectedEdgeElements } = findConnections(
    selectedNodeId,
    svg
  )

  // Apply .node-connected to connected node groups
  connectedNodeDomIds.forEach((domId) => {
    const nodeEl = svg.querySelector(`#${CSS.escape(domId)}`)
    if (nodeEl) {
      nodeEl.classList.add('node-connected')
    }
  })

  // Apply .edge-connected to connected edge paths
  connectedEdgeElements.forEach((edgeEl) => {
    edgeEl.classList.add('edge-connected')
  })
}
