import { useState, useEffect } from 'react';

// Hook: how many columns are visible (match Tailwind default breakpoints)
export function useColumnsCount() {
  const [count, setCount] = useState(1);
  
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      // Tailwind defaults: sm=640, md=768, lg=1024, xl=1280
      // Using md:columns-3 lg:columns-4 from the CSS
      setCount(w >= 1024 ? 4 : w >= 768 ? 3 : w >= 640 ? 2 : 1);
    };
    
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  
  return count;
}