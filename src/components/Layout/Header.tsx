
import React from 'react';
import { Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 bg-gallery-bg bg-opacity-95 backdrop-blur-sm border-b border-gallery-card py-4 px-4 md:px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Camera className="h-6 w-6 text-gallery-accent" />
          <h1 className="text-xl font-semibold">
            <span className="text-gallery-accent">Raj's </span>Photography
          </h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          {/*<Link to="/" className="text-gallery-text hover:text-gallery-accent transition-colors">Gallery</Link>*/}
          {/*<Link to="/about" className="text-gallery-text hover:text-gallery-accent transition-colors">About</Link>*/}
          {/*<Link to="/contact" className="text-gallery-text hover:text-gallery-accent transition-colors">Contact</Link>*/}
        </nav>
      </div>
    </header>
  );
};

export default Header;
