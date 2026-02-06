import React, { createContext, useReducer, type ReactNode } from 'react'

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
  | { type: 'RESET_FILE' }

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

// Context
export const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | undefined>(undefined)

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
