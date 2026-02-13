import { useRef, useCallback } from 'react'
import panzoom from 'panzoom'
import type { PanZoom } from 'panzoom'
import { useAppState } from '../context/useAppState'

/**
 * Hook to manage panzoom interactions for the SVG canvas
 *
 * Exposes an `initPanzoom(element)` function that must be called
 * after the SVG element is inserted into the DOM. This avoids
 * timing issues with refs and useEffect.
 */
export function usePanzoom() {
  const { state, dispatch } = useAppState()
  const panzoomInstanceRef = useRef<PanZoom | null>(null)
  const currentElementRef = useRef<SVGSVGElement | null>(null)

  /**
   * Initialize (or re-initialize) panzoom on the given SVG element.
   * Call this after the SVG is in the DOM.
   */
  const initPanzoom = useCallback((element: SVGSVGElement) => {
    // Dispose previous instance if it exists on a different element
    if (panzoomInstanceRef.current && currentElementRef.current !== element) {
      panzoomInstanceRef.current.dispose()
      panzoomInstanceRef.current = null
    }

    // Already initialized on this element
    if (panzoomInstanceRef.current && currentElementRef.current === element) {
      return
    }

    currentElementRef.current = element

    // Create panzoom instance with configuration
    const instance = panzoom(element, {
      maxZoom: 5,
      minZoom: 0.5,
      smoothScroll: false,
      zoomDoubleClickSpeed: 1, // Disable double-click zoom
      beforeWheel: () => {
        // Return false to let panzoom handle all wheel events on the SVG
        return false
      },
    })

    panzoomInstanceRef.current = instance

    // Sync zoom/pan state with AppContext
    instance.on('zoom', () => {
      const transform = instance.getTransform()
      dispatch({ type: 'SET_ZOOM', payload: transform.scale })
      dispatch({ type: 'SET_PAN', payload: { x: transform.x, y: transform.y } })
    })

    instance.on('pan', () => {
      const transform = instance.getTransform()
      dispatch({ type: 'SET_PAN', payload: { x: transform.x, y: transform.y } })
    })

    // Track drag start/end for UI feedback if needed (Story 4.2)
    instance.on('dragstart', () => {
      // Drag started - can be used for cursor changes or feedback
      if (element && element.style) {
        element.style.cursor = 'grabbing'
      }
    })

    instance.on('dragend', () => {
      // Drag ended - inertia will continue via panzoom's internal physics
      if (element && element.style) {
        element.style.cursor = 'grab'
      }
    })

    // Set initial cursor state
    if (element && element.style) {
      element.style.cursor = 'grab'
    }
  }, [dispatch])

  /** Dispose the current panzoom instance. Call on unmount. */
  const disposePanzoom = useCallback(() => {
    if (panzoomInstanceRef.current) {
      panzoomInstanceRef.current.dispose()
      panzoomInstanceRef.current = null
      currentElementRef.current = null
    }
  }, [])

  /** Reset zoom/pan to initial state (scale 1, origin 0,0) */
  const resetView = useCallback(() => {
    const instance = panzoomInstanceRef.current
    if (!instance) return
    instance.moveTo(0, 0)
    instance.zoomAbs(0, 0, 1)
    dispatch({ type: 'RESET_ZOOM_PAN' })
  }, [dispatch])

  /** Zoom to center of element by a delta amount (e.g. +0.2 or -0.2) */
  const zoomBy = useCallback((delta: number) => {
    const instance = panzoomInstanceRef.current
    const element = currentElementRef.current
    if (!instance || !element) return

    const currentZoom = instance.getTransform().scale
    let newLevel = Math.max(0.5, Math.min(5, currentZoom + delta))

    // Snap to 100% if close (within 8%)
    if (Math.abs(newLevel - 1.0) < 0.08) {
      newLevel = 1.0
    }

    const rect = element.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    // Use zoomAbs for absolute zoom level (zoomTo is a relative multiplier)
    instance.zoomAbs(centerX, centerY, newLevel)
  }, [])

  /** Zoom to an absolute level, centered on the element */
  const zoomTo = useCallback((level: number) => {
    const instance = panzoomInstanceRef.current
    const element = currentElementRef.current
    if (!instance || !element) return

    const rect = element.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    // Use zoomAbs for absolute zoom level (zoomTo is a relative multiplier)
    instance.zoomAbs(centerX, centerY, level)
  }, [])

  /** Pan by a delta amount */
  const panBy = useCallback((dx: number, dy: number) => {
    const instance = panzoomInstanceRef.current
    if (!instance) return
    instance.moveBy(dx, dy, true)
  }, [])

  /**
   * Auto-fit the SVG diagram into its container.
   * Sets the SVG to its natural size and uses panzoom to scale/position it.
   */
  const autoFit = useCallback((container: HTMLDivElement) => {
    const instance = panzoomInstanceRef.current
    const element = currentElementRef.current
    if (!instance || !element) return

    try {
      const svgBBox = element.getBBox()
      const containerRect = container.getBoundingClientRect()

      // Set SVG to its natural content size so panzoom transforms work
      element.setAttribute('width', String(svgBBox.width))
      element.setAttribute('height', String(svgBBox.height))

      // Calculate scale to fit diagram in container with margins
      const margin = 15
      const scaleX = (containerRect.width - margin * 2) / svgBBox.width
      const scaleY = (containerRect.height - margin * 2) / svgBBox.height
      const initialScale = Math.min(scaleX, scaleY, 1)

      // Center the diagram in the container
      const scaledWidth = svgBBox.width * initialScale
      const scaledHeight = svgBBox.height * initialScale
      const offsetX = (containerRect.width - scaledWidth) / 2 - svgBBox.x * initialScale
      const offsetY = (containerRect.height - scaledHeight) / 2 - svgBBox.y * initialScale

      // Apply transform
      instance.moveTo(offsetX, offsetY)
      instance.zoomAbs(offsetX, offsetY, initialScale)
    } catch (error) {
      console.error('Error auto-fitting diagram:', error)
    }
  }, [])

  return {
    initPanzoom,
    disposePanzoom,
    autoFit,
    resetView,
    zoomTo,
    zoomBy,
    panBy,
    zoomLevel: state.zoomLevel,
    panX: state.panX,
    panY: state.panY,
  }
}
