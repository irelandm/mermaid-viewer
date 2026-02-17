import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SidePanel } from '../SidePanel'
import { AppProvider } from '../../context/AppProvider'
import type { NodeMetadata } from '../../types'

/**
 * Story 5.6: Display Selected Node Metadata in Side Panel
 * Tests for metadata content: Node ID, Label, Connected Edges
 */
describe('SidePanel Metadata – Story 5.6: Display Selected Node Metadata', () => {
  const baseMeta: NodeMetadata = {
    bareId: 'A',
    label: 'Start Process',
    connections: [
      { edgeSource: 'A', edgeTarget: 'B', targetLabel: 'Do Something', direction: 'outgoing' as const },
      { edgeSource: 'A', edgeTarget: 'C', targetLabel: 'Do Other Thing', direction: 'incoming' as const },
    ],
  }

  function renderWithMeta(meta: NodeMetadata | null, selectedNodeId: string | null = 'flowchart-A-0') {
    return render(
      <AppProvider initialState={{
        selectedNodeId,
        mermaidCode: 'graph TD; A-->B',
        selectedNodeMeta: meta,
      }}>
        <SidePanel />
      </AppProvider>
    )
  }

  /**
   * AC-5.6.1: Display Node ID and Label
   */
  describe('AC-5.6.1: Display Node ID and Label', () => {
    it('displays the bare Node ID', () => {
      renderWithMeta(baseMeta)
      expect(screen.getByText('A')).toBeInTheDocument()
    })

    it('displays the Node Label', () => {
      renderWithMeta(baseMeta)
      expect(screen.getByText('Start Process')).toBeInTheDocument()
    })

    it('displays section headers for ID and Label', () => {
      renderWithMeta(baseMeta)
      expect(screen.getByText('Node ID')).toBeInTheDocument()
      expect(screen.getByText('Label')).toBeInTheDocument()
    })
  })

  /**
   * AC-5.6.2: Display Connected Edges
   */
  describe('AC-5.6.2: Display Connected Edges', () => {
    it('displays Connected Edges section header', () => {
      renderWithMeta(baseMeta)
      expect(screen.getByText('Connections')).toBeInTheDocument()
    })

    it('lists connected edge targets with labels', () => {
      renderWithMeta(baseMeta)
      // Check edge target IDs appear in connection list
      expect(screen.getByText('B')).toBeInTheDocument()
      expect(screen.getByText('Do Something')).toBeInTheDocument()
      // 'C' matches both header 'Connections' and ID 'C', use getAllByText
      const cElements = screen.getAllByText(/^C$/)
      expect(cElements.length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('Do Other Thing')).toBeInTheDocument()
    })

    it('displays "No connections" when edges list is empty', () => {
      renderWithMeta({ bareId: 'X', label: 'Isolated Node', connections: [] })
      expect(screen.getByText('No connections')).toBeInTheDocument()
    })
  })

  /**
   * AC-5.6.3: Formatting
   */
  describe('AC-5.6.3: Formatting and fallback', () => {
    it('shows placeholder when no metadata is available', () => {
      renderWithMeta(null)
      // Panel should still render (node is selected) but show fallback
      expect(screen.getByRole('complementary')).toBeInTheDocument()
    })

    it('handles metadata with single connection', () => {
      renderWithMeta({
        bareId: 'Login',
        label: 'User Login',
        connections: [
          { edgeSource: 'Login', edgeTarget: 'Dashboard', targetLabel: 'Main Dashboard', direction: 'outgoing' as const },
        ],
      })
      expect(screen.getByText('User Login')).toBeInTheDocument()
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Main Dashboard')).toBeInTheDocument()
    })
  })
})
