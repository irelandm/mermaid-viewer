---
project: mermaid-viewer
workStyle: kanban
developer: solo
date: 2026-02-06
status: ready-to-start
---

# mermaid-viewer – Kanban Work Plan

## Overview

Single-developer kanban workflow executing 37 MVP stories across 7 epics in sequential order. No sprint boundaries—continuous flow from Epic 1 through Epic 7.

---

## Work Queue by Epic

### Epic 1: Foundation & Project Setup
**Status:** Ready to Start  
**Dependency:** None (Entry Point)  
**Completion Criteria:** All 6 stories complete, dev environment fully operational

**Story Sequence:**

| # | Story | Prerequisite | Exit Criteria | Status |
|---|-------|--------------|---------------|--------|
| 1.1 | Initialize Vite React TypeScript Project | None | `npm run dev` works, React 18.x confirmed | Done |
| 1.2 | Install Core Dependencies | 1.1 | All packages in package.json, node_modules populated | Done |
| 1.3 | Configure Tailwind CSS with Dark Mode | 1.2 | Tailwind utilities working, dark mode default, color tokens defined | Done |
| 1.4 | Set Up React Context & State Management | 1.3 | AppContext provider wrapping app, useAppState hook exportable | Done |
| 1.5 | Create Project Directory Structure | 1.4 | Folder structure created, .gitignore in place | Done |
| 1.6 | Create Temporary File Load Status Display | 1.5 | Status component renders success/error messages, integrated with AppContext | Done |

**Completion Gate:** Run `npm run dev` and confirm:
- Dev server starts without errors
- Hot module reloading works
- Console has no TypeScript errors
- Status display component renders

➡️ **Move to Epic 2 when:** All 6 stories complete, project builds cleanly

---

### Epic 2: File Handling & Markdown Parsing
**Status:** ✅ Complete  
**Dependency:** Epic 1 complete  
**Completion Criteria:** Users can load `.md` files and parse Mermaid blocks with clear error handling

**Story Sequence:**

| # | Story | Prerequisite | Exit Criteria | Status |
|---|-------|--------------|---------------|--------|
| 2.1 | Create File Open Button & File Picker | 1.6 | Button appears in toolbar, file picker filters `.md` files | Done |
| 2.2 | Parse Markdown & Extract Mermaid Code Block | 2.1 | Remark parser identifies first `mermaid` code block, error on missing block | Done |
| 2.3 | Display Loaded File Name & Status | 2.2 | File name displays in toolbar, status message shows "Loaded: [filename]" | Done |
| 2.4 | Handle File Parse Errors & Provide Recovery | 2.3 | Error messages display inline, recovery action ("Open Different File") works | Done |

**Completion Gate:** ✅ PASSED
- Load a valid Markdown file with Mermaid block → file name displays, status shows success
- Load invalid Markdown → error message displays
- Load valid Markdown with no Mermaid block → specific error message + recovery action

➡️ **Epic 3 UNBLOCKED:** All 4 stories complete, file loading fully functional

---

### Epic 3: Diagram Rendering & Display
**Status:** ✅ Complete  
**Dependency:** Epic 2 complete ✅  
**Completion Criteria:** Mermaid diagrams render to SVG and auto-fit in viewport with loading feedback

**Story Sequence:**

| # | Story | Prerequisite | Exit Criteria | Status |
|---|-------|--------------|---------------|--------|
| 3.1 | Render Mermaid Flowchart to SVG | 2.4 | `mermaid.render()` produces SVG, nodes/edges visible | Done |
| 3.2 | Auto-Fit Diagram to Viewport on Load | 3.1 | Diagram centers and scales to fit canvas with 10–20px margin | Done |
| 3.3 | Display Loading Indicator During Rendering | 3.2 | Spinner appears while rendering, disappears when complete | Done |
| 3.4 | Create SVGCanvas Component | 3.3 | Reusable component encapsulates render logic, reads/writes to AppContext | Done |

**Completion Gate:** ✅ PASSED
- Load a Markdown file → spinner appears → diagram renders and auto-fits
- Diagram visibly scales to fit viewport
- No console errors, SVG nodes have unique IDs

