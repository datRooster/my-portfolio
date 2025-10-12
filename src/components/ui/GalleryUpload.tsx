'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Plus, ImageIcon } from 'lucide-react';

interface GalleryUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  placeholder?: string;
  maxImages?: number;
  maxSize?: number; // in MB
}

export default function GalleryUpload({
  value = [],
  onChange,
  placeholder = "Carica le immagini della gallery del progetto",
  maxImages = 10,
  maxSize = 5
}: GalleryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Validazione dimensione
    if (file.size > maxSize * 1024 * 1024) {
      return `File troppo grande. Massimo ${maxSize}MB`;
    }

    // Validazione tipo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return 'Tipo file non supportato. Usa: JPEG, PNG, WebP, GIF';
    }

    return null;
  };

  const handleFileSelect = async (files: File[]) => {
    if (value.length + files.length > maxImages) {
      setUploadError(`Massimo ${maxImages} immagini consentite`);
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const uploadPromises = files.map(async (file) => {
        // Validazione file
        const validationError = validateFile(file);
        if (validationError) {
          throw new Error(validationError);
        }

        // Upload
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Errore durante l\'upload');
        }

        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newGallery = [...value, ...uploadedUrls];
      onChange(newGallery);
      setUploadError(null);
    } catch (error) {
      console.error('Gallery upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Errore durante l\'upload');
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
    
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newGallery = value.filter((_, index) => index !== indexToRemove);
    onChange(newGallery);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newGallery = [...value];
    const [movedItem] = newGallery.splice(fromIndex, 1);
    newGallery.splice(toIndex, 0, movedItem);
    onChange(newGallery);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${dragOver 
            ? 'border-yellow-400 bg-yellow-400/10' 
            : 'border-gray-600 hover:border-gray-500'
          }
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-gray-800 rounded-full">
            {uploading ? (
              <div className="animate-spin w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full" />
            ) : (
              <ImageIcon size={24} className="text-gray-400" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-2">
              {uploading ? 'Caricamento in corso...' : 'Aggiungi Immagini alla Gallery'}
            </h3>
            <p className="text-gray-400 text-sm">
              {placeholder}
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Formati supportati: JPEG, PNG, WebP, GIF (max {maxSize}MB) - Max {maxImages} immagini
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-yellow-500">
            <Plus size={16} />
            <span className="text-sm font-medium">
              Trascina qui o clicca per selezionare ({value.length}/{maxImages})
            </span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {uploadError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400">
            <X size={16} />
            <span className="text-sm">{uploadError}</span>
          </div>
        </div>
      )}

      {/* Gallery Preview */}
      {value.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <ImageIcon size={16} />
            Gallery Preview ({value.length} immagini)
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {value.map((url, index) => (
              <div 
                key={`${url}-${index}`}
                className="relative group bg-gray-800 rounded-lg overflow-hidden aspect-square"
              >
                <Image
                  src={url}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                
                {/* Overlay con controlli */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute top-2 right-2 flex gap-1">
                    {/* Rimuovi immagine */}
                    <button
                      onClick={() => removeImage(index)}
                      className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                      title="Rimuovi immagine"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  
                  {/* Indicatore posizione */}
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                  </div>
                  
                  {/* Controlli di spostamento */}
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    {index > 0 && (
                      <button
                        onClick={() => moveImage(index, index - 1)}
                        className="p-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs"
                        title="Sposta a sinistra"
                      >
                        ←
                      </button>
                    )}
                    {index < value.length - 1 && (
                      <button
                        onClick={() => moveImage(index, index + 1)}
                        className="p-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs"
                        title="Sposta a destra"
                      >
                        →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Helper text */}
          <p className="text-xs text-gray-500">
            💡 Hover sulle immagini per rimuoverle o riordinarle. L'ordine qui mostrato sarà quello nella gallery pubblica.
          </p>
        </div>
      )}
    </div>
  );
}