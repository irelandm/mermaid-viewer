import { useEffect } from 'react'
import { Status } from './components/Status'
import { Toolbar } from './components/Toolbar'
import { SVGCanvas } from './components/SVGCanvas'
import { useAppState } from './context/useAppState'

function AppContent() {
  const { state } = useAppState()

  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <div className="flex flex-col w-full h-screen bg-gray-950">
      <Toolbar />
      <Status />
      {state.mermaidCode ? (
        <SVGCanvas />
      ) : (
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-4">
            Mermaid Viewer
          </h1>
          <p className="text-gray-400">
            Open a Markdown file with a Mermaid diagram to get started
          </p>
        </main>
      )}
    </div>
  )
}

export default AppContent