➡️ **Epic 4 UNBLOCKED:** All 4 stories complete, diagram rendering fully functional

---

### Epic 4: Navigation & Zoom/Pan Interactions
**Status:** 🔵 In Progress (5/6 complete)  
**Dependency:** Epic 3 complete ✅  
**Completion Criteria:** Smooth, responsive zoom and pan with wheel scroll, buttons, keyboard, and reset

**Story Sequence:**

| # | Story | Prerequisite | Exit Criteria | Status |
|---|-------|--------------|---------------|--------|
| 4.6 | Create Zoom/Pan Controller Hook & Integrate Panzoom Library | 3.4 | panzoom library initialized, zoom/pan state in AppContext | Done |
| 4.1 | Implement Zoom with Wheel Scroll (Cursor-Centered) | 4.6 | Scroll wheel zooms diagram, centered on cursor, range 0.5x–5x | Done |
| 4.2 | Implement Pan with Click-Drag & Inertial Momentum | 4.1 | Click-drag pans smoothly, inertia continues after release (~500–800ms decay) | Done |
| 4.3 | Create Zoom Controls (Plus/Minus Buttons) | 4.2 | +/− buttons in toolbar, incremental zoom from canvas center | Done |
| 4.4 | Implement Reset View Button | 4.3 | Reset button returns diagram to initial auto-fit state with 300–500ms animation | Done |
| 4.5 | Add Keyboard Zoom Shortcuts (+ and − Keys) | 4.4 | +/− keys zoom diagram (canvas center), work with or without search focus | To Do |

**Completion Gate:**
- Scroll wheel zooms (cursor-centered) and pans smoothly
- Click-drag pans with inertia
- +/− buttons and keyboard shortcuts work
- Reset View returns to initial state
- All interactions ≤100ms response, ≥30 FPS during pan/zoom
- Test on a large diagram (100+ nodes) for performance

➡️ **Move to Epic 5 when:** All 6 stories complete, zoom/pan fully responsive

---

### Epic 5: Node Selection & Side Panel
**Status:** Blocked (Waiting for Epic 4)  
**Dependency:** Epic 4 complete  
**Completion Criteria:** Nodes selectable with visual feedback and side panel showing metadata

**Story Sequence:**

