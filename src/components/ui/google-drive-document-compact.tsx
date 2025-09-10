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
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-md flex items-center justify-center text-white flex-shrink-0">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
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
            className="p-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-md transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
            title="Download"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </a>
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 border border-gray-300 dark:border-gray-600 text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200 flex items-center justify-center"
            title="View"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}