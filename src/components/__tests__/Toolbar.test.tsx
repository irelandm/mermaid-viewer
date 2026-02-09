import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Toolbar } from '../Toolbar'
import { AppProvider } from '../../context/AppContext'
import * as parseMarkdownModule from '../../utils/parseMarkdown'

// Mock parseMarkdown
vi.mock('../../utils/parseMarkdown', () => ({
  parseMarkdown: vi.fn(),
}))

const mockedParseMarkdown = vi.mocked(parseMarkdownModule.parseMarkdown)

function createMockFile(name: string, content: string): File {
  const file = new File([content], name, { type: 'text/markdown' })
  // jsdom File doesn't have text(), so we add it
  file.text = () => Promise.resolve(content)
  return file
}

function renderToolbar() {
  return render(
    <AppProvider>
      <Toolbar />
    </AppProvider>
  )
}

describe('Toolbar – Story 2.3: Display Loaded File Name & Status', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('AC-2.3.1: File name displays in toolbar after successful load', () => {
    it('should display the file name when a valid markdown file with mermaid block is loaded', async () => {
      const markdownContent = '```mermaid\nflowchart TD\n  A-->B\n```'
      mockedParseMarkdown.mockReturnValue('flowchart TD\n  A-->B')

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('flowchart.md', markdownContent)

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByText('flowchart.md')).toBeInTheDocument()
      })
    })

    it('should display "File:" label before the file name', async () => {
      mockedParseMarkdown.mockReturnValue('flowchart TD\n  A-->B')

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('diagram.md', '```mermaid\nflowchart TD\n```')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByText('File:')).toBeInTheDocument()
        expect(screen.getByText('diagram.md')).toBeInTheDocument()
      })
    })
  })

  describe('AC-2.3.2: Status message "Loaded: filename"', () => {
    it('should call parseMarkdown with file content and dispatch mermaid code', async () => {
      const markdownContent = '```mermaid\nflowchart TD\n  A-->B\n```'
      mockedParseMarkdown.mockReturnValue('flowchart TD\n  A-->B')

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('test.md', markdownContent)

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(mockedParseMarkdown).toHaveBeenCalledWith(markdownContent)
      })
    })
  })

  describe('AC-2.3.3: New file replaces previous file name', () => {
    it('should replace file name when a new file is loaded', async () => {
      mockedParseMarkdown.mockReturnValue('flowchart TD\n  A-->B')

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      // Load first file
      const file1 = createMockFile('first.md', '```mermaid\nflowchart TD\n```')
      fireEvent.change(input, { target: { files: [file1] } })

      await waitFor(() => {
        expect(screen.getByText('first.md')).toBeInTheDocument()
      })

      // Load second file
      const file2 = createMockFile('second.md', '```mermaid\nflowchart TD\n```')
      fireEvent.change(input, { target: { files: [file2] } })

      await waitFor(() => {
        expect(screen.getByText('second.md')).toBeInTheDocument()
        expect(screen.queryByText('first.md')).not.toBeInTheDocument()
      })
    })
  })

  describe('AC-2.3.4: Error displays in file name area on failure', () => {
    it('should display error in file name area when parseMarkdown throws', async () => {
      mockedParseMarkdown.mockImplementation(() => {
        throw new Error('No mermaid code block found in markdown')
      })

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('no-mermaid.md', '# Just text')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByText('Error:')).toBeInTheDocument()
        expect(screen.getByText(/No Mermaid diagram found in this file/)).toBeInTheDocument()
      })
    })

    it('should use role="alert" for the error display area', async () => {
      mockedParseMarkdown.mockImplementation(() => {
        throw new Error('No mermaid code block found in markdown')
      })

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('bad.md', '# No mermaid')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        const alertEl = screen.getByRole('alert')
        expect(alertEl).toBeInTheDocument()
        expect(alertEl).toHaveTextContent(/No Mermaid diagram found in this file/)
      })
    })

    it('should show generic error when a non-Error is thrown', async () => {
      mockedParseMarkdown.mockImplementation(() => {
        throw 'unexpected'
      })

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('broken.md', 'broken content')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByText('Error:')).toBeInTheDocument()
        expect(screen.getByText('Failed to read file')).toBeInTheDocument()
      })
    })
  })

  describe('parseMarkdown integration', () => {
    it('should dispatch SET_MERMAID_CODE when parseMarkdown succeeds', async () => {
      const mermaidCode = 'flowchart TD\n  A[Start] --> B[End]'
      mockedParseMarkdown.mockReturnValue(mermaidCode)

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('valid.md', '```mermaid\nflowchart TD\n  A[Start] --> B[End]\n```')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        // Verify file name shows (success path)
        expect(screen.getByText('valid.md')).toBeInTheDocument()
        expect(screen.getByText('File:')).toBeInTheDocument()
        // No error displayed
        expect(screen.queryByText('Error:')).not.toBeInTheDocument()
      })
    })
  })

  describe('file validation', () => {
    it('should reject non-.md files', async () => {
      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('image.png', 'not markdown')

      fireEvent.change(input, { target: { files: [file] } })

      // parseMarkdown should NOT be called for non-.md files
      expect(mockedParseMarkdown).not.toHaveBeenCalled()
    })

    it('should not do anything if no file is selected', () => {
      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      fireEvent.change(input, { target: { files: [] } })

      expect(mockedParseMarkdown).not.toHaveBeenCalled()
    })
  })

  describe('UI elements', () => {
    it('should render Open File button', () => {
      renderToolbar()

      const button = screen.getByRole('button', { name: /open markdown file/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Open File')
    })

    it('should have a hidden file input accepting .md files', () => {
      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      expect(input).toBeInTheDocument()
      expect(input.accept).toBe('.md')
    })

    it('should not display file name area when no file is loaded', () => {
      renderToolbar()

      expect(screen.queryByText('File:')).not.toBeInTheDocument()
      expect(screen.queryByText('Error:')).not.toBeInTheDocument()
    })
  })
})

