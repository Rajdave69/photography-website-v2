// Source data interface (for original images.ts)
export interface SourceImageData {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  tags: string[];
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
  rating: number;
  files: Record<'full' | 'large' | 'medium' | 'small' | 'thumbnail', string>;
  cameraModel?: string;
  fStop?: string;
  exposureTime?: string;
  iso?: number;
  focalLength?: string;
  lensModel?: string;
  dateTaken?: string; // ISO string from EXIF DateTimeOriginal, CreateDate, or DateTime
  sourceFile?: string;
}

export type SortOption = 'best' | 'new' | 'category';