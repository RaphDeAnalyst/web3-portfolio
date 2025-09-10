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
        
        // YouTube videos - check for YouTube URLs
        const youtubeMatch = line.trim().match(/^https?:\/\/(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
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

        // Google Drive links - check for Google Drive URLs
        const googleDriveMatch = line.trim().match(/^https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\//)
        if (googleDriveMatch) {
          const fileId = googleDriveMatch[1]
          const viewUrl = `https://drive.google.com/file/d/${fileId}/view`
          const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
          const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`
          
          elements.push(
            <div key={i} className="my-6">
              <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-blue-900/20 dark:to-green-900/20">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center text-white text-2xl">
                    📄
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground text-lg">Document</h4>
                    <p className="text-sm text-foreground/60">Google Drive • Ad-free viewing</p>
                  </div>
                  <div className="flex space-x-3">
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
                    >
                      <span>📥</span>
                      <span>Download</span>
                    </a>
                    <a
                      href={viewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                    >
                      <span>👁️</span>
                      <span>View</span>
                    </a>
                  </div>
                </div>
                
                {/* Optional: Embedded Preview */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <details className="group">
                    <summary className="cursor-pointer text-sm text-foreground/70 hover:text-foreground transition-colors duration-200 flex items-center space-x-2">
                      <span className="transition-transform duration-200 group-open:rotate-90">▶</span>
                      <span>Preview Document</span>
                    </summary>
                    <div className="mt-3">
                      <iframe
                        src={previewUrl}
                        className="w-full h-96 border border-gray-200 dark:border-gray-700 rounded-lg"
                        title="Document Preview"
                        loading="lazy"
                      />
                    </div>
                  </details>
                </div>
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