import { ImageData, SortOption } from '../types';

// Function to get optimized image src based on screen width
export const getOptimizedImageSrc = (image: ImageData, screenWidth: number): string => {
  // In a real application, you would have different sizes of images
  // For this demo, we'll just return the original image
  return image.src;
};

// Function to get preview image URL
export const getPreviewImageUrl = (imageUrl: string): string => {
  // For Unsplash images, we can use their API to get smaller versions
  // Format: https://images.unsplash.com/photo-ID?param=value
  if (imageUrl.includes('images.unsplash.com')) {
    // Add width and quality parameters for preview
    const separator = imageUrl.includes('?') ? '&' : '?';
    return `${imageUrl}${separator}w=400&q=75&auto=format`;
  }
  
  // For other image sources, return the original image
  return imageUrl;
};

// Function to get full resolution image URL
export const getFullImageUrl = (imageUrl: string): string => {
  // For Unsplash images, ensure we get the full quality version
  if (imageUrl.includes('images.unsplash.com')) {
    // Strip any existing size parameters if they exist
    const baseUrl = imageUrl.split('?')[0];
    return `${baseUrl}?q=100&auto=format`;
  }
  
  return imageUrl;
};

// Function to sort images based on the selected sort option
export const sortImages = (images: ImageData[], sortOption: SortOption): ImageData[] => {
  switch (sortOption) {
    case 'best':
      return [...images].sort((a, b) => b.rating - a.rating);
    case 'new':
      return [...images].sort((a, b) => 
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      );
    case 'category':
      return [...images].sort((a, b) => {
        // Sort by first tag, then by rating
        const tagA = a.tags[0] || '';
        const tagB = b.tags[0] || '';
        return tagA.localeCompare(tagB) || b.rating - a.rating;
      });
    default:
      return images;
  }
};

// Function to filter images by selected tag
export const filterImagesByTag = (images: ImageData[], selectedTag: string | null): ImageData[] => {
  if (!selectedTag) return images;
  return images.filter(image => image.tags.includes(selectedTag));
};

// Function to get all unique tags from images
export const getUniqueTags = (images: ImageData[]): string[] => {
  const allTags = images.flatMap(image => image.tags);
  return Array.from(new Set(allTags)).sort();
};

// Function to group images by tag
export const groupImagesByTag = (images: ImageData[]): Record<string, ImageData[]> => {
  const tags = getUniqueTags(images);
  const result: Record<string, ImageData[]> = {};
  
  tags.forEach(tag => {
    result[tag] = images.filter(image => image.tags.includes(tag));
  });
  
  return result;
};
