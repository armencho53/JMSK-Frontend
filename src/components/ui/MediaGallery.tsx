import { useState, useEffect } from 'react'
import { Image } from './Image'
import { FilePreview } from './FilePreview'
import Modal from './Modal'

interface MediaItem {
  id: string | number
  src: string
  type: 'image' | 'video' | 'document' | 'other'
  alt?: string
  thumbnail?: string
  caption?: string
  fileName?: string
  fileSize?: number
  mimeType?: string
}

interface MediaGalleryProps {
  items: MediaItem[]
  columns?: 2 | 3 | 4
  aspectRatio?: 'square' | '4:3' | '16:9' | '3:2'
  showCaptions?: boolean
  enableLightbox?: boolean
  showFileInfo?: boolean
  onItemClick?: (item: MediaItem, index: number) => void
  className?: string
}

export function MediaGallery({
  items,
  columns = 3,
  aspectRatio = 'square',
  showCaptions = false,
  enableLightbox = true,
  showFileInfo = true,
  onItemClick,
  className = ''
}: MediaGalleryProps) {
  // Using professional theme styling directly
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const getGridClasses = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-2'
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      case 4:
        return 'grid-cols-2 lg:grid-cols-4'
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    }
  }

  const getThemeClasses = () => {
    // Professional theme only
    return {
      container: 'bg-white',
      item: 'bg-slate-50 border border-slate-200 rounded-lg overflow-hidden',
      overlay: 'bg-slate-900 bg-opacity-80',
      caption: 'text-slate-900',
      fileInfo: 'text-slate-500 text-xs'
    }
  }

  const themeClasses = getThemeClasses()

  const openLightbox = (index: number) => {
    if (enableLightbox) {
      setSelectedItemIndex(index)
      setIsLightboxOpen(true)
    }
    onItemClick?.(items[index], index)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    setSelectedItemIndex(null)
  }

  const navigateItem = (direction: 'prev' | 'next') => {
    if (selectedItemIndex === null) return

    let newIndex = selectedItemIndex
    if (direction === 'prev') {
      newIndex = selectedItemIndex > 0 ? selectedItemIndex - 1 : items.length - 1
    } else {
      newIndex = selectedItemIndex < items.length - 1 ? selectedItemIndex + 1 : 0
    }
    setSelectedItemIndex(newIndex)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isLightboxOpen) return

      switch (event.key) {
        case 'ArrowLeft':
          navigateItem('prev')
          break
        case 'ArrowRight':
          navigateItem('next')
          break
        case 'Escape':
          closeLightbox()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, selectedItemIndex])

  const renderMediaItem = (item: MediaItem, index: number) => {
    const isClickable = enableLightbox || onItemClick

    return (
      <div key={item.id} className="group relative">
        <div
          className={`
            ${themeClasses.item}
            ${isClickable ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}
          `}
          onClick={() => isClickable && openLightbox(index)}
        >
          {item.type === 'image' ? (
            <div className="relative">
              <Image
                src={item.thumbnail || item.src}
                alt={item.alt || item.fileName || `Media item ${index + 1}`}
                aspectRatio={aspectRatio}
                className="w-full h-full"
                loading="lazy"
              />
              
              {isClickable && (
                <div className={`absolute inset-0 ${themeClasses.overlay} opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center`}>
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              )}
            </div>
          ) : (
            <div className={`p-4 flex flex-col items-center justify-center min-h-[120px]`}>
              {getFileTypeIcon(item)}
              {showFileInfo && item.fileName && (
                <p className={`${themeClasses.caption} text-sm mt-2 text-center truncate w-full`} title={item.fileName}>
                  {item.fileName}
                </p>
              )}
              {showFileInfo && item.fileSize && (
                <p className={themeClasses.fileInfo}>
                  {formatFileSize(item.fileSize)}
                </p>
              )}
            </div>
          )}
        </div>
        
        {showCaptions && item.caption && (
          <p className={`mt-2 text-sm ${themeClasses.caption}`}>{item.caption}</p>
        )}
      </div>
    )
  }

  const getFileTypeIcon = (item: MediaItem) => {
    const iconClass = "w-12 h-12 text-current opacity-60"
    
    switch (item.type) {
      case 'video':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )
      case 'document':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center h-48 ${themeClasses.container} rounded-lg ${className}`}>
        <div className="text-center opacity-60">
          <svg
            className="mx-auto h-12 w-12 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p>No media files available</p>
        </div>
      </div>
    )
  }

  const selectedItem = selectedItemIndex !== null ? items[selectedItemIndex] : null

  return (
    <>
      <div className={`grid ${getGridClasses()} gap-4 ${className}`}>
        {items.map((item, index) => renderMediaItem(item, index))}
      </div>

      {/* Lightbox Modal */}
      {enableLightbox && selectedItem && (
        <Modal
          isOpen={isLightboxOpen}
          onClose={closeLightbox}
          size="xl"
          showCloseButton={true}
          className="bg-black bg-opacity-90"
        >
          <div className="relative">
            {/* Navigation buttons */}
            {items.length > 1 && (
              <>
                <button
                  onClick={() => navigateItem('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all"
                  aria-label="Previous item"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => navigateItem('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all"
                  aria-label="Next item"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Main content */}
            <div className="flex items-center justify-center max-h-[80vh]">
              {selectedItem.type === 'image' ? (
                <Image
                  src={selectedItem.src}
                  alt={selectedItem.alt || selectedItem.fileName || 'Media item'}
                  objectFit="contain"
                  className="max-w-full max-h-full"
                  showLoadingState={true}
                />
              ) : (
                <FilePreview
                  file={selectedItem.src}
                  showFileName={true}
                  showFileSize={true}
                  showDownloadButton={true}
                  maxWidth={600}
                  maxHeight={400}
                />
              )}
            </div>

            {/* Item info */}
            <div className="mt-4 text-center">
              {selectedItem.caption && (
                <p className="text-white text-lg mb-2">{selectedItem.caption}</p>
              )}
              <p className="text-gray-300 text-sm">
                {selectedItemIndex! + 1} of {items.length}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}