
import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gallery-card py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-gallery-muted text-sm">
              &copy; {new Date().getFullYear()} Shutterbug Gallery. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gallery-muted">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>and Lovable</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
