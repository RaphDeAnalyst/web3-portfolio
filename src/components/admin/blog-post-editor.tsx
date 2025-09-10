'use client'

import { useState, useEffect } from 'react'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { ImageUpload } from '@/components/ui/image-upload'
import { ActivityService } from '@/lib/activity-service'
import { BlogPostData } from '@/lib/blog-service'

interface BlogPostEditorProps {
  initialData?: Partial<BlogPostData>
  onSave: (data: Omit<BlogPostData, 'id' | 'createdAt' | 'updatedAt'>, isDraft: boolean) => void
}

export function BlogPostEditor({ initialData, onSave }: BlogPostEditorProps) {
  const [formData, setFormData] = useState<Omit<BlogPostData, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: 'Web3 Learning',
    tags: [],
    author: {
      name: 'Matthew Raphael',
      avatar: '/avatar.jpg'
    },
    date: new Date().toISOString().split('T')[0],
    readTime: '5 min read',
    status: 'draft',
    ...initialData
  })

  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [tagInput, setTagInput] = useState('')

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !initialData?.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.title, initialData?.slug])

  // Estimate read time based on content
  useEffect(() => {
    const words = formData.content.split(/\s+/).length
    const readTime = Math.max(1, Math.ceil(words / 200)) // Average reading speed: 200 words per minute
    setFormData(prev => ({ ...prev, readTime: `${readTime} min read` }))
  }, [formData.content])

  const handleInputChange = (field: keyof Omit<BlogPostData, 'id' | 'createdAt' | 'updatedAt'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSave = async (isDraft: boolean) => {
    setIsSaving(true)
    
    const dataToSave = {
      ...formData,
      status: (isDraft ? 'draft' : 'published') as 'draft' | 'published'
    }

    // Track activity
    if (!isDraft) {
      ActivityService.trackBlogPost(formData.title, !!initialData)
    }

    try {
      await onSave(dataToSave, isDraft)
    } catch (error) {
      console.error('Failed to save post:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const categories = [
    'Web3 Learning',
    'Data Analytics',
    'Blockchain Analysis',
    'Python Tutorials',
    'Career Transition',
    'Tools & Resources'
  ]

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between bg-background border border-gray-200 dark:border-gray-800 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowPreview(false)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              !showPreview 
                ? 'bg-cyber-500 text-white' 
                : 'text-foreground/70 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              showPreview 
                ? 'bg-cyber-500 text-white' 
                : 'text-foreground/70 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            👁️ Preview
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleSave(true)}
            disabled={isSaving || !formData.title.trim()}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-foreground rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            💾 Save Draft
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving || !formData.title.trim() || !formData.content.trim()}
            className="px-4 py-2 bg-gradient-to-r from-primary-500 to-cyber-500 text-white rounded-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:transform-none"
          >
            {isSaving ? '🔄 Publishing...' : '🚀 Publish'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {!showPreview ? (
            // Edit Mode
            <>
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter post title..."
                  className="w-full px-4 py-3 text-2xl font-bold border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Slug</label>
                <div className="flex items-center">
                  <span className="text-sm text-foreground/60 mr-2">/blog/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="post-slug"
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
                  />
                </div>
              </div>

              {/* Featured Image */}
              <ImageUpload
                label="Featured Image"
                currentImage={formData.featuredImage}
                onImageSelect={(imageUrl) => handleInputChange('featuredImage', imageUrl)}
                className="mb-6"
              />

              {/* Summary */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Summary *</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  placeholder="Brief description of your post..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20 resize-none"
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Write your post content using Markdown..."
                  rows={20}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20 font-mono text-sm resize-none"
                />
                <div className="text-xs text-foreground/60 space-y-2">
                  <div>
                    <p className="font-medium text-foreground/80 mb-1">📝 Markdown Formatting:</p>
                    <p>**bold**, *italic*, `code`, ## headers, > quotes, - lists</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground/80 mb-1">🖼️ Images:</p>
                    <p>1. Upload via <span className="font-mono bg-gray-200 dark:bg-gray-800 px-1 rounded">Admin → Media</span> page</p>
                    <p>2. Copy URL and use: <span className="font-mono bg-gray-200 dark:bg-gray-800 px-1 rounded">![alt text](image-url)</span></p>
                    <p>3. Or drag & drop images below to auto-add to content</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground/80 mb-1">🎥 Videos (YouTube):</p>
                    <p>Paste YouTube URL on its own line: <span className="font-mono bg-gray-200 dark:bg-gray-800 px-1 rounded">https://youtube.com/watch?v=VIDEO_ID</span></p>
                    <p>Auto-embeds with responsive 16:9 player</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground/80 mb-1">📄 Documents (PDFs):</p>
                    <p>1. Upload to Google Drive, set sharing to "Anyone with link"</p>
                    <p>2. Paste share link on its own line:</p>
                    <p><span className="font-mono bg-gray-200 dark:bg-gray-800 px-1 rounded">https://drive.google.com/file/d/FILE_ID/view</span></p>
                    <p>Creates ad-free download/view buttons + optional preview</p>
                  </div>
                  <div className="pt-1 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-foreground/50">💡 Tip: Manage all media via <span className="font-mono">Admin → Media</span> for organized workflow</p>
                  </div>
                </div>
                
                {/* Media Upload for Content */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                  <ImageUpload
                    label="Add Images to Content"
                    onImageSelect={(imageUrl) => {
                      const imageMarkdown = `![Image](${imageUrl})\n\n`
                      handleInputChange('content', formData.content + imageMarkdown)
                    }}
                    className="mb-2"
                  />
                  <div className="text-xs text-foreground/50">
                    Images will be added to the end of your content as Markdown
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Preview Mode
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg bg-background">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h1 className="text-3xl font-bold text-foreground mb-4">{formData.title || 'Untitled Post'}</h1>
                <div className="flex items-center space-x-4 text-sm text-foreground/60">
                  <span>{formData.date}</span>
                  <span>•</span>
                  <span>{formData.readTime}</span>
                  <span>•</span>
                  <span>{formData.category}</span>
                </div>
                {formData.summary && (
                  <p className="text-lg text-foreground/70 mt-4">{formData.summary}</p>
                )}
              </div>
              <div className="p-6">
                {formData.content ? (
                  <MarkdownRenderer content={formData.content} />
                ) : (
                  <p className="text-foreground/60 italic">Start writing your content to see the preview...</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-background border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-3">Post Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Status:</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  formData.status === 'published' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {formData.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Read Time:</span>
                <span className="text-sm text-foreground">{formData.readTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Words:</span>
                <span className="text-sm text-foreground">
                  {formData.content.split(/\s+/).filter(word => word.length > 0).length}
                </span>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="bg-background border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-3">Category</h3>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-background border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-3">Tags</h3>
            <div className="space-y-3">
              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-l-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-cyber-500 text-white rounded-r-lg hover:bg-cyber-600 transition-colors"
                >
                  +
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-foreground text-sm rounded-full"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-foreground/60 hover:text-red-500 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Author */}
          <div className="bg-background border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-3">Author</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Author Name</label>
                <input
                  type="text"
                  value={formData.author.name}
                  onChange={(e) => handleInputChange('author', { ...formData.author, name: e.target.value })}
                  placeholder="Matthew Raphael"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-cyber-500 focus:ring-2 focus:ring-cyber-500/20"
                />
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 flex items-center justify-center text-white font-bold">
                  {formData.author.name.charAt(0) || 'M'}
                </div>
                <div>
                  <div className="font-medium text-foreground">{formData.author.name || 'Matthew Raphael'}</div>
                  <div className="text-sm text-foreground/60">RaphdeAnalyst • Web3 Data & AI Specialist</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}