# Media Components

Components for displaying and managing images, galleries, and file previews.

## PhotoGallery

A responsive photo gallery with lightbox functionality and keyboard navigation.

### Usage

```tsx
import { PhotoGallery } from '@/components/ui';

<PhotoGallery
  images={productImages}
  columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
  onImageClick={openLightbox}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `GalleryImage[]` | `[]` | Array of images |
| `columns` | `ResponsiveColumns` | `{ xs: 1, sm: 2, md: 3 }` | Responsive column count |
| `gap` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Gap between images |
| `aspectRatio` | `'square' \| 'landscape' \| 'portrait'` | `'square'` | Image aspect ratio |
| `showLightbox` | `boolean` | `true` | Enable lightbox functionality |
| `onImageClick` | `(image: GalleryImage, index: number) => void` | - | Image click handler |
| `className` | `string` | - | Additional CSS classes |

### GalleryImage Interface

```tsx
interface GalleryImage {
  id: string;
  src: string;
  thumbnail?: string;
  alt: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
}
```

### Examples

```tsx
// Product gallery
const productImages = [
  {
    id: '1',
    src: '/jewelry/ring-001-full.jpg',
    thumbnail: '/jewelry/ring-001-thumb.jpg',
    alt: 'Gold Ring - Front View',
    title: 'Gold Ring',
    description: '18K Gold Ring with Diamond'
  },
  // ... more images
];

<PhotoGallery
  images={productImages}
  columns={{ xs: 1, sm: 2, lg: 3 }}
  aspectRatio="square"
  onImageClick={(image, index) => {
    setLightboxImage(image);
    setLightboxIndex(index);
    setShowLightbox(true);
  }}
/>

// Simple gallery without lightbox
<PhotoGallery
  images={thumbnails}
  columns={{ xs: 2, sm: 4, md: 6 }}
  gap="sm"
  showLightbox={false}
  onImageClick={selectImage}
/>
```

## MediaGallery

A mixed media gallery supporting images, videos, and documents.

### Usage

```tsx
import { MediaGallery } from '@/components/ui';

<MediaGallery
  items={mediaItems}
  layout="grid"
  onItemClick={handleMediaClick}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `MediaItem[]` | `[]` | Array of media items |
| `layout` | `'grid' \| 'list' \| 'masonry'` | `'grid'` | Gallery layout |
| `columns` | `ResponsiveColumns` | `{ xs: 1, sm: 2, md: 3 }` | Grid columns |
| `showPreview` | `boolean` | `true` | Show preview on hover |
| `allowUpload` | `boolean` | `false` | Enable file upload |
| `acceptedTypes` | `string[]` | `['image/*']` | Accepted file types |
| `onItemClick` | `(item: MediaItem) => void` | - | Item click handler |
| `onUpload` | `(files: File[]) => void` | - | Upload handler |
| `className` | `string` | - | Additional CSS classes |

### MediaItem Interface

```tsx
interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'document';
  src: string;
  thumbnail?: string;
  alt: string;
  title?: string;
  description?: string;
  size?: number;
  mimeType?: string;
  uploadedAt?: Date;
}
```

### Examples

```tsx
// Mixed media gallery
const mediaItems = [
  {
    id: '1',
    type: 'image',
    src: '/jewelry/ring-001.jpg',
    alt: 'Gold Ring',
    title: 'Product Photo'
  },
  {
    id: '2',
    type: 'video',
    src: '/jewelry/ring-001-video.mp4',
    thumbnail: '/jewelry/ring-001-video-thumb.jpg',
    alt: 'Ring Manufacturing Process',
    title: 'Manufacturing Video'
  },
  {
    id: '3',
    type: 'document',
    src: '/jewelry/ring-001-cert.pdf',
    alt: 'Certificate of Authenticity',
    title: 'Certificate',
    mimeType: 'application/pdf'
  }
];

<MediaGallery
  items={mediaItems}
  layout="grid"
  columns={{ xs: 1, sm: 2, lg: 3 }}
  allowUpload={true}
  acceptedTypes={['image/*', 'video/*', 'application/pdf']}
  onItemClick={openMediaViewer}
  onUpload={handleFileUpload}
/>

// List layout for documents
<MediaGallery
  items={documents}
  layout="list"
  showPreview={false}
  onItemClick={downloadDocument}
/>
```

