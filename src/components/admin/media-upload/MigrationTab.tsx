'use client'

import { 
  RotateCcw, 
  HardDrive, 
  Trash2, 
  Clock, 
  CheckCircle 
} from 'lucide-react'

interface MigrationTabProps {
  migrationStatus: {
    inProgress: boolean
    results?: any
  }
  onMigration: (type: 'all' | 'localStorage' | 'cleanup') => void
}

export function MigrationTab({ migrationStatus, onMigration }: MigrationTabProps) {
  const migrationOptions = [
    {
      id: 'all',
      title: 'Full Migration',
      description: 'Migrate all media files to the optimal storage providers',
      icon: RotateCcw,
      buttonText: 'Start Full Migration',
      variant: 'primary' as const
    },
    {
      id: 'localStorage',
      title: 'Local Storage Migration',
      description: 'Quick migration for files stored in browser local storage',
      icon: HardDrive,
      buttonText: 'Migrate Local Files',
      variant: 'secondary' as const
    },
    {
      id: 'cleanup',
      title: 'Cleanup Duplicates',
      description: 'Remove duplicate files and optimize storage usage',
      icon: Trash2,
      buttonText: 'Start Cleanup',
      variant: 'danger' as const
    }
  ]

  const getButtonClasses = (variant: 'primary' | 'secondary' | 'danger') => {
    const base = 'px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
    
    switch (variant) {
      case 'primary':
        return `${base} bg-accent-blue text-white hover:bg-accent-blue-light disabled:hover:bg-accent-blue transition-all duration-200 shadow-lg shadow-accent-blue/20`
      case 'secondary':
        return `${base} bg-secondary-500 text-white hover:bg-secondary-600 disabled:hover:bg-secondary-500`
      case 'danger':
        return `${base} bg-red-500 text-white hover:bg-red-600 disabled:hover:bg-red-500`
      default:
        return base
    }
  }

  return (
    <div className="bg-background rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-2">Media Migration</h2>
        <p className="text-gray-600">
          Migrate and optimize your media files across different storage providers
        </p>
      </div>

      {!migrationStatus.inProgress ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {migrationOptions.map((option) => (
            <div key={option.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="mb-4 flex justify-center">
                  <option.icon size={48} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {option.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {option.description}
                </p>
              </div>

              <div className="text-center">
                <button
                  onClick={() => onMigration(option.id as 'all' | 'localStorage' | 'cleanup')}
                  className={getButtonClasses(option.variant)}
                  disabled={migrationStatus.inProgress}
                >
                  {option.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mb-6 flex justify-center">
            <Clock size={64} className="text-gray-400 animate-pulse" />
          </div>
          <h3 className="text-xl font-medium text-foreground mb-2">Migration in Progress</h3>
          <p className="text-gray-600">
            Please wait while we process your media files...
          </p>
          <div className="mt-6">
            <div className="inline-block w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-primary-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      )}

      {migrationStatus.results && (
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <div className="flex items-start">
              <div className="mr-4 flex items-center">
                <CheckCircle size={24} className="text-green-500" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                  Migration Complete
                </h3>
                
                <div className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-3">Migration Results</h4>
                  
                  {/* Summary Stats */}
                  {migrationStatus.results.summary && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-500">
                          {migrationStatus.results.summary.processed || 0}
                        </div>
                        <div className="text-sm text-gray-600">Processed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">
                          {migrationStatus.results.summary.successful || 0}
                        </div>
                        <div className="text-sm text-gray-600">Successful</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-500">
                          {migrationStatus.results.summary.failed || 0}
                        </div>
                        <div className="text-sm text-gray-600">Failed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-500">
                          {migrationStatus.results.summary.skipped || 0}
                        </div>
                        <div className="text-sm text-gray-600">Skipped</div>
                      </div>
                    </div>
                  )}

                  {/* Detailed Results */}
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                      View Detailed Results
                    </summary>
                    <pre className="mt-3 text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded border overflow-auto max-h-64">
                      {JSON.stringify(migrationStatus.results, null, 2)}
                    </pre>
                  </details>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
                  >
                    Refresh Page
                  </button>
                  <button
                    onClick={() => onMigration('cleanup')}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-foreground rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Run Cleanup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Migration Tips */}
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-foreground mb-4">Migration Tips</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Before Migration</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Backup important files</li>
              <li>• Check storage quotas</li>
              <li>• Close other browser tabs</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">During Migration</h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Keep this tab active</li>
              <li>• Don't refresh the page</li>
              <li>• Monitor progress carefully</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}