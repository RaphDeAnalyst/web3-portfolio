'use client'

import { useEffect, useState } from 'react'
import { UtterancesComments } from '@/components/ui/utterances-comments'
import { viewTracker } from '@/lib/view-tracking'

interface BlogPostClientProps {
  slug: string
  title: string
}

export function BlogPostClient({ slug, title }: BlogPostClientProps) {
  const [isClient, setIsClient] = useState(false)
  const [viewCount, setViewCount] = useState(0)

  useEffect(() => {
    setIsClient(true)
    // Increment view count
    viewTracker.incrementView(slug)
    // Get updated view count
    setViewCount(viewTracker.getViewCount(slug))
  }, [slug])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <>
      {/* View Counter */}
      {isClient && (
        <section className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-sm text-foreground/60">
              <span>👁️</span>
              <span>{viewTracker.getFormattedViewCount(slug)} views</span>
            </div>
          </div>
        </section>
      )}

      {/* Comments Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-4xl mx-auto">

          {/* Utterances Comments */}
          <UtterancesComments slug={slug} title={title} />
        </div>
      </section>

      {/* Share Button */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <button
            onClick={handleShare}
            className="px-6 py-3 rounded-full bg-foreground hover:bg-foreground/80 text-background font-medium shadow-lg shadow-foreground/20 transition-all duration-200"
          >
            Share Article
          </button>
        </div>
      </section>
    </>
  )
}