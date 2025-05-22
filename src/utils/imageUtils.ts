import { ImageData, SortOption } from '../types';
import { useIsMobile } from '@/hooks/use-mobile';

// Image size constants to make the code more maintainable
export const IMAGE_SIZES = {
  THUMBNAIL: 'thumbnail', // 200px width (for very small preview)
  SMALL: 'small',      // 400px width (for grid on mobile)
  MEDIUM: 'medium',    // 800px width (for grid on desktop)
  LARGE: 'large',      // 1200px width (for lightbox on mobile)
  FULL: 'full'         // Original size (for lightbox on desktop/download)
};

// Function to construct WebP image URL with correct size
export const getSizedImageUrl = (imageUrl: string, size: string): string => {
  // For actual implementation with local WebP images, you would:
  // 1. Parse the original image path/name
  // 2. Construct path to the correct sized version
  // 3. Return the WebP version path
  
  // Example URL transformation for a real implementation with local images:
  // From: /images/photo-123.jpg
  // To: /images/photo-123-medium.webp
  
  // For Unsplash images, we can use their API to get resized versions
  if (imageUrl.includes('images.unsplash.com')) {
    const baseUrl = imageUrl.split('?')[0];
    const separator = '?';
    
    switch (size) {
      case IMAGE_SIZES.THUMBNAIL:
        return `${baseUrl}${separator}w=200&q=70&fm=webp&auto=format`;
      case IMAGE_SIZES.SMALL:
        return `${baseUrl}${separator}w=400&q=75&fm=webp&auto=format`;
      case IMAGE_SIZES.MEDIUM:
        return `${baseUrl}${separator}w=800&q=80&fm=webp&auto=format`;
      case IMAGE_SIZES.LARGE:
        return `${baseUrl}${separator}w=1200&q=85&fm=webp&auto=format`;
      case IMAGE_SIZES.FULL:
        return `${baseUrl}${separator}w=1800&q=90&fm=webp&auto=format`;
      default:
        return `${baseUrl}${separator}q=80&fm=webp&auto=format`;
    }
  }
  
  // For other image sources, return with the size appended (this is a placeholder)
  // In a real implementation, you would have actual different sized WebP images
  return imageUrl;
};

// Function to get optimized image src based on screen width
export const getOptimizedImageSrc = (image: ImageData, screenWidth: number): string => {
  let size = IMAGE_SIZES.MEDIUM;
  
  if (screenWidth < 640) {
    size = IMAGE_SIZES.SMALL;
  } else if (screenWidth >= 1920) {
    size = IMAGE_SIZES.LARGE;
  }
  
  return getSizedImageUrl(image.src, size);
};

// Function to get preview image URL for grid display
export const getPreviewImageUrl = (imageUrl: string, isMobile = false): string => {
  return getSizedImageUrl(imageUrl, isMobile ? IMAGE_SIZES.SMALL : IMAGE_SIZES.MEDIUM);
};

// Function to get full resolution image URL for lightbox
export const getFullImageUrl = (imageUrl: string, isMobile = false): string => {
  return getSizedImageUrl(imageUrl, isMobile ? IMAGE_SIZES.LARGE : IMAGE_SIZES.FULL);
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
