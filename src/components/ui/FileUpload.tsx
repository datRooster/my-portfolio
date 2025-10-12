'use client';

import { useState, useRef } from 'react';
import { Upload, X, ImageIcon, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  placeholder?: string;
  error?: string;
}

export default function FileUpload({
  value,
  onChange,
  accept = 'image/jpeg,image/jpg,image/png,image/webp,image/gif',
  maxSize = 5,
  className = '',
  placeholder = 'Trascina un\'immagine qui o clicca per selezionarla',
  error
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setUploadError(null);
    
    // Validazione lato client
    if (file.size > maxSize * 1024 * 1024) {
      setUploadError(`File troppo grande. Massimo ${maxSize}MB`);
      return;
    }

    const allowedTypes = accept.split(',').map(type => type.trim());
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Tipo di file non supportato');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onChange(data.url);
        setUploadError(null);
      } else {
        setUploadError(data.error || 'Errore durante l\'upload');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Errore di rete durante l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayError = error || uploadError;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
          dragOver
            ? 'border-yellow-500 bg-yellow-500/10'
            : displayError
            ? 'border-red-500 bg-red-500/5'
            : 'border-gray-600 hover:border-gray-500'
        } ${
          uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />

        {/* Preview or Upload UI */}
        {value && !uploading ? (
          // Image Preview
          <div className="relative group">
            <div className="relative h-48 w-full rounded-lg overflow-hidden">
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized={value.includes('blob.vercel-storage.com')}
                onError={(e) => {
                  console.error('Image load error:', value);
                  // Fallback: prova a caricare come immagine normale
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                }}
              />
            </div>
            
            {/* Remove button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
            
            {/* Change overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-white text-center">
                <Upload size={24} className="mx-auto mb-2" />
                <p className="text-sm">Cambia immagine</p>
              </div>
            </div>
          </div>
        ) : (
          // Upload UI
          <div className="p-8 text-center">
            {uploading ? (
              <div className="space-y-3">
                <div className="animate-spin w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-400">Caricamento in corso...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className={`p-3 rounded-full ${
                    displayError ? 'bg-red-500/20' : 'bg-gray-700'
                  }`}>
                    {displayError ? (
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-300 mb-1">{placeholder}</p>
                  <p className="text-xs text-gray-500">
                    Formati supportati: JPEG, PNG, WebP, GIF (max {maxSize}MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {displayError && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle size={16} />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
}