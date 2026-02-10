import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'
import { useAppState } from '../context/useAppState'
import { LoadingSpinner } from './LoadingSpinner'

/**
 * SVGCanvas component renders Mermaid diagrams to SVG and auto-fits to viewport
 * 
 * Responsibilities:
 * - Initialize mermaid library with configuration
 * - Render mermaid code to SVG
 * - Auto-fit diagram to viewport with margins
 * - Display loading indicator during rendering
 * - Manage rendering state (loading, errors)
 * - Display the rendered SVG in the DOM
 */
export function SVGCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const { state, dispatch } = useAppState()

  useEffect(() => {
    // Initialize mermaid library once on component mount
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
    })
  }, [])

  /**
   * Auto-fit diagram to viewport by calculating viewBox and scaling
   */
  const autoFitDiagram = () => {
    if (!svgRef.current || !containerRef.current) {
      return
    }

    try {
      // Get SVG dimensions
      const svg = svgRef.current
      const container = containerRef.current

      // Get the bounding box of the SVG content
      const svgBBox = svg.getBBox()
      
      // Add margins (10-20px)
      const margin = 15
      const viewBoxX = Math.max(0, svgBBox.x - margin)
      const viewBoxY = Math.max(0, svgBBox.y - margin)
      const viewBoxWidth = svgBBox.width + margin * 2
      const viewBoxHeight = svgBBox.height + margin * 2

      // Set viewBox to fit content with margins
      svg.setAttribute('viewBox', `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`)

      // Set preserveAspectRatio to maintain aspect ratio
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')

      // Set width and height to fill container
      svg.setAttribute('width', '100%')
      svg.setAttribute('height', '100%')

      // Set container to allow SVG to expand
      container.style.width = '100%'
      container.style.height = '100%'
    } catch (error) {
      console.error('Error auto-fitting diagram:', error)
    }
  }

  useEffect(() => {
    const renderDiagram = async () => {
      if (!state.mermaidCode || !containerRef.current) {
        return
      }

      try {
        dispatch({ type: 'SET_LOADING', payload: true })

        // Clear previous content
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
            svgRef.current = insertedSvg
            
            // Auto-fit the diagram to the viewport
            // Use setTimeout to ensure DOM is fully updated
            setTimeout(() => {
              autoFitDiagram()
              dispatch({ type: 'SET_LOADING', payload: false })
            }, 100)
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
  }, [state.mermaidCode])

  // Handle window resize to maintain auto-fit
  useEffect(() => {
    const handleResize = () => {
      autoFitDiagram()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!state.mermaidCode) {
    return null
  }

  return (
    <div
      className="flex-1 bg-gray-950 overflow-hidden relative flex items-center justify-center"
      role="region"
      aria-label="Mermaid diagram"
    >
      {/* SVG Container - takes full space */}
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
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
