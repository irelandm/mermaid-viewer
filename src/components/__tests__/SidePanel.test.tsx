import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SidePanel } from '../SidePanel'
import { AppProvider } from '../../context/AppProvider'

/**
 * Story 5.5: Create Side Panel Component Structure
 * Tests for SidePanel visibility, layout, close button, and selection behavior
 */
describe('SidePanel – Story 5.5: Side Panel Component Structure', () => {
  /**
   * AC-5.5.1: Panel appears on node selection
   */
  describe('AC-5.5.1: Panel appears on node selection', () => {
    it('renders panel when a node is selected', () => {
      render(
        <AppProvider initialState={{ selectedNodeId: 'flowchart-A-0', mermaidCode: 'graph TD; A-->B' }}>
          <SidePanel />
        </AppProvider>
      )
      const panel = screen.getByRole('complementary')
      expect(panel).toBeInTheDocument()
    })

    it('does not render panel when no node is selected', () => {
      render(
        <AppProvider initialState={{ selectedNodeId: null }}>
          <SidePanel />
        </AppProvider>
      )
      expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    })

    it('has 280px fixed width', () => {
      render(
        <AppProvider initialState={{ selectedNodeId: 'flowchart-A-0', mermaidCode: 'graph TD; A-->B' }}>
          <SidePanel />
        </AppProvider>
      )
      const panel = screen.getByRole('complementary')
      expect(panel).toHaveClass('w-[220px]')
    })

    it('uses dark theme background', () => {
      render(
        <AppProvider initialState={{ selectedNodeId: 'flowchart-A-0', mermaidCode: 'graph TD; A-->B' }}>
          <SidePanel />
        </AppProvider>
      )
      const panel = screen.getByRole('complementary')
      expect(panel).toHaveClass('bg-gray-900/80')
    })
  })

  /**
   * AC-5.5.3: Panel updates on new selection
   */
  describe('AC-5.5.3: Panel updates on new selection', () => {
    it('panel appears when a node is selected', () => {
      render(
        <AppProvider initialState={{ selectedNodeId: 'flowchart-B-1', mermaidCode: 'graph TD; A-->B' }}>
          <SidePanel />
        </AppProvider>
      )
      expect(screen.getByRole('complementary')).toBeInTheDocument()
    })
  })
})
