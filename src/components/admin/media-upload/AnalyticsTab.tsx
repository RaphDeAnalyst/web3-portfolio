'use client'

import { MediaFile } from '@/lib/media-service-hybrid'
import { 
  BarChart3, 
  FolderOpen, 
  HardDrive, 
  Cloud, 
  TrendingUp, 
  Calendar, 
  Image, 
  Video, 
  FileText, 
  Music 
} from 'lucide-react'

interface AnalyticsTabProps {
  mediaFiles: MediaFile[]
}

export function AnalyticsTab({ mediaFiles }: AnalyticsTabProps) {
  // Calculate analytics data
  const totalFiles = mediaFiles.length
  const totalSize = mediaFiles.reduce((acc, file) => acc + (file.file_size || 0), 0)
  
  // Provider distribution
  const providerStats = mediaFiles.reduce((acc, file) => {
    const provider = file.storage_provider
    acc[provider] = (acc[provider] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // File type distribution
  const typeStats = mediaFiles.reduce((acc, file) => {
    if (file.file_type) {
      const category = file.file_type.split('/')[0]
      acc[category] = (acc[category] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  // Size distribution
  const sizeStats = mediaFiles.reduce((acc, file) => {
    const provider = file.storage_provider
    acc[provider] = (acc[provider] || 0) + (file.file_size || 0)
    return acc
  }, {} as Record<string, number>)

  // Recent uploads (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const recentFiles = mediaFiles.filter(file => 
    file.created_at && new Date(file.created_at) > thirtyDaysAgo
  )

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getPercentage = (value: number, total: number) => {
    return total === 0 ? 0 : Math.round((value / total) * 100)
  }

  return (
    <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-2">Media Analytics</h2>
        <p className="text-gray-600">
          Insights and statistics about your media library
        </p>
      </div>

      {totalFiles === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4 flex justify-center">
            <BarChart3 size={64} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-foreground mb-2">No Data Available</h3>
          <p className="text-gray-500">
            Upload some media files to see analytics
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">Total Files</h3>
                <FolderOpen size={24} className="text-white/80" />
              </div>
              <div className="text-3xl font-bold">{totalFiles.toLocaleString()}</div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">Total Size</h3>
                <HardDrive size={24} className="text-white/80" />
              </div>
              <div className="text-3xl font-bold">{formatFileSize(totalSize)}</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">Providers</h3>
                <Cloud size={24} className="text-white/80" />
              </div>
              <div className="text-3xl font-bold">{Object.keys(providerStats).length}</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium opacity-90">Recent (30d)</h3>
                <TrendingUp size={24} className="text-white/80" />
              </div>
              <div className="text-3xl font-bold">{recentFiles.length}</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Storage Provider Distribution */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Storage Provider Distribution</h3>
              <div className="space-y-4">
                {Object.entries(providerStats).map(([provider, count]) => (
                  <div key={provider}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground capitalize">{provider}</span>
                      <span className="text-sm text-gray-600">{count} files ({getPercentage(count, totalFiles)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getPercentage(count, totalFiles)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* File Type Distribution */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">File Type Distribution</h3>
              <div className="space-y-4">
                {Object.entries(typeStats).map(([type, count]) => (
                  <div key={type}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground capitalize">
                        {type} 
                        {type === 'image' && <Image size={16} className="ml-1 inline" />}
                        {type === 'video' && <Video size={16} className="ml-1 inline" />}
                        {type === 'application' && <FileText size={16} className="ml-1 inline" />}
                        {type === 'audio' && <Music size={16} className="ml-1 inline" />}
                      </span>
                      <span className="text-sm text-gray-600">{count} files ({getPercentage(count, totalFiles)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-secondary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getPercentage(count, totalFiles)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Storage Size by Provider */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Storage Size by Provider</h3>
              <div className="space-y-4">
                {Object.entries(sizeStats).map(([provider, size]) => (
                  <div key={provider}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground capitalize">{provider}</span>
                      <span className="text-sm text-gray-600">{formatFileSize(size)} ({getPercentage(size, totalSize)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getPercentage(size, totalSize)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h3>
              {recentFiles.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mb-2 flex justify-center">
                    <Calendar size={32} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No recent uploads</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {recentFiles
                    .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
                    .slice(0, 10)
                    .map((file) => (
                    <div key={file.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                          {file.file_type?.startsWith('image/') ? 
                            <Image size={16} className="text-gray-500" /> : 
                           file.file_type?.startsWith('video/') ? 
                            <Video size={16} className="text-gray-500" /> : 
                            <FileText size={16} className="text-gray-500" />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground truncate" style={{ maxWidth: '150px' }}>
                            {file.filename}
                          </p>
                          <p className="text-xs text-gray-500">
                            {file.created_at && new Date(file.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatFileSize(file.file_size || 0)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Average file size:</span>
                <div className="font-medium text-foreground">{formatFileSize(totalFiles > 0 ? totalSize / totalFiles : 0)}</div>
              </div>
              <div>
                <span className="text-gray-600">Largest file:</span>
                <div className="font-medium text-foreground">
                  {formatFileSize(Math.max(...mediaFiles.map(f => f.file_size || 0)))}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Smallest file:</span>
                <div className="font-medium text-foreground">
                  {formatFileSize(Math.min(...mediaFiles.map(f => f.file_size || 0).filter(s => s > 0)))}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Growth (30d):</span>
                <div className="font-medium text-primary-500">+{recentFiles.length} files</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}