import { unified } from 'unified'
import remarkParse from 'remark-parse'

/**
 * AST Node type for remark parsed markdown
 */
interface ASTNode {
  type: string
  lang?: string
  value?: string
  children?: ASTNode[]
}

/**
 * Extracts the first Mermaid code block from a Markdown document.
 * 
 * @param markdown - The Markdown document content
 * @returns The content of the first mermaid code block
 * @throws Error if no mermaid code block is found
 * 
 * @example
 * const markdown = `# Document
 * 
 * \`\`\`mermaid
 * flowchart TD
 *   A[Start] --> B[End]
 * \`\`\`
 * `;
 * 
 * const mermaidCode = parseMarkdown(markdown);
 * // Returns: "flowchart TD\n  A[Start] --> B[End]"
 */
export function parseMarkdown(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') {
    throw new Error('Invalid markdown input')
  }

  const processor = unified().use(remarkParse)
  const ast = processor.parse(markdown) as ASTNode

  // Walk through the AST to find the first code block with language 'mermaid'
  let mermaidCode: string | null = null

  function visit(node: ASTNode): void {
    // Stop if we've already found the mermaid block
    if (mermaidCode !== null) {
      return
    }

    // Check if this is a code block with language 'mermaid'
    if (
      node.type === 'code' &&
      node.lang === 'mermaid' &&
      node.value
    ) {
      mermaidCode = node.value
      return
    }

    // Recursively visit children
    if (node.children && Array.isArray(node.children)) {
      for (const child of node.children) {
        visit(child)
      }
    }
  }

  visit(ast)

  if (mermaidCode === null) {
    throw new Error('No mermaid code block found in markdown')
  }

  return mermaidCode
}
