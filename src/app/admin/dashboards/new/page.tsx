'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { dashboardService } from '@/lib/service-switcher'
import type { CreateDashboardInput, Dashboard } from '@/types/dashboard'
import { useNotification } from '@/lib/notification-context'
import { logger } from '@/lib/logger'
import Link from 'next/link'
import {
  ArrowLeft,
  BarChart3,
  ExternalLink,
  Eye,
  Save
} from 'lucide-react'

export default function NewDashboard() {
  const router = useRouter()
  const { success, error } = useNotification()
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [formData, setFormData] = useState<CreateDashboardInput>({
    dashboard_id: '',
    title: '',
    description: '',
    category: '',
    tags: [],
    embed_url: '',
    dune_url: '',
    featured: false,
    is_active: true,
    complexity: 'intermediate'
    // sort_order will be auto-calculated based on existing dashboards in the same group
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.dashboard_id || !formData.title) {
        error('Dashboard ID and title are required')
        return
      }

      // Validate embed URL if provided
      if (formData.embed_url && !dashboardService.validateEmbedUrl(formData.embed_url)) {
        error('Invalid embed URL. Must be from dune.com or dune.xyz with /embeds/ path')
        return
      }

      // Calculate next available sort_order based on group (featured vs non-featured)
      const allDashboards = await dashboardService.getAllDashboards()
      const sameGroup = formData.featured === true
        ? allDashboards.filter((d: Dashboard) => d.featured === true)
        : allDashboards.filter((d: Dashboard) => d.featured !== true)

      // Find the highest sort_order in the same group
      const maxSortOrder = sameGroup.length > 0
        ? Math.max(...sameGroup.map((d: Dashboard) => d.sort_order ?? 0))
        : -1

      // Create final form data with auto-calculated sort_order
      const finalFormData = {
        ...formData,
        sort_order: maxSortOrder + 1
      }

      const dashboard = await dashboardService.createDashboard(finalFormData)
      success(`Dashboard created with sort order ${maxSortOrder + 1}`)
      router.push('/admin/dashboards')
    } catch (err) {
      error('Failed to create dashboard')
      logger.error('Error creating dashboard:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreateDashboardInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Update preview URL when embed URL changes
    if (field === 'embed_url' && value && dashboardService.validateEmbedUrl(value)) {
      setPreviewUrl(value)
    } else if (field === 'embed_url') {
      setPreviewUrl('')
    }
  }

  const handleTagsChange = (tagString: string) => {
    const tags = tagString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
    handleInputChange('tags', tags)
  }

  const categories = [
    'defi',
    'nft',
    'gaming',
    'infrastructure',
    'analytics',
    'governance',
    'trading',
    'yield',
    'security',
    'metrics',
    'other'
  ]

  const complexityLevels = [
    'beginner',
    'intermediate',
    'advanced',
    'expert'
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/dashboards"
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboards
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                New Dashboard
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dashboard ID *
                    </label>
                    <input
                      type="text"
                      value={formData.dashboard_id}
                      onChange={(e) => handleInputChange('dashboard_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., active_wallets, gas_tracker"
                      pattern="[a-zA-Z0-9_\\-]+"
                      title="Only letters, numbers, underscores, and hyphens allowed"
                      required
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Used in placeholders: {`{{embed_query:${formData.dashboard_id || 'dashboard_id'}}}`}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Dashboard title"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the dashboard"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Complexity
                    </label>
                    <select
                      value={formData.complexity || 'intermediate'}
                      onChange={(e) => handleInputChange('complexity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {complexityLevels.map(level => (
                        <option key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sort_order || 0}
                      onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags?.join(', ') || ''}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ethereum, defi, analytics (comma-separated)"
                  />
                </div>
              </div>

              {/* URLs */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  URLs
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Embed URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={formData.embed_url || ''}
                      onChange={(e) => handleInputChange('embed_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://dune.com/embeds/..."
                    />
                    {formData.embed_url && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        {dashboardService.validateEmbedUrl(formData.embed_url) ? (
                          <span className="text-green-500">✓</span>
                        ) : (
                          <span className="text-red-500">✗</span>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Must be a valid Dune Analytics embed URL
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dune Dashboard URL
                  </label>
                  <input
                    type="url"
                    value={formData.dune_url || ''}
                    onChange={(e) => handleInputChange('dune_url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://dune.com/dashboard/..."
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Settings
                </h3>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => handleInputChange('is_active', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Active
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Featured
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/admin/dashboards"
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Dashboard
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Preview
            </h3>

            {previewUrl ? (
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <iframe
                    src={previewUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    className="w-full h-full"
                    title="Dashboard Preview"
                  />
                </div>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View in Dune
                </a>
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Eye className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Enter a valid embed URL to preview</p>
                </div>
              </div>
            )}
          </div>

          {/* Placeholder Example */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Usage Example
            </h3>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-3">
              <code className="text-sm text-gray-800 dark:text-gray-200">
                {`{{embed_query:${formData.dashboard_id || 'dashboard_id'}}}`}
              </code>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Use this placeholder in blog posts to embed the dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}