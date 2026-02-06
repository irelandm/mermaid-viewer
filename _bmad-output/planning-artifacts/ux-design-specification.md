stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
inputDocuments: []
---

# UX Design Specification mermaid-viewer

**Author:** Marki
**Date:** 2026-01-30

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

### Project Vision

A single-user, desktop-first Mermaid diagram explorer with a default dark, high-contrast visual system that prioritizes crystal-clear rendering, fluid navigation, and unmistakable selection feedback. Runs fully offline with minimal UI overhead.

### Target Users

You — technical and detail-oriented, working on a desktop/laptop; values strong contrast, dark mode, speed, and precise interaction over multi-user features.

### Key Design Challenges

- High-contrast dark theming that meets WCAG AA/AAA while keeping dense diagrams readable.
- Precise selection on crowded nodes/edges with zero ambiguity and immediate visual confirmation.
- Fast, predictable zoom/pan tuned to desktop inputs (wheel, drag, +/-), maintaining smooth performance.

### Design Opportunities

- Default Theme: Dark, high-contrast palette (near-black canvas, high-luminance accents, accessible text).
- Selection Feedback: Combined color swap plus subtle glow; bold edge highlights with increased stroke width for selected connections.
- Navigation: Wheel zoom centered on cursor; inertial pan; compact toolbar with +, -, Reset, Search, Theme.
- Search Behavior: Dim non-matches (not hide) to preserve structural context while highlighting matches.
- Accessibility: Maintain ≥4.5:1 contrast for text and ≥3:1 for UI components; ensure tooltip and side panel legibility on dark backgrounds.

## Core User Experience

### Defining Experience

Open a local Markdown file, extract the first Mermaid flowchart block, render to SVG, then fluidly explore via zoom/pan and precise node selection. Searching highlights matches while dimming non-matches to preserve context. Node selection reveals a tooltip and a compact side panel with ID, label, and connected edges.

### Platform Strategy

Desktop/laptop only, browser-based (Chrome/Firefox), mouse and keyboard inputs; fully offline operation; default dark, high-contrast theme; minimal dependencies and uncluttered UI prioritized for a single user.

### Effortless Interactions

Scroll-wheel zoom centered on cursor; click-drag pan with smooth inertia; +/− buttons and a Reset View. Selection feedback combines color swap and subtle glow; connected edges bolden with increased stroke width for clarity; quick, legible tooltip over dark canvas.

### Critical Success Moments

First load auto-fit and centered; render within ≤ 2 seconds even for large diagrams; zoom/pan remain responsive and predictable; selection is unambiguous; search instantly highlights while dimming others; visuals maintain WCAG AA contrast in dark mode.

### Experience Principles

Clarity-first dark theme; performance-first navigation; single-user focus with minimal UI; predictable interactions; accessible contrast across controls and text.

## Desired Emotional Response

### Primary Emotional Goals

Calm focus and confidence; clarity at a glance on a dark canvas; a strong sense of control through immediate, predictable interactions.

### Emotional Journey Mapping

- First discovery: Instantly clear diagram fit and legible dark theme.
- Core interaction: Smooth zoom/pan and unambiguous selection; steady confidence.
- Task completion: Satisfaction from quick navigation and precise insights.
- Error states: Reassured by clear, non-technical messages and easy recovery (Reset View).
- Return use: Familiar, dependable rhythm—everything feels right where it should be.

### Micro-Emotions

Confidence over confusion; accomplishment over frustration; calm over anxiety; trust built via consistent behavior and accessible contrast.

### Design Implications

- Motion: Crisp transitions without jitter; avoid over-animated effects.
- Feedback: Combined color swap and glow for selection; bold edges for relationships.
- Messaging: Short, friendly, high-contrast notices; clear affordances for recovery.

### Emotional Design Principles

- Predictability breeds trust.
- Contrast guides attention.
- Minimal friction, maximal clarity.
- Fast feedback is reassurance.

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

High-performance visualization and navigation tools prioritize: (1) zoom/pan centered on user intent; (2) unambiguous selection with immediate visual confirmation; (3) accessible contrast on dark backgrounds; (4) minimal UI chrome to maximize canvas space.

### Transferable UX Patterns

