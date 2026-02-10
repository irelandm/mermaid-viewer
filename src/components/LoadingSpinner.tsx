/**
 * LoadingSpinner component displays a spinner while diagrams are rendering
 * 
 * Used by SVGCanvas to provide visual feedback during Mermaid rendering
 */
export function LoadingSpinner() {
  return (
    <div
      className="flex items-center justify-center gap-2"
      role="status"
      aria-live="polite"
      aria-label="Loading diagram"
    >
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
            style={{
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
      <span className="text-sm text-gray-300 ml-2">Rendering diagram...</span>
    </div>
  )
}
