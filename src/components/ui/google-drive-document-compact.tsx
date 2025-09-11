'use client'

interface GoogleDriveDocumentCompactProps {
  fileId: string
  customTitle?: string
  url: string
}

export function GoogleDriveDocumentCompact({ fileId, customTitle, url }: GoogleDriveDocumentCompactProps) {
  const title = customTitle || 'Document'
  const viewUrl = `https://drive.google.com/file/d/${fileId}/view`
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-background hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-500 rounded-md flex items-center justify-center text-white flex-shrink-0">
            <span className="text-xs font-bold">DOC</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground truncate">{title}</h4>
            <p className="text-xs text-foreground/60">Google Drive</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 btn-primary text-xs rounded-md"
            title="Download"
          >
            Download
          </a>
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 btn-outline text-xs rounded-md"
            title="View"
          >
            View
          </a>
        </div>
      </div>
    </div>
  )
}