## FilePreview

A component for previewing different file types with download functionality. Uses professional theme styling.

### Usage

```tsx
import { FilePreview } from '@/components/ui';

<FilePreview
  file={selectedFile}
  maxWidth={400}
  maxHeight={300}
  showFileName={true}
  showFileSize={true}
  showDownloadButton={true}
  onDownload={handleDownload}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `file` | `File \| string` | - | File object or URL string to preview |
| `maxWidth` | `number` | `400` | Maximum preview width in pixels |
| `maxHeight` | `number` | `300` | Maximum preview height in pixels |
| `showFileName` | `boolean` | `true` | Show file name in header |
| `showFileSize` | `boolean` | `true` | Show file size in header |
| `showDownloadButton` | `boolean` | `false` | Show download button |
| `onDownload` | `() => void` | - | Download handler |
| `className` | `string` | `''` | Additional CSS classes |

### Examples

```tsx
// Image preview
<FilePreview
  file={{
    id: '1',
    name: 'ring-design.jpg',
    src: '/uploads/ring-design.jpg',
    type: 'image',
    mimeType: 'image/jpeg'
  }}
  showDownload={true}
  onClose={closePreview}
/>

// PDF preview
<FilePreview
  file={{
    id: '2',
    name: 'certificate.pdf',
    src: '/documents/certificate.pdf',
    type: 'document',
    mimeType: 'application/pdf'
  }}
  maxHeight="90vh"
  onDownload={downloadFile}
/>

// Video preview
<FilePreview
  file={{
    id: '3',
    name: 'manufacturing-process.mp4',
    src: '/videos/manufacturing.mp4',
    type: 'video',
    mimeType: 'video/mp4'
  }}
  showFullscreen={true}
/>
```

## Image

An enhanced image component with responsive behavior and loading states.

### Usage

```tsx
import { Image } from '@/components/ui';

<Image
  src="/jewelry/ring-001.jpg"
  alt="Gold Ring"
  aspectRatio="square"
  priority={true}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Image source URL |
| `alt` | `string` | - | Alt text |
| `aspectRatio` | `'square' \| 'landscape' \| 'portrait' \| 'video'` | - | Aspect ratio |
| `objectFit` | `'cover' \| 'contain' \| 'fill' \| 'scale-down'` | `'cover'` | Object fit behavior |
| `priority` | `boolean` | `false` | Priority loading |
| `loading` | `'lazy' \| 'eager'` | `'lazy'` | Loading strategy |
| `placeholder` | `string` | - | Placeholder image |
| `sizes` | `string` | - | Responsive sizes |
| `onLoad` | `() => void` | - | Load handler |
| `onError` | `() => void` | - | Error handler |
| `className` | `string` | - | Additional CSS classes |

### Examples

```tsx
// Hero image with priority loading
<Image
  src="/hero-jewelry.jpg"
  alt="Luxury Jewelry Collection"
  aspectRatio="landscape"
  priority={true}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// Product thumbnail
<Image
  src={product.thumbnail}
  alt={product.name}
  aspectRatio="square"
  objectFit="cover"
  placeholder="/placeholder-jewelry.jpg"
  className="w-24 h-24 rounded-lg cursor-pointer"
  onClick={() => openProductGallery(product)}
/>

// Responsive gallery image
<Image
  src={image.src}
  alt={image.alt}
  aspectRatio="square"
  loading="lazy"
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
  onLoad={() => setImageLoaded(true)}
  onError={() => setImageError(true)}
/>
```

## Media Patterns

### Product Image Gallery

