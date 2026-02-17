import { useReducer, useState, type ReactNode } from 'react'
import { AppContext, type AppState, type AppAction, type ZoomHandlers } from './AppContext'

// Initial State
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
  // Zoom/Pan initial state (Epic 4)
  zoomLevel: 1,
  panX: 0,
  panY: 0,
}

// Reducer
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

// Provider Props
interface AppProviderProps {
  children: ReactNode
  initialState?: Partial<AppState>
}

// Provider Component
export function AppProvider({ children, initialState: overrideState }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, { ...initialState, ...overrideState })
  const [zoomHandlers, setZoomHandlers] = useState<ZoomHandlers | null>(null)

  return (
    <AppContext.Provider value={{ state, dispatch, zoomHandlers, setZoomHandlers }}>
      {children}
    </AppContext.Provider>
  )
}
