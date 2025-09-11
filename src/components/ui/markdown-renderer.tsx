'use client'

import { ReactNode } from 'react'
import { GoogleDriveDocument } from './google-drive-document'
import { GoogleDriveDocumentGroup } from './google-drive-document-group'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Helper function to detect and group consecutive Google Drive documents
  const groupGoogleDriveDocs = (lines: string[]) => {
    const grouped: Array<{ type: 'document' | 'group' | 'other', data: any, originalIndex: number }> = []
    let i = 0
    
    while (i < lines.length) {
      const line = lines[i]
      
      // Check for Google Drive links (both titled and plain)
      const googleDriveTitleMatch = line.trim().match(/^\[([^\]]+)\]\((https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/[^)]*)\)/)
      const googleDriveMatch = line.trim().match(/^https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\//)
      
      if (googleDriveTitleMatch || googleDriveMatch) {
        const documents = []
        let currentIndex = i
        
        // Collect consecutive Google Drive documents
        while (currentIndex < lines.length) {
          const currentLine = lines[currentIndex]
          const titleMatch = currentLine.trim().match(/^\[([^\]]+)\]\((https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/[^)]*)\)/)
          const plainMatch = currentLine.trim().match(/^https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\//)
          
          if (titleMatch) {
            documents.push({
              fileId: titleMatch[3],
              customTitle: titleMatch[1],
              url: titleMatch[2]
            })
            currentIndex++
          } else if (plainMatch) {
            documents.push({
              fileId: plainMatch[1],
              url: currentLine.trim()
            })
            currentIndex++
          } else if (currentLine.trim() === '') {
            // Skip empty lines between documents
            currentIndex++
          } else {
            // Not a Google Drive document, stop grouping
            break
          }
        }
        
        if (documents.length > 0) {
          grouped.push({
            type: documents.length === 1 ? 'document' : 'group',
            data: documents,
            originalIndex: i
          })
          i = currentIndex
          continue
        }
      }
      
      // Not a Google Drive document
      grouped.push({
        type: 'other',
        data: line,
        originalIndex: i
      })
      i++
    }
    
    return grouped
  }

  // Simple markdown parser for demo purposes
  // In a real app, you'd use a library like react-markdown or marked
  const parseMarkdown = (text: string): ReactNode => {
    const lines = text.split('\n')
    const groupedLines = groupGoogleDriveDocs(lines)
    const elements: ReactNode[] = []
    
    for (let i = 0; i < groupedLines.length; i++) {
      const item = groupedLines[i]
      
      if (item.type === 'document') {
        const doc = item.data[0]
        elements.push(
          <GoogleDriveDocument 
            key={item.originalIndex}
            fileId={doc.fileId}
            customTitle={doc.customTitle}
            url={doc.url}
          />
        )
        continue
      }
      
      if (item.type === 'group') {
        elements.push(
          <GoogleDriveDocumentGroup
            key={item.originalIndex}
            documents={item.data}
          />
        )
        continue
      }
      
      // Process regular markdown line
      const line = item.data
      
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
        
        // YouTube videos - check for YouTube URLs (including Shorts)
        const youtubeMatch = line.trim().match(/^https?:\/\/(?:www\.)?(youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&].*)?/)
        if (youtubeMatch) {
          const videoId = youtubeMatch[2]
          elements.push(
            <div key={i} className="my-8">
              <div className="relative w-full max-w-4xl mx-auto" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video"
                  className="absolute inset-0 w-full h-full rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          )
          continue
        }


        // Images - check if the line contains image markdown
        const imageMatch = line.trim().match(/!\[([^\]]*)\]\(([^)]+)\)/)
        if (imageMatch) {
          const altText = imageMatch[1] || 'Image'
          const imageUrl = imageMatch[2]
          
          elements.push(
            <div key={i} className="my-8 text-center">
              <div className="relative inline-block">
                <img 
                  src={imageUrl} 
                  alt={altText}
                  className="max-w-full h-auto rounded-xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg mx-auto transition-opacity duration-300"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    const container = target.parentElement
                    if (container) {
                      container.innerHTML = `
                        <div class="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800">
                          <div class="text-4xl mb-3">🖼️</div>
                          <div class="text-sm text-foreground/60">Image failed to load</div>
                          <div class="text-xs text-foreground/40 mt-1 font-mono break-all">${imageUrl}</div>
                        </div>
                      `
                    }
                  }}
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.opacity = '1'
                  }}
                />
              </div>
              {altText && altText !== 'Image' && (
                <p className="text-sm text-foreground/60 mt-3 italic">{altText}</p>
              )}
            </div>
          )
          continue
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