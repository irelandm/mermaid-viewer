import { useRef } from 'react'
import { useAppState } from '../context/useAppState'
import { parseMarkdown } from '../utils/parseMarkdown'

export function Toolbar() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { state, dispatch, zoomHandlers } = useAppState()

  const handleOpenFile = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Guard against race condition: prevent multiple simultaneous loads
    if (state.isLoading) return

    // Validate file extension
    if (!file.name.endsWith('.md')) {
      dispatch({
        type: 'SET_STATUS',
        payload: {
          type: 'error',
          message: 'Please select a Markdown (.md) file',
        },
      })
      return
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_FILE_NAME', payload: file.name })

      const content = await file.text()
      dispatch({ type: 'SET_FILE_CONTENT', payload: content })

      // Parse markdown and extract mermaid code block
      const mermaidCode = parseMarkdown(content)
      dispatch({ type: 'SET_MERMAID_CODE', payload: mermaidCode })
      dispatch({ type: 'SET_ERROR', payload: null })

      dispatch({
        type: 'SET_STATUS',
        payload: {
          type: 'success',
          message: `Loaded: ${file.name}`,
        },
      })
    } catch (error) {
      let errorMessage: string

      // Check if it's a parseMarkdown error (no mermaid block found)
      if (error instanceof Error && error.message.includes('No mermaid code block found')) {
        errorMessage = 'No Mermaid diagram found in this file. Please select a file with a mermaid code block.'
      } else {
        errorMessage = error instanceof Error ? error.message : 'Failed to read file'
      }

      dispatch({
        type: 'SET_STATUS',
        payload: {
          type: 'error',
          message: errorMessage,
        },
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }

    // Reset input so selecting the same file again works
    event.target.value = ''
  }

  return (
    <div className="flex items-center gap-2 p-4 bg-gray-900 border-b border-gray-800">
      <button
        onClick={handleOpenFile}
        disabled={state.isLoading}
        className="flex-shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded font-medium transition-colors focus:outline-2 focus:outline-cyan-400"
        aria-label="Open Markdown file"
      >
        Open File
      </button>

      {/* Zoom Controls (Epic 4 - Story 4.3) */}
      {state.mermaidCode && zoomHandlers && (
        <div className="flex items-center gap-1 ml-2 border-l border-gray-700 pl-2">
          <button
            onClick={zoomHandlers.zoomOut}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors focus:outline-2 focus:outline-cyan-400"
            aria-label="Zoom out"
            title="Zoom out"
          >
            <span className="text-lg font-bold">−</span>
          </button>
          <span className="text-sm text-gray-400 min-w-[3rem] text-center">
            {Math.round(state.zoomLevel * 100)}%
          </span>
          <button
            onClick={zoomHandlers.zoomIn}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors focus:outline-2 focus:outline-cyan-400"
            aria-label="Zoom in"
            title="Zoom in"
          >
            <span className="text-lg font-bold">+</span>
          </button>
          <button
            onClick={zoomHandlers.resetView}
            className="flex-shrink-0 px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors focus:outline-2 focus:outline-cyan-400 ml-1"
            aria-label="Reset view"
            title="Reset view"
          >
            Reset
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".md"
        onChange={handleFileSelect}
        className="hidden"
        aria-hidden="true"
      />

      {/* Error display */}
      {state.status?.type === 'error' && (
        <div role="alert" className="flex items-center gap-1 text-sm min-w-0">
          <span className="text-red-500 font-medium flex-shrink-0">Error:</span>
          <span className="text-red-300 truncate">{state.status.message}</span>
        </div>
      )}

      {/* File name display (only when no error) */}
      {state.fileName && state.status?.type !== 'error' && (
        <div className="flex items-center gap-1 text-sm min-w-0">
          <span className="text-gray-400 flex-shrink-0">File:</span>
          <span className="text-white truncate">{state.fileName}</span>
        </div>
      )}
    </div>
  )
}
