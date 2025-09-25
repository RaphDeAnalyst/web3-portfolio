'use client'

interface GoogleDriveDocumentProps {
  fileId: string
  customTitle?: string
  url: string
}

export function GoogleDriveDocument({ fileId, customTitle, url }: GoogleDriveDocumentProps) {
  // Title precedence: customTitle (from database or markdown) → fallback 'Document'
  const title = customTitle || 'Document'
  const subtitle = 'Google Drive'

  const viewUrl = `https://drive.google.com/file/d/${fileId}/view`
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`

  return (
    <div className="my-6">
      <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-blue-900/20 dark:to-green-900/20">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg flex items-center justify-center text-white">
            <span className="text-sm font-bold">DOC</span>
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
              className="px-4 py-2 btn-primary rounded-lg font-medium flex items-center"
            >
              Download
            </a>
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 btn-outline rounded-lg font-medium flex items-center"
            >
              View
            </a>
          </div>
        </div>
        
        {/* Optional: Embedded Preview */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <details className="group">
            <summary className="cursor-pointer text-sm text-foreground/70 hover:text-foreground transition-colors duration-200 flex items-center space-x-2">
              <span className="transition-transform duration-200 group-open:rotate-90">→</span>
              <span>Preview Document</span>
            </summary>
            <div className="mt-3">
              <iframe
                src={embedUrl}
                className="w-full h-96 border border-gray-200 dark:border-gray-700 rounded-lg"
                title="Document Preview"
                loading="lazy"
                onError={() => {
                  console.warn('Google Drive preview failed to load, document may not be publicly accessible')
                }}
              />
              <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  💡 If preview doesn&apos;t load, the document may need to be shared publicly or you may need to open it directly via the &quot;View&quot; button.
                </p>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}