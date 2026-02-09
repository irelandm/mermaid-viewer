# Story 2.3: Display Loaded File Name & Status

## Story
As a user, I want to see the name of the currently loaded file displayed in the toolbar, so that I know which diagram I'm viewing.

## Acceptance Criteria
- **AC-2.3.1:** Given a file has been successfully loaded, when the Mermaid block is extracted, then the toolbar displays the file name (e.g., "flowchart.md")
- **AC-2.3.2:** A status message appears: "Loaded: flowchart.md"
- **AC-2.3.3:** When a new file is loaded, the previous file name is replaced with the new one
- **AC-2.3.4:** When loading fails, the file name area displays the error message instead

## Tasks

- [x] **Task 1: Integrate parseMarkdown into Toolbar file loading flow**
  - [x] 1.1 Import parseMarkdown into Toolbar
  - [x] 1.2 After reading file content, call parseMarkdown to extract mermaid code
  - [x] 1.3 Dispatch SET_MERMAID_CODE on success
  - [x] 1.4 On parse failure, dispatch SET_ERROR and SET_STATUS with error message
  - [x] 1.5 When loading fails, show error in the file name area of the toolbar

- [x] **Task 2: Write comprehensive unit tests for Toolbar**
  - [x] 2.1 Test file name displays in toolbar after successful load
  - [x] 2.2 Test status message "Loaded: filename" appears on success
  - [x] 2.3 Test new file replaces previous file name
  - [x] 2.4 Test error displays in file name area on failure
  - [x] 2.5 Test parseMarkdown integration (mermaid code dispatched)

## Dev Agent Record

### Implementation Notes
- Toolbar already has fileName display and status dispatch from Story 2.1/2.2
- Key change: integrate parseMarkdown call into handleFileSelect flow
- On parse error (no mermaid block), show error in toolbar file name area and dispatch error status
- RESET_FILE action already clears fileName, fileContent, mermaidCode, error

### Tests Created
- `src/components/__tests__/Toolbar.test.tsx` — covers all ACs for 2.3

### Files Changed
- `src/components/Toolbar.tsx` — integrated parseMarkdown, error display in file name area
- `src/components/__tests__/Toolbar.test.tsx` — new test file

### Decisions
- Parse is called immediately after file.text() succeeds — single flow, no intermediate renders needed
- Error in file name area uses red text styling consistent with Status component error styling
- On parse error, fileName is still set (user can see which file failed) but mermaidCode stays null

## Code Review Status
**Date:** 2026-02-09  
**Reviewer:** Deveshi (Adversarial Review)  
**Status:** ✅ **APPROVED** - All findings addressed

### Code Review Findings Fixed
1. ✅ Race condition guard added to Toolbar.handleFileSelect
2. ✅ TypeScript types fixed (no `any` types)
3. ✅ React Fast Refresh compliance (AppContext split into separate files)
4. ✅ Test coverage gap filled (file re-selection test added)

All recommendations from code review implemented and committed.
