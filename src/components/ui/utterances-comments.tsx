'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { logger } from '@/lib/logger'

interface UtterancesCommentsProps {
  slug: string
  title: string
}

export function UtterancesComments({ slug, title }: UtterancesCommentsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { theme, resolvedTheme } = useTheme()
  
  // Determine utterances theme based on current theme
  const utterancesTheme = resolvedTheme === 'dark' ? 'github-dark' : 'github-light'

  useEffect(() => {
    if (!ref.current) return

    const container = ref.current
    let mounted = true
    
    // Clear any existing content
    container.innerHTML = ''
    
    const script = document.createElement('script')
    
    script.src = 'https://utteranc.es/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    
    // Configure utterances
    script.setAttribute('repo', 'RaphDeAnalyst/web3-portfolio')
    script.setAttribute('issue-term', 'pathname')
    script.setAttribute('theme', utterancesTheme)
    script.setAttribute('label', '💬 blog-comment')
    
    // Add error handler
    script.onerror = () => {
      if (mounted) {
        logger.warn('Failed to load Utterances comments')
      }
    }
    
    // Add load handler to prevent issues
    script.onload = () => {
      if (mounted) {
        logger.info('Utterances comments loaded successfully')
      }
    }
    
    // Only append if still mounted
    if (mounted && container.parentNode) {
      container.appendChild(script)
    }

    return () => {
      mounted = false
      // More careful cleanup - only clear if container still exists and has a parent
      if (container && container.parentNode && document.contains(container)) {
        try {
          // Remove script elements to prevent further execution
          const scripts = container.querySelectorAll('script')
          scripts.forEach(s => {
            try {
              s.remove()
            } catch (e) {
              // Ignore removal errors
            }
          })
          
          // Clear container content
          container.innerHTML = ''
        } catch (error) {
          // Ignore errors during cleanup - component is unmounting anyway
          logger.info('Utterances cleanup error (safe to ignore)', error as Error)
        }
      }
    }
  }, [utterancesTheme, slug]) // Re-run when theme or slug changes

  return (
    <div className="mt-12 pt-8 border-t border-text-light-primary/10 dark:border-text-dark-primary/10">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground mb-2">Comments</h3>
        <p className="text-sm text-foreground/60">
          Comments are powered by{' '}
          <a 
            href="https://github.com/utterance/utterances"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-foreground/80 underline"
          >
            Utterances
          </a>
          . Sign in with GitHub to leave a comment.
        </p>
      </div>
      
      {/* Utterances will inject the comment interface here */}
      <div ref={ref} className="utterances-container min-h-[200px]" />
    </div>
  )
}

// Instructions component to show setup steps
export function UtterancesSetupInstructions() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        🚀 Setup Utterances Comments
      </h3>
      <div className="text-sm text-gray-800 dark:text-gray-200 space-y-3">
        <p>To enable GitHub comments on your blog posts, follow these steps:</p>
        
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>
            Go to{' '}
            <a 
              href="https://github.com/apps/utterances" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-gray-600 dark:hover:text-gray-300"
            >
              github.com/apps/utterances
            </a>
          </li>
          <li>Click "Configure" and install the app on your repository</li>
          <li>Grant access to your <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">web3-portfolio</code> repository</li>
          <li>
            Update the repo name in{' '}
            <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">
              utterances-comments.tsx
            </code>
          </li>
          <li>Deploy your changes - comments will work immediately!</li>
        </ol>
        
        <div className="mt-4 p-3 bg-gray-200 dark:bg-gray-800 rounded border-l-4 border-gray-500">
          <p className="font-medium">Replace this line in the component:</p>
          <code className="text-xs block mt-1 font-mono">
            script.setAttribute('repo', 'your-username/web3-portfolio')
          </code>
          <p className="text-xs mt-1">With your actual GitHub username/repository name</p>
        </div>
      </div>
    </div>
  )
}