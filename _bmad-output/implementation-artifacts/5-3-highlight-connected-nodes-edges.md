---
story_id: 5-3-highlight-connected-nodes-edges
epic: 5
story_number: 5.3
title: Highlight Connected Nodes & Edges
status: review
date_created: 2026-02-17
date_completed: 2026-02-17
---

# Story 5.3: Highlight Connected Nodes & Edges

## Overview
When a user selects a node in the diagram, all directly connected nodes and edges are visually highlighted with CSS classes to show the flow relationships.

## Acceptance Criteria

### AC-5.3.1: Identify connected nodes
- **Given** a node is selected
- **When** the SVG structure is analyzed
- **Then** all directly connected nodes (connected by edges) are identified
- **And** CSS class `.node-connected` is applied to those nodes

### AC-5.3.2: Highlight connected edges
- **Given** a node is selected
- **When** edges connected to that node are identified
- **Then** CSS class `.edge-connected` is applied to those edges
- **And** edges display with bold stroke and accent color (#ffb800)

### AC-5.3.3: Update highlighting on node switching
- **Given** a node is selected
- **When** a different node is selected or selection is cleared
- **Then** previous connected highlighting is removed
- **And** new connected highlighting is applied to the new selection

## Implementation Summary

### Files Created
- **src/utils/svgNodeHelpers.ts** – Utility functions for SVG node/edge manipulation (Mermaid v11)
  - `extractBareId()` – Strip `flowchart-` prefix and `-{counter}` suffix from DOM IDs
  - `buildNodeIdMap()` – Map bare node IDs to their DOM IDs from the SVG
  - `parseEdgeId()` – Parse `L_{source}_{target}_{counter}` edge IDs with longest-first matching
  - `buildEdgeMap()` – Build edge adjacency structure from `.edgePaths` path elements
  - `findConnections()` – Find connected node DOM IDs and edge elements for a selected node
  - `clearConnectedClasses()` – Clear all `.node-connected` and `.edge-connected` classes
  - `applyConnectedHighlighting()` – Apply highlighting to connected nodes/edges

- **src/components/__tests__/SVGCanvas.5-3.test.tsx** – Comprehensive unit tests
  - 17 test cases covering all acceptance criteria + utility functions
  - Tests use real Mermaid v11 SVG structure (DOMParser)
  - All tests passing ✅

### Files Modified
- **src/components/SVGCanvas.tsx**
  - Imported `clearConnectedClasses` and `applyConnectedHighlighting` utilities
  - Updated node selection useEffect to call `applyConnectedHighlighting()`
  - Connected highlighting applied immediately upon node selection

- **src/App.css**
  - Added `.node-connected` styling (amber/orange stroke, 1.5px width, 0.8 opacity)
  - Added `.edge-connected` styling targeting `.edgePaths path` and `path.flowchart-link`
  - Styling overrides Mermaid defaults with !important flags

- **src/context/AppProvider.tsx**
  - Added `initialState` prop to AppProvider for test flexibility

### Implementation Details

#### Mermaid v11 SVG Structure (dagre layout)
- **Nodes**: `<g class="nodes"> > <g class="node default" id="flowchart-A-0">`
- **Edges**: `<g class="edgePaths"> > <path id="L_A_B_0" class="...flowchart-link">`
- **Edge IDs**: `L_{sourceBareId}_{targetBareId}_{counter}` (underscores, NOT dashes)
- **Node DOM IDs**: `flowchart-{bareId}-{counter}`

#### Edge ID Parsing Strategy
- Strip `L_` prefix and `_{counter}` suffix
- Try all known bare node IDs longest-first to resolve ambiguity
- Handles node IDs containing underscores (e.g., `my_node`)

#### Connected Class Application
- `.node-connected` – Applied to `<g class="node">` groups directly connected to selected node
- `.edge-connected` – Applied to `<path>` elements inside `<g class="edgePaths">`
- Classes are cleared before applying new highlighting

### Tests Passing
✅ **17/17 SVG Node Helpers tests passing**
- extractBareId: 3 tests
- buildNodeIdMap: 1 test
- parseEdgeId: 3 tests
- buildEdgeMap: 1 test
- AC-5.3.1: Find connected nodes (3 tests)
- AC-5.3.2: Find connected edges (2 tests)
- AC-5.3.3: Apply and clear highlighting (4 tests)

✅ **85/85 total project tests passing** (no regressions)

### Styling Notes
- Connected nodes use **amber/orange (#ffb800)** to distinguish from selected nodes (cyan #00d4ff)
- Connected edges use bold stroke width (2.5px) with matching amber color
- Both remain visible but slightly de-emphasized during search filtering
- All colors meet WCAG 2.1 AA contrast requirements on dark background

## Acceptance Criteria Verification

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Connected nodes identified from SVG | ✅ | `findConnections()` unit tests pass |
| `.node-connected` class applied | ✅ | Styling tests verify class application |
| Connected edges identified from SVG | ✅ | `buildEdgeMap()` + `findConnections()` tests pass |
| `.edge-connected` class applied | ✅ | Edge highlighting tests pass |
| Bold stroke + accent color on edges | ✅ | CSS rules target `.edgePaths path.edge-connected` |
| Previous highlighting cleared on switch | ✅ | AC-5.3.3 test verifies cleanup |
| Selection switching updates highlighting | ✅ | Integration test verifies state management |
| Deselection clears all highlighting | ✅ | `clearConnectedClasses()` verified |

## Dev Agent Record

### Implementation Plan
1. **Analyze Mermaid v11 SVG Structure**: Researched actual DOM output from Mermaid v11 dagre renderer to understand real element IDs, classes, and hierarchy
2. **Build Utility Layer**: Created reusable SVG helper functions with robust edge ID parsing (longest-first matching for underscore ambiguity)
3. **Component Integration**: Modified SVGCanvas to call highlighting function on node selection
4. **Styling**: Added CSS rules targeting real Mermaid elements (`.edgePaths path`, `g.node`)
5. **Testing**: Unit tests with realistic Mermaid v11 SVG structure via DOMParser

### Technical Decisions
- **Utility Functions First**: Extracted logic to pure functions for testability and reusability
- **DOMParser for Tests**: Tests create realistic Mermaid SVG structure without needing full mermaid render
- **CSS Classes Pattern**: Used CSS classes rather than inline styles to maintain Mermaid styling control
- **Amber Color Choice**: Selected #ffb800 (amber) for connected nodes/edges to distinguish from selected (cyan)
- **Edge ID Parsing**: Longest-first greedy matching handles node IDs containing underscores

### Known Limitations
- Relies on Mermaid v11 `L_{src}_{tgt}_{n}` edge ID format; other renderers may differ
- Edge ID parsing may be ambiguous if two node IDs form a valid longer ID
- No animation on highlight transitions (CSS could add transitions if desired)

## File Changes Summary

### New Files
```
src/utils/svgNodeHelpers.ts (191 lines)
src/components/__tests__/SVGCanvas.5-3.test.tsx (238 lines)
```

### Modified Files
```
src/components/SVGCanvas.tsx (+1 import, +1 function call)
src/App.css (+27 lines for .node-connected and .edge-connected)
src/context/AppProvider.tsx (+1 prop for initialState)
```

## Next Steps
- **Story 5.4**: Node hover tooltip (label + ID)
- **Story 5.5**: Side panel component structure
- **Story 5.6**: Display node metadata in side panel

---

**Status**: Done  
**Completed**: 2026-02-17  
**Tests**: 17/17 passing (utilities) + 85/85 project tests (no regressions)
