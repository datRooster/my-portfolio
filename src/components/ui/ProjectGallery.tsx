'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, Images } from 'lucide-react';
import ImageViewer from './ImageViewer';

interface ProjectGalleryProps {
  images: string[];
  projectTitle: string;
}

export default function ProjectGallery({ images, projectTitle }: ProjectGalleryProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const openViewer = (index: number) => {
    setInitialIndex(index);
    setViewerOpen(true);
  };

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Images className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Gallery</h2>
          <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
            {images.length} immagini
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="group relative h-48 rounded-xl overflow-hidden cursor-pointer bg-gray-800"
              onClick={() => openViewer(index)}
            >
              <Image
                src={image}
                alt={`${projectTitle} - Screenshot ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-all duration-300 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <div className="transform scale-0 group-hover:scale-100 transition-transform duration-200">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Image Counter */}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                {index + 1} / {images.length}
              </div>
              
              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-500/50 rounded-xl transition-colors duration-300" />
            </div>
          ))}
        </div>
        
        {/* Gallery Info */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            💡 Clicca su qualsiasi immagine per aprire il visualizzatore full-screen
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Usa le frecce per navigare, ESC per chiudere, +/- per zoom, R per ruotare
          </p>
        </div>
      </div>

      {/* Image Viewer */}
      <ImageViewer
        images={images}
        initialIndex={initialIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        projectTitle={projectTitle}
      />
    </>
  );
}