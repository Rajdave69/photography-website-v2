
import { ImageData } from '../types';

export const tags = [
  'astro',
  'landscape',
  'macro',
  'wildlife',
  'portrait',
  'street',
  'architecture',
  'sports',
  'travel',
  'nature',
  'city',
  'abstract'
];

export const images: ImageData[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    alt: 'Foggy mountain landscape at sunrise',
    width: 7372,
    height: 4392,
    tags: ['landscape', 'nature'],
    dateAdded: '2023-10-15',
    rating: 9
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    alt: 'Macro photo of circuit board',
    width: 5530,
    height: 3687,
    tags: ['macro', 'abstract'],
    dateAdded: '2023-08-20',
    rating: 8
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
    alt: 'Orange and white tabby cat',
    width: 7504,
    height: 10000,
    tags: ['wildlife', 'portrait'],
    dateAdded: '2023-12-01',
    rating: 10
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21',
    alt: 'Ocean wave at sunset',
    width: 3945,
    height: 5909,
    tags: ['landscape', 'nature'],
    dateAdded: '2023-11-05',
    rating: 8
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1498936178812-4b2e558d2937',
    alt: 'Bees in flight',
    width: 6000,
    height: 4000,
    tags: ['macro', 'wildlife'],
    dateAdded: '2024-01-10',
    rating: 7
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1518877593221-1f28583780b4',
    alt: 'Humpback whale breaching',
    width: 5103,
    height: 3402,
    tags: ['wildlife', 'nature'],
    dateAdded: '2024-02-15',
    rating: 9
  },
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1439886183900-e79ec0057170',
    alt: 'Two deer in misty woods',
    width: 2000,
    height: 1227,
    tags: ['wildlife', 'nature'],
    dateAdded: '2024-01-05',
    rating: 8
  },
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    alt: 'Woman using laptop on bed',
    width: 8256,
    height: 5504,
    tags: ['portrait', 'lifestyle'],
    dateAdded: '2024-03-01',
    rating: 7
  }
];
