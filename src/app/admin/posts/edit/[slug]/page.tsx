'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { BlogPostEditor } from '@/components/admin/blog-post-editor'
import { blogService } from '@/lib/service-switcher'
import { BlogPostData } from '@/lib/blog-service'
import { FileText } from 'lucide-react'

export default function EditBlogPost() {
  const router = useRouter()
  const params = useParams()
  const id = params.slug as string // Using slug param but it's actually the post ID
  
  const [postData, setPostData] = useState<BlogPostData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPost = async () => {
      // Find the post by ID
      const post = await blogService.getPostById(id)
      if (post) {
        setPostData(post)
      }
      setLoading(false)
    }
    loadPost()
  }, [id])

  const handleSave = async (updatedPostData: Omit<BlogPostData, 'id' | 'createdAt' | 'updatedAt'>, isDraft: boolean) => {
    try {
      // Save the updated post
      await blogService.savePost({
        ...updatedPostData,
        status: isDraft ? 'draft' : 'published'
      }, id)
      
      // Redirect back to posts list
      router.push('/admin/posts')
    } catch (error) {
      console.error('Failed to save post:', error)
      alert('Failed to save post. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-64 animate-pulse"></div>
          </div>
        </div>
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
      </div>
    )
  }

  if (!postData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 text-center py-20">
        <div className="flex justify-center mb-4">
          <FileText className="w-16 h-16 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Post Not Found</h1>
        <p className="text-foreground/70">The blog post you're looking for doesn't exist.</p>
        <Link
          href="/admin/posts"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue-light text-white rounded-lg font-medium hover:scale-105 transition-all duration-200 shadow-lg shadow-accent-blue/20"
        >
          <span>←</span>
          <span>Back to Posts</span>
        </Link>
      </div>
    )
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
            <h1 className="text-2xl font-bold text-foreground">Edit Blog Post</h1>
            <p className="text-foreground/70">Update and republish your blog post</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
            Editing
          </span>
          <span className="text-foreground/60">•</span>
          <span className="text-foreground/60">{postData.readTime}</span>
        </div>
      </div>

      {/* Editor */}
      <BlogPostEditor initialData={postData} onSave={handleSave} />
    </div>
  )
}