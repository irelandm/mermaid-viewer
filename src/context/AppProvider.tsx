import { useReducer, type ReactNode } from 'react'
import { AppContext, type AppState, type AppAction } from './AppContext'

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
    default:
      return state
  }
}

// Provider Props
interface AppProviderProps {
  children: ReactNode
}

// Provider Component
export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}
