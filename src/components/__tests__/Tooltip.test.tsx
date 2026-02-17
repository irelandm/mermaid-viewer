import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Tooltip } from '../Tooltip'

/**
 * Story 5.4: Display Node Hover Tooltip (Label + ID)
 * Tests for the Tooltip component
 */
describe('Tooltip – Story 5.4: Display Node Hover Tooltip', () => {
  const defaultProps = {
    label: 'Start Process',
    nodeId: 'A',
    x: 200,
    y: 150,
    visible: true,
  }

  /**
   * AC-5.4.1: Tooltip appears with correct format "Label – node_id"
   */
  describe('AC-5.4.1: Tooltip content and format', () => {
    it('renders tooltip with "Label – node_id" format', () => {
      render(<Tooltip {...defaultProps} />)
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toBeInTheDocument()
      expect(tooltip).toHaveTextContent('Start Process')
      expect(tooltip).toHaveTextContent('A')
      // Verify the separator is present (en dash)
      expect(tooltip.textContent).toContain('–')
    })

    it('renders label and ID from props', () => {
      render(<Tooltip {...defaultProps} label="User Login" nodeId="myNode" />)
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip.textContent).toContain('User Login')
      expect(tooltip.textContent).toContain('myNode')
    })

    it('handles labels with special characters', () => {
      render(<Tooltip {...defaultProps} label="Step A & B" nodeId="node_1" />)
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip.textContent).toContain('Step A & B')
      expect(tooltip.textContent).toContain('node_1')
    })
  })

  /**
   * AC-5.4.2: Tooltip styling and positioning
   */
  describe('AC-5.4.2: Tooltip styling and positioning', () => {
    it('positions tooltip with offset from cursor coordinates', () => {
      render(<Tooltip {...defaultProps} x={300} y={250} />)
      const tooltip = screen.getByRole('tooltip')
      const style = tooltip.style
      // Should be offset by ~8px from cursor
      expect(parseInt(style.left)).toBeGreaterThanOrEqual(304)
      expect(parseInt(style.left)).toBeLessThanOrEqual(316)
      expect(parseInt(style.top)).toBeGreaterThanOrEqual(254)
      expect(parseInt(style.top)).toBeLessThanOrEqual(266)
    })

    it('has pointer-events none to not interfere with interactions', () => {
      render(<Tooltip {...defaultProps} />)
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip.style.pointerEvents).toBe('none')
    })

    it('uses absolute positioning', () => {
      render(<Tooltip {...defaultProps} />)
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip.style.position).toBe('fixed')
    })
  })

  /**
   * AC-5.4.3: Tooltip visibility
   */
  describe('AC-5.4.3: Tooltip visibility', () => {
    it('does not render when visible is false', () => {
      render(<Tooltip {...defaultProps} visible={false} />)
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })

    it('renders when visible is true', () => {
      render(<Tooltip {...defaultProps} visible={true} />)
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })
  })

  /**
   * Edge cases
   */
  describe('Edge cases', () => {
    it('handles empty label gracefully', () => {
      render(<Tooltip {...defaultProps} label="" />)
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toBeInTheDocument()
      expect(tooltip.textContent).toContain('A')
    })

    it('handles long labels without breaking', () => {
      const longLabel = 'This is a very long node label that should still render correctly in the tooltip'
      render(<Tooltip {...defaultProps} label={longLabel} />)
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip.textContent).toContain(longLabel)
    })
  })
})
