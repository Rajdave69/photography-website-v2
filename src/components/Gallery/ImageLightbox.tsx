import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Tag as TagIcon, Calendar, Star } from 'lucide-react';
import { ImageData } from '@/types';

interface ImageLightboxProps {
  image: ImageData;
  onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ image, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [isClosing, setIsClosing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent scrolling when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const newZoom = Math.max(prev - 0.25, 1);
      if (newZoom === 1) setPosition({ x: 0, y: 0 });
      return newZoom;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setStartPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className={`lightbox ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
      onClick={handleClose}
    >
      <div 
        className={`lightbox-content ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 z-10 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition-colors"
          onClick={handleClose}
        >
          <X className="h-6 w-6" />
        </button>
        
        <div 
          ref={containerRef}
          className="overflow-hidden rounded-lg cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ maxWidth: '90vw', maxHeight: '80vh' }}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="max-w-full max-h-[80vh] object-contain transition-transform"
            style={{ 
              transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
              transformOrigin: 'center',
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
          />
        </div>
        
        <div className="zoom-controls">
          <button 
            onClick={handleZoomOut} 
            className="text-white p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            disabled={zoomLevel <= 1}
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <button 
            onClick={handleZoomIn} 
            className="text-white p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
            disabled={zoomLevel >= 3}
          >
            <ZoomIn className="h-5 w-5" />
          </button>
        </div>
        
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 rounded p-2 text-white text-sm space-y-1 transition-opacity duration-300 opacity-30 hover:opacity-100">
          <div className="text-sm font-medium mb-1">{image.alt}</div>
          <div className="flex items-center text-xs opacity-80">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{new Date(image.dateAdded).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <Star className="h-3 w-3 mr-1" />
            <span>{image.rating}/10</span>
          </div>
          <div className="flex flex-wrap items-center text-xs mt-1">
            <TagIcon className="h-3 w-3 mr-1" />
            {image.tags.map((tag) => (
              <span key={tag} className="mr-2">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageLightbox;
