export interface ImageData {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  tags: string[];
  dateAdded: string;
  rating: number;
}

export type SortOption = 'best' | 'new' | 'category';