- **Zoom-to-cursor**: Wheel scroll zooms centered on cursor, not canvas center; intuitive for detailed exploration.
- **Selection feedback**: Color swap + subtle glow + bold edge highlight creates layered, unmistakable selection states.
- **Inertial pan**: Click-drag with momentum carries through; feels natural and reduces friction.
- **Toolbar minimalism**: Essential controls (+, −, Reset, Search, Theme) on a single row; no hidden menus for critical actions.
- **Tooltip legibility**: Light text on dark background with subtle shadow; appears near cursor on hover; disappears on interaction.
- **Search with dimming**: Matching nodes highlighted; non-matches dimmed but visible; preserves graph context.

### Anti-Patterns to Avoid

- Ambiguous selection: avoid subtle color shifts; use bold, high-contrast swaps.
- Laggy interactions: never trade performance for animation; frame rate matters more than smoothness.
- Hidden controls: all critical actions (zoom, pan, reset, select) must be immediate and visible.
- Low-contrast overlays: tooltips, side panels, and toolbars must maintain ≥4.5:1 text contrast on dark.
- Over-animation: unnecessary transitions increase perceived latency; keep motion crisp and purposeful.

### Design Inspiration Strategy

**What to Adopt:**

- Zoom-to-cursor and inertial pan for fluid navigation.
- Layered selection feedback (color + glow + edges) for confidence.
- Minimal, single-row toolbar with essential controls.

**What to Adapt:**

- Tooltip behavior: show on hover, hide on interaction (not on mouse leave).
- Search dimming: preserve full visibility of non-matches; use opacity shift, not hide.

**What to Avoid:**

- Complex toolbar menus; flat, single-level hierarchy only.
- Ambiguous state transitions; every change must be instantly clear.
- Non-dark, low-contrast backgrounds; prioritize accessibility from the start.

## Design System Foundation

### Design System Choice

Tailwind CSS with custom component layer.

### Rationale for Selection

- **Speed**: Tailwind enables rapid prototyping without predefined component overhead.
- **Dark Mode**: Native, first-class dark mode support with zero extra effort.
- **Customization**: Full control over token values (colors, spacing, typography) to match dark high-contrast requirements.
- **Minimal Dependencies**: Utility-first approach keeps bundle small and offline-friendly.
- **Accessibility**: Built-in focus states and semantic HTML; fully customizable for WCAG AA compliance.
- **Single-User Focus**: Lightweight framework suits a solo developer's needs without unnecessary abstraction layers.

### Implementation Approach

- Configure Tailwind with custom color tokens for dark, high-contrast theme.
- Define dark mode as default; provide toggle for light theme (future).
- Build custom SVG container wrapper and interaction layer on top of Tailwind utilities.
- Use Tailwind's utility classes for toolbar, side panel, tooltip, and search components.
- Ensure all interactive states (hover, active, focus) use high-contrast colors (≥4.5:1).

### Customization Strategy

- **Color Palette**: Define primary (accent), canvas (dark), text (light), and semantic colors in `tailwind.config.js`.
- **Component Library**: Create minimal set of custom React components (Button, Toolbar, SidePanel, Tooltip, SearchBox) layered on Tailwind.
- **Typography**: Ensure font hierarchy supports legibility on dark backgrounds; prioritize sans-serif for UI clarity.
- **Spacing**: Use consistent, predictable spacing scale aligned to Tailwind's 4px base grid.

## Core Experience Definition

### Defining Experience

The seamless flow: Open Markdown file → diagram instantly visible and centered on dark canvas → smoothly zoom/pan to explore → click any node to select and inspect its relationships → continue navigation. Three interactions (load, select, navigate) feel like one continuous, effortless experience.

### User Mental Model

You expect: file loads, you see the full diagram immediately, you can intuitively explore without friction. Clicking a node means "show me details and connections." Zooming and panning are second nature. The tool should disappear; only the diagram matters.

### Success Criteria

- Load ≤ 2 seconds, auto-fit, centered, legible on dark canvas.
- Selection unambiguous: color swap + glow + bold edges; side panel appears with node ID, label, connected edges.
- Zoom/pan feels natural: scroll zooms to cursor, drag pans with inertia, +/− buttons and Reset always available.
- Flow seamless: no context switch between actions; selecting a node doesn't disrupt pan/zoom state.

