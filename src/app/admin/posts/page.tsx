'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { blogService } from '@/lib/service-switcher'
import { BlogPostData } from '@/types/shared'
import { useNotification } from '@/lib/notification-context'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import {
  FileText,
  CheckCircle,
  FileEdit,
  Star,
  Plus
} from 'lucide-react'
import { logger } from '@/lib/logger'

export default function PostsManagement() {
  const { success, error } = useNotification()
  const [posts, setPosts] = useState<BlogPostData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; post: BlogPostData | null }>({
    isOpen: false,
    post: null
  })

  useEffect(() => {
    const loadPosts = async () => {
      const allPosts = await blogService.getAllPosts()
      setPosts(allPosts)
    }
    loadPosts()
  }, [])

  const categories = Array.from(new Set(posts.map(post => post.category)))

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || post.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const openDeleteDialog = (post: BlogPostData) => {
    setDeleteDialog({ isOpen: true, post })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, post: null })
  }

  const handleDeletePost = async () => {
    if (!deleteDialog.post) return

    const { id, title } = deleteDialog.post
    try {
      await blogService.deletePost(id!)
      const allPosts = await blogService.getAllPosts()
      setPosts(allPosts)
      success(`Blog post "${title}" deleted successfully`)
    } catch (err) {
      logger.error('Failed to delete post:', err)
      error('Failed to delete blog post. Please try again.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Blog Posts</h1>
          <p className="text-sm sm:text-base text-foreground/70 mt-1">Manage your blog content</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-foreground hover:bg-foreground/80 text-background rounded-lg font-medium hover:scale-105 transition-all duration-200 shadow-lg shadow-foreground/20 flex items-center space-x-2"
        >
          <span>New Post</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Posts</p>
              <p className="text-2xl font-bold text-foreground">{posts.length}</p>
            </div>
            <div className="w-10 h-10 bg-foreground/10 rounded-lg flex items-center justify-center">
              <FileText className="text-foreground" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-background rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Published</p>
              <p className="text-2xl font-bold text-foreground">
                {posts.filter(p => p.status === 'published').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-foreground/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-foreground" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-background rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Drafts</p>
              <p className="text-2xl font-bold text-foreground">
                {posts.filter(p => p.status === 'draft').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-foreground/10 rounded-lg flex items-center justify-center">
              <FileEdit className="text-foreground" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-background rounded-lg border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Featured</p>
              <p className="text-2xl font-bold text-foreground">
                {posts.filter(p => p.featured).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-foreground/10 rounded-lg flex items-center justify-center">
              <Star className="text-foreground" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-background rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-foreground/50 focus:ring-2 focus:ring-foreground/10"
          />
        </div>
        <div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-foreground/50 focus:ring-2 focus:ring-foreground/10"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-background rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Mobile Card Layout */}
        <div className="block md:hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredPosts.map((post) => (
              <div key={post.slug} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground text-sm">{post.title}</h3>
                    <p className="text-xs text-foreground/60 mt-1 line-clamp-2">{post.summary}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ml-2 ${getStatusColor(post.status)}`}>
                    {post.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-foreground/70">
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                      {post.category}
                    </span>
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/posts/edit/${post.id}`}
                      className="p-1 text-foreground/60 hover:text-cyber-500 transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-1 text-foreground/60 hover:text-primary-500 transition-colors"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => openDeleteDialog(post)}
                      className="p-1 text-foreground/60 hover:text-red-500 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Desktop Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">Title</th>
                <th className="text-left p-4 font-medium text-foreground">Category</th>
                <th className="text-left p-4 font-medium text-foreground">Status</th>
                <th className="text-left p-4 font-medium text-foreground">Date</th>
                <th className="text-left p-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredPosts.map((post) => (
                <tr key={post.slug} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="p-4">
                    <div>
                      <h3 className="font-medium text-foreground">{post.title}</h3>
                      <p className="text-sm text-foreground/60 mt-1 line-clamp-2">{post.summary}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-foreground/50">{post.readTime}</span>
                        <span className="text-xs text-foreground/50">by {post.author.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-xs rounded-full">
                      {post.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-foreground/70">
                    {new Date(post.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/posts/edit/${post.id}`}
                        className="p-3 text-foreground/60 hover:text-cyber-500 hover:bg-cyber-500/10 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        title="Edit post"
                      >
Edit
                      </Link>
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-3 text-foreground/60 hover:text-primary-500 hover:bg-primary-500/10 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        title="View post"
                      >
View
                      </Link>
                      <button
                        onClick={() => openDeleteDialog(post)}
                        className="p-3 text-foreground/60 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        title="Delete post"
                      >
Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">No posts found</h3>
            <p className="text-foreground/60 mb-6">
              {searchTerm || filterCategory !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first blog post'
              }
            </p>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue-light text-white rounded-lg font-medium hover:scale-105 transition-all duration-200 shadow-lg shadow-accent-blue/20"
            >
              <span>Create First Post</span>
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeletePost}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deleteDialog.post?.title}"? This action cannot be undone.`}
        confirmText="Delete Post"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}