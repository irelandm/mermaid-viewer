import { useEffect, useRef, useCallback } from 'react'
import panzoom from 'panzoom'
import type { PanZoom } from 'panzoom'
import { useAppState } from '../context/useAppState'

/**
 * Hook to manage panzoom interactions for the SVG canvas
 * 
 * Responsibilities:
 * - Initialize panzoom library on SVG element
 * - Manage zoom/pan state synchronization with AppContext
 * - Provide cleanup on unmount
 * - Configure zoom/pan constraints (0.5x-5x range)
 * 
 * @param elementRef - Reference to the SVG element to attach panzoom to
 * @returns panzoom instance (or null if not initialized)
 */
export function usePanzoom(elementRef: React.RefObject<SVGSVGElement | null>) {
  const { state, dispatch } = useAppState()
  const panzoomInstanceRef = useRef<PanZoom | null>(null)

  // Initialize panzoom on element mount
  useEffect(() => {
    const element = elementRef.current
    if (!element) {
      return
    }

    // Create panzoom instance with configuration
    const instance = panzoom(element, {
      maxZoom: 5,
      minZoom: 0.5,
      smoothScroll: false,
      zoomDoubleClickSpeed: 1,
      beforeWheel: (e) => {
        // Allow wheel events on the SVG canvas
        // This ensures zooming works without conflicts
        const shouldIgnore = !e.target || !(e.target as Element).closest('svg')
        return shouldIgnore
      },
    })

    panzoomInstanceRef.current = instance

    // Sync zoom/pan state with AppContext
    const handleZoom = () => {
      const transform = instance.getTransform()
      dispatch({ type: 'SET_ZOOM', payload: transform.scale })
      dispatch({ type: 'SET_PAN', payload: { x: transform.x, y: transform.y } })
    }

    instance.on('zoom', handleZoom)
    instance.on('pan', handleZoom)

    // Cleanup on unmount
    return () => {
      instance.dispose()
      panzoomInstanceRef.current = null
    }
  }, [elementRef, dispatch])

  // Method to reset zoom/pan to initial state
  const resetView = useCallback(() => {
    const instance = panzoomInstanceRef.current
    if (!instance) {
      return
    }

    instance.moveTo(0, 0)
    instance.zoomAbs(0, 0, 1)
    dispatch({ type: 'RESET_ZOOM_PAN' })
  }, [dispatch])

  // Method to zoom to a specific level
  const zoomTo = useCallback((level: number) => {
    const instance = panzoomInstanceRef.current
    if (!instance) {
      return
    }

    const element = elementRef.current
    if (!element) {
      return
    }

    // Zoom to center of element
    const rect = element.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    instance.zoomTo(centerX, centerY, level)
  }, [elementRef])

  // Method to pan by delta
  const panBy = useCallback((dx: number, dy: number) => {
    const instance = panzoomInstanceRef.current
    if (!instance) {
      return
    }

    instance.moveBy(dx, dy, true)
  }, [])

  return {
    panzoomInstance: panzoomInstanceRef.current,
    resetView,
    zoomTo,
    panBy,
    zoomLevel: state.zoomLevel,
    panX: state.panX,
    panY: state.panY,
  }
}
