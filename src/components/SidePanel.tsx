import { useAppState } from '../context/useAppState'

/**
 * SidePanel component – displays selected node metadata on the right side.
 * Story 5.5: Side Panel Component Structure
 * Story 5.6: Display Selected Node Metadata in Side Panel
 *
 * - 220px fixed width, right-aligned, below toolbar
 * - Content populated with node ID, label, and connections (Story 5.6)
 */
export function SidePanel() {
  const { state } = useAppState()

  // Don't render if no node is selected
  if (!state.selectedNodeId) {
    return null
  }

  return (
    <aside
      role="complementary"
      aria-label="Node details panel"
      className="w-[220px] bg-gray-900/80 border-l-2 border-gray-500 flex flex-col overflow-hidden flex-shrink-0"
    >

      {/* Content – scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-2 text-xs text-[#f0f2f5] text-left">
        {state.selectedNodeMeta ? (
          <>
            {/* Node ID */}
            <div className="mb-2">
              <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Node ID</h3>
              <p className="font-mono text-gray-200 text-xs">{state.selectedNodeMeta.bareId}</p>
            </div>

            {/* Label */}
            <div className="mb-2">
              <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Label</h3>
              <p className="text-gray-200 text-xs">{state.selectedNodeMeta.label}</p>
            </div>

            {/* Connections */}
            <div className="mb-2">
              <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Connections</h3>
              {state.selectedNodeMeta.connections.length > 0 ? (
                <ul className="space-y-0.5 text-left list-none pl-0 ml-0" style={{ paddingInlineStart: 0 }}>
                  {state.selectedNodeMeta.connections.map((conn, i) => (
                    <li key={i} className="text-gray-300 text-[11px] text-left whitespace-nowrap">
                      <span className="text-gray-500">{conn.direction === 'outgoing' ? '→' : '←'}</span>
                      &ensp;
                      <span className="font-mono text-[10px] text-cyan-400">{conn.edgeTarget}</span>
                      &ensp;
                      <span className="text-gray-500 text-[10px]">{conn.targetLabel}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No connections</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-gray-400 text-xs">
            Selected: {state.selectedNodeId}
          </p>
        )}
      </div>
    </aside>
  )
}
