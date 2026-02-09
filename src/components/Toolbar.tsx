import { useRef } from 'react'
import { useAppState } from '../context/useAppState'

export function Toolbar() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { state, dispatch } = useAppState()

  const handleOpenFile = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

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

      dispatch({
        type: 'SET_STATUS',
        payload: {
          type: 'success',
          message: `Loaded: ${file.name}`,
        },
      })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to read file'
      dispatch({
        type: 'SET_STATUS',
        payload: {
          type: 'error',
          message: errorMessage,
        },
      })
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
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
        className="flex-shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded font-medium transition-colors"
        aria-label="Open Markdown file"
      >
        Open File
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".md"
        onChange={handleFileSelect}
        className="hidden"
        aria-hidden="true"
      />

      {state.fileName && (
        <div className="flex-1 min-w-0 text-sm text-gray-300">
          <span className="text-gray-400">File:</span> <span className="truncate">{state.fileName}</span>
        </div>
      )}
    </div>
  )
}
