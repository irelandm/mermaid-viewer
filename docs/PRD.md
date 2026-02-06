# Product Requirements Document (PRD)

---
title: Mermaid Diagram Explorer PRD
classification:
  domain: general
  projectType: web_app
inputDocuments: []
date: 2026-01-30
---

## Executive Summary
Mermaid Diagram Explorer is a local, browser-based tool for loading Markdown files, extracting Mermaid flowcharts, and rendering them with responsive interaction. Target users are developers and technical writers who maintain diagrams in Markdown. Success hinges on fast renders (≤ 2s for large diagrams), smooth zoom/pan and node detail inspection, offline operation, and WCAG 2.1 AA compliant visuals.
# Product Requirements Document (PRD)

## Product Overview
**Product Name:** Mermaid Diagram Explorer (working title)  
**Type:** Local browser-based application  
**Purpose:** To load, render, and interact with diagrams written in Mermaid syntax contained within Markdown files.  
**Primary Goal:** Enable users to visually explore and interact with flowcharts defined in Markdown, with later support for additional Mermaid diagram types.  

---

## Success Criteria
- Render diagrams with up to 2,000 nodes within ≤ 2 seconds, measured using browser performance timing on standard hardware.
- Zoom and pan interactions respond within ≤ 100 ms per action; pan maintains ≥ 30 FPS during movement.
- Node selection displays hover tooltip (label + ID) and opens a side panel with node details (ID, label, connected edges).
- Operates fully offline (no external network requests) for all features.
- UI colors meet WCAG 2.1 AA contrast standards.

## 1. Objectives and Scope

### 1.1 Objectives
- Allow users to **load Markdown files** containing Mermaid code locally (no server dependency).
- **Parse and render** Mermaid flowcharts into a visual interface.
- Provide intuitive **zooming and panning** capabilities.
- Enable **node and connector interaction**, including highlighting nodes and their directly connected elements.
- Support basic **styling** and **colour customization** of diagram elements.
- Build a scalable architecture that allows adding new diagram types (e.g., sequence, class, or state diagrams) later.

### 1.2 Scope (Phase 1)
- Supported Diagram Type: **Flowchart**
- Supported File Type: **Markdown (.md)** with embedded Mermaid code blocks  
- Supported Browsers: Latest versions of Chromium-based browsers (Chrome, Edge) and Firefox  
- Offline Operation: Fully local, no internet or server required  

---

## 2. User Stories

| ID | User Story | Acceptance Criteria |
|----|-------------|--------------------|
| U1 | As a user, I want to **open a Markdown file** so I can load a diagram | File picker accepts `.md`, parses ` ```mermaid` blocks |
| U2 | As a user, I want to **view Mermaid flowcharts** rendered automatically | Diagram renders upon load or refresh |
| U3 | As a user, I want to **zoom and pan** the diagram easily | Zoom with mouse wheel or buttons, pan via click-drag |
| U4 | As a user, I want to **select a node** and highlight related nodes and connectors | Clicking a node visually highlights it and directly connected paths |
| U5 | As a user, I want to **change colours or styles** for better visual clarity | Allow selection from predefined colour themes or minimal inline styling |
| U6 | As a user, I want the app to **work offline**, within my browser | No internet calls, everything runs from local HTML/JS/CSS |
| U7 | As a user, I want to **view node details** when I select a node | Hover shows label + ID tooltip; side panel shows ID, label, and connected edges |
| U8 | As a user, I want to **search nodes by label or ID** so I can find elements quickly | Search box filters nodes; matches highlight; non-matches dim |

---

## 3. Functional Requirements

### 3.1 File Handling
- Support **local file import** using the native file picker API.  
- Accept `.md` files only; extract the first Mermaid code block (```mermaid) from the file.  
- If multiple Mermaid blocks exist in a single file, load only the first block; users should split diagrams into separate files to load multiple diagrams sequentially.  
- Parse Mermaid code blocks using a robust Markdown parsing approach that reliably identifies fenced `mermaid` sections.  
- Display filename and extraction status in header (e.g., "Loaded: flowchart.md").  

### 3.2 Diagram Rendering
- Render diagrams to SVG using the configured diagram library.  
- Implement a sandboxed rendering container (component wrapper) for diagram safety, styling isolation, and event handling.  
- **Auto-resize (MVP):** Automatically adjust diagram viewport to fit container on load and window resize; maintain aspect ratio and center diagram.  
- Handle diagrams up to 2,000 nodes and render within 2 seconds on standard hardware.  
- Display loading indicator while Mermaid processes diagram; gracefully handle parse errors with a clear error message.  

### 3.3 Interaction
-
#### Zoom & Pan
- **Zoom:** Mouse wheel scroll (zoom in/out); `+` and `-` toolbar buttons; pinch gesture on touchscreen.  
- **Pan:** Click-drag on canvas to pan; touchscreen swipe to pan.  
- **Reset View:** "Reset View" button returns to default zoom and center position.  

#### Node Selection & Highlighting
- **Hover Behavior:**  
  - Hovering over a node displays a subtle visual outline (1–2px border or glow effect).  
  - Tooltip appears near cursor showing node label and node ID (e.g., "nodeA – User Login").  
- **Selection Behavior (clicking a node):**  
  - Selected node changes color distinctly (saturated or contrasting color).  
  - All directly connected nodes also highlight (slightly different shade).  
  - All edges connecting the selected node to adjacent nodes highlight with bold or contrasting color.  
  - Side panel appears showing node metadata: ID, label, and list of connected edges.  
- **Deselection:** Clicking empty canvas area deselects.  

