'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

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
    const script = document.createElement('script')
    
    script.src = 'https://utteranc.es/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    
    // Configure utterances
    script.setAttribute('repo', 'RaphDeAnalyst/web3-portfolio')
    script.setAttribute('issue-term', 'pathname')
    script.setAttribute('theme', utterancesTheme)
    script.setAttribute('label', '💬 blog-comment')
    
    // Clear any existing comments and add new script
    if (ref.current) {
      ref.current.innerHTML = ''
      ref.current.appendChild(script)
    }

    return () => {
      // Cleanup on unmount
      if (ref.current) {
        ref.current.innerHTML = ''
      }
    }
  }, [utterancesTheme, slug]) // Re-run when theme or slug changes

  return (
    <div className="mt-12 pt-8 border-t border-gray-200/50 dark:border-gray-800/50">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground mb-2">Comments</h3>
        <p className="text-sm text-foreground/60">
          Comments are powered by{' '}
          <a 
            href="https://github.com/utterance/utterances"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyber-500 hover:text-primary-500 underline"
          >
            Utterances
          </a>
          . Sign in with GitHub to leave a comment.
        </p>
      </div>
      
      {/* Utterances will inject the comment interface here */}
      <div ref={ref} className="utterances-container" />
      
      {/* Fallback message while loading */}
      <div className="text-center py-8 text-foreground/50">
        <div className="inline-flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-cyber-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading comments...</span>
        </div>
      </div>
    </div>
  )
}

// Instructions component to show setup steps
export function UtterancesSetupInstructions() {
  return (
    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
        🚀 Setup Utterances Comments
      </h3>
      <div className="text-sm text-blue-800 dark:text-blue-200 space-y-3">
        <p>To enable GitHub comments on your blog posts, follow these steps:</p>
        
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>
            Go to{' '}
            <a 
              href="https://github.com/apps/utterances" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-blue-600"
            >
              github.com/apps/utterances
            </a>
          </li>
          <li>Click "Configure" and install the app on your repository</li>
          <li>Grant access to your <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">web3-portfolio</code> repository</li>
          <li>
            Update the repo name in{' '}
            <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
              utterances-comments.tsx
            </code>
          </li>
          <li>Deploy your changes - comments will work immediately!</li>
        </ol>
        
        <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-800 rounded border-l-4 border-blue-500">
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