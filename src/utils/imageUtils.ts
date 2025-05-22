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
  // Extract the base filename from the URL
  // Parse the URL to get the filename without extension
  const urlParts = imageUrl.split('/');
  const filenameWithExtension = urlParts[urlParts.length - 1];
  
  // If it's already in our format, don't transform it again
  if (filenameWithExtension.includes('-thumbnail.webp') ||
      filenameWithExtension.includes('-small.webp') ||
      filenameWithExtension.includes('-medium.webp') ||
      filenameWithExtension.includes('-large.webp') ||
      filenameWithExtension.includes('-full.webp')) {
    return imageUrl;
  }
  
  // Get the filename without extension (handles both .jpg, .png, etc.)
  const filename = filenameWithExtension.split('.')[0];
  
  // For Unsplash or external images, we need to transform them to our local format
  if (imageUrl.includes('images.unsplash.com')) {
    // For Unsplash images, we'll extract the photo ID to use as our filename
    const photoId = imageUrl.split('/').pop()?.split('?')[0] || filename;
    return `https://rajtech.me/photography/images/${photoId}-${size}.webp`;
  }
  
  // For local or other images that don't match our format yet,
  // transform them to the expected format
  return `https://rajtech.me/photography/images/${filename}-${size}.webp`;
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
