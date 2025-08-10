'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface VisualFilter {
  id: string;
  name: string;
  image: string;
  type: 'category' | 'occasion' | 'style';
  count?: number;
  description?: string;
  gradient?: string;
  formality?: string;
}

interface UnifiedVisualFilterProps {
  filters?: VisualFilter[];
  selectedFilters: string[];
  onFilterToggle: (filterId: string) => void;
  onClearAll?: () => void;
  title?: string;
  subtitle?: string;
}

// Default unified filters - categories and occasions together
const defaultFilters: VisualFilter[] = [
  // Categories
  {
    id: 'suits',
    name: 'Suits',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
    type: 'category',
    count: 89
  },
  {
    id: 'shirts',
    name: 'Shirts',
    image: 'https://images.unsplash.com/photo-1603252109303-2751ce8939db?w=800&q=80',
    type: 'category',
    count: 124
  },
  {
    id: 'pants',
    name: 'Pants',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
    type: 'category',
    count: 76
  },
  {
    id: 'knitwear',
    name: 'Knitwear',
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80',
    type: 'category',
    count: 45
  },
  {
    id: 'jackets',
    name: 'Jackets',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    type: 'category',
    count: 58
  },
  {
    id: 'accessories',
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=800&q=80',
    type: 'category',
    count: 93
  },
  {
    id: 'shoes',
    name: 'Shoes',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80',
    type: 'category',
    count: 67
  },
  {
    id: 'bundles',
    name: 'Complete Looks',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    type: 'category',
    count: 66
  },
  // Occasions
  {
    id: 'wedding',
    name: 'Wedding Guest',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    type: 'occasion',
    gradient: 'from-rose-600/40 to-pink-600/40',
    formality: 'Formal'
  },
  {
    id: 'business',
    name: 'Business',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    type: 'occasion',
    gradient: 'from-slate-700/40 to-slate-900/40',
    formality: 'Formal'
  },
  {
    id: 'black-tie',
    name: 'Black Tie',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
    type: 'occasion',
    gradient: 'from-gray-900/40 to-black/40',
    formality: 'Black-Tie'
  },
  {
    id: 'prom',
    name: 'Prom 2025',
    image: 'https://images.unsplash.com/photo-1519073454383-324977baf09d?w=800&q=80',
    type: 'occasion',
    gradient: 'from-purple-600/40 to-blue-600/40',
    formality: 'Formal'
  },
  {
    id: 'cocktail',
    name: 'Cocktail Party',
    image: 'https://images.unsplash.com/photo-1490195117352-aa267f47f2d9?w=800&q=80',
    type: 'occasion',
    gradient: 'from-amber-600/40 to-orange-600/40',
    formality: 'Semi-Formal'
  },
  {
    id: 'date-night',
    name: 'Date Night',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
    type: 'occasion',
    gradient: 'from-red-600/40 to-rose-600/40',
    formality: 'Casual'
  }
];

export default function UnifiedVisualFilter({
  filters = defaultFilters,
  selectedFilters,
  onFilterToggle,
  onClearAll,
  title = 'Shop by Style',
  subtitle = 'Click images to filter products'
}: UnifiedVisualFilterProps) {
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);

  const isSelected = (filterId: string) => selectedFilters.includes(filterId);

  // Split filters by type for optional separate sections
  const categoryFilters = filters.filter(f => f.type === 'category');
  const occasionFilters = filters.filter(f => f.type === 'occasion');

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-serif text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
        </div>
        {selectedFilters.length > 0 && onClearAll && (
          <button
            onClick={onClearAll}
            className="text-sm text-burgundy-600 hover:text-burgundy-700 flex items-center gap-1"
          >
            Clear filters ({selectedFilters.length})
          </button>
        )}
      </div>

      {/* Unified Grid - All filters in one consistent size */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {filters.map((filter, index) => (
          <motion.div
            key={filter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className={cn(
              "relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group",
              isSelected(filter.id) ? "ring-2 ring-burgundy-600" : "",
              "transition-all duration-300 hover:scale-105"
            )}
            onClick={() => onFilterToggle(filter.id)}
            onMouseEnter={() => setHoveredFilter(filter.id)}
            onMouseLeave={() => setHoveredFilter(null)}
          >
            {/* Background Image */}
            <Image
              src={filter.image}
              alt={filter.name}
              fill
              className={cn(
                "object-cover transition-all duration-500",
                isSelected(filter.id) && "brightness-90"
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
            />
            
            {/* Gradient Overlay */}
            <div 
              className={cn(
                "absolute inset-0 transition-opacity duration-300",
                filter.gradient 
                  ? `bg-gradient-to-t ${filter.gradient}`
                  : "bg-gradient-to-t from-black/60 via-transparent to-transparent"
              )} 
            />
            
            {/* Selection Indicator */}
            {isSelected(filter.id) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-7 h-7 bg-burgundy-600 rounded-full flex items-center justify-center shadow-lg z-10"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
            
            {/* Content Overlay */}
            <div className="absolute inset-0 p-3 flex flex-col justify-end">
              <div className="text-white">
                <h3 className="text-sm font-semibold leading-tight">{filter.name}</h3>
                {filter.formality && (
                  <p className="text-xs text-white/80 mt-0.5">{filter.formality}</p>
                )}
                {filter.count !== undefined && (
                  <p className="text-xs text-white/70 mt-0.5">{filter.count} items</p>
                )}
              </div>
            </div>
            
            {/* Hover Overlay */}
            <div className={cn(
              "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300",
              hoveredFilter === filter.id ? "opacity-100" : "opacity-0"
            )}>
              <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                <span className="text-xs font-medium text-black">
                  {isSelected(filter.id) ? 'Remove' : 'Select'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}