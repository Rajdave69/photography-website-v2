import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ImageData } from '@/types';

interface GalleryImageProps {
  image: ImageData;
  onClick: () => void;
}

// Define image size priorities (higher number = higher quality)
const IMAGE_SIZES = {
  thumbnail: { priority: 1, maxWidth: 400 },
  small: { priority: 2, maxWidth: 800 },
  medium: { priority: 3, maxWidth: 1280 },
  large: { priority: 4, maxWidth: 2048 },
  full: { priority: 5, maxWidth: Infinity }
} as const;

type ImageSizeKey = keyof typeof IMAGE_SIZES;

const GalleryImage: React.FC<GalleryImageProps> = ({ image, onClick }) => {
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(image.src);
  const [loadedSizePriority, setLoadedSizePriority] = useState<number>(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to determine required image size based on container width
  const getRequiredImageSize = (containerWidth: number): ImageSizeKey => {
    if (containerWidth <= 400) return 'thumbnail';
    if (containerWidth <= 600) return 'small';
    if (containerWidth <= 900) return 'medium';
    return 'large';
  };

  // Function to get the best available image source for a given size
  const getImageSrc = useCallback((requiredSize: ImageSizeKey): string => {
    if (!image.files) return image.src;

    // Try to get the exact size first
    if (image.files[requiredSize]) {
      return image.files[requiredSize];
    }

    // Fall back to the next best available size
    const sizeKeys = Object.keys(IMAGE_SIZES) as ImageSizeKey[];
    const sortedSizes = sizeKeys.sort((a, b) => IMAGE_SIZES[a].priority - IMAGE_SIZES[b].priority);

    for (const size of sortedSizes) {
      if (IMAGE_SIZES[size].priority >= IMAGE_SIZES[requiredSize].priority && image.files[size]) {
        return image.files[size];
      }
    }

    // If no suitable size found, return the original src
    return image.src;
  }, [image.files, image.src]);

  // Function to load a new image size if it's higher quality than current
  const maybeLoadHigherQuality = useCallback((requiredSize: ImageSizeKey) => {
    const requiredPriority = IMAGE_SIZES[requiredSize].priority;

    // Only load if the required quality is higher than what we currently have
    if (requiredPriority > loadedSizePriority) {
      const newSrc = getImageSrc(requiredSize);

      // Create a new image to preload
      const newImg = new Image();
      newImg.onload = () => {
        setCurrentImageSrc(newSrc);
        setLoadedSizePriority(requiredPriority);
      };
      newImg.src = newSrc;
    }
  }, [getImageSrc, loadedSizePriority]);

  // Resize observer to detect container size changes
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        const requiredSize = getRequiredImageSize(width);
        maybeLoadHigherQuality(requiredSize);
      }
    });

    resizeObserver.observe(containerRef.current);

    // Initial load
    const initialWidth = containerRef.current.offsetWidth || 300;
    const initialSize = getRequiredImageSize(initialWidth);
    maybeLoadHigherQuality(initialSize);

    return () => {
      resizeObserver.disconnect();
    };
  }, [maybeLoadHigherQuality]);

  // Also check on window resize for additional responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const requiredSize = getRequiredImageSize(width);
        maybeLoadHigherQuality(requiredSize);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [maybeLoadHigherQuality]);

  return (
    <div ref={containerRef} className="gallery-image-container animate-fade-in" onClick={onClick}>
      <picture>
        <img
          ref={imgRef}
          src={currentImageSrc}
          alt={image.alt}
          className="gallery-image"
          loading="lazy"
        />
      </picture>
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex flex-wrap mt-1">
          {image.tags.map((tag) => (
            <span key={tag} className="text-xs text-white opacity-80 mr-2">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryImage;
