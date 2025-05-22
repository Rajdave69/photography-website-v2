
import React from 'react';
import { ImageData } from '@/types';
import { getPreviewImageUrl } from '@/utils/imageUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface GalleryImageProps {
  image: ImageData;
  onClick: () => void;
}

const GalleryImage: React.FC<GalleryImageProps> = ({ image, onClick }) => {
  const isMobile = useIsMobile();
  // Get optimized preview version of the image for the grid based on device
  const previewSrc = getPreviewImageUrl(image.src, isMobile);
  
  return (
    <div className="gallery-image-container animate-fade-in" onClick={onClick}>
      <picture>
        {/* WebP format with appropriate size */}
        <img
          src={previewSrc}
          alt={image.alt}
          className="gallery-image"
          loading="lazy"
          width={image.width}
          height={image.height}
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
