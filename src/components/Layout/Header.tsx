
import React from 'react';
import { Camera } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 bg-gallery-bg bg-opacity-95 backdrop-blur-sm border-b border-gallery-card py-4 px-4 md:px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Camera className="h-6 w-6 text-gallery-accent" />
          <h1 className="text-xl font-semibold">
            <span className="text-gallery-accent">Shutter</span>bug
          </h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="/" className="text-gallery-text hover:text-gallery-accent transition-colors">Gallery</a>
          <a href="#" className="text-gallery-text hover:text-gallery-accent transition-colors">About</a>
          <a href="#" className="text-gallery-text hover:text-gallery-accent transition-colors">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