#### Keyboard Navigation (Minimal)
- **Zoom Shortcuts:** `+` / `-` keys adjust zoom level incrementally.  

### 3.4 Styling & Theming
- Support Mermaid theme configuration using `theme` and `themeVariables`.  
- Provide preset themes: **Light** (default) and **Dark**.  
- All themes must meet WCAG 2.1 AA color contrast standards (minimum 4.5:1 for text, 3:1 for UI components).  
- Theme selector in header toolbar; user selection persists in localStorage.  
- Optional future: user CSS override capability; not required for MVP.  

### 3.5 Node Metadata & Side Panel
- When a node is selected, a **side panel** displays:
  - **Node ID:** Unique identifier from Mermaid definition.  
  - **Node Label:** Display text/content.  
  - **Connected Edges:** List of edges (connections) and their target nodes.  
  - **Raw Mermaid Syntax (optional detail view):** Show the raw Mermaid definition for that node.  
- Side panel can be dismissed by clicking close button or selecting a different node.  

### 3.6 Data Analysis & Search
- **Flow Statistics:** Display aggregate diagram metrics in a collapsible info panel:
  - Total nodes count.  
  - Total edges count.  
  - Graph depth (longest path length).  
- **Search & Filter (MVP):**  
  - Search box in header toolbar; filter nodes by label or ID (case-insensitive substring).  
  - Matching nodes highlight; non-matching nodes dim.  
  - Clear search to restore full diagram visibility.  

### 3.7 Extensibility
- Designed with modular architecture for adding new diagram types:
  - Each Mermaid type (flowchart, sequence, class, etc.) handled by an independent component/module.  
  - Shared utilities: zoom/pan controller, selection state manager, node metadata extractor.  
  - Mermaid.js API abstraction layer to isolate rendering specifics.  

### 3.8 Responsive Design
- Support viewport widths down to 360px with adaptive layout behavior.  
- Side panel collapses on small screens and is accessible via a toggle.  
- Toolbar wraps gracefully; controls remain accessible and clickable.  
- Minimum touch target size is 44x44 px for interactive controls.  
- Ensure zoom, pan, and selection are usable on touch devices.

---

## 4. Non-Functional Requirements

| Attribute | Description |
|------------|--------------|
| Performance | Diagrams up to 2,000 nodes render within ≤ 2 seconds on standard hardware; measured via the browser Performance API across a benchmark set of ≥ 3 representative diagrams. |
| Compatibility | Validated on Chrome ≥ v120, Edge ≥ v120, Firefox ≥ v120 across Windows, macOS, Linux; verified via manual test matrix and CI runs. |
| Accessibility | All UI colors meet WCAG 2.1 AA contrast standards (4.5:1 minimum for text). |
| User Guidance | Status bar displays context-sensitive hints (e.g., "Click a node to see details", "Scroll to zoom"). |
| Security | No external network requests; only local file reading. File data stays local to the browser. |
| Maintainability | Modular component architecture with ≤ 3 external runtime dependencies; components documented; measured by dependency inventory and lint checks. |
| Portability | Runs as a static bundle from local file system across OSes and via Electron; verified by offline launch tests on Windows/macOS/Linux. |

---

## 5. Technical Stack

- **Frontend Framework:** React (recommended for component composability and state management).  
- **Diagram Library:** [Mermaid.js](https://mermaid-js.github.io/) (latest stable build).  
- **Markdown Parsing:** Remark with `remark-parse` (robust edge-case handling and AST processing).  
- **UI Components:** React components with HTML5 + CSS3; CSS Modules or Tailwind for styling.  
- **Build Tools:** Vite for development and production bundling.  
- **Additional Dependencies:** Keep to minimum (Mermaid.js, Remark, React).  

---

## 6. Initial UI Layout

### Main View
- **Header Toolbar (top):**  
  - `Open File…` button – file picker to load .md file.  
  - File name display (e.g., "flowchart.md").  
  - Search box – filter nodes by label or ID.  
  - `+` / `-` zoom buttons.  
  - `Reset View` button – return to default zoom/center.  
  - `Theme selector` dropdown (Light, Dark).  

- **Main Canvas Area (center):**  
  - Scalable SVG rendering of Mermaid diagram.  
  - Supports mouse wheel zoom, click-drag pan, node selection.  
  - Loading indicator during Mermaid processing.  
  - Error message display if diagram fails to parse.  

- **Side Panel (right, collapsible):**  
  - Appears when a node is selected.  
  - Shows node metadata: ID, label, connected edges.  
  - Dismissible via close button or selecting a different node.  
  - Collapses on smaller screens (responsive).  

- **Diagram Info Panel (collapsible, optional):**  
  - Displays flow statistics: node count, edge count, graph depth.  
  - Accessible via info icon in toolbar.  

- **Status Bar (bottom):**  
  - Displays context-sensitive hints (e.g., "Click a node to see details", "Scroll to zoom", "+ and - keys adjust zoom").  
  - Non-intrusive, subtle text.  

---

## 7. Future Enhancements (Post-MVP)
-
### Phase 2 Features
- **Drag-and-Drop File Loading** – Accept dragged .md files onto canvas to load diagram (currently file picker only).  
- **Additional Mermaid Diagram Types** – Support for sequence diagrams, class diagrams, state machines, ERD, Gantt charts.  
- **Export Functionality** – Export current diagram as PNG or SVG with theme applied.  
- **Session Persistence** – Save and restore session state (loaded file, selection, zoom/pan position, theme preference).  
- **Embedded Markdown Preview** – Side-by-side Markdown editor and live diagram preview with synchronized updates.  
- **Diagram Annotation** – Add notes or labels to nodes directly in the UI; export annotations with diagram.  