```tsx
function ProductImageGallery({ product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  return (
    <Stack spacing="md">
      {/* Main Image */}
      <Image
        src={product.images[selectedImage]?.src}
        alt={product.images[selectedImage]?.alt}
        aspectRatio="square"
        priority={selectedImage === 0}
        className="w-full rounded-lg cursor-pointer"
        onClick={() => setShowLightbox(true)}
      />

      {/* Thumbnail Gallery */}
      <Grid cols={4} gap="sm">
        {product.images.map((image, index) => (
          <Image
            key={image.id}
            src={image.thumbnail || image.src}
            alt={image.alt}
            aspectRatio="square"
            className={`cursor-pointer rounded border-2 transition-colors ${
              index === selectedImage 
                ? 'border-blue-500' 
                : 'border-transparent hover:border-gray-300'
            }`}
            onClick={() => setSelectedImage(index)}
          />
        ))}
      </Grid>

      {/* Lightbox */}
      {showLightbox && (
        <Modal
          isOpen={showLightbox}
          onClose={() => setShowLightbox(false)}
          size="full"
        >
          <PhotoGallery
            images={product.images}
            initialIndex={selectedImage}
            showLightbox={false}
            onImageClick={(_, index) => setSelectedImage(index)}
          />
        </Modal>
      )}
    </Stack>
  );
}
```

### File Upload with Preview

```tsx
function FileUploadWithPreview({ onFilesChange }) {
  const [files, setFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);

  const handleFilesChange = (newFiles) => {
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  return (
    <Stack spacing="md">
      <FileUpload
        label="Upload Files"
        accept="image/*,application/pdf,.doc,.docx"
        multiple
        onFilesChange={handleFilesChange}
      />

      {files.length > 0 && (
        <Card>
          <Card.Header>
            <h4>Uploaded Files ({files.length})</h4>
          </Card.Header>
          <Card.Body>
            <Grid cols={{ xs: 1, sm: 2, md: 3 }} gap="sm">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  {file.type.startsWith('image/') ? (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      aspectRatio="square"
                      className="cursor-pointer"
                      onClick={() => setPreviewFile(file)}
                    />
                  ) : (
                    <div 
                      className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
                      onClick={() => setPreviewFile(file)}
                    >
                      <DocumentIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  
                  <p className="text-xs text-gray-600 mt-1 truncate">
                    {file.name}
                  </p>
                </div>
              ))}
            </Grid>
          </Card.Body>
        </Card>
      )}

      {previewFile && (
        <Modal
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          title={previewFile.name}
          size="lg"
        >
          <FilePreview
            file={{
              id: 'preview',
              name: previewFile.name,
              src: URL.createObjectURL(previewFile),
              type: previewFile.type.startsWith('image/') ? 'image' : 'document',
              mimeType: previewFile.type
            }}
            onClose={() => setPreviewFile(null)}
          />
        </Modal>
      )}
    </Stack>
  );
}
```

### Media Library

```tsx
function MediaLibrary({ items, onSelect, selectedItems = [] }) {
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <Stack spacing="md">
      {/* Controls */}
      <Flex justify="between" align="center">
        <Select
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'All Media' },
            { value: 'image', label: 'Images' },
            { value: 'video', label: 'Videos' },
            { value: 'document', label: 'Documents' }
          ]}
        />
        
        <Flex gap="sm">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </Flex>
      </Flex>

      {/* Media Gallery */}
      <MediaGallery
        items={filteredItems}
        layout={viewMode}
        columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
        onItemClick={onSelect}
      />

      {/* Selection Summary */}
      {selectedItems.length > 0 && (
        <Card variant="outlined">
          <Card.Body>
            <p>{selectedItems.length} items selected</p>
          </Card.Body>
        </Card>
      )}
    </Stack>
  );
}
```

## Best Practices

### Performance

- Use appropriate image formats (WebP, AVIF when supported)
- Implement lazy loading for images below the fold
- Use `priority` loading for above-the-fold images
- Optimize image sizes with responsive `sizes` attribute

### Accessibility

- Always provide meaningful alt text for images
- Use proper ARIA labels for interactive elements
- Ensure keyboard navigation works in galleries
- Provide alternative text for decorative images

### User Experience

- Show loading states for slow-loading media
- Provide clear error states for failed loads
- Use consistent aspect ratios in galleries
- Enable keyboard navigation in lightboxes

### Mobile Optimization

- Use touch-friendly gallery navigation
- Optimize image sizes for mobile devices
- Consider bandwidth limitations
- Test swipe gestures on touch devices