import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Tag as TagIcon, Calendar, Star, Camera, Aperture, Timer, Zap, Focus, Ruler, Plus, Minus } from 'lucide-react';
import { ImageData } from '@/types';
import { getFullImageUrl, getSizedImageUrl } from '@/utils/imageUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ImageLightboxProps {
  image: ImageData;
  onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ image, onClose }) => {
  const isMobile = useIsMobile();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(true);
  const [isDetailsHovered, setIsDetailsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isMobileDetailsVisible, setIsMobileDetailsVisible] = useState(false);
  const [isPCDetailsVisible, setIsPCDetailsVisible] = useState(false);
  const [isPCDetailsClosing, setIsPCDetailsClosing] = useState(false);
  const [isMobileDetailsClosing, setIsMobileDetailsClosing] = useState(false);

  // More specific mobile portrait detection
  const isMobilePortrait = isMobile && window.innerHeight > window.innerWidth;

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Always get the highest quality image for lightbox (full size)
  const fullSizeSrc = image.files?.full || getSizedImageUrl(image.src, 'full');

  // Opening animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpening(false);
    }, 50); // Small delay to ensure the component is mounted

    return () => clearTimeout(timer);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    }, 300); // Match this with the CSS animation duration
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

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handlePCDetailsToggle = () => {
    if (isPCDetailsVisible) {
      setIsPCDetailsClosing(true);
      setTimeout(() => {
        setIsPCDetailsVisible(false);
        setIsPCDetailsClosing(false);
      }, 300);
    } else {
      setIsPCDetailsVisible(true);
    }
  };

  const handleMobileDetailsToggle = () => {
    if (isMobileDetailsVisible) {
      setIsMobileDetailsClosing(true);
      setTimeout(() => {
        setIsMobileDetailsVisible(false);
        setIsMobileDetailsClosing(false);
      }, 300);
    } else {
      setIsMobileDetailsVisible(true);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black transition-all duration-300 flex items-center justify-center p-4 ${
        isClosing ? 'bg-opacity-0' : isOpening ? 'bg-opacity-0' : 'bg-opacity-95'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`relative flex flex-col items-center max-w-full max-h-full transition-all duration-500 ease-out ${
          isClosing 
            ? 'scale-90 opacity-0 translate-y-4' 
            : isOpening 
            ? 'scale-75 opacity-0 -translate-y-8' 
            : 'scale-100 opacity-100 translate-y-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className={`absolute top-4 right-4 z-10 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition-all duration-300 ${
            isOpening ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
          }`}
          onClick={handleClose}
        >
          <X className="h-6 w-6" />
        </button>
        
        {!isImageLoaded && (
          <div className="flex items-center justify-center w-full h-[50vh] text-white bg-black bg-opacity-50 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gallery-accent"></div>
          </div>
        )}
        
        {/* Image Container */}
        <div
          ref={containerRef}
          className={`relative overflow-hidden rounded-lg cursor-move transition-all duration-500 ${
            isOpening ? 'scale-90 opacity-60' : 'scale-100 opacity-100'
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ maxWidth: '90vw', maxHeight: '70vh' }}
        >
          <picture>
            <img
              src={fullSizeSrc}
              alt={image.alt}
              className={`max-w-full max-h-[70vh] object-contain transition-all duration-500 ${
                !isImageLoaded ? 'opacity-0 scale-105' : isOpening ? 'opacity-70 scale-105' : 'opacity-100 scale-100'
              }`}
              style={{
                transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
                transformOrigin: 'center',
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
              onLoad={handleImageLoad}
            />
          </picture>

          {/* PC Details Box - positioned within image container, toggle-based */}
          {!isMobilePortrait && isPCDetailsVisible && (
            <div
              className={`absolute bottom-3 left-3 bg-black bg-opacity-90 rounded-lg p-4 text-white text-sm space-y-3 max-w-sm animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-300 ${
                isOpening ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
              }`}
              style={{
                zIndex: 50,
                maxWidth: 'calc(100% - 1.5rem)'
              }}
            >
              <div className="flex items-center text-xs opacity-90 mb-2">
                <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>{new Date(image.dateAdded).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <Star className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>{image.rating}/10</span>
              </div>

              {/* Camera Details - PC Layout */}
              {(image.cameraModel || image.lensModel || image.fStop || image.exposureTime || image.iso || image.focalLength) && (
                <div className="space-y-2 border-t border-white border-opacity-20 pt-3">
                  {image.cameraModel && (
                    <div className="flex items-center text-xs opacity-80">
                      <Camera className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="font-medium truncate">{image.cameraModel}</span>
                    </div>
                  )}
                  {image.lensModel && (
                    <div className="flex items-center text-xs opacity-80">
                      <Focus className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="truncate">{image.lensModel}</span>
                    </div>
                  )}

                  {/* Technical specs in a compact grid for PC */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {image.fStop && (
                      <div className="flex flex-col items-center text-xs opacity-80">
                        <Aperture className="h-3 w-3 mb-1" />
                        <span className="text-[10px] text-gray-300">Aperture</span>
                        <span className="font-medium text-[11px]">{image.fStop}</span>
                      </div>
                    )}
                    {image.exposureTime && (
                      <div className="flex flex-col items-center text-xs opacity-80">
                        <Timer className="h-3 w-3 mb-1" />
                        <span className="text-[10px] text-gray-300">Shutter</span>
                        <span className="font-medium text-[11px]">{image.exposureTime}</span>
                      </div>
                    )}
                    {image.iso && (
                      <div className="flex flex-col items-center text-xs opacity-80">
                        <Zap className="h-3 w-3 mb-1" />
                        <span className="text-[10px] text-gray-300">ISO</span>
                        <span className="font-medium text-[11px]">{image.iso}</span>
                      </div>
                    )}
                  </div>

                  {image.focalLength && (
                    <div className="flex items-center justify-center text-xs opacity-80 pt-2">
                      <Ruler className="h-3 w-3 mr-2" />
                      <span className="text-gray-300 mr-1">Focal Length:</span>
                      <span className="font-medium">{image.focalLength}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center text-xs border-t border-white border-opacity-20 pt-3">
                <TagIcon className="h-3 w-3 mr-2 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  {image.tags.map((tag) => (
                    <span key={tag} className="bg-white bg-opacity-10 px-2 py-1 rounded text-[10px]">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls Bar - Below Image */}
        <div className={`flex justify-between items-center w-full max-w-[90vw] mt-4 px-2 transition-all duration-300 delay-200 ${
          isOpening ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}>
          {/* Details Toggle Buttons */}
          <div className="flex items-center">
            {/* Mobile Details Toggle (Left) */}
            {isMobilePortrait && (
              <button
                className="text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMobileDetailsToggle();
                }}
              >
                {isMobileDetailsVisible ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </button>
            )}

            {/* PC Details Toggle (Left) */}
            {!isMobilePortrait && (
              <button
                className="text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePCDetailsToggle();
                }}
              >
                {isPCDetailsVisible ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </button>
            )}
          </div>

          {/* Zoom Controls (Right) */}
          <div className="flex space-x-2 bg-black bg-opacity-50 rounded-md p-1">
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
        </div>

        {/* Mobile Portrait Details Panel - ONLY on mobile portrait, appears below image */}
        {isMobilePortrait && isMobileDetailsVisible && (
          <div className="w-full max-w-[90vw] mt-4 bg-black bg-opacity-90 rounded-lg p-4 text-white text-sm space-y-3 transition-all duration-300 animate-in slide-in-from-bottom-2">
            <div className="flex items-center justify-center text-xs opacity-90 mb-2">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{new Date(image.dateAdded).toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <Star className="h-3 w-3 mr-1" />
              <span>{image.rating}/10</span>
            </div>

            {/* Camera Details - Mobile Layout */}
            {(image.cameraModel || image.lensModel || image.fStop || image.exposureTime || image.iso || image.focalLength) && (
              <div className="space-y-2 border-t border-white border-opacity-20 pt-3">
                {image.cameraModel && (
                  <div className="flex items-center justify-center text-xs opacity-80">
                    <Camera className="h-3 w-3 mr-2" />
                    <span className="font-medium">{image.cameraModel}</span>
                  </div>
                )}
                {image.lensModel && (
                  <div className="flex items-center justify-center text-xs opacity-80">
                    <Focus className="h-3 w-3 mr-2" />
                    <span>{image.lensModel}</span>
                  </div>
                )}

                {/* Technical specs in a grid for mobile */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {image.fStop && (
                    <div className="flex flex-col items-center text-xs opacity-80">
                      <Aperture className="h-4 w-4 mb-1" />
                      <span className="text-[10px] text-gray-300">Aperture</span>
                      <span className="font-medium">{image.fStop}</span>
                    </div>
                  )}
                  {image.exposureTime && (
                    <div className="flex flex-col items-center text-xs opacity-80">
                      <Timer className="h-4 w-4 mb-1" />
                      <span className="text-[10px] text-gray-300">Shutter</span>
                      <span className="font-medium">{image.exposureTime}</span>
                    </div>
                  )}
                  {image.iso && (
                    <div className="flex flex-col items-center text-xs opacity-80">
                      <Zap className="h-4 w-4 mb-1" />
                      <span className="text-[10px] text-gray-300">ISO</span>
                      <span className="font-medium">{image.iso}</span>
                    </div>
                  )}
                </div>

                {image.focalLength && (
                  <div className="flex items-center justify-center text-xs opacity-80 pt-2">
                    <Ruler className="h-3 w-3 mr-2" />
                    <span className="text-gray-300 mr-1">Focal Length:</span>
                    <span className="font-medium">{image.focalLength}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center text-xs border-t border-white border-opacity-20 pt-3">
              <TagIcon className="h-3 w-3 mr-2" />
              <div className="flex flex-wrap gap-2">
                {image.tags.map((tag) => (
                  <span key={tag} className="bg-white bg-opacity-10 px-2 py-1 rounded text-[10px]">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageLightbox;
