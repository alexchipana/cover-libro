import { useRef, useCallback, useState } from 'react';
import { BookConfig } from '@/types';

interface ImageUploaderProps {
  label: string;
  accept?: string;
  preview?: string | null;
  onImageSelect: (file: File | null) => void;
}

export function ImageUploader({
  label,
  accept = 'image/*',
  preview,
  onImageSelect,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      onImageSelect(file);
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDragOver(false);
      const file = event.dataTransfer.files[0] || null;
      if (file && file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onImageSelect]);

  return (
    <div
      className={`upload-area ${preview ? 'has-image' : ''} ${dragOver ? 'drag-over' : ''}`}
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {preview ? (
        <>
          <img src={preview} alt={label} className="upload-preview" />
          <button
            onClick={handleClear}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            ✕
          </button>
        </>
      ) : (
        <>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📁</div>
          <p className="upload-text">{label}</p>
          <p className="upload-text" style={{ fontSize: '10px', marginTop: '4px' }}>
            PNG, JPG, WEBP
          </p>
        </>
      )}
    </div>
  );
}
