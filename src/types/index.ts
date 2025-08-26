// Source data interface (for original images.ts)
export interface SourceImageData {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  tags: string[];
  dateAdded: string;
  rating: number;
  sourceFile?: string;
}

// Generated data interface (for processed images)
export interface ImageData {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  tags: string[];
  dateAdded: string;
  rating: number;
  files: Record<'full' | 'large' | 'medium' | 'small' | 'thumbnail', string>;
  cameraModel?: string;
  fStop?: string;
  exposureTime?: string;
  iso?: number;
  focalLength?: string;
  lensModel?: string;
  sourceFile?: string;
}

export type SortOption = 'best' | 'new' | 'category';