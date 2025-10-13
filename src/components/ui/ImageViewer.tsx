'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';

interface ImageViewerProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  projectTitle?: string;
}

export default function ImageViewer({
  images,
  initialIndex,
  isOpen,
  onClose,
  projectTitle = 'Gallery'
}: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
    setRotation(0);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case '+':
        case '=':
          setIsZoomed(true);
          break;
        case '-':
          setIsZoomed(false);
          break;
        case 'r':
        case 'R':
          setRotation(prev => prev + 90);
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
    setRotation(0);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
    setRotation(0);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(images[currentIndex]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectTitle}-image-${currentIndex + 1}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between p-4">
          <div className="text-white">
            <h3 className="text-lg font-semibold">{projectTitle}</h3>
            <p className="text-sm text-gray-300">
              {currentIndex + 1} di {images.length}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Zoom Toggle */}
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              title={isZoomed ? 'Zoom Out (-)' : 'Zoom In (+)'}
            >
              {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
            </button>
            
            {/* Rotate */}
            <button
              onClick={() => setRotation(prev => prev + 90)}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Rotate (R)"
            >
              <RotateCw size={20} />
            </button>
            
            {/* Download */}
            <button
              onClick={handleDownload}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Download"
            >
              <Download size={20} />
            </button>
            
            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors ml-2"
              title="Close (Esc)"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
            title="Previous (←)"
          >
            <ChevronLeft size={32} />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
            title="Next (→)"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      {/* Main Image */}
      <div 
        className="flex items-center justify-center h-full p-8 cursor-pointer"
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <div 
          className={`relative transition-all duration-300 ${
            isZoomed 
              ? 'w-full h-full' 
              : 'w-full h-full max-w-4xl max-h-[80vh]'
          }`}
          style={{ 
            transform: `rotate(${rotation}deg)`
          }}
        >
          <Image
            src={images[currentIndex]}
            alt={`${projectTitle} - Image ${currentIndex + 1}`}
            fill
            sizes={isZoomed ? '100vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw'}
            className={`${isZoomed ? 'object-cover cursor-zoom-out' : 'object-contain cursor-zoom-in'}`}
            priority
          />
        </div>
      </div>

      {/* Bottom Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-center gap-2 p-4 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsZoomed(false);
                  setRotation(0);
                }}
                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                  index === currentIndex 
                    ? 'border-yellow-500 scale-110' 
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Info */}
      <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs p-3 rounded-lg space-y-1">
        <div>← → Navigate</div>
        <div>ESC Close</div>
        <div>+/- Zoom</div>
        <div>R Rotate</div>
      </div>
    </div>
  );
}