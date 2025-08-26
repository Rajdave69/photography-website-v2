#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync } from 'fs';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Configuration
const ASSETS_DIR = join(rootDir, 'assets', 'pictures');
const OUTPUT_DIR = join(rootDir, 'public', 'generated');
const GENERATED_FILE = join(rootDir, 'src', 'data', 'images.generated.ts');
const MANIFEST_FILE = join(OUTPUT_DIR, 'manifest.json');

const SIZES = {
  full: null, // Original size
  large: 2048,
  medium: 1280,
  small: 800,
  thumbnail: 400
};

const WEBP_QUALITY = 82;

async function main() {
  console.log('🚀 Starting prebuild pipeline...');

  // Clean and create output directory
  if (existsSync(OUTPUT_DIR)) {
    rmSync(OUTPUT_DIR, { recursive: true });
  }
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Read source data
  const { images: sourceImages, tags } = await loadSourceData();
  console.log(`📖 Found ${sourceImages.length} images in source data`);

  // Check if we have sharp available for image processing
  let sharp = null;
  let exifr = null;
  
  try {
    sharp = (await import('sharp')).default;
    exifr = (await import('exifr')).default;
    console.log('📸 Image processing libraries loaded');
  } catch (error) {
    console.warn('⚠️  Image processing libraries not available, generating placeholder data only');
  }

  // Find source files
  const sourceFiles = findSourceFiles();
  console.log(`📁 Found ${sourceFiles.length} source files in ${ASSETS_DIR}`);

  // Match images to source files
  const matchedImages = matchImagesToSources(sourceImages, sourceFiles);
  console.log(`✅ Matched ${matchedImages.length} images to source files`);

  // Sort by rating (desc) then by source filename (asc)
  matchedImages.sort((a, b) => {
    const ratingDiff = b.rating - a.rating;
    if (ratingDiff === 0) {
      return (a.sourceFile || a.src).localeCompare(b.sourceFile || b.src);
    }
    return ratingDiff;
  });

  // Process images
  const processedImages = [];
  for (let i = 0; i < matchedImages.length; i++) {
    const image = matchedImages[i];
    const id = (i + 1).toString();
    
    console.log(`🖼️  Processing image ${id}/${matchedImages.length}: ${image.sourceFile || image.src}`);
    
    try {
      let files = {};
      let exifData = {};
      
      if (sharp && image.sourceFile && existsSync(join(ASSETS_DIR, image.sourceFile))) {
        // Generate WebP variants
        files = await generateWebPVariants(image.sourceFile, id, sharp);
        
        // Extract EXIF data
        if (exifr) {
          exifData = await extractExifData(image.sourceFile, exifr);
        }
      } else {
        // Generate placeholder file references
        files = generatePlaceholderFiles(id);
      }
      
      // Create processed image object
      processedImages.push({
        id,
        src: files.medium || image.src, // Default to medium variant or original
        alt: image.alt,
        tags: image.tags,
        dateAdded: image.dateAdded,
        rating: image.rating,
        files,
        sourceFile: image.sourceFile,
        ...exifData
      });
    } catch (error) {
      console.warn(`⚠️  Error processing ${image.sourceFile || image.src}:`, error.message);
      
      // Add image with fallback data
      processedImages.push({
        id,
        src: image.src,
        alt: image.alt,
        tags: image.tags,
        dateAdded: image.dateAdded,
        rating: image.rating,
        files: generatePlaceholderFiles(id),
        sourceFile: image.sourceFile
      });
    }
  }

  // Generate TypeScript file
  await generateTypeScriptFile(processedImages, tags);
  
  // Generate JSON manifest
  await generateManifest(processedImages, tags);

  console.log(`✨ Prebuild complete! Generated ${processedImages.length} processed images`);
}

async function loadSourceData() {
  try {
    // Try multiple approaches to load the source data
    let sourceData = null;
    
    // Try loading JS version first
    try {
      const jsPath = join(rootDir, 'src', 'data', 'images.ts');
      if (existsSync(jsPath)) {
        const sourceModule = await import(`file://${jsPath}`);
        sourceData = {
          images: sourceModule.images || [],
          tags: sourceModule.tags || []
        };
      }
    } catch (error) {
      console.log('No sample images found, trying main data file...');
    }
    
    // Fallback to parsing TypeScript file
    if (!sourceData) {
      const tsPath = join(rootDir, 'src', 'data', 'images.ts');
      if (existsSync(tsPath)) {
        const fileContent = readFileSync(tsPath, 'utf8');
        
        // Simple regex-based extraction
        const tagsMatch = fileContent.match(/export const tags\s*=\s*(\[[\s\S]*?\]);/);
        const imagesMatch = fileContent.match(/export const images[^=]*=\s*(\[[\s\S]*?\]);/);
        
        if (tagsMatch && imagesMatch) {
          try {
            const tags = eval(tagsMatch[1]);
            const images = eval(imagesMatch[1]);
            sourceData = { images, tags };
          } catch (evalError) {
            console.warn('Failed to parse arrays:', evalError.message);
          }
        }
      }
    }
    
    if (!sourceData) {
      console.warn('⚠️  No source data found, using empty arrays');
      sourceData = { images: [], tags: [] };
    }
    
    return sourceData;
  } catch (error) {
    console.error('❌ Failed to load source data:', error.message);
    return { images: [], tags: [] };
  }
}

