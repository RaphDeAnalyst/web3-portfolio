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
          <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-purple-500 rounded-md flex items-center justify-center text-white">
            <span className="text-xs font-bold">{documents.length}</span>
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