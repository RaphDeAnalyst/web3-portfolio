'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BlogPostEditor } from '@/components/admin/blog-post-editor'
import { blogService } from '@/lib/service-switcher'
import { BlogPostData } from '@/lib/blog-service'
import { ActivityService } from '@/lib/activity-service'
import { ProfileService } from '@/lib/profile-service'

export default function NewBlogPost() {
  const router = useRouter()
  
  const handleSave = async (postData: Omit<BlogPostData, 'id' | 'createdAt' | 'updatedAt'>, isDraft: boolean) => {
    try {
      // Create the new post
      await blogService.savePost({
        ...postData,
        status: isDraft ? 'draft' : 'published'
      })
      
      // Track activity if published
      if (!isDraft) {
        ActivityService.trackBlogPost(postData.title, false)
      }
      
      // Redirect back to posts list
      router.push('/admin/posts')
    } catch (error) {
      console.error('Failed to create post:', error)
      alert('Failed to create post. Please try again.')
    }
  }

  const authorInfo = ProfileService.getAuthorInfo()
  
  const initialData = {
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: 'Web3 Learning',
    tags: [],
    author: authorInfo,
    date: new Date().toISOString().split('T')[0],
    readTime: '5 min read',
    status: 'draft' as const,
    featured: false
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/posts"
            className="p-2 text-foreground/60 hover:text-foreground rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            ←
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">New Blog Post</h1>
            <p className="text-foreground/70">Create and publish a new blog post</p>
          </div>
        </div>
      </div>

      {/* Editor */}
      <BlogPostEditor initialData={initialData} onSave={handleSave} />
    </div>
  )
}