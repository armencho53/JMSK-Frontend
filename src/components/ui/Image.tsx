import React, { useState, useRef, useEffect, useCallback } from 'react'
import { performanceMonitor } from '../../lib/performance'

interface ResponsiveImageSrc {
  src: string
  width?: number
  density?: number
}

interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes'> {
  src: string | ResponsiveImageSrc[]
  alt: string
  fallbackSrc?: string
  aspectRatio?: 'square' | '4:3' | '16:9' | '3:2' | 'auto'
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  loading?: 'lazy' | 'eager'
  showLoadingState?: boolean
  responsive?: boolean
  sizes?: string
  onLoad?: () => void
  onError?: () => void
  className?: string
  priority?: boolean // For above-the-fold images
  webpSrc?: string // WebP version for better compression
  placeholder?: string // Low-quality placeholder
  preload?: boolean // Preload the image
  quality?: number // Image quality (for optimization)
}

export function Image({
  src,
  alt,
  fallbackSrc,
  aspectRatio = 'auto',
  objectFit = 'cover',
  loading = 'lazy',
  showLoadingState = true,
  responsive = true,
  sizes,
  onLoad,
  onError,
  className = '',
  priority = false,
  webpSrc,
  placeholder,
  preload = false,
  quality = 85,
  ...props
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(typeof src === 'string' ? src : src[0]?.src || '')
  const [loadStartTime, setLoadStartTime] = useState<number | null>(null)
  const [supportsWebP, setSupportsWebP] = useState<boolean | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const pictureRef = useRef<HTMLPictureElement>(null)

  // Generate srcSet for responsive images
  const generateSrcSet = () => {
    if (typeof src === 'string' || !responsive) return undefined
    
    return src
      .map(item => {
        if (item.width) {
          return `${item.src} ${item.width}w`
        } else if (item.density) {
          return `${item.src} ${item.density}x`
        }
        return item.src
      })
      .join(', ')
  }

  const srcSet = generateSrcSet()

  // WebP support detection
  useEffect(() => {
    const webP = new window.Image()
    webP.onload = webP.onerror = () => {
      setSupportsWebP(webP.height === 2)
    }
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  }, [])

  useEffect(() => {
    const newSrc = typeof src === 'string' ? src : src[0]?.src || ''
    setCurrentSrc(newSrc)
    setHasError(false)
    setIsLoading(true)
  }, [src])

  // Preload image if requested
  useEffect(() => {
    if (preload && currentSrc) {
      const img = new window.Image()
      img.src = supportsWebP && webpSrc ? webpSrc : currentSrc
      if (srcSet) {
        img.srcset = srcSet
      }
    }
  }, [preload, currentSrc, webpSrc, supportsWebP, srcSet])

  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square'
      case '4:3':
        return 'aspect-[4/3]'
      case '16:9':
        return 'aspect-video'
      case '3:2':
        return 'aspect-[3/2]'
      case 'auto':
      default:
        return ''
    }
  }

  const getObjectFitClasses = () => {
    switch (objectFit) {
      case 'cover':
        return 'object-cover'
      case 'contain':
        return 'object-contain'
      case 'fill':
        return 'object-fill'
      case 'none':
        return 'object-none'
      case 'scale-down':
        return 'object-scale-down'
      default:
        return 'object-cover'
    }
  }

  const handleLoadStart = useCallback(() => {
    setLoadStartTime(performance.now())
    performanceMonitor.startTiming(`image-load-${currentSrc}`)
  }, [currentSrc])

  const handleLoad = useCallback(() => {
    setIsLoading(false)
    
    if (loadStartTime) {
      const loadTime = performance.now() - loadStartTime
      performanceMonitor.endTiming(`image-load-${currentSrc}`)
      
      // Log slow loading images
      if (loadTime > 2000) {
        console.warn(`Slow image load: ${currentSrc} took ${loadTime.toFixed(2)}ms`)
      }
    }
    
    onLoad?.()
  }, [currentSrc, loadStartTime, onLoad])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
    performanceMonitor.endTiming(`image-load-${currentSrc}`)
    
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setHasError(false)
      setIsLoading(true)
    } else {
      onError?.()
    }
  }, [currentSrc, fallbackSrc, onError])

  const containerClasses = `
    relative overflow-hidden bg-gray-100
    ${getAspectRatioClasses()}
    ${className}
  `

  const imageClasses = `
    w-full h-full transition-opacity duration-300
    ${getObjectFitClasses()}
    ${isLoading ? 'opacity-0' : 'opacity-100'}
  `

  return (
    <div className={containerClasses}>
      {/* Placeholder */}
      {placeholder && isLoading && (
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110 transition-opacity duration-300"
          style={{ backgroundImage: `url(${placeholder})` }}
        />
      )}

      {/* Loading state */}
      {isLoading && showLoadingState && !placeholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
          <svg
            className="animate-spin h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}

      {/* Error state */}
      {hasError && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
          <svg
            className="h-12 w-12 mb-2"
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
          <span className="text-sm">Failed to load image</span>
        </div>
      )}

      {/* Optimized picture element with WebP support */}
      <picture ref={pictureRef}>
        {/* WebP source */}
        {webpSrc && supportsWebP && (
          <source
            srcSet={webpSrc}
            sizes={sizes}
            type="image/webp"
          />
        )}
        
        {/* Fallback image */}
        <img
          ref={imgRef}
          src={currentSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : loading}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
          onError={handleError}
          className={imageClasses}
          role="img"
          {...props}
        />
      </picture>
    </div>
  )
}