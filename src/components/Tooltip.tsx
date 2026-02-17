/**
 * Tooltip component for displaying node label and ID on hover.
 * Story 5.4: Display Node Hover Tooltip (Label + ID)
 *
 * Renders an absolutely positioned tooltip near the cursor with:
 * - Format: "Label – node_id"
 * - Dark background, light text (#f0f2f5) for ≥4.5:1 WCAG contrast
 * - Subtle shadow for visual separation
 * - pointer-events: none to avoid interfering with panzoom/selection
 */

interface TooltipProps {
  label: string
  nodeId: string
  x: number
  y: number
  visible: boolean
}

const OFFSET_X = 8
const OFFSET_Y = 8

export function Tooltip({ label, nodeId, x, y, visible }: TooltipProps) {
  if (!visible) return null

  return (
    <div
      role="tooltip"
      className="node-tooltip"
      style={{
        position: 'fixed',
        left: `${x + OFFSET_X}px`,
        top: `${y + OFFSET_Y}px`,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      <span className="node-tooltip-label">{label}</span>
      <span className="node-tooltip-separator"> – </span>
      <span className="node-tooltip-id">{nodeId}</span>
    </div>
  )
}
