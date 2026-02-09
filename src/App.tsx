import { useEffect } from 'react'
import { Status } from './components/Status'
import { Toolbar } from './components/Toolbar'

function AppContent() {
  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <>
      <Status />
      <Toolbar />
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-4">
          Mermaid Viewer
        </h1>
        <p className="text-gray-400">
          Open a Markdown file with a Mermaid diagram to get started
        </p>
      </main>
    </>
  )
}

export default AppContent
