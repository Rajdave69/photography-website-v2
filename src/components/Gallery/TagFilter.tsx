
import React from 'react';
import { X } from 'lucide-react';

interface TagFilterProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTag, onSelectTag }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gallery-muted">Filter by tag</h3>
        {selectedTag && (
          <button
            onClick={() => onSelectTag(null)}
            className="flex items-center text-xs text-gallery-accent hover:text-gallery-text transition-colors"
          >
            <X className="w-3 h-3 mr-1" />
            Clear filter
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelectTag(tag === selectedTag ? null : tag)}
            className={`gallery-tag ${
              tag === selectedTag ? 'bg-gallery-accent' : 'bg-gallery-card hover:bg-gallery-accent/70'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;
