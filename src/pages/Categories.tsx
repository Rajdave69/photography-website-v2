
import React from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { useNavigate } from 'react-router-dom';
import { getUniqueTags } from '@/utils/imageUtils';
import { images } from '@/data/images';
import { Camera, Image } from 'lucide-react';

const Categories = () => {
  const navigate = useNavigate();
  const categories = getUniqueTags(images);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-gallery-accent bg-opacity-10 rounded-full mb-4">
            <Image className="h-6 w-6 text-gallery-accent" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Photo Categories</h1>
          <p className="text-gallery-muted max-w-2xl mx-auto">
            Browse my photography collection by category.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const categoryImages = images.filter(img => img.tags.includes(category));
            const previewImage = categoryImages[0]?.src;
            const imageCount = categoryImages.length;

            return (
              <button
                key={category}
                onClick={() => navigate(`/?tag=${category}`)}
                className="group relative overflow-hidden rounded-lg aspect-video hover:scale-105 transition-transform duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10" />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt={category}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    #{category}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {imageCount} {imageCount === 1 ? 'photo' : 'photos'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Categories;
