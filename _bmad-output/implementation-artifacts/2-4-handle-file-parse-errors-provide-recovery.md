---
story_key: 2-4-handle-file-parse-errors-provide-recovery
epic: 2
epic_name: "File Handling & Markdown Parsing"
title: "Handle File Parse Errors & Provide Recovery"
prerequisite: 2-3-display-loaded-file-name-status
completion_gate: "Error messages display inline, recovery action ('Open Different File') works"
date_created: 2026-02-09
date_started: 2026-02-09
status: review
---

# Story 2.4: Handle File Parse Errors & Provide Recovery

## Story Summary

Enhance error handling for file parsing failures. When a user loads a Markdown file without a Mermaid code block or with invalid content, provide clear, specific error messages and actionable recovery options. Add a "Open Different File" button in the toolbar that allows users to quickly try another file without navigating menus.

This completes Epic 2's file handling workflow with comprehensive error recovery.

## Acceptance Criteria

1. **AC-2.4.1: Specific Error Messages** – When parsing fails (no Mermaid block found), display specific error message: "No Mermaid diagram found in this file. Please select a file with a mermaid code block."
2. **AC-2.4.2: Error Display in Toolbar** – Error message displays prominently in toolbar (red text, `role="alert"`)
3. **AC-2.4.3: Open Different File Button** – Toolbar shows "Open Different File" button when error state exists
4. **AC-2.4.4: Button Clears Error and Resets File** – Clicking button dispatches RESET_FILE action, clears error display, enables file picker
5. **AC-2.4.5: Button Accessibility** – Button has `aria-label="Open a different file"` and visible focus indicator
6. **AC-2.4.6: Visual Distinction** – Recovery button styled distinctly (e.g., secondary button style) from main "Open File" button
7. **AC-2.4.7: Error State Persistence** – Error message persists in status display until user opens new file or dismisses error
8. **AC-2.4.8: Graceful Invalid Input Handling** – parseMarkdown throws specific errors; Toolbar catches and displays without crashing
9. **AC-2.4.9: Type Safety** – All error handling typed with TypeScript; no `any` types in error paths
10. **AC-2.4.10: Unit Tests** – Comprehensive unit tests verify error message display, button visibility, recovery flow

## Tasks/Subtasks

- [x] **Task 1: Enhance Error Messaging in Toolbar**
  - [x] 1.1 Modify `handleFileSelect` to catch parseMarkdown errors specifically
  - [x] 1.2 Dispatch error with message: "No Mermaid diagram found in this file. Please select a file with a mermaid code block."
  - [x] 1.3 Ensure error message displays in toolbar error area with red styling and `role="alert"`
  - [x] 1.4 Verify Status component displays error with `role="alert"` attribute
  - [x] 1.5 Write unit tests for error message display

- [x] **Task 2: Create "Open Different File" Recovery Button**
  - [x] 2.1 Add "Open Different File" button to toolbar that appears only when `state.error` exists
  - [x] 2.2 Implement `handleOpenDifferentFile()` that dispatches RESET_FILE action
  - [x] 2.3 On RESET_FILE, clear error, fileName, fileContent, mermaidCode, searchQuery
  - [x] 2.4 After RESET_FILE dispatches, trigger file picker (call `fileInputRef.current?.click()`)
  - [x] 2.5 Write unit tests for recovery button behavior

- [x] **Task 3: Styling and Accessibility**
  - [x] 3.1 Style recovery button as secondary (gray background, hover effect)
  - [x] 3.2 Add `aria-label="Open a different file"` to recovery button
  - [x] 3.3 Ensure button has visible focus indicator (2-3px outline in accent color)
  - [x] 3.4 Verify both error message and recovery button have sufficient contrast (≥4.5:1 for text)
  - [x] 3.5 Write accessibility tests for focus management and ARIA attributes

- [x] **Task 4: Integration Testing**
  - [x] 4.1 Test end-to-end flow: load invalid file → error displays → click recovery → file picker opens
  - [x] 4.2 Test loading new valid file after error clears previous error state
  - [x] 4.3 Test Status component displays error appropriately with role="alert"
  - [x] 4.4 Test keyboard navigation (Tab to recovery button, Enter/Space activates)
  - [x] 4.5 Run full test suite; ensure no regressions introduced

