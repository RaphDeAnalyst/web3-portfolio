'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { dashboardService } from '@/lib/service-switcher'
import type { Dashboard } from '@/types/dashboard'
import { useNotification } from '@/lib/notification-context'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import {
  BarChart3,
  CheckCircle,
  Edit,
  Star,
  Plus,
  ExternalLink,
  Eye,
  EyeOff,
  Search,
  Filter,
  Trash2
} from 'lucide-react'
import { logger } from '@/lib/logger'

export default function DashboardsManagement() {
  const { success, error } = useNotification()
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; dashboard: Dashboard | null }>({
    isOpen: false,
    dashboard: null
  })

  useEffect(() => {
    loadDashboards()
  }, [])

  const loadDashboards = async () => {
    setIsLoading(true)
    try {
      const allDashboards = await dashboardService.getAllDashboards()
      setDashboards(allDashboards)
    } catch (err) {
      error('Failed to load dashboards')
      logger.error('Error loading dashboards:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const categories = Array.from(new Set(dashboards.map(d => d.category).filter(Boolean)))

  // Calculate dashboard groups for sort order validation
  const featuredDashboards = dashboards.filter(d => d.featured === true)
  const nonFeaturedDashboards = dashboards.filter(d => d.featured !== true)

  const filteredDashboards = dashboards.filter(dashboard => {
    const matchesSearch =
      dashboard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dashboard.dashboard_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dashboard.description && dashboard.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = filterCategory === 'all' || dashboard.category === filterCategory

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && dashboard.is_active) ||
      (filterStatus === 'inactive' && !dashboard.is_active) ||
      (filterStatus === 'with_embeds' && dashboard.embed_url) ||
      (filterStatus === 'without_embeds' && !dashboard.embed_url)

    return matchesSearch && matchesCategory && matchesStatus
  })

  const openDeleteDialog = (dashboard: Dashboard) => {
    setDeleteDialog({ isOpen: true, dashboard })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, dashboard: null })
  }

  const handleDelete = async () => {
    if (!deleteDialog.dashboard) return

    try {
      const dashboardToDelete = deleteDialog.dashboard

      // Step 1: Delete the dashboard
      await dashboardService.deleteDashboard(dashboardToDelete.id)

      // Step 2: Get remaining dashboards in the same group (featured vs non-featured)
      const sameGroup = dashboardToDelete.featured === true
        ? featuredDashboards.filter(d => d.id !== dashboardToDelete.id)
        : nonFeaturedDashboards.filter(d => d.id !== dashboardToDelete.id)

      // Step 3: Rebalance sort_order values if there are remaining dashboards
      if (sameGroup.length > 0) {
        // Sort by current sort_order to maintain relative positioning
        const sortedGroup = sameGroup.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

        // Reassign sort_order values sequentially (0, 1, 2, 3...)
        const rebalancePromises = sortedGroup.map((dashboard, index) =>
          dashboardService.updateDashboard({
            id: dashboard.id,
            sort_order: index
          })
        )

        // Execute all rebalancing updates
        await Promise.all(rebalancePromises)

        // Show success message with rebalancing info
        const groupType = dashboardToDelete.featured ? 'featured' : 'non-featured'
        success(`Dashboard deleted and ${sameGroup.length} remaining ${groupType} dashboards rebalanced`)
      } else {
        success('Dashboard deleted successfully')
      }

      await loadDashboards()
      closeDeleteDialog()
    } catch (err) {
      error('Failed to delete dashboard')
      logger.error('Error deleting dashboard:', err)
    }
  }

  const toggleActiveStatus = async (dashboard: Dashboard) => {
    try {
      await dashboardService.updateDashboard({
        id: dashboard.id,
        is_active: !dashboard.is_active
      })
      success(`Dashboard ${dashboard.is_active ? 'deactivated' : 'activated'} successfully`)
      await loadDashboards()
    } catch (err) {
      error('Failed to update dashboard status')
      logger.error('Error updating dashboard status:', err)
    }
  }

  const toggleFeaturedStatus = async (dashboard: Dashboard) => {
    try {
      const newFeaturedStatus = !dashboard.featured
      const allDashboards = await dashboardService.getAllDashboards()

      // Simple: count how many are already in target group
      const targetGroupCount = newFeaturedStatus
        ? allDashboards.filter((d: Dashboard) => d.featured === true).length
        : allDashboards.filter((d: Dashboard) => d.featured !== true).length

      // Next number is just the count (0-indexed)
      const newSortOrder = targetGroupCount

      await dashboardService.updateDashboard({
        id: dashboard.id,
        featured: newFeaturedStatus,
        sort_order: newSortOrder
      })

      success(`Dashboard ${dashboard.featured ? 'unfeatured' : 'featured'} with sort order ${newSortOrder}`)
      await loadDashboards()
    } catch (err) {
      error('Failed to update featured status')
      logger.error('Error in toggleFeaturedStatus:', err)
    }
  }

  const updateSortOrder = async (dashboard: Dashboard, newSortOrder: number) => {
    try {
      // Determine which group this dashboard belongs to
      const sameGroup = dashboard.featured === true ? featuredDashboards : nonFeaturedDashboards
      const maxValidOrder = Math.max(0, sameGroup.length - 1)

      // Validate sort order range
      if (newSortOrder < 0 || newSortOrder > maxValidOrder) {
        error(`Sort order must be between 0 and ${maxValidOrder} for ${dashboard.featured ? 'featured' : 'non-featured'} dashboards`)
        return
      }

      // Check for duplicates in the same group
      const hasDuplicate = sameGroup.some(d =>
        d.id !== dashboard.id && d.sort_order === newSortOrder
      )

      if (hasDuplicate) {
        // Find the dashboard that currently has this sort_order
        const conflictingDashboard = sameGroup.find(d =>
          d.id !== dashboard.id && d.sort_order === newSortOrder
        )

        if (conflictingDashboard) {
          // Swap their positions
          const oldSortOrder = dashboard.sort_order ?? 0

          // Update both dashboards
          await Promise.all([
            dashboardService.updateDashboard({
              id: dashboard.id,
              sort_order: newSortOrder
            }),
            dashboardService.updateDashboard({
              id: conflictingDashboard.id,
              sort_order: oldSortOrder
            })
          ])

          success(`Swapped positions: "${dashboard.title}" ↔ "${conflictingDashboard.title}"`)
        }
      } else {
        // No conflict, safe to update
        await dashboardService.updateDashboard({
          id: dashboard.id,
          sort_order: newSortOrder
        })
        success(`Dashboard sort order updated to ${newSortOrder}`)
      }

      await loadDashboards()
    } catch (err) {
      error('Failed to update sort order')
      logger.error('Error updating sort order:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
          <div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full" />
          <span>Loading dashboards...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage Dune Analytics dashboards and embeds
          </p>
        </div>
        <Link
          href="/admin/dashboards/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Dashboard
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search dashboards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="with_embeds">With Embeds</option>
              <option value="without_embeds">Without Embeds</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {dashboards.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-2xl font-bold text-green-600">
            {dashboards.filter(d => d.is_active).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-2xl font-bold text-blue-600">
            {dashboards.filter(d => d.embed_url).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">With Embeds</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-2xl font-bold text-purple-600">
            {dashboards.filter(d => d.featured).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Featured</div>
        </div>
      </div>

      {/* Dashboard List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredDashboards.length === 0 ? (
          <div className="p-8 text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No dashboards found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first dashboard'
              }
            </p>
            {!searchTerm && filterCategory === 'all' && filterStatus === 'all' && (
              <Link
                href="/admin/dashboards/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Dashboard
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Dashboard
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Embed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Sort Order
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDashboards.map((dashboard) => (
                  <tr key={dashboard.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <BarChart3 className="w-8 h-8 text-blue-500" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {dashboard.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                            {dashboard.dashboard_id}
                          </div>
                          {dashboard.description && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {dashboard.description.length > 100
                                ? `${dashboard.description.substring(0, 100)}...`
                                : dashboard.description
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {dashboard.category && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {dashboard.category}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleActiveStatus(dashboard)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            dashboard.is_active
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {dashboard.is_active ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => toggleFeaturedStatus(dashboard)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            dashboard.featured
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-yellow-50 hover:text-yellow-700'
                          }`}
                        >
                          <Star className={`w-3 h-3 mr-1 ${dashboard.featured ? 'fill-current' : ''}`} />
                          {dashboard.featured ? 'Featured' : 'Not Featured'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {dashboard.embed_url ? (
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <Eye className="w-3 h-3 mr-1" />
                            Available
                          </span>
                          <a
                            href={dashboard.embed_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                          <EyeOff className="w-3 h-3 mr-1" />
                          No Embed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        // Calculate dynamic max based on dashboard's group
                        const sameGroup = dashboard.featured === true ? featuredDashboards : nonFeaturedDashboards
                        const maxValidOrder = Math.max(0, sameGroup.length - 1)

                        // Calculate actual position in sorted group (not sort_order + 1)
                        const sortedGroup = [...sameGroup].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                        const actualPosition = sortedGroup.findIndex(d => d.id === dashboard.id) + 1
                        const totalInGroup = sameGroup.length

                        return (
                          <div className="flex items-center space-x-2">
                            <div className="flex flex-col items-center">
                              <input
                                type="number"
                                value={dashboard.sort_order ?? 0}
                                onChange={(e) => {
                                  const newValue = parseInt(e.target.value) || 0
                                  updateSortOrder(dashboard, newValue)
                                }}
                                className="w-16 px-2 py-1 text-center text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="0"
                                max={maxValidOrder}
                                title={`Valid range: 0-${maxValidOrder}`}
                              />
                              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {actualPosition} of {totalInGroup}
                              </span>
                            </div>
                            <div className="flex flex-col space-y-1">
                              <button
                                onClick={() => updateSortOrder(dashboard, Math.max(0, (dashboard.sort_order ?? 0) - 1))}
                                disabled={(dashboard.sort_order ?? 0) <= 0}
                                className="w-6 h-6 flex items-center justify-center text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Move up"
                              >
                                ↑
                              </button>
                              <button
                                onClick={() => updateSortOrder(dashboard, Math.min(maxValidOrder, (dashboard.sort_order ?? 0) + 1))}
                                disabled={(dashboard.sort_order ?? 0) >= maxValidOrder}
                                className="w-6 h-6 flex items-center justify-center text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Move down"
                              >
                                ↓
                              </button>
                            </div>
                          </div>
                        )
                      })()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/dashboards/edit/${dashboard.id}`}
                          className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openDeleteDialog(dashboard)}
                          className="text-red-600 hover:text-red-500 dark:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Dashboard"
        message={`Are you sure you want to delete "${deleteDialog.dashboard?.title}"? This action cannot be undone.`}
      />
    </div>
  )
}