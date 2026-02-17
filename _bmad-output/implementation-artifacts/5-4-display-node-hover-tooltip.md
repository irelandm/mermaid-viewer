---
story_id: 5-4-display-node-hover-tooltip
epic: 5
story_number: 5.4
title: Display Node Hover Tooltip (Label + ID)
status: review
date_created: 2026-02-17
date_completed: 2026-02-17
---

# Story 5.4: Display Node Hover Tooltip (Label + ID)

## Story

As a user,
I want a tooltip showing node label and ID to appear when I hover over a node,
So that I can quickly identify nodes without having to select them.

## Acceptance Criteria

### AC-5.4.1: Tooltip appears on hover
- **Given** the diagram is rendered
- **When** I hover my mouse over a node
- **Then** a tooltip appears near the cursor showing:
  - Node label (display text)
  - Node ID
  - Format: "Node Label – node_id"

### AC-5.4.2: Tooltip styling meets contrast requirements
- **And** tooltip text is light colored (#f0f2f5) on dark background for ≥4.5:1 contrast
- **And** tooltip has subtle shadow for visual separation from canvas
- **And** tooltip is positioned to not obscure the node (offset by ~4–8px from cursor)

### AC-5.4.3: Tooltip disappears on mouse out
- **When** I move my mouse away from the node or click
- **Then** the tooltip disappears
- **And** tooltip render time is <50ms

## Tasks/Subtasks

- [x] Task 1: Create Tooltip component (src/components/Tooltip.tsx)
  - [x] 1.1: Render tooltip with label and ID in "Label – id" format
  - [x] 1.2: Position absolutely near cursor with 4–8px offset
  - [x] 1.3: Style with dark bg, light text (#f0f2f5), subtle shadow
- [x] Task 2: Add hover event delegation to SVGCanvas
  - [x] 2.1: Add mouseover/mouseout handlers via event delegation on SVG container
  - [x] 2.2: Extract node label from .nodeLabel text content within node group
  - [x] 2.3: Use extractBareId() for display ID
  - [x] 2.4: Manage local hover state (nodeLabel, nodeId, x, y, visible)
- [x] Task 3: Write comprehensive tests
  - [x] 3.1: Tooltip renders with correct format
  - [x] 3.2: Tooltip positioned with offset from coordinates
  - [x] 3.3: Tooltip hidden when no hover data
  - [x] 3.4: Integration test for hover event delegation
- [x] Task 4: Verify all tests pass, no regressions

## Dev Notes

- Reuse `getNodeIdFromElement()` traversal from SVGCanvas click handler
- Reuse `extractBareId()` from svgNodeHelpers.ts for display ID
- Local state in SVGCanvas (no AppContext needed for hover)
- Node label lives in `.nodeLabel` span/div inside the node group element
- Tooltip must not interfere with panzoom interactions

## Dev Agent Record

### Implementation Plan
1. Created Tooltip component with "Label – node_id" format, fixed positioning, pointer-events:none
2. Added mouseover/mouseout/mousemove event delegation on SVGCanvas container
3. Extract label from `.nodeLabel` text content; fallback to `<text>` element
4. Use `extractBareId()` to strip `flowchart-` prefix and `-{counter}` suffix for display
5. Tooltip follows cursor via mousemove, hides on mouseout and node selection change
6. CSS styling: dark bg (#0f1223 @ 95% opacity), light text (#f0f2f5), subtle shadow, mono font for ID

### Completion Notes
- 10/10 Tooltip tests passing
- 95/95 full suite passing (no regressions)
- Build succeeds
- pointer-events: none ensures tooltip doesn't interfere with panzoom or click selection
- Tooltip dismissed on node selection change to avoid stale hover state

## File List

### New Files
```
src/components/Tooltip.tsx
src/components/__tests__/Tooltip.test.tsx
```

### Modified Files
```
src/components/SVGCanvas.tsx (+hover state, +mouseover/mouseout/mousemove delegation, +Tooltip render)
src/App.css (+tooltip styling: .node-tooltip, .node-tooltip-label, .node-tooltip-separator, .node-tooltip-id)
```

## Change Log
- 2026-02-17: Story 5.4 implemented – tooltip with label + ID on hover, 10 unit tests, all 95 tests passing
