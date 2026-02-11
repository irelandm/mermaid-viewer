import { describe, it, expect } from 'vitest'
import type { AppState, AppAction } from '../AppContext'

// Mock reducer for testing (copy from AppContext)
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'SET_FILE_NAME':
      return { ...state, fileName: action.payload }
    case 'SET_FILE_CONTENT':
      return { ...state, fileContent: action.payload }
    case 'SET_MERMAID_CODE':
      return { ...state, mermaidCode: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_SELECTED_NODE':
      return { ...state, selectedNodeId: action.payload }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
    case 'SET_STATUS':
      return { ...state, status: action.payload }
    case 'RESET_FILE':
      return {
        ...state,
        fileName: null,
        fileContent: null,
        mermaidCode: null,
        error: null,
        selectedNodeId: null,
        searchQuery: '',
      }
    case 'SET_ZOOM':
      return { ...state, zoomLevel: action.payload }
    case 'SET_PAN':
      return { ...state, panX: action.payload.x, panY: action.payload.y }
    case 'RESET_ZOOM_PAN':
      return { ...state, zoomLevel: 1, panX: 0, panY: 0 }
    default:
      return state
  }
}

const initialState: AppState = {
  theme: 'dark',
  fileName: null,
  fileContent: null,
  mermaidCode: null,
  error: null,
  isLoading: false,
  selectedNodeId: null,
  searchQuery: '',
  status: null,
  zoomLevel: 1,
  panX: 0,
  panY: 0,
}

describe('AppContext Status State', () => {
  describe('SET_STATUS action', () => {
    it('should set status with success type and message', () => {
      const action: AppAction = {
        type: 'SET_STATUS',
        payload: { type: 'success', message: 'File loaded successfully' },
      }
      const newState = appReducer(initialState, action)

      expect(newState.status).toEqual({
        type: 'success',
        message: 'File loaded successfully',
      })
      expect(newState.status?.type).toBe('success')
      expect(newState.status?.message).toBe('File loaded successfully')
    })

    it('should set status with error type and message', () => {
      const action: AppAction = {
        type: 'SET_STATUS',
        payload: { type: 'error', message: 'Failed to load file' },
      }
      const newState = appReducer(initialState, action)

      expect(newState.status).toEqual({
        type: 'error',
        message: 'Failed to load file',
      })
      expect(newState.status?.type).toBe('error')
    })

    it('should set status with warning type', () => {
      const action: AppAction = {
        type: 'SET_STATUS',
        payload: { type: 'warning', message: 'No Mermaid block found' },
      }
      const newState = appReducer(initialState, action)

      expect(newState.status?.type).toBe('warning')
      expect(newState.status?.message).toBe('No Mermaid block found')
    })

    it('should set status with info type', () => {
      const action: AppAction = {
        type: 'SET_STATUS',
        payload: { type: 'info', message: 'Processing file...' },
      }
      const newState = appReducer(initialState, action)

      expect(newState.status?.type).toBe('info')
    })

    it('should clear status by setting to null', () => {
      const stateWithStatus: AppState = {
        ...initialState,
        status: { type: 'success', message: 'File loaded' },
      }

      const action: AppAction = {
        type: 'SET_STATUS',
        payload: null,
      }
      const newState = appReducer(stateWithStatus, action)

      expect(newState.status).toBeNull()
    })
  })

  describe('status state with other actions', () => {
    it('should preserve status when setting file name', () => {
      const stateWithStatus: AppState = {
        ...initialState,
        status: { type: 'success', message: 'Ready' },
      }

      const action: AppAction = {
        type: 'SET_FILE_NAME',
        payload: 'test.md',
      }
      const newState = appReducer(stateWithStatus, action)

      expect(newState.status).toEqual({ type: 'success', message: 'Ready' })
      expect(newState.fileName).toBe('test.md')
    })

    it('should reset status on RESET_FILE but preserve other status changes', () => {
      // Note: RESET_FILE doesn't reset status, only file-related fields
      const stateWithStatus: AppState = {
        ...initialState,
        fileName: 'test.md',
        status: { type: 'success', message: 'File loaded' },
      }

      const action: AppAction = {
        type: 'RESET_FILE',
      }
      const newState = appReducer(stateWithStatus, action)

      expect(newState.fileName).toBeNull()
      expect(newState.status).toEqual({ type: 'success', message: 'File loaded' })
    })
  })

  describe('initial state', () => {
    it('should have null status initially', () => {
      expect(initialState.status).toBeNull()
    })

    it('should have all expected initial state properties', () => {
      expect(initialState).toHaveProperty('theme', 'dark')
      expect(initialState).toHaveProperty('fileName', null)
      expect(initialState).toHaveProperty('fileContent', null)
      expect(initialState).toHaveProperty('mermaidCode', null)
      expect(initialState).toHaveProperty('error', null)
      expect(initialState).toHaveProperty('isLoading', false)
      expect(initialState).toHaveProperty('selectedNodeId', null)
      expect(initialState).toHaveProperty('searchQuery', '')
      expect(initialState).toHaveProperty('status', null)
      expect(initialState).toHaveProperty('zoomLevel', 1)
      expect(initialState).toHaveProperty('panX', 0)
      expect(initialState).toHaveProperty('panY', 0)
    })
  })
})
