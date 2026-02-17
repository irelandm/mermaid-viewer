import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { useAppState } from '../context/useAppState'
import { LoadingSpinner } from './LoadingSpinner'
import { Tooltip } from './Tooltip'
import { usePanzoom } from '../hooks/usePanzoom'
import { clearConnectedClasses, applyConnectedHighlighting, findConnections, extractBareId, buildNodeIdMap, buildEdgeMap } from '../utils/svgNodeHelpers'
import type { NodeMetadata, NodeConnection } from '../types'

/**
 * SVGCanvas component renders Mermaid diagrams to SVG and auto-fits to viewport
 */
export function SVGCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { state, dispatch, setZoomHandlers } = useAppState()

  // Initialize panzoom hook (Epic 4)
  const { initPanzoom, disposePanzoom, autoFit, resetView, zoomBy } = usePanzoom()

  // Hover tooltip state (Epic 5 - Story 5.4)
  const [hoverInfo, setHoverInfo] = useState<{
    label: string
    nodeId: string
    x: number
    y: number
  } | null>(null)

  // Cleanup panzoom on unmount
  useEffect(() => {
    return () => disposePanzoom()
  }, [disposePanzoom])

  useEffect(() => {
    // Initialize mermaid library once on component mount
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
    })
  }, [])

  // Register zoom handlers for use by Toolbar (Epic 4)
  useEffect(() => {
    const ZOOM_STEP = 0.2

    setZoomHandlers({
      zoomIn: () => zoomBy(ZOOM_STEP),
      zoomOut: () => zoomBy(-ZOOM_STEP),
      resetView,
    })

    return () => setZoomHandlers(null)
  }, [zoomBy, resetView, setZoomHandlers])

  // Keyboard zoom shortcuts (Epic 4 - Story 4.5)
  useEffect(() => {
    const ZOOM_STEP = 0.2

    const handleKeyDown = (event: KeyboardEvent) => {
      // Only respond to + and - keys (handle both + and = on US keyboard)
      if (event.key === '+' || event.key === '=') {
        event.preventDefault()
        zoomBy(ZOOM_STEP)
      } else if (event.key === '-' || event.key === '_') {
        event.preventDefault()
        zoomBy(-ZOOM_STEP)
      }
    }

    // Add listener to document so it works even when search input is focused
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [zoomBy])

  /**
   * Extract node ID from element by traversing up the DOM tree
   * Mermaid uses elements with id like "flowchart-A-0" or class "node"
   */
  const getNodeIdFromElement = (element: Element): string | null => {
    let current: Element | null = element
    while (current && current !== containerRef.current) {
      // Check if this is a node group element (has class "node")
      if (current.classList.contains('node')) {
        // Return the ID of this element
        return current.id || null
      }
      // Check for data-node-id attribute (custom attribute)
      const nodeId = current.getAttribute('data-node-id')
      if (nodeId) {
        return nodeId
      }
      current = current.parentElement
    }
    return null
  }

  /**
   * Handle node selection via click delegation (Epic 5 - Story 5.1)
   * Single listener pattern for 2000+ nodes
   */
  useEffect(() => {
    const svgContainer = containerRef.current
    if (!svgContainer) return

    const handleSvgClick = (event: MouseEvent) => {
      const clickedElement = event.target as Element
      const nodeId = getNodeIdFromElement(clickedElement)

      if (nodeId) {
        dispatch({ type: 'SET_SELECTED_NODE', payload: nodeId })
      } else {
        dispatch({ type: 'SET_SELECTED_NODE', payload: null })
      }
    }

    svgContainer.addEventListener('click', handleSvgClick)

    return () => {
      svgContainer.removeEventListener('click', handleSvgClick)
    }
  }, [dispatch])

  /**
   * Handle node hover tooltip via event delegation (Epic 5 - Story 5.4)
   * Shows tooltip with "Label – node_id" on mouseover, hides on mouseout
   */
  useEffect(() => {
    const svgContainer = containerRef.current
    if (!svgContainer) return

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as Element
      const nodeId = getNodeIdFromElement(target)

      if (nodeId) {
        // Find the node group element to extract label
        let nodeEl: Element | null = target
        while (nodeEl && !nodeEl.classList.contains('node')) {
          nodeEl = nodeEl.parentElement
        }

        // Extract label from .nodeLabel text content
        let label = ''
        if (nodeEl) {
          const labelEl = nodeEl.querySelector('.nodeLabel')
          if (labelEl) {
            label = labelEl.textContent?.trim() || ''
          }
          // Fallback: try text element directly
          if (!label) {
            const textEl = nodeEl.querySelector('text')
            label = textEl?.textContent?.trim() || ''
          }
        }

        const bareId = extractBareId(nodeId)

        setHoverInfo({
          label: label || bareId,
          nodeId: bareId,
          x: event.clientX,
          y: event.clientY,
        })
      }
    }

    const handleMouseOut = (event: MouseEvent) => {
      const relatedTarget = event.relatedTarget as Element | null
      // Only hide if we're leaving a node (not moving between child elements)
      if (relatedTarget) {
        const stillInNode = getNodeIdFromElement(relatedTarget)
        if (stillInNode) return
      }
      setHoverInfo(null)
    }

    const handleMouseMove = (event: MouseEvent) => {
      // Update tooltip position as mouse moves within a node
      setHoverInfo(prev => {
        if (!prev) return null
        return { ...prev, x: event.clientX, y: event.clientY }
      })
    }

    svgContainer.addEventListener('mouseover', handleMouseOver)
    svgContainer.addEventListener('mouseout', handleMouseOut)
    svgContainer.addEventListener('mousemove', handleMouseMove)

    return () => {
      svgContainer.removeEventListener('mouseover', handleMouseOver)
      svgContainer.removeEventListener('mouseout', handleMouseOut)
      svgContainer.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Hide tooltip on click (selecting a node should dismiss tooltip)
  useEffect(() => {
    setHoverInfo(null)
  }, [state.selectedNodeId])

  useEffect(() => {
    const renderDiagram = async () => {
      if (!state.mermaidCode || !containerRef.current) {
        return
      }

      try {
        dispatch({ type: 'SET_LOADING', payload: true })

        // Clear previous content and dispose old panzoom
        disposePanzoom()
        if (containerRef.current) {
          containerRef.current.innerHTML = ''
        }

        // Generate unique ID for each render to avoid conflicts
        const diagramId = `mermaid-diagram-${Date.now()}`

        // Render mermaid diagram to SVG
        const { svg } = await mermaid.render(
          diagramId,
          state.mermaidCode
        )

        // Insert the rendered SVG into the container
        if (containerRef.current) {
          containerRef.current.innerHTML = svg

          // Get reference to the inserted SVG element
          const insertedSvg = containerRef.current.querySelector('svg') as SVGSVGElement
          if (insertedSvg) {
            // Initialize panzoom on the new SVG element, then auto-fit
            initPanzoom(insertedSvg)
            // Small delay to ensure DOM layout is settled
            requestAnimationFrame(() => {
              if (containerRef.current) {
                autoFit(containerRef.current)
              }
              dispatch({ type: 'SET_LOADING', payload: false })
            })
          } else {
            dispatch({ type: 'SET_LOADING', payload: false })
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : 'Failed to render diagram'

        dispatch({
          type: 'SET_STATUS',
          payload: {
            type: 'error',
            message: `Rendering error: ${errorMessage}`,
          },
        })
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    renderDiagram()
  }, [state.mermaidCode, dispatch, initPanzoom, disposePanzoom, autoFit])

  /**
   * Apply node selection styling via CSS class (Epic 5 - Story 5.2)
   * and connected node/edge highlighting (Epic 5 - Story 5.3)
   * Updates whenever selectedNodeId changes
   */
  useEffect(() => {
    if (!containerRef.current) return

    const svg = containerRef.current.querySelector('svg') as SVGSVGElement
    if (!svg) return

    // Remove previous selection highlighting
    svg.querySelectorAll('.node-selected').forEach(el => {
      el.classList.remove('node-selected')
    })

    // Clear previous connected highlighting (Epic 5 - Story 5.3)
    clearConnectedClasses(svg)

    // Apply selection to current node
    if (state.selectedNodeId) {
      // Find the node element - it should be a <g> with class "node" and id matching selectedNodeId
      let selectedElement: Element | null = svg.querySelector(`g.node#${CSS.escape(state.selectedNodeId)}`)

      // Fallback: try just by ID
      if (!selectedElement) {
        selectedElement = svg.getElementById(state.selectedNodeId)
      }

      // Fallback: try data-node-id attribute
      if (!selectedElement) {
        selectedElement = svg.querySelector(`[data-node-id="${state.selectedNodeId}"]`)
      }

      if (selectedElement) {
        selectedElement.classList.add('node-selected')
      }

      // Apply connected node/edge highlighting (Epic 5 - Story 5.3)
      applyConnectedHighlighting(state.selectedNodeId, svg)

      // Compute node metadata for SidePanel (Epic 5 - Story 5.6)
      const bareId = extractBareId(state.selectedNodeId)

      // Extract label
      let label = ''
      if (selectedElement) {
        const labelEl = selectedElement.querySelector('.nodeLabel')
        if (labelEl) {
          label = labelEl.textContent?.trim() || ''
        }
        if (!label) {
          const textEl = selectedElement.querySelector('text')
          label = textEl?.textContent?.trim() || ''
        }
      }

      // Get connections
      const { connectedNodeDomIds } = findConnections(state.selectedNodeId, svg)
      const bareIdToDomId = buildNodeIdMap(svg)
      const domIdToBareId = new Map<string, string>()
      bareIdToDomId.forEach((domId, bId) => domIdToBareId.set(domId, bId))

      // Build edge map to determine direction
      const knownBareIds = Array.from(bareIdToDomId.keys())
      const edgeList = buildEdgeMap(svg, knownBareIds)

      const connections: NodeConnection[] = connectedNodeDomIds.map(domId => {
        const targetBareId = domIdToBareId.get(domId) || extractBareId(domId)
        // Get target label from SVG
        let targetLabel = targetBareId
        const targetEl = svg.querySelector(`#${CSS.escape(domId)}`)
        if (targetEl) {
          const tLabelEl = targetEl.querySelector('.nodeLabel')
          if (tLabelEl) targetLabel = tLabelEl.textContent?.trim() || targetBareId
          else {
            const tTextEl = targetEl.querySelector('text')
            targetLabel = tTextEl?.textContent?.trim() || targetBareId
          }
        }
        // Determine direction from edge map
        const isOutgoing = edgeList.some(e => e.source === bareId && e.target === targetBareId)
        const direction: 'outgoing' | 'incoming' = isOutgoing ? 'outgoing' : 'incoming'
        return { edgeSource: bareId, edgeTarget: targetBareId, targetLabel, direction }
      })

      const meta: NodeMetadata = { bareId, label: label || bareId, connections }
      dispatch({ type: 'SET_SELECTED_NODE_META', payload: meta })
    } else {
      dispatch({ type: 'SET_SELECTED_NODE_META', payload: null })
    }
  }, [state.selectedNodeId, dispatch])

  if (!state.mermaidCode) {
    return null
  }

  return (
    <div
      className="flex-1 bg-gray-950 overflow-hidden relative"
      role="region"
      aria-label="Mermaid diagram"
    >
      {/* SVG Container */}
      <div
        ref={containerRef}
        className="w-full h-full"
      />

      {/* Node Hover Tooltip (Epic 5 - Story 5.4) */}
      {hoverInfo && (
        <Tooltip
          label={hoverInfo.label}
          nodeId={hoverInfo.nodeId}
          x={hoverInfo.x}
          y={hoverInfo.y}
          visible={true}
        />
      )}

      {/* Loading Spinner Overlay */}
      {state.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-950/80">
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}
