import React, { useState, useEffect } from 'react';
import { ImageData, SortOption } from '@/types';
import GalleryImage from './GalleryImage';
import ImageLightbox from './ImageLightbox';
import SortControls from './SortControls';
import TagFilter from './TagFilter';
import { sortImages, filterImagesByTag, getUniqueTags } from '@/utils/imageUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface GalleryGridProps {
  images: ImageData[];
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('best');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filteredImages, setFilteredImages] = useState<ImageData[]>(images);
  const uniqueTags = getUniqueTags(images);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Apply filtering and sorting
    let result = filterImagesByTag(images, selectedTag);
    result = sortImages(result, sortOption);
    setFilteredImages(result);
  }, [images, selectedTag, sortOption]);

  // For desktop view, we want to ensure that higher rated images are at the top of the masonry grid
  // We'll render them in a simple order, which the CSS grid will arrange in rows
  // This ensures that the highest rated images appear at the top of the page
  // For mobile, we'll keep the original ordering
  const getOrderedImages = () => {
    // For mobile, just return the filtered images
    if (isMobile) {
      return filteredImages;
    }
    
    // For desktop, we already have the images sorted by rating thanks to the sortImages function
    // We just need to pass them directly to the grid, and the CSS grid will arrange them
    // in rows, with the highest rated images at the top
    return filteredImages;
  };

  return (
    <div>
      <div className="mb-6">
        <SortControls currentSort={sortOption} onSortChange={setSortOption} />
        {sortOption !== 'category' && (
          <TagFilter 
            tags={uniqueTags} 
            selectedTag={selectedTag} 
            onSelectTag={setSelectedTag} 
          />
        )}
        {sortOption === 'category' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mt-6 animate-fade-in">
            {uniqueTags.map((category) => {
              const categoryImages = images.filter(img => img.tags.includes(category));
              const imageCount = categoryImages.length;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedTag(category)}
                  className={`flex items-center justify-between h-auto p-4 border rounded-md hover:bg-gallery-accent/10 transition-colors duration-300 ${
                    selectedTag === category ? 'border-gallery-accent bg-gallery-accent/5' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-lg font-medium">#{category}</span>
                  </div>
                  <span className="text-gallery-muted text-sm">
                    {imageCount} {imageCount === 1 ? 'photo' : 'photos'}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {(sortOption !== 'category' || selectedTag) && filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gallery-muted">No images found with the selected filters.</p>
        </div>
      ) : (sortOption !== 'category' || selectedTag) ? (
        <div className={`${isMobile ? 'masonry-grid' : 'desktop-gallery-grid'}`}>
          {getOrderedImages().map((image) => (
            <div key={image.id} className={`${isMobile ? 'masonry-item' : 'desktop-gallery-item'}`}>
              <GalleryImage
                image={image}
                onClick={() => setSelectedImage(image)}
              />
            </div>
          ))}
        </div>
      ) : null}

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
