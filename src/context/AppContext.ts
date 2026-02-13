import React, { createContext } from 'react'
import type { StatusMessage } from '../types'

// Zoom handler callbacks
export interface ZoomHandlers {
  zoomIn: () => void
  zoomOut: () => void
  resetView: () => void
}

// App State Types
export interface AppState {
  theme: 'dark' | 'light'
  fileName: string | null
  fileContent: string | null
  mermaidCode: string | null
  error: string | null
  isLoading: boolean
  selectedNodeId: string | null
  searchQuery: string
  status: StatusMessage | null
  // Zoom/Pan state for Epic 4
  zoomLevel: number
  panX: number
  panY: number
}

// Action Types
export type AppAction =
  | { type: 'SET_THEME'; payload: 'dark' | 'light' }
  | { type: 'SET_FILE_NAME'; payload: string }
  | { type: 'SET_FILE_CONTENT'; payload: string }
  | { type: 'SET_MERMAID_CODE'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SELECTED_NODE'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_STATUS'; payload: StatusMessage | null }
  | { type: 'RESET_FILE' }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'SET_PAN'; payload: { x: number; y: number } }
  | { type: 'RESET_ZOOM_PAN' }

// Context
export const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
  zoomHandlers: ZoomHandlers | null
  setZoomHandlers: (handlers: ZoomHandlers | null) => void
} | undefined>(undefined)
