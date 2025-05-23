
import React from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import GalleryGrid from '@/components/Gallery/GalleryGrid';
import { images } from '@/data/images';
import { Camera } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-gallery-accent bg-opacity-10 rounded-full mb-4">
            <Camera className="h-6 w-6 text-gallery-accent" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Raj's Photography</h1>
          <p className="text-gallery-muted max-w-2xl mx-auto">
            A collection of the best pictures I've taken :D
          </p>
        </div>
        
        <GalleryGrid images={images} />
      </main>
      
      <Footer />
      
      <style jsx global>{`
        /* Existing masonry grid styles remain for mobile */
        
        /* Desktop gallery grid - ensures images are displayed in rows from left to right */
        .desktop-gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          grid-gap: 16px;
          grid-auto-flow: dense;
        }
        
        .desktop-gallery-item {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          transition: transform 0.3s ease;
        }
        
        .desktop-gallery-item:hover {
          transform: translateY(-4px);
        }
        
        /* Make images with higher aspect ratios span more columns */
        .desktop-gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default Index;
