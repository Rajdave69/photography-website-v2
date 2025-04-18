
import React from 'react';
import { SortOption } from '@/types';
import { ListFilter, Star, Clock, Folder } from 'lucide-react';

interface SortControlsProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SortControls: React.FC<SortControlsProps> = ({ currentSort, onSortChange }) => {
  const sortOptions: Array<{ value: SortOption; label: string; icon: React.ReactNode }> = [
    { value: 'best', label: 'Best', icon: <Star className="h-4 w-4" /> },
    { value: 'new', label: 'New', icon: <Clock className="h-4 w-4" /> },
    { value: 'category', label: 'Category', icon: <Folder className="h-4 w-4" /> }
  ];

  return (
    <div className="flex items-center mb-6 overflow-x-auto pb-2">
      <div className="flex items-center mr-2 text-gallery-muted">
        <ListFilter className="h-4 w-4 mr-1" />
        <span className="text-sm">Sort:</span>
      </div>
      <div className="flex space-x-2">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className={`flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors animate-fade-in ${
              currentSort === option.value
                ? 'bg-gallery-accent text-white'
                : 'bg-gallery-card text-gallery-text hover:bg-gallery-card/70'
            }`}
          >
            <span className="mr-1.5">{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortControls;
