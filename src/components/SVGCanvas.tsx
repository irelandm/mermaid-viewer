import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'
import { useAppState } from '../context/useAppState'
import { LoadingSpinner } from './LoadingSpinner'
import { usePanzoom } from '../hooks/usePanzoom'

/**
 * SVGCanvas component renders Mermaid diagrams to SVG and auto-fits to viewport
 */
export function SVGCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { state, dispatch, setZoomHandlers } = useAppState()

  // Initialize panzoom hook (Epic 4)
  const { initPanzoom, disposePanzoom, autoFit, resetView, zoomBy } = usePanzoom()

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

      {/* Loading Spinner Overlay */}
      {state.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-950/80">
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}
