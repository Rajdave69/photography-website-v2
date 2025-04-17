
import React from 'react';
import { ImageData } from '@/types';

interface GalleryImageProps {
  image: ImageData;
  onClick: () => void;
}

const GalleryImage: React.FC<GalleryImageProps> = ({ image, onClick }) => {
  return (
    <div className="gallery-image-container animate-fade-in" onClick={onClick}>
      <img
        src={image.src}
        alt={image.alt}
        className="gallery-image"
        loading="lazy"
        width={image.width}
        height={image.height}
      />
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
