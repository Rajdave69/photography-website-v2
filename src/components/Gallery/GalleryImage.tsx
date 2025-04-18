
import React from 'react';
import { ImageData } from '@/types';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface GalleryImageProps {
  image: ImageData;
  onClick: () => void;
}

const GalleryImage: React.FC<GalleryImageProps> = ({ image, onClick }) => {
  // Calculate aspect ratio from image dimensions
  const aspectRatio = image.width / image.height;
  
  return (
    <div className="gallery-image-container animate-fade-in" onClick={onClick}>
      <AspectRatio ratio={aspectRatio} className="overflow-hidden">
        <img
          src={image.src}
          alt={image.alt}
          className="gallery-image"
          loading="lazy"
          width={image.width}
          height={image.height}
        />
      </AspectRatio>
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
