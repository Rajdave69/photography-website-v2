
import React, { useState, useEffect } from 'react';
import { ImageData, SortOption } from '@/types';
import GalleryImage from './GalleryImage';
import ImageLightbox from './ImageLightbox';
import SortControls from './SortControls';
import TagFilter from './TagFilter';
import { sortImages, filterImagesByTag, getUniqueTags } from '@/utils/imageUtils';

interface GalleryGridProps {
  images: ImageData[];
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('best');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filteredImages, setFilteredImages] = useState<ImageData[]>(images);
  const uniqueTags = getUniqueTags(images);

  useEffect(() => {
    // Apply filtering and sorting
    let result = filterImagesByTag(images, selectedTag);
    result = sortImages(result, sortOption);
    setFilteredImages(result);
  }, [images, selectedTag, sortOption]);

  return (
    <div>
      <div className="mb-6">
        <SortControls currentSort={sortOption} onSortChange={setSortOption} />
        <TagFilter 
          tags={uniqueTags} 
          selectedTag={selectedTag} 
          onSelectTag={setSelectedTag} 
        />
      </div>

      {filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gallery-muted">No images found with the selected filters.</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {filteredImages.map((image) => (
            <GalleryImage
              key={image.id}
              image={image}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
      )}

      {selectedImage && (
        <ImageLightbox 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default GalleryGrid;
