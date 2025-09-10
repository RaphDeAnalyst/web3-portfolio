'use client'

interface GoogleDriveDocumentProps {
  fileId: string
  customTitle?: string
  url: string
}

export function GoogleDriveDocument({ fileId, customTitle, url }: GoogleDriveDocumentProps) {
  const title = customTitle || 'Document'
  const subtitle = 'Google Drive'

  const viewUrl = `https://drive.google.com/file/d/${fileId}/view`
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
  const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`

  return (
    <div className="my-6">
      <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-blue-900/20 dark:to-green-900/20">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground text-lg">{title}</h4>
            <p className="text-sm text-foreground/60">{subtitle}</p>
          </div>
          <div className="flex space-x-3">
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download</span>
            </a>
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>View</span>
            </a>
          </div>
        </div>
        
        {/* Optional: Embedded Preview */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <details className="group">
            <summary className="cursor-pointer text-sm text-foreground/70 hover:text-foreground transition-colors duration-200 flex items-center space-x-2">
              <svg className="w-4 h-4 transition-transform duration-200 group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Preview Document</span>
            </summary>
            <div className="mt-3">
              <iframe
                src={previewUrl}
                className="w-full h-96 border border-gray-200 dark:border-gray-700 rounded-lg"
                title="Document Preview"
                loading="lazy"
              />
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}