describe('Toolbar – Story 2.4: Handle File Parse Errors & Provide Recovery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Task 1: AC-2.4.1 – Specific error message for missing Mermaid block', () => {
    it('should display specific error message when parseMarkdown throws "No mermaid code block found"', async () => {
      mockedParseMarkdown.mockImplementation(() => {
        throw new Error('No mermaid code block found in markdown')
      })

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('no-diagram.md', '# Title\n\nJust text')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByText(/No Mermaid diagram found in this file/)).toBeInTheDocument()
        expect(screen.getByText(/Please select a file with a mermaid code block/)).toBeInTheDocument()
      })
    })

    it('should use role="alert" for error message display', async () => {
      mockedParseMarkdown.mockImplementation(() => {
        throw new Error('No mermaid code block found in markdown')
      })

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('empty.md', '# Empty')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        const alertEl = screen.getByRole('alert')
        expect(alertEl).toBeInTheDocument()
        expect(alertEl).toHaveTextContent('No Mermaid diagram found in this file')
      })
    })

    it('should display error in red text with "Error:" prefix', async () => {
      mockedParseMarkdown.mockImplementation(() => {
        throw new Error('No mermaid code block found in markdown')
      })

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('bad.md', '# No mermaid')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByText('Error:')).toBeInTheDocument()
        const errorPrefix = screen.getByText('Error:')
        expect(errorPrefix).toHaveClass('text-red-500')
      })
    })
  })

  describe('Task 2: AC-2.4.3 & AC-2.4.4 – Open Different File recovery button', () => {
    it('should display "Open Different File" button when error exists', async () => {
      mockedParseMarkdown.mockImplementation(() => {
        throw new Error('No mermaid code block found in markdown')
      })

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('invalid.md', '# No diagram')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        const recoveryButton = screen.getByRole('button', { name: /open a different file/i })
        expect(recoveryButton).toBeInTheDocument()
      })
    })

    it('should not display recovery button when no error exists', () => {
      mockedParseMarkdown.mockReturnValue('flowchart TD\n  A-->B')

      renderToolbar()

      expect(screen.queryByRole('button', { name: /open a different file/i })).not.toBeInTheDocument()
    })

    it('should dispatch RESET_FILE when recovery button is clicked', async () => {
      mockedParseMarkdown.mockImplementation(() => {
        throw new Error('No mermaid code block found in markdown')
      })

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('invalid.md', '# No diagram')

      // First, trigger an error
      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      // Click recovery button
      const recoveryButton = screen.getByRole('button', { name: /open a different file/i })
      fireEvent.click(recoveryButton)

      // After reset, error should be gone and file name should be cleared
      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
        expect(screen.queryByText('Error:')).not.toBeInTheDocument()
      })
    })

    it('should clear fileName when recovery button is clicked', async () => {
      mockedParseMarkdown.mockImplementation(() => {
        throw new Error('No mermaid code block found in markdown')
      })

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('invalid.md', '# No diagram')

      fireEvent.change(input, { target: { files: [file] } })

      // File name should display even on error
      await waitFor(() => {
        expect(screen.getByText('invalid.md')).toBeInTheDocument()
      })

      // Click recovery button
      const recoveryButton = screen.getByRole('button', { name: /open a different file/i })
      fireEvent.click(recoveryButton)

      // File name should be cleared after reset
      await waitFor(() => {
        expect(screen.queryByText('invalid.md')).not.toBeInTheDocument()
      })
    })

    it('should open file picker after recovery button click', async () => {
      mockedParseMarkdown.mockImplementation(() => {
        throw new Error('No mermaid code block found in markdown')
      })

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('bad.md', '# No diagram')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      // Mock the click method on file input
      const clickSpy = vi.spyOn(input, 'click')

      // Click recovery button
      const recoveryButton = screen.getByRole('button', { name: /open a different file/i })
      fireEvent.click(recoveryButton)

      // File picker should be triggered
      expect(clickSpy).toHaveBeenCalled()
    })
  })

  describe('Task 3: AC-2.4.5 & AC-2.4.6 – Accessibility and styling', () => {
    it('should have aria-label on recovery button', async () => {
      mockedParseMarkdown.mockImplementation(() => {
        throw new Error('No mermaid code block found in markdown')
      })

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('bad.md', '# No diagram')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        const recoveryButton = screen.getByRole('button', { name: /open a different file/i })
        expect(recoveryButton).toHaveAttribute('aria-label', 'Open a different file')
      })
    })

    it('should style recovery button distinctly from main Open File button', async () => {
      mockedParseMarkdown.mockImplementation(() => {
        throw new Error('No mermaid code block found in markdown')
      })

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('bad.md', '# No diagram')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        const openFileButton = screen.getByRole('button', { name: /open markdown file/i })
        const recoveryButton = screen.getByRole('button', { name: /open a different file/i })

        // Main button should be blue
        expect(openFileButton).toHaveClass('bg-blue-600')
        
        // Recovery button should be gray (secondary style)
        expect(recoveryButton).toHaveClass('bg-gray-600')
      })
    })

    it('should have visible focus indicator on recovery button', async () => {
      mockedParseMarkdown.mockImplementation(() => {
        throw new Error('No mermaid code block found in markdown')
      })

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('bad.md', '# No diagram')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        const recoveryButton = screen.getByRole('button', { name: /open a different file/i })
        // Should have focus-visible or similar outline class for keyboard navigation
        expect(recoveryButton.className).toMatch(/focus|outline/)
      })
    })
  })

  describe('Task 4: AC-2.4.7 – Error state persistence', () => {
    it('should persist error message until user opens new file', async () => {
      mockedParseMarkdown.mockImplementation(() => {
        throw new Error('No mermaid code block found in markdown')
      })

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('bad.md', '# No diagram')

      fireEvent.change(input, { target: { files: [file] } })

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      // Error should still be there after a short wait
      await new Promise(resolve => setTimeout(resolve, 500))
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('should clear error when new valid file is loaded', async () => {
      mockedParseMarkdown.mockImplementation(() => {
        throw new Error('No mermaid code block found in markdown')
      })

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const badFile = createMockFile('bad.md', '# No diagram')

      // Load invalid file
      fireEvent.change(input, { target: { files: [badFile] } })

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })

      // Now load valid file
      mockedParseMarkdown.mockImplementation(() => {
        return 'flowchart TD\n  A-->B'
      })

      const goodFile = createMockFile('good.md', '```mermaid\nflowchart TD\n  A-->B\n```')
      fireEvent.change(input, { target: { files: [goodFile] } })

      // Error should be cleared
      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      })
    })
  })

  describe('Task 4: AC-2.4.8 – Graceful error handling', () => {
    it('should handle invalid markdown gracefully without crashing', async () => {
      mockedParseMarkdown.mockImplementation(() => {
        throw new Error('Invalid markdown input')
      })

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('invalid.md', '')

      expect(() => {
        fireEvent.change(input, { target: { files: [file] } })
      }).not.toThrow()
    })

    it('should handle non-Error exceptions gracefully', async () => {
      mockedParseMarkdown.mockImplementation(() => {
        throw 'String exception'
      })

      renderToolbar()

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = createMockFile('crash.md', 'test')

      fireEvent.change(input, { target: { files: [file] } })

      // Should not crash, should show some error
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })
    })
  })
})
