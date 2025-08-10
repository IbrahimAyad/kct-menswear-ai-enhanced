'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
// import { R2Image } from '@/components/ui/R2Image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Product data using temp-images from public folder
const productRotations = {
  suits: [
    { color: 'Navy', image: '/placeholder-suit.jpg', fallbackColor: '#1e3a8a' },
    { color: 'Black', image: '/temp-images/black-suit.png', fallbackColor: '#000000' },
    { color: 'Light Grey', image: '/temp-images/light-grey-main.jpeg', fallbackColor: '#d1d5db' },
    { color: 'Sand', image: '/temp-images/sand-suit.jpg', fallbackColor: '#d4b896' },
    { color: 'Emerald', image: '/temp-images/emerlad-suit.jpg', fallbackColor: '#50c878' },
  ],
  shirts: [
    { color: 'White', image: '/temp-images/shirt1.jpg', fallbackColor: '#ffffff' },
    { color: 'Light Blue', image: '/temp-images/french-blue-main.webp', fallbackColor: '#93c5fd' },
    { color: 'Lavender', image: '/temp-images/Lavender-main.jpg', fallbackColor: '#ddd6fe' },
    { color: 'Rust', image: '/temp-images/rust-main.jpg', fallbackColor: '#b7410e' },
    { color: 'Classic', image: '/temp-images/shirt2.jpg', fallbackColor: '#f0f0f0' },
  ],
  ties: [
    { color: 'True Red', image: '/temp-images/True-Red-main.webp', fallbackColor: '#c00000' },
    { color: 'Turquoise', image: '/temp-images/Turquoise-mian.webp', fallbackColor: '#40e0d0' },
    { color: 'Classic', image: '/placeholder-tie.jpg', fallbackColor: '#4b5563' },
    { color: 'Pattern', image: '/temp-images/shirt4.jpg', fallbackColor: '#6b7280' },
    { color: 'Elegant', image: '/temp-images/shirt5.jpg', fallbackColor: '#1f2937' },
  ],
};

export function BuildYourLookShowcase() {
  const [currentIndices, setCurrentIndices] = useState({
    suits: 0,
    shirts: 0,
    ties: 0,
  });

  // Rotate products every 3 seconds with staggered timing
  useEffect(() => {
    const intervals = {
      suits: setInterval(() => {
        setCurrentIndices(prev => ({
          ...prev,
          suits: (prev.suits + 1) % productRotations.suits.length,
        }));
      }, 3000),
      shirts: setInterval(() => {
        setCurrentIndices(prev => ({
          ...prev,
          shirts: (prev.shirts + 1) % productRotations.shirts.length,
        }));
      }, 3500),
      ties: setInterval(() => {
        setCurrentIndices(prev => ({
          ...prev,
          ties: (prev.ties + 1) % productRotations.ties.length,
        }));
      }, 4000),
    };

    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, []);

  const productCategories = [
    {
      key: 'suits',
      title: 'Premium Suits',
      subtitle: 'Tailored to perfection',
      products: productRotations.suits,
      currentIndex: currentIndices.suits,
      priceRange: '$179 - $799',
      order: 1,
    },
    {
      key: 'shirts',
      title: 'Dress Shirts',
      subtitle: 'Crisp & refined',
      products: productRotations.shirts,
      currentIndex: currentIndices.shirts,
      priceRange: '$39 - $129',
      order: 2,
    },
    {
      key: 'ties',
      title: 'Designer Ties',
      subtitle: 'The perfect accent',
      products: productRotations.ties,
      currentIndex: currentIndices.ties,
      priceRange: '$24 - $89',
      order: 3,
    },
  ].sort((a, b) => a.order - b.order);

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-burgundy/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container-main relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-burgundy mb-6"
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-semibold tracking-widest uppercase">Create Your Look</span>
            <Sparkles className="h-5 w-5" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif mb-6"
          >
            Mix and Match
            <span className="text-burgundy block">Your Style</span>
          </motion.h2>
        </div>

        {/* Product Grid - Mobile: 3 columns for side-by-side display */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 mb-12">
          {productCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + categoryIndex * 0.1 }}
              className="group"
            >
              <Link href="/custom-suits">
                <div className="relative bg-white rounded-lg md:rounded-2xl shadow-md md:shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  {/* Image Container */}
                  <div className="relative h-[200px] sm:h-[300px] md:h-[400px] overflow-hidden bg-gray-100">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${category.key}-${category.currentIndex}`}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0"
                      >
                        <img
                          src={category.products[category.currentIndex].image}
                          alt={`${category.products[category.currentIndex].color} ${category.title}`}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.backgroundColor = category.products[category.currentIndex].fallbackColor;
                          }}
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Color indicator dots */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {category.products.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === category.currentIndex
                              ? 'bg-white w-8'
                              : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Hover CTA */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="bg-white text-black px-6 py-3 rounded-full font-semibold flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        Customize Now
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Product Info - Responsive sizing */}
                  <div className="p-2 sm:p-4 md:p-6">
                    <h3 className="text-sm sm:text-lg md:text-2xl font-serif mb-1 md:mb-2 group-hover:text-burgundy transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-1 md:mb-3 hidden sm:block">{category.subtitle}</p>
                    
                    {/* Current color display - Mobile optimized */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 md:mb-4">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-0">
                        <span className="text-[10px] sm:text-xs md:text-sm text-gray-500 hidden sm:inline">Current:</span>
                        <span className="text-xs sm:text-sm md:text-base font-medium text-gray-900">
                          {category.products[category.currentIndex].color}
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-burgundy">
                        {category.priceRange}
                      </span>
                    </div>

                    {/* Available colors preview - Mobile responsive */}
                    <div className="flex gap-1 sm:gap-2">
                      {category.products.map((product, index) => (
                        <div
                          key={index}
                          className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full border transition-all duration-300 ${
                            index === category.currentIndex
                              ? 'border-burgundy scale-110 border-2'
                              : 'border-gray-300'
                          }`}
                          style={{
                            backgroundColor: product.fallbackColor || '#9ca3af'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Link href="/custom-suits">
            <Button 
              size="lg" 
              className="bg-burgundy hover:bg-burgundy-700 text-white px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Start Building Your Look
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-4 text-gray-600">
            Free shipping on orders over $200 • Expert styling advice included
          </p>
        </motion.div>
      </div>
    </section>
  );
}