## Dev Notes

### Current Implementation State

- **Toolbar.tsx:** Currently handles file selection, calls parseMarkdown, dispatches errors to status
- **parseMarkdown:** Throws Error if no mermaid block found; message: "No mermaid code block found in markdown"
- **AppContext:** Has RESET_FILE action that clears all file-related state
- **Status Component:** Displays status messages with appropriate styling; error role="alert"

### Key Decisions to Make

1. **Error Message Text:** Should match story AC-2.4.1 verbatim: "No Mermaid diagram found in this file. Please select a file with a mermaid code block."
2. **Recovery Button Placement:** Second button after "Open File" button in toolbar
3. **Button Style:** Recommend `bg-gray-600 hover:bg-gray-700` to distinguish from primary blue "Open File" button
4. **Auto-Dismiss Behavior:** Error should NOT auto-dismiss (unlike success messages) — persist until user acts

### Testing Strategy

- Unit tests in `src/components/__tests__/Toolbar.test.tsx`:
  - Test error message displays when parseMarkdown throws
  - Test recovery button visibility when error exists
  - Test recovery button hides when no error
  - Test RESET_FILE dispatches on button click
  - Test file picker opens after RESET_FILE
  
- Integration tests verify full error → recovery flow

### Patterns from Previous Stories

- Use same error styling as 2.3 (red text, `role="alert"`)
- Follow Tailwind utility classes for styling (no CSS modules)
- Dispatch actions atomically (SET_ERROR, then SET_STATUS separately if needed)
- All interactive elements require aria-label for accessibility

## Implementation Plan

### Phase 1: Error Message Enhancement (Task 1)
1. Update parseMarkdown error handling (already throws, just verify message)
2. Enhance Toolbar's catch block to display specific error message
3. Ensure error persists in state (no auto-dismiss)
4. Write unit tests for error message display

### Phase 2: Recovery Button (Task 2)
1. Add recovery button to Toolbar JSX (conditional render on error state)
2. Implement handleOpenDifferentFile function
3. Ensure RESET_FILE clears all state correctly
4. Wire button to trigger file picker
5. Write unit tests for recovery flow

### Phase 3: Styling & Accessibility (Task 3)
1. Apply Tailwind classes for secondary button style
2. Add aria-label and focus indicators
3. Verify contrast ratios
4. Add accessibility tests

### Phase 4: Full Integration Testing (Task 4)
1. Test end-to-end error → recovery flow
2. Test keyboard navigation
3. Run full test suite
4. Document any edge cases or decisions

## File List

### Files to Create
- No new files required (all work in existing files)

### Files to Modify
- `src/components/Toolbar.tsx` — Added recovery button, enhanced error handling with specific message mapping
- `src/components/__tests__/Toolbar.test.tsx` — Added 9 new tests for error messages and recovery button (all 28 tests passing)

### Files to Review (Read-Only)
- `src/utils/parseMarkdown.ts` — Throws specific error message; used in new error mapping logic
- `src/context/AppContext.tsx` — RESET_FILE action already works as expected

## Change Log

- **2026-02-09:** Story implementation complete; all tasks implemented and tested
  - Added specific error message when Mermaid block not found: "No Mermaid diagram found in this file. Please select a file with a mermaid code block."
  - Implemented "Open Different File" recovery button visible when error state exists
  - Added focus indicators and aria-label for accessibility
  - Created comprehensive unit tests (9 new test cases for Story 2.4)
  - Updated existing Story 2.3 tests to match new error message format
  - All 54 tests passing; build successful

## Dev Agent Record

### Completion Notes
✅ **Story 2.4 – Handle File Parse Errors & Provide Recovery: COMPLETE**

**What was implemented:**
1. Enhanced error messaging in Toolbar.tsx: Specific message for "No Mermaid diagram found" errors
2. Recovery button with conditional rendering: Only shows when error exists
3. RESET_FILE dispatch + file picker trigger on recovery button click
4. Tailwind styling: Secondary button (gray-600) with hover and focus states
5. Accessibility: aria-label, focus:outline-2 focus:outline-cyan-400

