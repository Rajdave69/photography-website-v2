
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
  
  return (
    <div className="gallery-image-container animate-fade-in" onClick={onClick}>
      <picture>
        <img
          src={image.src}
          alt={image.alt}
          className="gallery-image"
          loading="lazy"
          srcSet={image.files ? `
            ${image.files.small} 800w,
            ${image.files.medium} 1280w,
            ${image.files.large} 2048w
          ` : undefined}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
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
