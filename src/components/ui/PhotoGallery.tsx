import { useState, useEffect } from 'react'
import { Image } from './Image'
import Modal from './Modal'

interface Photo {
  id: string | number
  src: string | { src: string; width?: number; density?: number }[]
  alt: string
  thumbnail?: string
  caption?: string
  sizes?: string
}

interface PhotoGalleryProps {
  photos: Photo[]
  columns?: 2 | 3 | 4
  aspectRatio?: 'square' | '4:3' | '16:9' | '3:2'
  showCaptions?: boolean
  enableLightbox?: boolean
  responsive?: boolean
  priority?: boolean // For above-the-fold images
  className?: string
}

export function PhotoGallery({
  photos,
  columns = 3,
  aspectRatio = 'square',
  showCaptions = false,
  enableLightbox = true,
  responsive = true,
  priority = false,
  className = '',
}: PhotoGalleryProps) {
  // Using professional theme styling directly
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const getGridClasses = () => {
    const baseClasses = responsive ? 'grid-cols-1' : ''
    
    switch (columns) {
      case 2:
        return responsive ? `${baseClasses} sm:grid-cols-2` : 'grid-cols-2'
      case 3:
        return responsive ? `${baseClasses} sm:grid-cols-2 lg:grid-cols-3` : 'grid-cols-3'
      case 4:
        return responsive ? `${baseClasses} sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4` : 'grid-cols-4'
      default:
        return responsive ? `${baseClasses} sm:grid-cols-2 lg:grid-cols-3` : 'grid-cols-3'
    }
  }

  const getThemeClasses = () => {
    // Professional theme only
    return {
      emptyState: 'bg-slate-50 text-slate-500',
      overlay: 'bg-slate-900 bg-opacity-80'
    }
  }

  const openLightbox = (index: number) => {
    if (enableLightbox) {
      setSelectedPhotoIndex(index)
      setIsLightboxOpen(true)
    }
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    setSelectedPhotoIndex(null)
  }

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (selectedPhotoIndex === null) return

    let newIndex = selectedPhotoIndex
    if (direction === 'prev') {
      newIndex = selectedPhotoIndex > 0 ? selectedPhotoIndex - 1 : photos.length - 1
    } else {
      newIndex = selectedPhotoIndex < photos.length - 1 ? selectedPhotoIndex + 1 : 0
    }
    setSelectedPhotoIndex(newIndex)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isLightboxOpen) return

      switch (event.key) {
        case 'ArrowLeft':
          navigatePhoto('prev')
          break
        case 'ArrowRight':
          navigatePhoto('next')
          break
        case 'Escape':
          closeLightbox()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, selectedPhotoIndex])

  const themeClasses = getThemeClasses()

  if (photos.length === 0) {
    return (
      <div className={`flex items-center justify-center h-48 ${themeClasses.emptyState} theme-border-radius ${className}`}>
        <div className="text-center">
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
          <p>No photos available</p>
        </div>
      </div>
    )
  }

  const selectedPhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null

  return (
    <>
      <div className={`grid ${getGridClasses()} gap-4 ${className}`}>
        {photos.map((photo, index) => (
          <div key={photo.id} className="group relative">
            <div
              className={`
                relative overflow-hidden theme-border-radius bg-gray-100 cursor-pointer
                ${enableLightbox ? 'hover:opacity-90 transition-opacity' : ''}
              `}
              onClick={() => openLightbox(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openLightbox(index)
                }
              }}
              aria-label={`View ${photo.alt} in lightbox`}
            >
              <Image
                src={photo.thumbnail || photo.src}
                alt={photo.alt}
                aspectRatio={aspectRatio}
                className="w-full h-full"
                responsive={responsive}
                sizes={photo.sizes}
                priority={priority && index < 3} // Prioritize first 3 images
                loading={priority && index < 3 ? 'eager' : 'lazy'}
              />
              
              {enableLightbox && (
                <div className={`absolute inset-0 ${themeClasses.overlay} opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center`}>
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
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
            
            {showCaptions && photo.caption && (
              <p className="mt-2 text-sm opacity-80">{photo.caption}</p>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {enableLightbox && selectedPhoto && (
        <Modal
          isOpen={isLightboxOpen}
          onClose={closeLightbox}
          size="xl"
          showCloseButton={true}
          className="bg-black bg-opacity-90"
        >
          <div className="relative">
            {/* Navigation buttons */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => navigatePhoto('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all"
                  aria-label="Previous photo"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => navigatePhoto('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all"
                  aria-label="Next photo"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Main image */}
            <div className="flex items-center justify-center max-h-[80vh]">
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                objectFit="contain"
                className="max-w-full max-h-full"
                showLoadingState={true}
                responsive={responsive}
                sizes={selectedPhoto.sizes || '100vw'}
                priority={true}
              />
            </div>

            {/* Photo info */}
            <div className="mt-4 text-center">
              {selectedPhoto.caption && (
                <p className="text-white text-lg mb-2">{selectedPhoto.caption}</p>
              )}
              <p className="text-gray-300 text-sm">
                {selectedPhotoIndex! + 1} of {photos.length}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}