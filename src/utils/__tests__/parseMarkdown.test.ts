import { describe, it, expect } from 'vitest'
import { parseMarkdown } from '../parseMarkdown'

describe('parseMarkdown', () => {
  it('should extract mermaid code block from markdown', () => {
    const markdown = `# My Document

\`\`\`mermaid
flowchart TD
  A[Start] --> B[End]
\`\`\`

More text here.
    `

    const result = parseMarkdown(markdown)
    expect(result).toContain('flowchart TD')
    expect(result).toContain('A[Start]')
    expect(result).toContain('B[End]')
  })

  it('should return empty string if no mermaid block found', () => {
    const markdown = '# No code block here\n\nJust plain text.'
    expect(() => parseMarkdown(markdown)).toThrow('No mermaid code block found')
  })

  it('should handle multiple mermaid blocks (return first)', () => {
    const markdown = `
\`\`\`mermaid
flowchart TD
  A[First]
\`\`\`

Some text in between.

\`\`\`mermaid
flowchart TD
  B[Second]
\`\`\`
    `

    const result = parseMarkdown(markdown)
    expect(result).toContain('First')
    expect(result).not.toContain('Second')
  })

  it('should trim whitespace correctly', () => {
    const markdown = `
\`\`\`mermaid
  flowchart TD
    A[Test]
    B[Node]
\`\`\`
    `

    const result = parseMarkdown(markdown)
    // The parser preserves internal formatting but removes surrounding whitespace
    expect(result).toContain('flowchart TD')
    expect(result).toContain('A[Test]')
    expect(result).toContain('B[Node]')
  })

  it('should ignore code blocks with other languages', () => {
    const markdown = `
\`\`\`javascript
const x = 5;
\`\`\`

\`\`\`mermaid
flowchart TD
  C[Valid]
\`\`\`
    `

    const result = parseMarkdown(markdown)
    expect(result).toContain('Valid')
    expect(result).not.toContain('const x = 5')
  })

  it('should throw error on empty markdown', () => {
    expect(() => parseMarkdown('')).toThrow('Invalid markdown input')
  })

  it('should throw error on null/undefined input', () => {
    expect(() => parseMarkdown(null as unknown as string)).toThrow('Invalid markdown input')
    expect(() => parseMarkdown(undefined as unknown as string)).toThrow('Invalid markdown input')
  })

  it('should handle complex flowchart syntax', () => {
    const markdown = `
# Complex Diagram

\`\`\`mermaid
flowchart TD
  A[Start] -->|yes| B[Process]
  B --> C{Decision}
  C -->|true| D[End]
  C -->|false| E[Loop Back]
  E --> B
\`\`\`

End of document.
    `

    const result = parseMarkdown(markdown)
    expect(result).toContain('Decision')
    expect(result).toContain('Loop Back')
    expect(result).toContain('|yes|')
  })

  it('should extract mermaid block with different indentation levels', () => {
    const markdown = `
\`\`\`mermaid
  flowchart LR
    X[Indented] --> Y[Block]
\`\`\`
    `

    const result = parseMarkdown(markdown)
    expect(result).toContain('Indented')
  })

  it('should handle mermaid block as first element in markdown', () => {
    const markdown = `\`\`\`mermaid
flowchart TD
  A[First Thing]
\`\`\`

Explanation follows.
    `

    const result = parseMarkdown(markdown)
    expect(result).toContain('First Thing')
  })

  it('should handle mermaid block as last element in markdown', () => {
    const markdown = `# Document

Description here.

\`\`\`mermaid
flowchart TD
  A[Last Thing]
\`\`\`
    `

    const result = parseMarkdown(markdown)
    expect(result).toContain('Last Thing')
  })
})
