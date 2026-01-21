import React, { useState, useRef, useCallback } from 'react';

export interface FileUploadProps {
  onFileSelect?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  preview?: boolean;
}

export function FileUpload({
  onFileSelect,
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  label,
  error,
  helperText,
  disabled = false,
  className = '',
  preview = true
}: FileUploadProps) {
  // Using professional theme styling directly
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Professional theme styling
  const themeClasses = {
    container: 'relative',
    dropzone: [
      'border-2 border-dashed border-slate-300 rounded-lg',
      'bg-white transition-all duration-200',
      'flex flex-col items-center justify-center p-8 cursor-pointer',
      isDragOver ? 'border-slate-500 bg-slate-50' : '',
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-500 hover:bg-slate-50'
    ].filter(Boolean).join(' '),
    icon: 'text-slate-500 mb-4',
    text: 'text-slate-900',
    subtext: 'text-slate-500 text-sm mt-2',
    fileList: 'mt-4 space-y-2',
    fileItem: 'flex items-center justify-between p-2 bg-slate-50 rounded-lg',
    fileName: 'text-slate-900 text-sm truncate',
    removeButton: 'text-red-600 hover:text-orange-600 ml-2'
  };

  const validateFiles = (files: File[]): File[] => {
    return files.filter(file => {
      if (maxSize && file.size > maxSize) {
        console.warn(`File ${file.name} exceeds maximum size of ${maxSize} bytes`);
        return false;
      }
      return true;
    });
  };

  const handleFileSelect = useCallback((files: File[]) => {
    const validFiles = validateFiles(files);
    setSelectedFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
    if (onFileSelect) {
      onFileSelect(multiple ? [...selectedFiles, ...validFiles] : validFiles);
    }
  }, [multiple, maxSize, onFileSelect, selectedFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files);
  }, [disabled, handleFileSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFileSelect(files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    if (onFileSelect) {
      onFileSelect(newFiles);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`${themeClasses.container} ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}
        </label>
      )}

      <div
        className={themeClasses.dropzone}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <svg
          className={`w-12 h-12 ${themeClasses.icon}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        
        <div className={themeClasses.text}>
          <span className="font-medium">Click to upload</span> or drag and drop
        </div>
        
        <div className={themeClasses.subtext}>
          {accept && <div>Accepted formats: {accept}</div>}
          <div>Maximum file size: {formatFileSize(maxSize)}</div>
          {multiple && <div>Multiple files allowed</div>}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
        />
      </div>

      {preview && selectedFiles.length > 0 && (
        <div className={themeClasses.fileList}>
          {selectedFiles.map((file, index) => (
            <div key={index} className={themeClasses.fileItem}>
              <div className="flex-1 min-w-0">
                <div className={themeClasses.fileName}>
                  {file.name}
                </div>
                <div className="text-xs opacity-60">
                  {formatFileSize(file.size)}
                </div>
              </div>
              <button
                type="button"
                className={themeClasses.removeButton}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm mt-1 text-red-600">{error}</p>}
      {helperText && !error && <p className="text-sm mt-1 opacity-60">{helperText}</p>}
    </div>
  );
}