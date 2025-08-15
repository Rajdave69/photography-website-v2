
import React from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import GalleryGrid from '@/components/Gallery/GalleryGrid';
import { imagesGenerated as images } from '@/data/images.generated';
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
    </div>
  );
};

export default Index;