| # | Story | Prerequisite | Exit Criteria | Status |
|---|-------|--------------|---------------|--------|
| 5.1 | Implement Node Click Detection via Event Delegation | 4.5 | Single click listener on SVG root, nodes identified by data-node-id or id | To Do |
| 5.2 | Apply Visual Selection Styling (Color Swap & Glow) | 5.1 | `.node-selected` class applied, node color swaps to accent (#00d4ff), subtle glow visible | To Do |
| 5.3 | Highlight Connected Nodes & Edges | 5.2 | `.node-connected` and `.edge-connected` classes applied, edges bold in accent color | To Do |
| 5.4 | Display Node Hover Tooltip (Label + ID) | 5.3 | Tooltip appears on hover with "Label – node_id" format, positioned 4–8px from cursor | To Do |
| 5.5 | Create Side Panel Component Structure | 5.4 | Panel appears on right (280px fixed width), sticky positioning, close button works | To Do |
| 5.6 | Display Selected Node Metadata in Side Panel | 5.5 | Panel shows Node ID, Label, Connected Edges list; scrollable if content overflows | To Do |

**Completion Gate:**
- Click a node → color changes, glow visible, connected nodes/edges highlighted
- Hover a node → tooltip appears with label and ID
- Side panel opens showing node metadata (ID, label, connections)
- Click another node → panel updates, previous node deselection works
- Click empty canvas → deselect all, panel closes

➡️ **Move to Epic 6 when:** All 6 stories complete, selection and side panel fully functional

---

### Epic 6: Search & Filtering
**Status:** Blocked (Waiting for Epic 5)  
**Dependency:** Epic 5 complete  
**Completion Criteria:** Real-time search by label/ID with highlight/dim visual feedback

**Story Sequence:**

| # | Story | Prerequisite | Exit Criteria | Status |
|---|-------|--------------|---------------|--------|
| 6.1 | Create Search Input in Toolbar | 5.6 | Search box in toolbar with placeholder "Search nodes...", clear button (X) works | To Do |
| 6.2 | Filter Nodes by Label & ID (Real-Time) | 6.1 | Search updates AppContext, matches identified (label/ID substring, case-insensitive), result count displayed | To Do |
| 6.3 | Highlight Matching Nodes & Dim Non-Matches | 6.2 | `.search-match` nodes full opacity in accent color, `.search-mismatch` nodes opacity 0.4 | To Do |
| 6.4 | Preserve Node Selection During Search | 6.3 | Selected node remains selected while search is active, side panel stays open | To Do |
| 6.5 | Allow Click-Selection of Highlighted Matches | 6.4 | Clicking highlighted node selects it, side panel updates, search query preserved | To Do |

**Completion Gate:**
- Type in search box → nodes matching label/ID highlighted, non-matches dimmed
- Result count displays (e.g., "3 of 42")
- Click highlighted node → selects and shows in side panel
- Clear search → all nodes revert to normal appearance
- Selection persists during search

➡️ **Move to Epic 7 when:** All 5 stories complete, search fully functional

---

### Epic 7: Styling, Theming & Accessibility
**Status:** Blocked (Waiting for Epic 6)  
**Dependency:** Epic 6 complete  
**Completion Criteria:** Dark/light themes, WCAG 2.1 AA compliance, keyboard navigation

**Story Sequence:**

| # | Story | Prerequisite | Exit Criteria | Status |
|---|-------|--------------|---------------|--------|
| 7.1 | Implement Dark Theme CSS with Tailwind | 6.5 | Dark theme default, custom color tokens (#0a0e27 canvas, #00d4ff accent, etc.), all UI components themed | To Do |
| 7.2 | Create Theme Toggle (Dark/Light) | 7.1 | Toggle button in toolbar, SET_THEME action dispatches, theme persists to localStorage | To Do |
| 7.3 | Implement Light Theme CSS | 7.2 | Light theme colors defined, all elements update on toggle, ≥4.5:1 text contrast, ≥3:1 UI contrast | To Do |
| 7.4 | Ensure WCAG 2.1 AA Contrast Compliance | 7.3 | Audit all colors: text ≥4.5:1, UI components ≥3:1, status colors compliant, accessibility report documented | To Do |
| 7.5 | Add Keyboard Navigation & Focus Indicators | 7.4 | Tab cycles through all interactive elements in logical order, focus indicators visible (2–3px accent outline) | To Do |
| 7.6 | Add ARIA Labels & Semantic HTML | 7.5 | Semantic `<button>`, `<input>`, `<label>` used throughout, aria-label attributes present, SVG nodes labeled, error messages `role="alert"` | To Do |

**Completion Gate:**
- Toggle theme button → entire app switches dark ↔ light
- Tab through UI → focus indicators visible on all buttons, inputs, canvas
- Enter/Space on focused button → action triggers
- Keyboard shortcuts work (+/− for zoom, Escape to deselect)
- Run contrast checker → ≥4.5:1 text, ≥3:1 UI components in both themes
- Screen reader test: All interactive elements announced with aria-labels

➡️ **Move to Validation when:** All 6 stories complete, entire feature set built and accessible

---

## Cross-Epic Dependencies & Sequencing Notes

### Hard Blocking Dependencies
- Epic 1 → Epic 2 (need AppContext, file handling infra)
- Epic 2 → Epic 3 (need Mermaid code extracted before rendering)
- Epic 3 → Epic 4 (need SVG rendered before zoom/pan interaction)
- Epic 4 → Epic 5 (need event listener on SVG; panzoom should not conflict with selection clicks)
- Epic 5 → Epic 6 (search operates on nodes, which must be selectable first)
- Epic 6 → Epic 7 (final polish—theme, keyboard nav, accessibility across all features)

### Story-Level Dependencies to Watch

**Within Epic 4:**
- Must implement `4.6` (panzoom hook) before `4.1` (wheel zoom)
- `4.1` must complete before `4.2` (pan with momentum)
- `4.3–4.5` can work in parallel after `4.2`, but all must complete before Epic 5 starts

**Within Epic 5:**
- `5.1` (event delegation) must complete before `5.2–5.3` (styling)
- `5.4` (tooltip) and `5.5–5.6` (side panel) can work in parallel after `5.1`

**Within Epic 7:**
- `7.1` (dark theme) provides foundation for `7.2–7.3` (toggle, light theme)
- `7.4` (WCAG audit) happens after themes are complete
- `7.5–7.6` (keyboard nav, ARIA) can happen in parallel with theme work but should finish last

---

## Ready-to-Start Checklist

Before picking up **Story 1.1**, confirm:

- [ ] VS Code or preferred editor open
- [ ] Terminal/CLI access confirmed
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 9+ installed (`npm --version`)
- [ ] Git initialized in project folder (`git status`)
- [ ] GitHub/version control remote configured (if applicable)
- [ ] `/Users/marki/dev/mermaid-viewer` is the active workspace
- [ ] You've read and understood the acceptance criteria for Story 1.1

---

## Work State Management

### Status Tracking

Update your work state as you progress:

- **Backlog** → Stories not yet started
- **In Progress** → Currently working on (1 story at a time in kanban)
- **Review** → Completed and self-tested (verify acceptance criteria)
- **Done** → Merged/committed to main branch

### Handoff Checklist Between Epics

Before moving from one epic to the next:

1. ✅ All stories in current epic **Complete**
2. ✅ `npm run build` succeeds with no errors
3. ✅ `npm run dev` server starts cleanly
4. ✅ All acceptance criteria verified for each story
5. ✅ Code committed with clear messages
6. ✅ Any tech debt or known issues documented in comments

### Parallel Work Opportunities (if not truly solo)

If a second developer joins later, these epics can start independently:
- Epic 5 (node selection) and Epic 6 (search) have some parallel potential after Epic 4 completes
- Epic 7 (theming/a11y) is mostly independent after Epic 6 completes

---

## Success Metrics

### MVP Complete When:
- ✅ All 37 stories complete and merged
- ✅ All acceptance criteria verified
- ✅ `npm run build` produces optimized bundle
- ✅ No console errors in dev or production build
- ✅ Keyboard navigation + screen reader tested
- ✅ Can load a Markdown file with Mermaid diagram → render → zoom/pan → search → select nodes → view metadata
- ✅ Both dark and light themes functional
- ✅ WCAG 2.1 AA accessibility report passed

---

## Quick Reference: Story IDs by Epic

| Epic | Stories | Count |
|------|---------|-------|
| **Epic 1** Foundation | 1.1–1.6 | 6 |
| **Epic 2** File Handling | 2.1–2.4 | 4 |
| **Epic 3** Rendering | 3.1–3.4 | 4 |
| **Epic 4** Zoom/Pan | 4.1–4.6 | 6 |
| **Epic 5** Selection | 5.1–5.6 | 6 |
| **Epic 6** Search | 6.1–6.5 | 5 |
| **Epic 7** Theming/A11y | 7.1–7.6 | 6 |
| **TOTAL** | 1.1–7.6 | **37** |

---

## Current Status

**✅ Completed:** Epic 1 (Foundation) + Epic 2 (File Handling) + Epic 3 (Diagram Rendering)  
**🔵 In Progress:** Epic 4 – Stories 4.6, 4.1, 4.2, 4.3, 4.4 Done (5/6 - panzoom hook, wheel zoom, drag-pan w/ inertia, zoom buttons, reset view)  
**🟢 Next Up:** Epic 4 – Story 4.5 (Add Keyboard Zoom Shortcuts)

Marki, solid progress! Foundation, file handling, and rendering complete. Now 5 of 6 Epic 4 stories done. Ready for keyboard shortcuts. Each epic completes a major feature area, and you can't start the next without finishing the current one (due to dependencies).

When you hit any blockers, come back to discuss. Good luck! 🚀
