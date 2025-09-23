'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { dashboardService } from '@/lib/service-switcher'
import type { Dashboard, UpdateDashboardInput } from '@/types/dashboard'
import { useNotification } from '@/lib/notification-context'
import { logger } from '@/lib/logger'
import Link from 'next/link'
import {
  ArrowLeft,
  BarChart3,
  ExternalLink,
  Eye,
  Save,
  Trash2
} from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

export default function EditDashboard() {
  const router = useRouter()
  const params = useParams()
  const { success, error } = useNotification()
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [formData, setFormData] = useState<UpdateDashboardInput>({
    id: '',
    dashboard_id: '',
    title: '',
    description: '',
    category: '',
    tags: [],
    embed_url: '',
    dune_url: '',
    featured: false,
    is_active: true,
    complexity: 'intermediate',
    sort_order: 0
  })

  useEffect(() => {
    if (params?.id) {
      loadDashboard(params.id as string)
    }
  }, [params?.id])

  const loadDashboard = async (id: string) => {
    setIsLoading(true)
    try {
      const dashboard = await dashboardService.getDashboardById(id)
      if (!dashboard) {
        error('Dashboard not found')
        router.push('/admin/dashboards')
        return
      }

      setDashboard(dashboard)
      setFormData({
        id: dashboard.id,
        dashboard_id: dashboard.dashboard_id,
        title: dashboard.title,
        description: dashboard.description || '',
        category: dashboard.category || '',
        tags: dashboard.tags || [],
        embed_url: dashboard.embed_url || '',
        dune_url: dashboard.dune_url || '',
        featured: dashboard.featured || false,
        is_active: dashboard.is_active !== false,
        complexity: dashboard.complexity || 'intermediate',
        sort_order: dashboard.sort_order || 0
      })

      if (dashboard.embed_url && dashboardService.validateEmbedUrl(dashboard.embed_url)) {
        setPreviewUrl(dashboard.embed_url)
      }
    } catch (err) {
      error('Failed to load dashboard')
      logger.error('Error loading dashboard:', err)
      router.push('/admin/dashboards')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

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

      // Check if featured status has changed
      const originalFeatured = dashboard?.featured === true
      const newFeatured = formData.featured === true
      const featuredStatusChanged = originalFeatured !== newFeatured

      const finalFormData = { ...formData }
      let successMessage = 'Dashboard updated successfully'

      // Only recalculate sort_order if featured status changed
      if (featuredStatusChanged) {
        // Step 1: Update the dashboard to the new group first
        await dashboardService.updateDashboard({
          ...formData,
          sort_order: 0 // Temporary sort_order, will be corrected by compacting
        })

        // Step 2: Compact the old group (to fill the gap left behind)
        await dashboardService.compactSortOrders(originalFeatured)

        // Step 3: Compact the new group (to give proper position to moved dashboard)
        await dashboardService.compactSortOrders(newFeatured)

        // Step 4: Get the final sort_order for success message
        const updatedDashboard = await dashboardService.getDashboardById(formData.id)
        const finalSortOrder = updatedDashboard?.sort_order ?? 0

        successMessage = `Dashboard moved to ${newFeatured ? 'featured' : 'non-featured'} group with sort order ${finalSortOrder}`

        // Skip the final update since we already updated above
        success(successMessage)
        router.push('/admin/dashboards')
        return
      }
      // If featured status didn't change, keep the original sort_order

      await dashboardService.updateDashboard(finalFormData)
      success(successMessage)
      router.push('/admin/dashboards')
    } catch (err) {
      error('Failed to update dashboard')
      logger.error('Error updating dashboard:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!dashboard) return

    try {
      await dashboardService.deleteDashboard(dashboard.id)
      success('Dashboard deleted successfully')
      router.push('/admin/dashboards')
    } catch (err) {
      error('Failed to delete dashboard')
      logger.error('Error deleting dashboard:', err)
    }
  }

  const handleInputChange = (field: keyof UpdateDashboardInput, value: any) => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
          <div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
          Dashboard not found
        </h2>
        <Link
          href="/admin/dashboards"
          className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          Back to Dashboards
        </Link>
      </div>
    )
  }

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
        <button
          onClick={() => setDeleteDialog(true)}
          className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Edit Dashboard
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
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
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

          {/* Metadata */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Metadata
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">ID:</span>
                <span className="text-gray-900 dark:text-gray-100 font-mono">{dashboard.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {dashboard.created_at ? new Date(dashboard.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Updated:</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {dashboard.updated_at ? new Date(dashboard.updated_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Dashboard"
        message={`Are you sure you want to delete "${dashboard.title}"? This action cannot be undone.`}
      />
    </div>
  )
}