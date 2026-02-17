---
story_id: 5-6-display-selected-node-metadata-in-side-panel
epic: 5
story_number: 5.6
title: Display Selected Node Metadata in Side Panel
status: review
date_created: 2026-02-17
date_completed: 2026-02-17
---

# Story 5.6: Display Selected Node Metadata in Side Panel

## Story

As a user,
I want to see detailed information about the selected node in the side panel,
So that I can understand the node's ID, label, and connections.

## Acceptance Criteria

### AC-5.6.1: Display Node ID and Label
- **Given** a node is selected
- **When** the SidePanel is rendered
- **Then** the panel displays Node ID (bare Mermaid ID) and Node Label (display text)

### AC-5.6.2: Display Connected Edges
- **Then** the panel displays a Connected Edges list showing edge source/target node IDs and target labels
- **And** if the node has no connected edges, a message "No connections" is displayed

### AC-5.6.3: Formatting and contrast
- **And** the metadata is formatted clearly with section headers and consistent spacing
- **And** text color is light (#f0f2f5) for ≥4.5:1 contrast on dark background
- **And** the panel content is scrollable if it exceeds the panel height

## Tasks/Subtasks

- [x] Task 1: Extract metadata from SVG for selected node
  - [x] 1.1: Get bare node ID via extractBareId()
  - [x] 1.2: Get node label from .nodeLabel text in SVG
  - [x] 1.3: Get connected edges via findConnections()
- [x] Task 2: Render metadata in SidePanel
  - [x] 2.1: Display Node ID with section header
  - [x] 2.2: Display Node Label with section header
  - [x] 2.3: Display Connected Edges list with source → target format
  - [x] 2.4: Show "No connections" when edges list is empty
- [x] Task 3: Write comprehensive tests
- [x] Task 4: Verify all tests pass, no regressions

## Dev Notes

- SidePanel already exists from 5.5 — extend it with metadata content
- Need to access the SVG DOM to extract label and connections
- Use extractBareId() from svgNodeHelpers for ID display
- Use findConnections() from svgNodeHelpers for connected edges
- SVG container ref lives in SVGCanvas — need a way to access it from SidePanel
- Option: Pass metadata via AppContext or compute in SidePanel with a ref to SVG

## Dev Agent Record

### Implementation Plan
1. Added NodeMetadata type (bareId, label, connections[]) to types/index.ts
2. Added selectedNodeMeta to AppContext state + SET_SELECTED_NODE_META action
3. SVGCanvas computes metadata on selection: extractBareId, .nodeLabel text, findConnections + target labels
4. SidePanel renders: Node ID (mono), Label, Connections list with → arrows and cyan IDs
5. "No connections" fallback for isolated nodes

### Completion Notes
- 8/8 metadata tests passing (SidePanel.5-6.test.tsx)
- 112/112 full suite passing (no regressions)
- Build succeeds
- Metadata computed in SVGCanvas selection useEffect and dispatched to context
- SidePanel reads selectedNodeMeta from context for rendering

## File List

### New Files
```
src/components/__tests__/SidePanel.5-6.test.tsx
```

### Modified Files
```
src/types/index.ts (+NodeConnection, +NodeMetadata interfaces)
src/context/AppContext.ts (+selectedNodeMeta state, +SET_SELECTED_NODE_META action)
src/context/AppProvider.tsx (+selectedNodeMeta initial state, +reducer case)
src/context/__tests__/AppContext.test.ts (+selectedNodeMeta to initial state)
src/components/SVGCanvas.tsx (+metadata computation on node selection)
src/components/SidePanel.tsx (+metadata rendering: Node ID, Label, Connections)
```

## Change Log
- 2026-02-17: Story 5.6 implemented – node metadata display in side panel, 8 tests, 112 total passing
