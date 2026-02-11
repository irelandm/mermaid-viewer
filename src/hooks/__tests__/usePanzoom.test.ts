import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { usePanzoom } from '../usePanzoom'
import { AppProvider } from '../../context/AppProvider'

// Mock panzoom library - vi.hoisted ensures these are available before vi.mock hoisting
const {
  mockDispose,
  mockMoveTo,
  mockZoomAbs,
  mockZoomTo,
  mockMoveBy,
  mockOn,
  mockPanzoomFn,
} = vi.hoisted(() => {
  const mockDispose = vi.fn()
  const mockGetTransform = vi.fn(() => ({ scale: 1, x: 0, y: 0 }))
  const mockMoveTo = vi.fn()
  const mockZoomAbs = vi.fn()
  const mockZoomTo = vi.fn()
  const mockMoveBy = vi.fn()
  const mockOn = vi.fn()

  const mockPanzoomInstance = {
    dispose: mockDispose,
    getTransform: mockGetTransform,
    moveTo: mockMoveTo,
    zoomAbs: mockZoomAbs,
    zoomTo: mockZoomTo,
    moveBy: mockMoveBy,
    on: mockOn,
  }

  const mockPanzoomFn = vi.fn(() => mockPanzoomInstance)

  return {
    mockDispose,
    mockMoveTo,
    mockZoomAbs,
    mockZoomTo,
    mockMoveBy,
    mockOn,
    mockPanzoomFn,
  }
})

vi.mock('panzoom', () => ({
  default: mockPanzoomFn,
}))

describe('usePanzoom', () => {
  let mockSvgElement: SVGSVGElement

  beforeEach(() => {
    mockSvgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    mockSvgElement.getBoundingClientRect = vi.fn(() => ({
      width: 800,
      height: 600,
      top: 0,
      left: 0,
      bottom: 600,
      right: 800,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }))
    document.body.appendChild(mockSvgElement)
  })

  afterEach(() => {
    document.body.removeChild(mockSvgElement)
    vi.clearAllMocks()
  })

  it('should initialize panzoom instance when element ref has a value', () => {
    const svgRef = { current: mockSvgElement }

    renderHook(() => usePanzoom(svgRef), { wrapper: AppProvider })

    expect(mockPanzoomFn).toHaveBeenCalledWith(
      mockSvgElement,
      expect.objectContaining({
        maxZoom: 5,
        minZoom: 0.5,
        smoothScroll: false,
      }),
    )
  })

  it('should not initialize panzoom when element ref is null', () => {
    const svgRef = { current: null }

    const { result } = renderHook(() => usePanzoom(svgRef), {
      wrapper: AppProvider,
    })

    expect(result.current.panzoomInstance).toBeNull()
    expect(mockPanzoomFn).not.toHaveBeenCalled()
  })

  it('should return all expected utilities and state', () => {
    const svgRef = { current: mockSvgElement }

    const { result } = renderHook(() => usePanzoom(svgRef), {
      wrapper: AppProvider,
    })

    expect(result.current).toHaveProperty('resetView')
    expect(result.current).toHaveProperty('zoomTo')
    expect(result.current).toHaveProperty('panBy')
    expect(result.current).toHaveProperty('zoomLevel')
    expect(result.current).toHaveProperty('panX')
    expect(result.current).toHaveProperty('panY')
    expect(result.current).toHaveProperty('panzoomInstance')
  })

  it('should have initial zoom/pan state values', () => {
    const svgRef = { current: mockSvgElement }

    const { result } = renderHook(() => usePanzoom(svgRef), {
      wrapper: AppProvider,
    })

    expect(result.current.zoomLevel).toBe(1)
    expect(result.current.panX).toBe(0)
    expect(result.current.panY).toBe(0)
  })

  it('should register zoom and pan event listeners', () => {
    const svgRef = { current: mockSvgElement }

    renderHook(() => usePanzoom(svgRef), { wrapper: AppProvider })

    expect(mockOn).toHaveBeenCalledWith('zoom', expect.any(Function))
    expect(mockOn).toHaveBeenCalledWith('pan', expect.any(Function))
  })

  it('should call moveTo and zoomAbs on resetView', () => {
    const svgRef = { current: mockSvgElement }

    const { result } = renderHook(() => usePanzoom(svgRef), {
      wrapper: AppProvider,
    })

    result.current.resetView()

    expect(mockMoveTo).toHaveBeenCalledWith(0, 0)
    expect(mockZoomAbs).toHaveBeenCalledWith(0, 0, 1)
  })

  it('should call zoomTo centered on element', () => {
    const svgRef = { current: mockSvgElement }

    const { result } = renderHook(() => usePanzoom(svgRef), {
      wrapper: AppProvider,
    })

    result.current.zoomTo(2)

    expect(mockZoomTo).toHaveBeenCalledWith(400, 300, 2)
  })

  it('should call moveBy on panBy', () => {
    const svgRef = { current: mockSvgElement }

    const { result } = renderHook(() => usePanzoom(svgRef), {
      wrapper: AppProvider,
    })

    result.current.panBy(50, -30)

    expect(mockMoveBy).toHaveBeenCalledWith(50, -30, true)
  })

  it('should dispose panzoom instance on unmount', () => {
    const svgRef = { current: mockSvgElement }

    const { unmount } = renderHook(() => usePanzoom(svgRef), {
      wrapper: AppProvider,
    })

    unmount()

    expect(mockDispose).toHaveBeenCalled()
  })

  it('should not throw when resetView is called with null ref', () => {
    const svgRef = { current: null }

    const { result } = renderHook(() => usePanzoom(svgRef), {
      wrapper: AppProvider,
    })

    expect(() => result.current.resetView()).not.toThrow()
  })

  it('should not throw when zoomTo is called with null ref', () => {
    const svgRef = { current: null }

    const { result } = renderHook(() => usePanzoom(svgRef), {
      wrapper: AppProvider,
    })

    expect(() => result.current.zoomTo(2)).not.toThrow()
  })

  it('should not throw when panBy is called with null ref', () => {
    const svgRef = { current: null }

    const { result } = renderHook(() => usePanzoom(svgRef), {
      wrapper: AppProvider,
    })

    expect(() => result.current.panBy(10, 10)).not.toThrow()
  })
})
