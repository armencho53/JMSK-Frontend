import { useState, useEffect } from 'react'
import { Image } from './Image'

interface FilePreviewProps {
  file: File | string
  maxWidth?: number
  maxHeight?: number
  showFileName?: boolean
  showFileSize?: boolean
  showDownloadButton?: boolean
  onDownload?: () => void
  className?: string
}

export function FilePreview({
  file,
  maxWidth = 400,
  maxHeight = 300,
  showFileName = true,
  showFileSize = true,
  showDownloadButton = false,
  onDownload,
  className = ''
}: FilePreviewProps) {
  // Using professional theme styling directly
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [fileType, setFileType] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [fileSize, setFileSize] = useState<number>(0)

  useEffect(() => {
    if (typeof file === 'string') {
      setPreviewUrl(file)
      setFileName(file.split('/').pop() || 'Unknown file')
      setFileType(getFileTypeFromUrl(file))
    } else {
      setFileName(file.name)
      setFileSize(file.size)
      setFileType(file.type)

      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        return () => URL.revokeObjectURL(url)
      }
    }
  }, [file])

  const getFileTypeFromUrl = (url: string): string => {
    const extension = url.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'
      case 'png':
        return 'image/png'
      case 'gif':
        return 'image/gif'
      case 'webp':
        return 'image/webp'
      case 'pdf':
        return 'application/pdf'
      case 'doc':
      case 'docx':
        return 'application/msword'
      case 'xls':
      case 'xlsx':
        return 'application/vnd.ms-excel'
      default:
        return 'application/octet-stream'
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Professional theme styling
  const themeClasses = {
    container: 'bg-white border border-slate-200 rounded-lg',
    header: 'bg-slate-50 px-4 py-2 border-b border-slate-200',
    content: 'p-4',
    fileName: 'text-slate-900 font-medium text-sm',
    fileSize: 'text-slate-500 text-xs',
    downloadButton: 'text-orange-600 hover:text-orange-700',
    iconContainer: 'bg-slate-100 text-slate-500',
    previewText: 'text-slate-500'
  }

  const renderPreview = () => {
    if (fileType.startsWith('image/') && previewUrl) {
      return (
        <div className="flex justify-center">
          <Image
            src={previewUrl}
            alt={fileName}
            className="max-w-full"
            style={{ maxWidth: `${maxWidth}px`, maxHeight: `${maxHeight}px` }}
            objectFit="contain"
            showLoadingState={true}
          />
        </div>
      )
    }

    // Non-image file preview
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-3 ${themeClasses.iconContainer}`}>
          {getFileIcon()}
        </div>
        <p className={`text-sm ${themeClasses.previewText}`}>
          {getFileTypeLabel()}
        </p>
      </div>
    )
  }

  const getFileIcon = () => {
    if (fileType.startsWith('image/')) {
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    } else if (fileType === 'application/pdf') {
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      )
    }

    // Default file icon
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }

  const getFileTypeLabel = () => {
    if (fileType.startsWith('image/')) return 'Image File'
    if (fileType === 'application/pdf') return 'PDF Document'
    if (fileType.includes('word')) return 'Word Document'
    if (fileType.includes('excel')) return 'Excel Spreadsheet'
    return 'File'
  }

  return (
    <div className={`${themeClasses.container} ${className}`}>
      {(showFileName || showFileSize || showDownloadButton) && (
        <div className={`${themeClasses.header} flex items-center justify-between`}>
          <div className="flex-1 min-w-0">
            {showFileName && (
              <p className={`${themeClasses.fileName} truncate`} title={fileName}>
                {fileName}
              </p>
            )}
            {showFileSize && fileSize > 0 && (
              <p className={themeClasses.fileSize}>
                {formatFileSize(fileSize)}
              </p>
            )}
          </div>
          {showDownloadButton && (
            <button
              onClick={onDownload}
              className={`ml-2 p-1 ${themeClasses.downloadButton} transition-colors`}
              aria-label="Download file"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          )}
        </div>
      )}
      <div className={themeClasses.content}>
        {renderPreview()}
      </div>
    </div>
  )
}