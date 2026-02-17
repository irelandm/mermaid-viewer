import { describe, it, expect, beforeEach } from 'vitest'
import {
  extractBareId,
  buildNodeIdMap,
  parseEdgeId,
  buildEdgeMap,
  findConnections,
  clearConnectedClasses,
  applyConnectedHighlighting,
} from '../../utils/svgNodeHelpers'

/**
 * Story 5.3: Highlight Connected Nodes & Edges
 * Tests for SVG node/edge highlighting utility functions
 *
 * Mermaid v11 SVG structure:
 *   Nodes: <g class="node default" id="flowchart-A-0">
 *   Edges: <path id="L_A_B_0" class="...flowchart-link"> inside <g class="edgePaths">
 */
describe('SVG Node Helpers – Story 5.3: Highlight Connected Nodes & Edges', () => {
  let svg: Element

  beforeEach(() => {
    // Create DOM matching real Mermaid v11 output structure
    const svgString = `
      <svg id="test-diagram">
        <g>
          <g class="edgePaths">
            <path id="L_A_B_0" class=" edge-thickness-normal edge-pattern-solid flowchart-link" d="M100,100 L200,100"/>
            <path id="L_B_C_0" class=" edge-thickness-normal edge-pattern-solid flowchart-link" d="M200,100 L300,100"/>
            <path id="L_C_D_0" class=" edge-thickness-normal edge-pattern-solid flowchart-link" d="M300,100 L400,100"/>
          </g>
          <g class="nodes">
            <g class="node default" id="flowchart-A-0"><rect/><text>Start</text></g>
            <g class="node default" id="flowchart-B-1"><rect/><text>Do something</text></g>
            <g class="node default" id="flowchart-C-2"><rect/><text>Do something else</text></g>
            <g class="node default" id="flowchart-D-3"><rect/><text>End</text></g>
          </g>
        </g>
      </svg>
    `
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgString, 'image/svg+xml')
    svg = doc.querySelector('svg') as Element
  })

  /**
   * extractBareId
   */
  describe('extractBareId', () => {
    it('extracts bare ID from standard Mermaid DOM ID', () => {
      expect(extractBareId('flowchart-A-0')).toBe('A')
      expect(extractBareId('flowchart-myNode-5')).toBe('myNode')
    })

    it('handles node IDs with hyphens', () => {
      expect(extractBareId('flowchart-my-node-12')).toBe('my-node')
    })

    it('handles node IDs without flowchart prefix', () => {
      expect(extractBareId('A-0')).toBe('A')
    })
  })

  /**
   * buildNodeIdMap
   */
  describe('buildNodeIdMap', () => {
    it('builds mapping of bare IDs to DOM IDs', () => {
      const map = buildNodeIdMap(svg)

      expect(map.get('A')).toBe('flowchart-A-0')
      expect(map.get('B')).toBe('flowchart-B-1')
      expect(map.get('C')).toBe('flowchart-C-2')
      expect(map.get('D')).toBe('flowchart-D-3')
      expect(map.size).toBe(4)
    })
  })

  /**
   * parseEdgeId
   */
  describe('parseEdgeId', () => {
    const knownIds = ['A', 'B', 'C', 'D']

    it('parses standard Mermaid edge IDs', () => {
      expect(parseEdgeId('L_A_B_0', knownIds)).toEqual({ source: 'A', target: 'B' })
      expect(parseEdgeId('L_B_C_0', knownIds)).toEqual({ source: 'B', target: 'C' })
      expect(parseEdgeId('L_C_D_0', knownIds)).toEqual({ source: 'C', target: 'D' })
    })

    it('returns null for non-edge IDs', () => {
      expect(parseEdgeId('flowchart-A-0', knownIds)).toBeNull()
      expect(parseEdgeId('', knownIds)).toBeNull()
    })

    it('handles node IDs with underscores via longest-first matching', () => {
      const ids = ['my_node', 'B', 'my']
      expect(parseEdgeId('L_my_node_B_0', ids)).toEqual({ source: 'my_node', target: 'B' })
    })
  })

  /**
   * buildEdgeMap
   */
  describe('buildEdgeMap', () => {
    it('builds edge info from SVG', () => {
      const knownIds = ['A', 'B', 'C', 'D']
      const edges = buildEdgeMap(svg, knownIds)

      expect(edges.length).toBe(3)
      expect(edges[0]).toMatchObject({ source: 'A', target: 'B' })
      expect(edges[1]).toMatchObject({ source: 'B', target: 'C' })
      expect(edges[2]).toMatchObject({ source: 'C', target: 'D' })
    })
  })

  /**
   * AC-5.3.1: Identify and highlight connected nodes
   */
  describe('AC-5.3.1: Find connected nodes from edges', () => {
    it('should identify all directly connected node DOM IDs for a selected node', () => {
      // Select node B (flowchart-B-1): connected to A and C
      const { connectedNodeDomIds } = findConnections('flowchart-B-1', svg)

      expect(connectedNodeDomIds).toContain('flowchart-A-0')
      expect(connectedNodeDomIds).toContain('flowchart-C-2')
      expect(connectedNodeDomIds).not.toContain('flowchart-B-1') // not self
      expect(connectedNodeDomIds).not.toContain('flowchart-D-3') // not connected
    })

    it('should return empty arrays for node with no connections', () => {
      const { connectedNodeDomIds, connectedEdgeElements } = findConnections(
        'flowchart-NONEXISTENT-99',
        svg
      )
      expect(connectedNodeDomIds).toEqual([])
      expect(connectedEdgeElements).toEqual([])
    })

    it('should identify only direct neighbors for leaf nodes', () => {
      // Node A connects only to B
      const fromA = findConnections('flowchart-A-0', svg)
      expect(fromA.connectedNodeDomIds).toEqual(['flowchart-B-1'])

      // Node D connects only to C
      const fromD = findConnections('flowchart-D-3', svg)
      expect(fromD.connectedNodeDomIds).toEqual(['flowchart-C-2'])
    })
  })

  /**
   * AC-5.3.2: Find and highlight connected edges
   */
  describe('AC-5.3.2: Find connected edges', () => {
    it('should identify all edge elements connected to a node', () => {
      // Node B has edges L_A_B_0 and L_B_C_0
      const { connectedEdgeElements } = findConnections('flowchart-B-1', svg)

      expect(connectedEdgeElements.length).toBe(2)
      const edgeIds = connectedEdgeElements.map((e) => e.id)
      expect(edgeIds).toContain('L_A_B_0')
      expect(edgeIds).toContain('L_B_C_0')
    })

    it('should not include edges not connected to the node', () => {
      // Node A should only have L_A_B_0
      const { connectedEdgeElements } = findConnections('flowchart-A-0', svg)

      expect(connectedEdgeElements.length).toBe(1)
      expect(connectedEdgeElements[0].id).toBe('L_A_B_0')
    })
  })

  /**
   * AC-5.3.3: Apply and manage connected classes
   */
  describe('AC-5.3.3: Apply and clear connected highlighting', () => {
    it('should apply .node-connected class to connected nodes', () => {
      const nodeA = svg.querySelector('#flowchart-A-0')!
      const nodeC = svg.querySelector('#flowchart-C-2')!

      expect(nodeA.classList.contains('node-connected')).toBe(false)
      expect(nodeC.classList.contains('node-connected')).toBe(false)

      // Apply highlighting for node B
      applyConnectedHighlighting('flowchart-B-1', svg)

      expect(nodeA.classList.contains('node-connected')).toBe(true)
      expect(nodeC.classList.contains('node-connected')).toBe(true)
    })

    it('should apply .edge-connected class to connected edges', () => {
      const edgeAB = svg.querySelector('#L_A_B_0')!
      const edgeBC = svg.querySelector('#L_B_C_0')!
      const edgeCD = svg.querySelector('#L_C_D_0')!

      applyConnectedHighlighting('flowchart-B-1', svg)

      expect(edgeAB.classList.contains('edge-connected')).toBe(true)
      expect(edgeBC.classList.contains('edge-connected')).toBe(true)
      expect(edgeCD.classList.contains('edge-connected')).toBe(false)
    })

    it('should clear previous highlighting when applying new highlighting', () => {
      // Apply for node B
      applyConnectedHighlighting('flowchart-B-1', svg)

      const nodeA = svg.querySelector('#flowchart-A-0')!
      const nodeC = svg.querySelector('#flowchart-C-2')!
      expect(nodeA.classList.contains('node-connected')).toBe(true)
      expect(nodeC.classList.contains('node-connected')).toBe(true)

      // Now switch to node C
      applyConnectedHighlighting('flowchart-C-2', svg)

      // A should no longer be connected (not neighbor of C)
      expect(nodeA.classList.contains('node-connected')).toBe(false)
      // B and D should now be connected to C
      expect(svg.querySelector('#flowchart-B-1')!.classList.contains('node-connected')).toBe(true)
      expect(svg.querySelector('#flowchart-D-3')!.classList.contains('node-connected')).toBe(true)
    })

    it('should clear all connected classes with clearConnectedClasses', () => {
      applyConnectedHighlighting('flowchart-B-1', svg)

      const nodeA = svg.querySelector('#flowchart-A-0')!
      const edgeAB = svg.querySelector('#L_A_B_0')!
      expect(nodeA.classList.contains('node-connected')).toBe(true)
      expect(edgeAB.classList.contains('edge-connected')).toBe(true)

      clearConnectedClasses(svg)

      expect(nodeA.classList.contains('node-connected')).toBe(false)
      expect(edgeAB.classList.contains('edge-connected')).toBe(false)
    })
  })
})
