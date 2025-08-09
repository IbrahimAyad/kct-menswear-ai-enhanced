'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, TrendingUp, Sparkles } from 'lucide-react';

interface EnsembleProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  savings: number;
  image: string;
  colors: string[];
  colorNames: string[];
  tags: string[];
  aiScore?: number;
  occasion: string;
  link: string;
}

const trendingEnsembles: EnsembleProduct[] = [
  {
    id: '1',
    name: 'Autumn Elegance',
    description: 'Warm earth tones perfect for rustic fall weddings',
    price: 229.99,
    originalPrice: 269.99,
    savings: 40,
    image: '/api/placeholder/400/600',
    colors: ['#8B4513', '#FFFFFF', '#654321'],
    colorNames: ['Brown', 'White', 'Brown'],
    tags: ['Fall', 'Trending'],
    occasion: 'wedding-party',
    link: '/occasions/wedding-party'
  },
  {
    id: '2',
    name: 'Burgundy Harvest',
    description: 'Bold burgundy suit with mustard accent',
    price: 229.99,
    originalPrice: 269.99,
    savings: 40,
    image: '/api/placeholder/400/600',
    colors: ['#800020', '#FFFFFF', '#FFDB58'],
    colorNames: ['Burgundy', 'White', 'Mustard'],
    tags: ['Fall', 'Trending'],
    aiScore: 95,
    occasion: 'wedding-party',
    link: '/occasions/wedding-party'
  },
  {
    id: '3',
    name: 'Metropolitan Black',
    description: 'Timeless black-tie elegance',
    price: 349.99,
    originalPrice: 449.99,
    savings: 100,
    image: '/api/placeholder/400/600',
    colors: ['#000000', '#FFFFFF', '#D4AF37'],
    colorNames: ['Black', 'White', 'Gold'],
    tags: ['Classic', 'Best Seller'],
    aiScore: 98,
    occasion: 'black-tie',
    link: '/occasions/black-tie'
  },
  {
    id: '4',
    name: 'Navy Excellence',
    description: 'Professional navy ensemble for business',
    price: 279.99,
    originalPrice: 329.99,
    savings: 50,
    image: '/api/placeholder/400/600',
    colors: ['#000080', '#FFFFFF', '#8B0000'],
    colorNames: ['Navy', 'White', 'Burgundy'],
    tags: ['Business', 'Trending'],
    aiScore: 92,
    occasion: 'business',
    link: '/occasions/business'
  },
  {
    id: '5',
    name: 'Charcoal Sophistication',
    description: 'Modern charcoal with contemporary styling',
    price: 299.99,
    originalPrice: 379.99,
    savings: 80,
    image: '/api/placeholder/400/600',
    colors: ['#36454F', '#E5E5E5', '#4B0082'],
    colorNames: ['Charcoal', 'Silver', 'Purple'],
    tags: ['Modern', 'AI Pick'],
    aiScore: 94,
    occasion: 'cocktail',
    link: '/occasions/cocktail'
  },
  {
    id: '6',
    name: 'Sage Wedding',
    description: 'Soft sage green perfect for garden weddings',
    price: 249.99,
    originalPrice: 299.99,
    savings: 50,
    image: '/api/placeholder/400/600',
    colors: ['#87A96B', '#FFFFFF', '#D2B48C'],
    colorNames: ['Sage', 'White', 'Tan'],
    tags: ['Spring', 'Wedding'],
    aiScore: 91,
    occasion: 'wedding-guest',
    link: '/occasions/wedding-guest'
  }
];

export default function TrendingEnsembles() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, trendingEnsembles.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
              Atelier AI - Trending Now
            </h2>
            <p className="text-gray-600">
              Curated ensembles powered by AI style intelligence
            </p>
          </div>
          
          {/* Navigation Arrows */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Products Carousel */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-out gap-4"
            style={{ 
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` 
            }}
          >
            {trendingEnsembles.map((ensemble) => (
              <Link
                key={ensemble.id}
                href={ensemble.link}
                className="min-w-full sm:min-w-[calc(50%-0.5rem)] md:min-w-[calc(33.333%-0.667rem)] lg:min-w-[calc(25%-0.75rem)] group"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
                    <Image
                      src={ensemble.image}
                      alt={ensemble.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Tags */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {ensemble.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`
                            px-3 py-1 rounded-full text-xs font-medium
                            ${tag === 'Trending' ? 'bg-red-500 text-white flex items-center gap-1' : ''}
                            ${tag === 'Fall' || tag === 'Spring' ? 'bg-orange-100 text-orange-800 border border-orange-200' : ''}
                            ${tag === 'AI Pick' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : ''}
                            ${tag === 'Best Seller' ? 'bg-gold text-black' : ''}
                            ${tag === 'Classic' || tag === 'Modern' || tag === 'Business' || tag === 'Wedding' ? 'bg-gray-100 text-gray-800 border border-gray-200' : ''}
                          `}
                        >
                          {tag === 'Trending' && <TrendingUp className="w-3 h-3" />}
                          {tag === 'AI Pick' && <Sparkles className="w-3 h-3" />}
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* AI Score Badge */}
                    {ensemble.aiScore && (
                      <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Pick {ensemble.aiScore}%
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Name */}
                    <h3 className="text-lg font-semibold text-black mb-1">
                      {ensemble.name}
                    </h3>

                    {/* Color Palette */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        {ensemble.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: color }}
                            title={ensemble.colorNames[index]}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {ensemble.colorNames.join(' • ')}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {ensemble.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-2xl font-bold text-black">
                          ${ensemble.price}
                        </span>
                        {ensemble.originalPrice > ensemble.price && (
                          <span className="ml-2 text-sm text-gray-400 line-through">
                            ${ensemble.originalPrice}
                          </span>
                        )}
                      </div>
                      {ensemble.savings > 0 && (
                        <span className="text-sm font-medium text-green-600">
                          Save ${ensemble.savings}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex justify-center mt-6 gap-2 md:hidden">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === index ? 'bg-black' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            href="/occasions"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Explore All Occasions
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}