### Novel vs. Established Patterns

All three interactions are established patterns (file picker, node selection, zoom/pan) refined by your dark high-contrast preference and emphasis on seamlessness. Innovation lies in the integration: switching between select and navigate without friction.

### Experience Mechanics

1. **Load**: User opens file → Markdown parsed → first Mermaid block extracted → SVG rendered → auto-fit viewport, centered, dark canvas ready.
2. **Navigate**: User scrolls to zoom (cursor-centered) or drags canvas to pan; +/− buttons adjust incrementally; Reset returns to fit view.
3. **Select**: User clicks any node → node color swaps, glow appears, connected edges bold up → tooltip shows label + ID → side panel slides in with details → clicking elsewhere deselects.
4. **Continuity**: All states (zoom, pan, selection) persist across interactions; no resets unless explicitly requested.

## Visual Design Foundation

### Color System

- **Canvas**: Near-black (#0a0e27) for dark high-contrast legibility.
- **Primary Accent**: Bright, saturated color for selected nodes (cyan #00d4ff or amber #ffd700).
- **Node Default**: Medium-light gray (#d0d5dd) for contrast on dark canvas.
- **Text**: Near-white (#f0f2f5) ensuring ≥4.5:1 contrast ratio.
- **Edges**: Medium gray (#6b7280); bold to accent color when connected to selection.
- **Glow**: Subtle colored shadow or opacity shift around selected node for feedback.
- **Status Colors**: Green (success), red (error), yellow (warning), all meeting ≥4.5:1 contrast on dark.

### Typography System

- **Primary Font**: Inter, JetBrains Mono, or Roboto (sans-serif, excellent legibility on dark).
- **Type Scale**: Toolbar labels 12px, node labels 13px, side panel text 14px, headings 16px.
- **Line Height**: 1.5 for readability; 1.4 for dense content.
- **Font Weight**: Regular (400) for body; medium (500) for labels; bold (700) for emphasis.

### Spacing & Layout Foundation

- **Base Unit**: 4px grid alignment.
- **Toolbar**: 8px padding, 4px gaps between buttons; single row, always visible.
- **Side Panel**: 16px padding, 12px section gaps; collapsible on small screens.
- **Canvas Area**: Full viewport minus toolbar (top) and side panel (right) heights.
- **Tooltip**: 4px offset from cursor, 8px padding, subtle shadow for separation.
- **Component Gaps**: 8px between major sections; 4px between inline elements.

### Accessibility Considerations

- All text and interactive elements maintain ≥4.5:1 contrast on dark backgrounds.
- Interactive states (hover, focus, active) use bold color shifts or outlines; never rely on hover alone.
- Keyboard navigation: Tab through toolbar/panel controls, Enter to activate, Escape to deselect node.
- Focus indicators: 2–3px outline in accent color, visible on all interactive elements.
- Touch targets: Minimum 44x44 px for toolbar buttons, ensuring accessibility on large fingers.
- Motion: Crisp, purposeful transitions (150–200ms); no over-animation to reduce perceived latency.

## Design Direction Decision

### Design Directions Explored

Five interactive mockups generated showcasing:
1. **Compact Minimalist** – Single-row toolbar, narrow side panel, maximum canvas space; best for focused exploration.
2. **Balanced Sidebar** – Left sidebar with collapsible sections, top toolbar, right side panel; balanced information hierarchy.
3. **Toolbar-Heavy** – Multi-row toolbar with all controls visible; maximum canvas; optimized for power users.
4. **Canvas-First** – Minimal toolbar, side panel hidden by default; appears only on node selection; maximum focus on diagram.
5. **Mode-Based Toggle** – Switch between Explore (full canvas) and Inspect (side panel visible) modes; user controls focus.

### Chosen Direction

**Compact Minimalist** (Direction 1) with elements from Canvas-First.

**Rationale:**
- Single-row toolbar keeps controls accessible without cognitive load.
- Narrow, always-visible side panel balances quick reference with maximum canvas space.
- Canvas-First principle: side panel optional via collapse/toggle for power exploration.
- Aligns with single-user, desktop-focused design and dark high-contrast aesthetic.
- Supports seamless flow: load → select → navigate without mode switching.

### Implementation Approach

- **Toolbar**: Fixed 40px height, dark background, single row with flex layout; controls: Open, Search, Zoom (±), Reset, Theme.
- **Side Panel**: Fixed 280px width (collapsible on <1000px viewport), dark background, always visible in default state; dismissible via icon.
- **Canvas**: Full viewport minus toolbar and panel heights; SVG rendered at 100% fit.
- **Interactions**: Click nodes to select; hover shows tooltip; selection persists; navigation states preserved.
- **Responsive**: On smaller screens (<800px), side panel collapses into a slide-over or modal; toolbar wraps gracefully.

### Design Decisions Locked

- Layout: Compact Minimalist as primary, Canvas-First as progressive enhancement.
- Color System: Dark high-contrast palette as specified in Step 8.
- Typography: Sans-serif, consistent sizing and hierarchy.
- Spacing: 4px base grid with 8px and 16px major divisions.
- Toolbar: Always visible, sticky top.
- Side Panel: Visible by default, collapsible on demand.

## User Journey Flows

### 1. Load & Orient

**Defining Success:** File opens, diagram renders within 2 seconds, auto-fit to viewport, user sees complete diagram immediately on dark canvas.

**Flow:**
1. User clicks "Open" button → File picker displays.
2. User selects .md file → Markdown parsed, first Mermaid block extracted.
3. SVG rendered to canvas → Auto-fit applied (zoom to fit all nodes).
4. Canvas centers diagram → Toolbar and side panel ready.
5. User sees full diagram, legible on dark background.

**Compact Minimalist Optimization:** Toolbar remains sticky at top; side panel tucked on right; canvas maximized. No modal overlays; immediate visual feedback.

### 2. Explore & Navigate

**Defining Success:** User smoothly zooms and pans to find nodes of interest; interactions feel natural and responsive.

**Flow:**
1. User scrolls wheel → Zoom centered on cursor position (not canvas center).
2. User clicks-drag canvas → Pan with inertial follow-through.
3. User clicks "+" or "-" button → Incremental zoom in/out (e.g., 10% steps).
4. User clicks "Reset View" → Returns to auto-fit state.
5. Navigation state persists (zoom/pan position maintained across interactions).

**Compact Minimalist Optimization:** All controls in single-row toolbar; no hidden menus. Wheel zoom and drag pan work seamlessly; buttons provide redundancy for keyboard-only users.

### 3. Select & Inspect

**Defining Success:** User clicks a node, immediately sees it's selected, tooltip appears with ID + label, side panel shows full details.

**Flow:**
1. User hovers node → Subtle border/glow appears (pre-selection hint).
2. User clicks node → Node color swaps (e.g., gray → cyan).
3. Tooltip appears near cursor → Shows label + node ID (e.g., "Process A – node_123").
4. Side panel updates → Shows selected node's ID, label, and connected edges.
5. Connected edges bolden and highlight (color swap or stroke weight increase).
6. Selection persists until user clicks empty canvas or another node.

**Compact Minimalist Optimization:** Side panel always visible (280px) for quick reference; tooltip disappears on interaction (not just on mouse leave); selection state is unambiguous through color + glow + edge bolding.

### 4. Search & Filter

**Defining Success:** User types search query, matching nodes highlight instantly, non-matches dim but remain visible (preserving diagram structure).

**Flow:**
1. User types in search box → Results filter in real-time (debounced, <100ms).
2. Matching nodes highlight (color swap, e.g., to accent color).
3. Non-matching nodes dim (opacity shift, e.g., 0.4 opacity).
4. Search count displays (e.g., "3 of 42 nodes").
5. User clicks a highlighted match → Selects that node (as if clicked on canvas).
6. User clears search box → All nodes restore to full opacity; selection persists.

**Compact Minimalist Optimization:** Search box always visible in toolbar; results appear instantly on canvas; no separate search panel needed.

### 5. Error Recovery

**Defining Success:** User encounters error (malformed Mermaid syntax, file parse failure, etc.); error message is clear and actionable; user can recover easily.

**Flow:**
1. User opens file with invalid Mermaid syntax.
2. Parser detects error → Loading indicator replaced with error message.
3. Error message shows: "Diagram syntax error on line X" or "File format not supported."
4. Recovery options presented: "Open Different File" or "View Mermaid Syntax Help."
5. User clicks recovery option → Returns to file picker or documentation.
6. On recovery, canvas clears and awaits new file.

**Compact Minimalist Optimization:** Error message inline on canvas (not modal popup); no side panel clutter; focus remains on "Open" button for quick retry.

### Journey Patterns

**Navigation Pattern:** Zoom-to-cursor for precision, inertial pan for fluidity, Reset for quick recovery. All accessible via wheel, drag, buttons, and keyboard (+/− keys).

**Selection Pattern:** Hover hints, click selects, tooltip appears, side panel updates, edges highlight. No mode switching; all interactions accumulate state.

**Feedback Pattern:** Color, glow, and stroke weight provide layered feedback. Motion is crisp (150–200ms) and purposeful. Text contrast always ≥4.5:1.

### Flow Optimization Principles

- **Minimize steps to value:** Load → orient → explore → select, each step <1 second.
- **Reduce cognitive load:** All controls visible; no hidden menus or modes; state persists across interactions.
- **Provide clear feedback:** Every action triggers immediate visual response (color, tooltip, panel update).
- **Enable recovery:** Error states are clear; Reset button always available; search clears with one click.
- **Preserve context:** Zoom/pan and selection states maintained; search results don't reset navigation.
## Component Strategy

### Design System Components

**Tailwind CSS Utilities:** Buttons, inputs, flexbox layouts, padding/margin scales, color utilities, dark mode support.

**Available Tailwind Patterns:**
- Button states (hover, active, focus, disabled).
- Form inputs with focus rings and placeholder text.
- Modal and overlay patterns.
- Responsive breakpoints for sidebar collapse.
- Dark mode palette and contrast utilities.

### Custom Components

**1. SVGCanvas**
- **Purpose:** Renders Mermaid flowchart SVG, handles zoom/pan interactions, detects node/edge clicks.
- **States:** Default, zooming, panning, node-selected.
- **Interactions:** Wheel zoom (cursor-centered), click-drag pan, node click detection, edge highlighting.
- **Accessibility:** Keyboard: +/− to zoom, arrow keys to pan (optional), Escape to deselect.

**2. Toolbar**
- **Purpose:** Fixed-position control bar for file, search, zoom, theme, reset.
- **Components:** Open button, search input, zoom buttons (±), Reset button, theme dropdown.
- **States:** Disabled (while loading), active, hovered.
- **Responsive:** Single row; wraps on <600px viewport (non-critical on desktop-only).

**3. SidePanel**
- **Purpose:** Display selected node metadata (ID, label, connected edges) and stats.
- **Content:** Node ID, node label, connected edges list, optional Mermaid syntax view.
- **States:** Visible (node selected), collapsed (icon in corner), hidden (on very small screens).
- **Interactions:** Dismissible via close icon; updates on node selection; scrollable if content exceeds height.

**4. Tooltip**
- **Purpose:** Ephemeral label showing node ID and label on hover or selection.
- **Content:** Node label + node ID (e.g., "Process A – node_001").
- **States:** Visible (on hover/selection), hidden (on interaction or mouse leave).
- **Positioning:** Near cursor or near hovered node; avoids obscuring canvas.

**5. SearchBox**
- **Purpose:** Real-time node search and filter with debounce.
- **Content:** Text input; results count display.
- **States:** Empty, filled, focused.
- **Interactions:** Type to filter; clear button to reset; Enter to focus first match.

**6. NodeDetails**
- **Purpose:** Side panel content pane for node metadata and relationships.
- **Content:** Node ID, label, type (if available), connected edge list with target labels, optional Mermaid syntax.
- **States:** Loaded, loading (while parsing), error.
- **Interactions:** Scrollable; click edge to select target node (optional advanced feature).

### Component Implementation Strategy

**Framework:** React with Tailwind CSS.

**State Management:** React Context for global state (selection, zoom level, search filter, theme).

**Mermaid Integration:** Wrap Mermaid.js in a custom React hook; render SVG to canvas; handle re-renders on diagram changes.

**Custom Hooks:**
- `useZoomPan()` – Manages zoom/pan state and event listeners.
- `useNodeSelection()` – Manages selected node state and related edges highlighting.
- `useSearch()` – Manages search query and filter results.

**Styling:** Tailwind utilities with dark mode as default; custom CSS for SVG-specific styles (node fills, strokes, animations).

**Accessibility:**
- All buttons have ARIA labels and keyboard support.
- Focus indicators using Tailwind's focus ring utilities (2–3px outline).
- Tooltip content exposed to screen readers via aria-label.
- Side panel marked with aria-live for dynamic updates.

### Implementation Roadmap

**Phase 1 (MVP - Core Functionality):**
1. SVGCanvas – Render Mermaid, zoom/pan, click detection.
2. Toolbar – Open file, +/− zoom, Reset, theme toggle.
3. SidePanel – Show node ID, label, connected edges.
4. Tooltip – Hover hint with node label + ID.

**Phase 2 (Enhanced Features):**
5. SearchBox – Real-time filter, highlight/dim nodes.
6. NodeDetails – Expanded metadata, optional Mermaid syntax view.
7. Error handling – Invalid file or parse error recovery UI.

**Phase 3 (Polish & Accessibility):**
8. Keyboard navigation – Full keyboard support for zoom, pan, select.
9. Animation/motion – Smooth transitions for zoom/pan (maintain responsiveness).
10. Responsive behavior – Sidebar collapse/modal on <800px screens.

## UX Consistency Patterns

### Button Hierarchy & Styling

**Primary Action Buttons** (e.g., "Open File")
- Background: Accent color (#00d4ff)
- Text: Dark text (#0a0e27), weight 500
- Padding: 8px 16px, min touch target 44x44px
- Border radius: 4px
- Hover: Brighten to #00e5ff, shadow increase
- Active/Pressed: Darken to #0099cc
- Disabled: Opacity 0.5, cursor not-allowed

**Secondary Action Buttons** (e.g., "+", "−", "Reset")
- Background: Transparent or light gray #1a202c
- Border: 1px solid #2d3748
- Text: Medium gray #8891a0, weight 500
- Padding: 6px 12px
- Hover: Border brighten to #4a5568, text to #d0d5dd
- Active: Background lighten to #2d3748
- Focus: 2–3px outline in accent color

**Disabled State (All Buttons)**
- Opacity: 0.5
- Cursor: not-allowed
- No hover effects
- Background/border unchanged

### Feedback Patterns

**Success Feedback**
- Message: Brief, positive tone (e.g., "File loaded successfully!")
- Color: Green (#22c55e)
- Duration: Display 2–3 seconds, then fade out
- Position: Inline in status bar or brief toast above canvas

**Error Feedback**
- Message: Clear, actionable (e.g., "Invalid Mermaid syntax on line 5")
- Color: Red (#ef4444)
- Duration: Persist until user dismisses or retries
- Position: Inline on canvas; include recovery action button

**Warning Feedback**
- Message: Cautionary info (e.g., "Diagram contains 1000+ nodes; performance may degrade")
- Color: Yellow/amber (#f59e0b)
- Duration: Persistent until acknowledged
- Position: Inline banner or toast

**Info/Hint Feedback**
- Message: Context-sensitive guidance (e.g., "Scroll to zoom, drag to pan")
- Color: Gray (#8891a0)
- Duration: Fade on interaction
- Position: Status bar at bottom or tooltip

**Loading State**
- Visual: Spinner or progress indicator
- Message: "Loading..." or "Parsing diagram..."
- Duration: Persist until complete or error
- Position: Center canvas or in toolbar
- Buttons: Disable all actions during load

### Interaction & State Patterns

**Hover State** (All Interactive Elements)
- Visual: Subtle color shift or outline increase
- Timing: Immediate (~0ms delay)
- Effect: +1px border or -5% luminance shift
- Example: Button hover adds brightness; node hover adds subtle glow

**Active/Selected State** (Nodes, Buttons)
- Visual: Bold color swap to accent (#00d4ff), glow effect
- Duration: Instant on click
- Effect: Color change + optional shadow/glow (0–12px blur)
- Persistence: Until user clicks elsewhere or deselects

**Focus State** (Keyboard Navigation)
- Visual: 2–3px solid outline in accent color (#00d4ff)
- Offset: 2px from element edge
- Timing: Immediate on tab/keyboard focus
- Persistence: Until blur or action

**Disabled State** (Forms, Buttons)
- Visual: 0.5 opacity, no color shift on hover
- Cursor: not-allowed
- Interaction: No response to click or keyboard
- Messaging: Optional tooltip explaining why disabled

### Search & Filter Patterns

**Matching Node Display**
- Fill: Accent color (#00d4ff)
- Stroke: Accent color or bold (#00d4ff), 2px weight
- Text: Light text (#f0f2f5), bold font-weight
- Visibility: 100% opacity

**Non-Matching Node Display**
- Fill: Original color with reduced opacity (0.4)
- Stroke: Original stroke, same opacity (0.4)
- Text: Grayed out, same opacity
- Visibility: Visible but de-emphasized (preserves diagram structure)

**Search Clear Action**
- Behavior: Single click or icon click to clear search box
- Result: All nodes restore to 100% opacity instantly
- Persistence: Selection state (if any) is preserved

### Tooltip & Panel Patterns

**Tooltip Behavior**
- Content: Node label + node ID (e.g., "Process A – node_001")
- Appearance: Light text (#f0f2f5) on dark background (#1a202c), 1px border (#2d3748)
- Position: Near cursor (4px offset), or near hovered element
- Animation: 100–150ms fade-in on hover
- Dismissal: Fade out 100ms on mouse leave or on interaction (not delayed)
- Z-index: Above canvas, below modals

**Side Panel Behavior**
- Content sections: Divided by 1px horizontal lines (#2d3748)
- Scrolling: Internal scroll if content exceeds panel height
- Dismissal: Close icon in top-right or by selecting different node
- Animation: Smooth slide-in from right (150–200ms)
- Persistence: Remains open across zoom/pan; updates on node selection

**Modal Overlay Pattern**
- Backdrop: 70% opacity dark background (#0a0e27cc)
- Modal: Centered, 90vw max-width, dark background (#0f1428)
- Close: ESC key or close icon (top-right)
- Animation: 150ms fade-in/out
- Z-index: Above all other content

## Responsive Design & Accessibility

### Responsive Strategy

**Desktop-Only Design:** Per PRD requirements, Mermaid Diagram Explorer is optimized for desktop/laptop browsers (Chrome ≥120, Firefox ≥120, Edge ≥120) on Windows, macOS, and Linux.

**Responsive Approach:**
- Primary: Desktop (1024px+) layout with full toolbar, 280px side panel, maximized canvas.
- Graceful degradation: Desktops <1024px collapse side panel to modal or overlay (secondary support, not primary).
- Mobile/Tablet: No optimization required; viewport meta tag includes viewport-fit for wider browser support but experience not guaranteed.

**Layout Adaptation:**
- **Desktop Large** (≥1400px): Full layout, side panel always visible, toolbar single row.
- **Desktop Standard** (1024–1399px): Current layout, side panel visible, toolbar single row.
- **Desktop Small** (<1024px, non-primary): Side panel hidden by default, toggle button to show/hide; toolbar remains sticky and functional.

### Breakpoint Strategy

**Primary Breakpoint:** 1024px (traditional desktop/laptop threshold).

**Responsive Behavior:**
- ≥1024px: Side panel fixed visible; toolbar single row.
- <1024px: Side panel collapses to modal or slide-over on toggle.
- No mobile breakpoints or touch-first optimizations (desktop-only product).

### Accessibility Strategy

**WCAG 2.1 Level AA Compliance** (industry standard; ensures legal compliance and inclusive design).

**Color & Contrast:**
- Text and interactive elements: ≥4.5:1 contrast ratio on all backgrounds.
- Canvas nodes and edges: ≥3:1 contrast when distinguishable (node selected vs. unselected).
- Dark theme as default satisfies high-contrast requirements; light theme toggle available (future).

**Keyboard Navigation:**
- Full keyboard accessibility: Tab to navigate controls, Enter/Space to activate, Escape to deselect.
- Zoom: + and − keys for incremental zoom; Ctrl/Cmd+Scroll as alternative.
- Pan: Arrow keys or Shift+Drag for keyboard-only users.
- Search: Tab to search box, type to filter, Enter to focus first match, Escape to clear.
- Focus visible: 2–3px outline in accent color on all interactive elements.
- No keyboard traps: Users can Tab out of any control.

**Screen Reader Support:**
- Semantic HTML: Use native button, input, nav, main, section elements.
- SVG Accessibility: ARIA labels for nodes (aria-label="Node ID: process_a"); edges marked as connections (aria-describedby).
- Dynamic Updates: aria-live regions for search results, node selection feedback.
- Link text: Clear, descriptive labels (not "Click here"; use "Open file picker").
- Error messages: Linked to recovery actions; announced to screen readers.

**Touch & Motor Accessibility:**
- Touch targets: All buttons and interactive areas ≥44x44px (meets WCAG AA standards).
- Spacing: Minimum 4px gaps between clickable elements (prevents accidental clicks).
- No time-dependent interactions: Users can take as long as needed; no auto-timeouts.

**Visual & Cognitive Accessibility:**
- Color + Icon + Text: Never rely on color alone to convey meaning (e.g., use icon + text for warnings).
- Clear language: Error messages and instructions use plain, simple language.
- Consistent patterns: Predictable navigation and interaction models throughout.
- High contrast default: Dark theme with light text automatically meets contrast requirements.

### Testing Strategy

**Automated Testing:**
- axe DevTools (browser extension) for accessibility audits.
- WAVE (WebAIM) for detailed contrast and ARIA checks.
- Lighthouse accessibility audit (built into Chrome DevTools).
- Run on every code commit (CI/CD integration).

**Manual Testing:**
- Keyboard-only navigation: Navigate entire app using Tab, Enter, Escape, +/−, Arrow keys.
- Screen reader testing: VoiceOver (macOS) and NVDA (Windows) to verify text readability and navigation.
- Focus indicator check: Ensure 2–3px outline visible on every interactive element.
- Zoom testing: Test at 200% zoom; ensure no horizontal scroll or content cutoff.
- Color blindness simulation: Use Chrome extension to simulate protanopia, deuteranopia, tritanopia.

**Device & Browser Testing:**
- Desktop browsers: Chrome ≥120, Firefox ≥120, Edge ≥120 on Windows, macOS, Linux.
- Responsive breakpoints: Test at 1920x1080, 1600x900, 1280x720 viewports.
- Real device testing: Validate on actual desktop/laptop hardware.

**User Testing:**
- Include users with disabilities in beta testing (keyboard-only, screen reader users).
- Collect feedback on accessibility barriers and usability.
- Iterate based on real-world usage patterns.

### Implementation Guidelines

**HTML & Semantic Structure:**
- Use semantic elements: `<button>`, `<input>`, `<nav>`, `<main>`, `<section>`, `<article>`.
- Avoid `<div>` or `<span>` for interactive controls; use native elements for built-in accessibility.
- Header structure: Logical `<h1>`, `<h2>`, `<h3>` hierarchy (not skipped levels).

**ARIA Implementation:**
- aria-label: Provide labels for SVG nodes and edges ("Node: process_a", "Edge: A → B").
- aria-describedby: Link nodes to detailed metadata (optional).
- aria-live="polite": Announce dynamic updates (search results, selection changes).
- aria-disabled: Mark disabled states; pair with CSS cursor: not-allowed.
- role: Use sparingly; prefer semantic HTML over role attributes.

**Keyboard & Focus Management:**
- tabindex="0": Ensure all interactive elements are in natural Tab order.
- tabindex="-1": Remove elements from Tab order that shouldn't be keyboard-accessible.
- Focus outline: CSS outline: 2px solid #00d4ff with outline-offset: 2px.
- No outline: none without alternative focus indicator.
- Focus trap prevention: Users can Tab out of modals via close button or Escape key.

**Color & Contrast:**
- Contrast checking: Use axe or WAVE to verify ≥4.5:1 text contrast.
- Color-blind safe palette: Avoid red-green only distinctions; pair with icons or patterns.
- Dark mode as default: Already meets high-contrast requirements per design system.

**Performance & Accessibility:**
- Fast rendering: Diagram load ≤2 seconds (reduces cognitive load for all users).
- Reduce motion: Support prefers-reduced-motion media query (disable animations if user prefers).
- Code optimization: Minimize JavaScript; avoid blocking render (accessibility benefits performance).