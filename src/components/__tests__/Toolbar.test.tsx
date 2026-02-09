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
        expect(screen.getByText('No mermaid code block found in markdown')).toBeInTheDocument()
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
        expect(alertEl).toHaveTextContent('No mermaid code block found in markdown')
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