function findSourceFiles() {
  if (!existsSync(ASSETS_DIR)) {
    console.warn(`⚠️  Assets directory not found: ${ASSETS_DIR}`);
    mkdirSync(ASSETS_DIR, { recursive: true });
    return [];
  }

  return readdirSync(ASSETS_DIR)
    .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
    .map(file => join(ASSETS_DIR, file));
}

function matchImagesToSources(sourceImages, sourceFiles) {
  const matched = [];
  const sourceFileNames = sourceFiles.map(f => basename(f));

  for (const image of sourceImages) {
    let sourceFile = null;

    // Try sourceFile field first
    if (image.sourceFile) {
      const fullPath = join(ASSETS_DIR, image.sourceFile);
      if (existsSync(fullPath)) {
        sourceFile = image.sourceFile;
      }
    }

    // Try src field
    if (!sourceFile && image.src) {
      const srcName = basename(image.src, extname(image.src));
      const found = sourceFileNames.find(f => {
        const name = basename(f, extname(f));
        return name === srcName;
      });
      if (found) sourceFile = found;
    }

    // Try alt field
    if (!sourceFile && image.alt) {
      const altName = image.alt.replace(/\s+/g, '_');
      const found = sourceFileNames.find(f => {
        const name = basename(f, extname(f));
        return name === altName || name.includes(altName) || altName.includes(name);
      });
      if (found) sourceFile = found;
    }

    // Add image regardless of whether we found a source file
    matched.push({
      ...image,
      sourceFile: sourceFile || null
    });
    
    if (!sourceFile) {
      console.warn(`⚠️  No source file found for image: ${image.alt || image.src || 'unknown'}`);
    }
  }

  return matched;
}

async function generateWebPVariants(sourceFileName, id, sharp) {
  const sourcePath = join(ASSETS_DIR, sourceFileName);
  const files = {};

  try {
    const image = sharp(sourcePath);
    const metadata = await image.metadata();

    for (const [sizeName, maxWidth] of Object.entries(SIZES)) {
      const outputPath = join(OUTPUT_DIR, `${id}-${sizeName}.webp`);
      
      let resizer = image.clone();
      
      if (maxWidth && metadata.width > maxWidth) {
        resizer = resizer.resize(maxWidth, null, {
          withoutEnlargement: true,
          fit: 'inside'
        });
      }
      
      await resizer
        .webp({ quality: WEBP_QUALITY })
        .toFile(outputPath);
      
      files[sizeName] = `/generated/${id}-${sizeName}.webp`;
    }
  } catch (error) {
    console.error(`❌ Failed to generate WebP variants for ${sourceFileName}:`, error.message);
    throw error;
  }

  return files;
}

function generatePlaceholderFiles(id) {
  const files = {};
  for (const sizeName of Object.keys(SIZES)) {
    files[sizeName] = `/generated/${id}-${sizeName}.webp`;
  }
  return files;
}

async function extractExifData(sourceFileName, exifr) {
  const sourcePath = join(ASSETS_DIR, sourceFileName);
  
  try {
    const exif = await exifr.parse(sourcePath, {
      pick: ['Make', 'Model', 'FNumber', 'ExposureTime', 'ISO', 'FocalLength', 'LensModel']
    });

    if (!exif) return {};

    return {
      cameraModel: exif.Make && exif.Model ? `${exif.Make} ${exif.Model}` : exif.Model,
      fStop: exif.FNumber ? `f/${exif.FNumber}` : undefined,
      exposureTime: exif.ExposureTime ? formatExposureTime(exif.ExposureTime) : undefined,
      iso: exif.ISO,
      focalLength: exif.FocalLength ? `${Math.round(exif.FocalLength)}mm` : undefined,
      lensModel: exif.LensModel
    };
  } catch (error) {
    console.warn(`⚠️  Could not extract EXIF from ${sourceFileName}:`, error.message);
    return {};
  }
}

function formatExposureTime(exposureTime) {
  if (exposureTime >= 1) {
    return `${exposureTime}s`;
  } else {
    return `1/${Math.round(1 / exposureTime)}`;
  }
}

async function generateTypeScriptFile(images, tags) {
  const content = `// This file is auto-generated by the prebuild script. Do not edit manually.

import { ImageData } from '../types';

export const tagsGenerated = ${JSON.stringify(tags, null, 2)};

export const imagesGenerated: ImageData[] = ${JSON.stringify(images, null, 2)};
`;

  writeFileSync(GENERATED_FILE, content, 'utf8');
  console.log(`📝 Generated TypeScript file: ${GENERATED_FILE}`);
}

async function generateManifest(images, tags) {
  const manifest = {
    generated: new Date().toISOString(),
    images,
    tags
  };

  writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`📝 Generated manifest file: ${MANIFEST_FILE}`);
}

// Run the script
main().catch(error => {
  console.error('❌ Prebuild failed:', error);
  process.exit(1);
});