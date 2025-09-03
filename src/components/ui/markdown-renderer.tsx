'use client'

import { ReactNode } from 'react'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Simple markdown parser for demo purposes
  // In a real app, you'd use a library like react-markdown or marked
  const parseMarkdown = (text: string): ReactNode => {
    const lines = text.split('\n')
    const elements: ReactNode[] = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="text-3xl font-bold text-foreground mb-6 text-gradient">
            {line.substring(2)}
          </h1>
        )
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-2xl font-bold text-foreground mb-4 mt-8">
            {line.substring(3)}
          </h2>
        )
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-xl font-semibold text-foreground mb-3 mt-6">
            {line.substring(4)}
          </h3>
        )
      }
      // Code blocks
      else if (line.startsWith('```')) {
        const codeLines = []
        i++ // Skip the opening ```
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i])
          i++
        }
        elements.push(
          <div key={i} className="my-6 rounded-xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 text-xs text-foreground/60 font-medium">
              Code
            </div>
            <pre className="p-4 bg-gray-50 dark:bg-gray-900 text-sm text-foreground overflow-x-auto">
              <code>{codeLines.join('\n')}</code>
            </pre>
          </div>
        )
      }
      // Blockquotes
      else if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={i} className="border-l-4 border-cyber-500 pl-4 py-2 my-4 bg-cyber-500/5 rounded-r-lg">
            <p className="text-foreground/80 italic">{line.substring(2)}</p>
          </blockquote>
        )
      }
      // Lists
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        const listItems = [line.substring(2)]
        while (i + 1 < lines.length && (lines[i + 1].startsWith('- ') || lines[i + 1].startsWith('* '))) {
          i++
          listItems.push(lines[i].substring(2))
        }
        elements.push(
          <ul key={i} className="list-disc pl-6 mb-4 space-y-2">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-foreground/80">{item}</li>
            ))}
          </ul>
        )
      }
      // Regular paragraphs
      else if (line.trim()) {
        // Handle inline formatting
        let formattedLine = line
        
        // Bold
        formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
        
        // Italic
        formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em class="italic text-foreground/80">$1</em>')
        
        // Inline code
        formattedLine = formattedLine.replace(/`(.*?)`/g, '<code class="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded text-sm font-mono text-cyber-500">$1</code>')
        
        // Images - check if the line starts with ![
        if (line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/)) {
          const imageMatch = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
          if (imageMatch) {
            const altText = imageMatch[1]
            const imageUrl = imageMatch[2]
            elements.push(
              <div key={i} className="my-6 text-center">
                <img 
                  src={imageUrl} 
                  alt={altText}
                  className="max-w-full h-auto rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg mx-auto"
                  loading="lazy"
                />
                {altText && (
                  <p className="text-sm text-foreground/60 mt-2 italic">{altText}</p>
                )}
              </div>
            )
            continue
          }
        }
        
        // Links
        formattedLine = formattedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-cyber-500 hover:text-primary-500 underline transition-colors duration-200" target="_blank" rel="noopener noreferrer">$1</a>')
        
        elements.push(
          <p key={i} className="text-foreground/80 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: formattedLine }} />
        )
      }
      // Empty lines
      else {
        elements.push(<br key={i} />)
      }
    }
    
    return elements
  }

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <div className="space-y-1">
        {parseMarkdown(content)}
      </div>
    </div>
  )
}