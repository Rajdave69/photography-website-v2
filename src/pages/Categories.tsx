
import React from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { useNavigate } from 'react-router-dom';
import { getUniqueTags } from '@/utils/imageUtils';
import { images } from '@/data/images';
import { Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {categories.map((category) => {
            const categoryImages = images.filter(img => img.tags.includes(category));
            const imageCount = categoryImages.length;

            return (
              <Button
                key={category}
                onClick={() => navigate(`/?tag=${category}`)}
                variant="outline"
                className="flex flex-col h-auto p-6 hover:bg-gallery-accent/10 transition-colors duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-gallery-accent/20 flex items-center justify-center mb-4">
                  <Image className="h-8 w-8 text-gallery-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-1">
                  #{category}
                </h3>
                <p className="text-gallery-muted text-sm">
                  {imageCount} {imageCount === 1 ? 'photo' : 'photos'}
                </p>
              </Button>
            );
          })}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Categories;
