'use client'

import { GoogleDriveDocument } from './google-drive-document'
import { GoogleDriveDocumentCompact } from './google-drive-document-compact'

interface DocumentInfo {
  fileId: string
  customTitle?: string
  url: string
}

interface GoogleDriveDocumentGroupProps {
  documents: DocumentInfo[]
}

export function GoogleDriveDocumentGroup({ documents }: GoogleDriveDocumentGroupProps) {
  // Single document - use full card
  if (documents.length === 1) {
    const doc = documents[0]
    return (
      <GoogleDriveDocument 
        fileId={doc.fileId}
        customTitle={doc.customTitle}
        url={doc.url}
      />
    )
  }

  // Multiple documents - use compact grid
  return (
    <div className="my-6">
      <div className="space-y-3">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-md flex items-center justify-center text-white">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="font-medium text-foreground">
            Documents ({documents.length})
          </h3>
        </div>
        
        <div className="grid gap-3">
          {documents.map((doc, index) => (
            <GoogleDriveDocumentCompact
              key={`${doc.fileId}-${index}`}
              fileId={doc.fileId}
              customTitle={doc.customTitle}
              url={doc.url}
            />
          ))}
        </div>
      </div>
    </div>
  )
}