# Photography Gallery with Prebuild Pipeline

This project includes an automated prebuild pipeline that processes source images and generates optimized WebP variants with EXIF metadata extraction.

## How It Works

### 1. Source Images
- Place your original `.jpg`, `.jpeg`, or `.png` files in `/assets/pictures/`
- Maintain your image metadata in `src/data/images.ts` (this file is never modified by the build process)

### 2. Prebuild Pipeline
The prebuild script automatically:
- Reads your source data from `src/data/images.ts`
- Matches images to source files in `/assets/pictures/`
- Generates WebP variants in 5 sizes: full, large (2048px), medium (1280px), small (800px), thumbnail (400px)
- Extracts EXIF metadata (camera, lens, settings)
- Creates optimized data file at `src/data/images.generated.ts`

### 3. Build Process
```bash
npm run build
```
This runs:
1. `npm run prebuild` - Processes images and generates data
2. `vite build` - Builds the application

## Setup Instructions

1. **Install dependencies:**
```bash
npm install
```

2. **Add your source images:**
- Create the `/assets/pictures/` directory
- Add your high-quality source images (.jpg, .jpeg, .png)

3. **Update your image data:**
- Edit `src/data/images.ts` with your image metadata
- Include: alt text, rating (0-10), tags, dateAdded
- Optionally include sourceFile field to help matching

4. **Run the build:**
```bash
npm run build
```

## File Structure

```
/assets/pictures/          # Your source images (not committed)
/public/generated/         # Generated WebP files (auto-created)
/src/data/images.ts        # Your editable image metadata
/src/data/images.generated.ts  # Auto-generated optimized data
/scripts/prebuild.js       # The prebuild pipeline script
```

## Image Matching Rules

The prebuild script matches your metadata to source files using:
1. `sourceFile` field (if specified)
2. `src` field filename
3. `alt` field text matching

## Generated Features

- **Responsive Images**: Automatic srcSet generation for optimal loading
- **EXIF Data**: Camera model, lens, exposure settings extracted automatically
- **Performance**: WebP format with quality 82 for optimal file sizes
- **Progressive Enhancement**: Falls back gracefully if files are missing

## Development

For development with hot reloading:
```bash
npm run dev
```

The generated data file includes placeholder data until you run the prebuild process.

---

## Original Lovable Project Info

**URL**: https://lovable.dev/projects/a3832f83-9772-4073-8e6e-5b6d51cd268f

This project was created with Lovable and enhanced with a custom prebuild pipeline for optimal image processing.