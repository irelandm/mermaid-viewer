import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { usePanzoom } from '../usePanzoom'
import { AppProvider } from '../../context/AppProvider'

// Mock panzoom library - vi.hoisted ensures these are available before vi.mock hoisting
const {
  mockDispose,
  mockMoveTo,
  mockZoomAbs,
  mockMoveBy,
  mockOn,
  mockGetTransform,
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
    mockGetTransform,
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

  it('should initialize panzoom when initPanzoom is called', () => {
    const { result } = renderHook(() => usePanzoom(), { wrapper: AppProvider })

    act(() => {
      result.current.initPanzoom(mockSvgElement)
    })

    expect(mockPanzoomFn).toHaveBeenCalledWith(
      mockSvgElement,
      expect.objectContaining({
        maxZoom: 5,
        minZoom: 0.5,
        smoothScroll: false,
      }),
    )
  })

  it('should not initialize panzoom until initPanzoom is called', () => {
    renderHook(() => usePanzoom(), { wrapper: AppProvider })

    expect(mockPanzoomFn).not.toHaveBeenCalled()
  })

  it('should return all expected utilities and state', () => {
    const { result } = renderHook(() => usePanzoom(), {
      wrapper: AppProvider,
    })

    expect(result.current).toHaveProperty('initPanzoom')
    expect(result.current).toHaveProperty('disposePanzoom')
    expect(result.current).toHaveProperty('autoFit')
    expect(result.current).toHaveProperty('resetView')
    expect(result.current).toHaveProperty('zoomTo')
    expect(result.current).toHaveProperty('zoomBy')
    expect(result.current).toHaveProperty('panBy')
    expect(result.current).toHaveProperty('zoomLevel')
    expect(result.current).toHaveProperty('panX')
    expect(result.current).toHaveProperty('panY')
  })

  it('should have initial zoom/pan state values', () => {
    const { result } = renderHook(() => usePanzoom(), {
      wrapper: AppProvider,
    })

    expect(result.current.zoomLevel).toBe(1)
    expect(result.current.panX).toBe(0)
    expect(result.current.panY).toBe(0)
  })

  it('should register zoom and pan event listeners on init', () => {
    const { result } = renderHook(() => usePanzoom(), { wrapper: AppProvider })

    act(() => {
      result.current.initPanzoom(mockSvgElement)
    })

    expect(mockOn).toHaveBeenCalledWith('zoom', expect.any(Function))
    expect(mockOn).toHaveBeenCalledWith('pan', expect.any(Function))
  })

  it('should call moveTo and zoomAbs on resetView', () => {
    const { result } = renderHook(() => usePanzoom(), {
      wrapper: AppProvider,
    })

    act(() => {
      result.current.initPanzoom(mockSvgElement)
    })

    result.current.resetView()

    expect(mockMoveTo).toHaveBeenCalledWith(0, 0)
    expect(mockZoomAbs).toHaveBeenCalledWith(0, 0, 1)
  })

  it('should call zoomTo centered on element', () => {
    const { result } = renderHook(() => usePanzoom(), {
      wrapper: AppProvider,
    })

    act(() => {
      result.current.initPanzoom(mockSvgElement)
    })

    result.current.zoomTo(2)

    expect(mockZoomAbs).toHaveBeenCalledWith(400, 300, 2)
  })

  it('should call moveBy on panBy', () => {
    const { result } = renderHook(() => usePanzoom(), {
      wrapper: AppProvider,
    })

    act(() => {
      result.current.initPanzoom(mockSvgElement)
    })

    result.current.panBy(50, -30)

    expect(mockMoveBy).toHaveBeenCalledWith(50, -30, true)
  })

  it('should dispose panzoom instance on disposePanzoom', () => {
    const { result } = renderHook(() => usePanzoom(), {
      wrapper: AppProvider,
    })

    act(() => {
      result.current.initPanzoom(mockSvgElement)
    })

    act(() => {
      result.current.disposePanzoom()
    })

    expect(mockDispose).toHaveBeenCalled()
  })

  it('should not throw when resetView is called before init', () => {
    const { result } = renderHook(() => usePanzoom(), {
      wrapper: AppProvider,
    })

    expect(() => result.current.resetView()).not.toThrow()
  })

  it('should not throw when zoomTo is called before init', () => {
    const { result } = renderHook(() => usePanzoom(), {
      wrapper: AppProvider,
    })

    expect(() => result.current.zoomTo(2)).not.toThrow()
  })

  it('should not throw when panBy is called before init', () => {
    const { result } = renderHook(() => usePanzoom(), {
      wrapper: AppProvider,
    })

    expect(() => result.current.panBy(10, 10)).not.toThrow()
  })

  it('should zoomBy reading current scale from panzoom instance', () => {
    mockGetTransform.mockReturnValue({ scale: 1.5, x: 0, y: 0 })

    const { result } = renderHook(() => usePanzoom(), {
      wrapper: AppProvider,
    })

    act(() => {
      result.current.initPanzoom(mockSvgElement)
    })

    result.current.zoomBy(0.2)

    // Current 1.5 + 0.2 = 1.7
    expect(mockZoomAbs).toHaveBeenCalledWith(400, 300, 1.7)
  })

  it('should snap to 100% when zoomBy lands close to 1.0', () => {
    mockGetTransform.mockReturnValue({ scale: 0.85, x: 0, y: 0 })

    const { result } = renderHook(() => usePanzoom(), {
      wrapper: AppProvider,
    })

    act(() => {
      result.current.initPanzoom(mockSvgElement)
    })

    result.current.zoomBy(0.2)

    // Current 0.85 + 0.2 = 1.05, which is within 0.08 of 1.0 → snaps to 1.0
    expect(mockZoomAbs).toHaveBeenCalledWith(400, 300, 1.0)
  })

  it('should clamp zoomBy to max zoom', () => {
    mockGetTransform.mockReturnValue({ scale: 4.9, x: 0, y: 0 })

    const { result } = renderHook(() => usePanzoom(), {
      wrapper: AppProvider,
    })

    act(() => {
      result.current.initPanzoom(mockSvgElement)
    })

    result.current.zoomBy(0.2)

    // Current 4.9 + 0.2 = 5.1, clamped to 5
    expect(mockZoomAbs).toHaveBeenCalledWith(400, 300, 5)
  })

  it('should clamp zoomBy to min zoom', () => {
    mockGetTransform.mockReturnValue({ scale: 0.6, x: 0, y: 0 })

    const { result } = renderHook(() => usePanzoom(), {
      wrapper: AppProvider,
    })

    act(() => {
      result.current.initPanzoom(mockSvgElement)
    })

    result.current.zoomBy(-0.2)

    // Current 0.6 - 0.2 = 0.4, clamped to 0.5
    expect(mockZoomAbs).toHaveBeenCalledWith(400, 300, 0.5)
  })

  it('should not re-initialize panzoom on same element', () => {
    const { result } = renderHook(() => usePanzoom(), { wrapper: AppProvider })

    act(() => {
      result.current.initPanzoom(mockSvgElement)
    })

    act(() => {
      result.current.initPanzoom(mockSvgElement)
    })

    // Should only create one instance
    expect(mockPanzoomFn).toHaveBeenCalledTimes(1)
  })

  it('should dispose old instance when initializing on a new element', () => {
    const secondSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(secondSvg)

    const { result } = renderHook(() => usePanzoom(), { wrapper: AppProvider })

    act(() => {
      result.current.initPanzoom(mockSvgElement)
    })

    act(() => {
      result.current.initPanzoom(secondSvg)
    })

    expect(mockDispose).toHaveBeenCalledTimes(1)
    expect(mockPanzoomFn).toHaveBeenCalledTimes(2)

    document.body.removeChild(secondSvg)
  })
})
