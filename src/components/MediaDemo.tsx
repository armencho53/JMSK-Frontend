import { useState } from 'react'
import { 
  PhotoGallery, 
  MediaGallery, 
  FilePreview, 
  Image,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  FileUpload
} from './ui'

// Sample data for demonstrations
const samplePhotos = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    alt: 'Gold jewelry pieces',
    thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
    caption: 'Elegant gold jewelry collection',
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800',
    alt: 'Diamond ring',
    thumbnail: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400',
    caption: 'Premium diamond engagement ring'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800',
    alt: 'Silver necklace',
    thumbnail: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400',
    caption: 'Handcrafted silver necklace'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800',
    alt: 'Pearl earrings',
    thumbnail: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400',
    caption: 'Classic pearl drop earrings'
  }
]

const sampleMediaItems = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    type: 'image' as const,
    alt: 'Gold jewelry pieces',
    thumbnail: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
    caption: 'Product catalog image'
  },
  {
    id: 2,
    src: '/sample-document.pdf',
    type: 'document' as const,
    fileName: 'Manufacturing_Process.pdf',
    fileSize: 2048576,
    caption: 'Manufacturing guidelines'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800',
    type: 'image' as const,
    alt: 'Diamond ring',
    thumbnail: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400'
  },
  {
    id: 4,
    src: '/sample-video.mp4',
    type: 'video' as const,
    fileName: 'jewelry_showcase.mp4',
    fileSize: 15728640,
    caption: 'Product showcase video'
  }
]

export function MediaDemo() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [aspectRatio, setAspectRatio] = useState<'square' | '4:3' | '16:9' | '3:2'>('square')
  const [columns, setColumns] = useState<2 | 3 | 4>(3)

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files)
  }

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Image & Media Components Demo</h1>
        <p className="opacity-70">Showcasing responsive image handling, photo galleries, and file preview components</p>
      </div>

      {/* Single Image Component */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Image Component</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Responsive Image with Loading States</h4>
              <Image
                src={[
                  { src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', width: 400 },
                  { src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800', width: 800 },
                  { src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200', width: 1200 }
                ]}
                alt="Responsive jewelry image"
                aspectRatio="16:9"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full"
                showLoadingState={true}
                priority={true}
              />
            </div>
            <div>
              <h4 className="font-medium mb-3">Square Aspect Ratio</h4>
              <Image
                src="https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400"
                alt="Diamond ring"
                aspectRatio="square"
                className="w-full"
                fallbackSrc="https://via.placeholder.com/400x400?text=Fallback"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Photo Gallery Component</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Aspect Ratio:</label>
              <select 
                value={aspectRatio} 
                onChange={(e) => setAspectRatio(e.target.value as any)}
                className="px-3 py-1 border theme-border-radius text-sm"
              >
                <option value="square">Square</option>
                <option value="4:3">4:3</option>
                <option value="16:9">16:9</option>
                <option value="3:2">3:2</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Columns:</label>
              <select 
                value={columns} 
                onChange={(e) => setColumns(Number(e.target.value) as any)}
                className="px-3 py-1 border theme-border-radius text-sm"
              >
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>
          </div>
          
          <PhotoGallery
            photos={samplePhotos}
            columns={columns}
            aspectRatio={aspectRatio}
            showCaptions={true}
            enableLightbox={true}
            responsive={true}
            priority={true}
          />
        </CardContent>
      </Card>

      {/* Media Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Media Gallery Component</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm opacity-70">
            Supports images, documents, and videos with file type detection and previews
          </p>
          <MediaGallery
            items={sampleMediaItems}
            columns={3}
            aspectRatio="square"
            showCaptions={true}
            enableLightbox={true}
            showFileInfo={true}
          />
        </CardContent>
      </Card>

      {/* File Preview */}
      <Card>
        <CardHeader>
          <CardTitle>File Preview Component</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Image Preview</h4>
              <FilePreview
                file="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400"
                showFileName={true}
                showFileSize={false}
                showDownloadButton={true}
                maxWidth={300}
                maxHeight={200}
              />
            </div>
            <div>
              <h4 className="font-medium mb-3">Document Preview</h4>
              <div className="border theme-border-radius p-4 text-center opacity-60">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm">PDF Document Preview</p>
                <p className="text-xs mt-1">Manufacturing_Guidelines.pdf</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload with Preview */}
      <Card>
        <CardHeader>
          <CardTitle>File Upload with Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FileUpload
              onFileSelect={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx"
              multiple={true}
              maxSize={10 * 1024 * 1024} // 10MB
              label="Upload product images or documents"
              helperText="Supports images, PDFs, and documents up to 10MB"
              preview={true}
            />
            
            {selectedFiles.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">File Previews</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedFiles.map((file, index) => (
                    <FilePreview
                      key={index}
                      file={file}
                      showFileName={true}
                      showFileSize={true}
                      showDownloadButton={false}
                      maxWidth={200}
                      maxHeight={150}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Responsive Behavior Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Responsive Behavior</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm opacity-70">
            All components automatically adapt to different screen sizes with touch-friendly interfaces on mobile devices.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {samplePhotos.slice(0, 4).map((photo) => (
              <div key={photo.id} className="text-center">
                <Image
                  src={photo.thumbnail || photo.src}
                  alt={photo.alt}
                  aspectRatio="square"
                  className="w-full mb-2"
                  responsive={true}
                />
                <p className="text-xs opacity-70">{photo.caption}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}