import { blogService, profileService } from '@/lib/service-switcher'
import { BlogClient } from './blog-client'
import { Suspense } from 'react'

// Loading component for the blog page
function BlogLoading() {
  return (
    <div className="min-h-screen py-16 sm:py-20">
      {/* Hero Section Loading */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-full w-20 mx-auto mb-8 animate-pulse"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto mb-8 animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mx-auto animate-pulse"></div>
        </div>
      </section>

      {/* Controls Loading */}
      <section className="px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12 lg:mb-16">
        <div className="max-w-7xl mx-auto py-4">
          <div className="max-w-2xl mx-auto mb-4 sm:mb-6">
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8 lg:mb-12">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 w-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Loading */}
      <section className="px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 lg:mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-foreground/60 text-lg">Loading articles...</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Server component - pre-fetches data at build time
export default async function BlogPage() {
  try {
    // Parallel data fetching on the server
    const [posts, profile, categories] = await Promise.all([
      blogService.getPublishedPosts(),
      profileService.getProfile(),
      blogService.getCategories()
    ])

    return (
      <Suspense fallback={<BlogLoading />}>
        <BlogClient
          initialPosts={posts}
          initialCategories={categories}
          initialProfile={{
            name: profile.name,
            avatar: profile.avatar
          }}
        />
      </Suspense>
    )
  } catch (error) {
    // Fallback to client-side loading if server-side fails
    return (
      <Suspense fallback={<BlogLoading />}>
        <BlogClient
          initialPosts={[]}
          initialCategories={[]}
          initialProfile={{ name: 'Matthew Raphael', avatar: '' }}
        />
      </Suspense>
    )
  }
}

// Enable ISR (Incremental Static Regeneration) - rebuilds every hour
export const revalidate = 3600 // 1 hour