**Tests created:** 9 new test cases covering:
- AC-2.4.1: Specific error message display
- AC-2.4.3 & AC-2.4.4: Recovery button visibility and RESET_FILE dispatch
- AC-2.4.5 & AC-2.4.6: Accessibility (aria-label, styling, focus)
- AC-2.4.7: Error state persistence
- AC-2.4.8: Graceful error handling (non-Error exceptions)

**Test results:**
- Story 2.4 tests: 9/9 passing ✅
- Story 2.3 tests (updated): 13/13 passing ✅
- Full test suite: 54/54 passing ✅
- Build: Successful ✅

**Key technical decisions:**
1. Error message mapping: Check `error.message.includes('No mermaid code block found')` to map parseMarkdown errors to user-friendly message
2. Recovery button placement: Second button after "Open File" for visual hierarchy
3. Color contrast: Gray-600 button chosen for sufficient contrast (≥3:1 UI, ≥4.5:1 text)
4. Focus indicator: Consistent with design tokens (cyan-400 outline, 2px width)
5. Accessibility: Recovery button uses aria-label for screen readers; error div uses role="alert" for dynamic content

**Acceptance Criteria verification:**
- ✅ AC-2.4.1: Specific error message displays correctly
- ✅ AC-2.4.2: Error in toolbar with red text and role="alert"
- ✅ AC-2.4.3: Recovery button appears when error exists
- ✅ AC-2.4.4: Button dispatches RESET_FILE and clears error
- ✅ AC-2.4.5: aria-label present on button
- ✅ AC-2.4.6: Recovery button styled as secondary (gray vs blue primary)
- ✅ AC-2.4.7: Error persists until recovery action or new valid file load
- ✅ AC-2.4.8: Graceful handling of all error types
- ✅ AC-2.4.9: All TypeScript types properly used
- ✅ AC-2.4.10: Comprehensive unit tests with 100% passing rate

### Technical Decisions
- **Error Message Mapping:** Rather than changing parseMarkdown output, detection happens in Toolbar catch block by checking error message content. This keeps parseMarkdown focused on one responsibility (parsing).
- **State Management:** RESET_FILE action already existed in AppContext; reused without changes. New feature only adds button UI and error message mapping.
- **Styling Consistency:** Recovered Tailwind tokens from existing Status component and Toolbar for button focus states (cyan-400).

### Issues & Resolutions
- **Initial test failures:** Tests were expecting old error message format. Resolved by updating Story 2.3 tests to use regex match for flexible message text.
- **Act() warnings:** Vitest warns about state updates not wrapped in act(), but these are pre-existing warnings in test suite (not introduced by this story).

## Status

**Current:** approved  
**Previous:** review  
**Next:** Ready for merge to main

## Code Review Summary

**Reviewer:** Deveshi (Adversarial Code Review)  
**Date:** 2026-02-09  
**Verdict:** ✅ **APPROVED** - All critical and high severity issues fixed

### Issues Found & Fixed
1. **ESLint Type Safety (CRITICAL)** ✅
   - Fixed: Replace `any` types with proper `ASTNode` interface
   - Files: `src/utils/parseMarkdown.ts`, `src/utils/__tests__/parseMarkdown.test.ts`
   
2. **React Fast Refresh Violation (HIGH)** ✅
   - Fixed: Split `AppContext.tsx` into:
     - `AppContext.ts` - context only
     - `AppProvider.tsx` - provider component only
   - Updated imports in: `src/main.tsx`, test files
   
3. **Race Condition (MEDIUM)** ✅
   - Fixed: Added guard in `Toolbar.handleFileSelect` to prevent simultaneous loads
   - Code: `if (state.isLoading) return`
   
4. **Test Coverage Gap (LOW)** ✅
   - Fixed: Added test for file re-selection capability
   - Test: "should allow re-selecting the same file after first selection"

### Final Metrics
- ✅ All 55 tests passing (54 existing + 1 new)
- ✅ ESLint: 0 errors
- ✅ Build: Successful
- ✅ React Fast Refresh: Enabled
- ✅ Type Safety: 100% - no `any` types
