'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { R2Image } from '@/components/ui/R2Image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Product data with actual R2 CDN images
const productRotations = {
  suits: [
    { color: 'Navy', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg', fallbackColor: '#1e3a8a' },
    { color: 'Charcoal', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/dark-grey-two-main.jpg', fallbackColor: '#374151' },
    { color: 'Black', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/main.png', fallbackColor: '#000000' },
    { color: 'Light Grey', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/light-grey/light-grey-two-p-main.jpg', fallbackColor: '#d1d5db' },
    { color: 'Burgundy', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/two-peice-main-bur.jpg', fallbackColor: '#8b0000' },
  ],
  shirts: [
    { color: 'White', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/White-Dress-Shirt.jpg', fallbackColor: '#ffffff' },
    { color: 'Light Blue', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Sky-Blue-Dress-Shirt.jpg', fallbackColor: '#93c5fd' },
    { color: 'Pink', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Pink-Dress-Shirt.jpg', fallbackColor: '#ffc0cb' },
    { color: 'Black', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Black-Dress-Shirt.jpg', fallbackColor: '#000000' },
    { color: 'Lavender', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Lavender-Dress-Shirt.jpg', fallbackColor: '#ddd6fe' },
  ],
  ties: [
    { color: 'Burgundy', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/burgundy.jpg', fallbackColor: '#8b0000' },
    { color: 'Navy', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Navy.webp', fallbackColor: '#1e3a8a' },
    { color: 'Silver', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/silver.jpg', fallbackColor: '#e5e7eb' },
    { color: 'Gold', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/Gold.webp', fallbackColor: '#daa520' },
    { color: 'Black', image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/black.jpg', fallbackColor: '#000000' },
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
    },
    {
      key: 'shirts',
      title: 'Dress Shirts',
      subtitle: 'Crisp & refined',
      products: productRotations.shirts,
      currentIndex: currentIndices.shirts,
      priceRange: '$39 - $129',
    },
    {
      key: 'ties',
      title: 'Designer Ties',
      subtitle: 'The perfect accent',
      products: productRotations.ties,
      currentIndex: currentIndices.ties,
      priceRange: '$24 - $89',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-burgundy/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container-main relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
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
            Build Your Perfect
            <span className="text-burgundy block">Ensemble</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Mix and match our premium collection to create a look that's uniquely yours. 
            Click any item to start building your custom outfit.
          </motion.p>
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {productCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + categoryIndex * 0.1 }}
              className="group"
            >
              <Link href="/custom-suits">
                <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  {/* Image Container */}
                  <div className="relative h-[400px] overflow-hidden bg-gray-100">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${category.key}-${category.currentIndex}`}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0"
                      >
                        <R2Image
                          src={category.products[category.currentIndex].image}
                          alt={`${category.products[category.currentIndex].color} ${category.title}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          fallbackColor={category.products[category.currentIndex].fallbackColor}
                          priority={categoryIndex === 0}
                          quality={90}
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

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-2xl font-serif mb-2 group-hover:text-burgundy transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{category.subtitle}</p>
                    
                    {/* Current color display */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Current:</span>
                        <span className="font-medium text-gray-900">
                          {category.products[category.currentIndex].color}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-burgundy">
                        {category.priceRange}
                      </span>
                    </div>

                    {/* Available colors preview */}
                    <div className="flex gap-2">
                      {category.products.map((product, index) => (
                        <div
                          key={index}
                          className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                            index === category.currentIndex
                              ? 'border-burgundy scale-110'
                              : 'border-gray-300'
                          }`}
                          style={{
                            backgroundColor: 
                              product.color.toLowerCase() === 'white' ? '#ffffff' :
                              product.color.toLowerCase() === 'black' ? '#000000' :
                              product.color.toLowerCase() === 'navy' ? '#1e3a8a' :
                              product.color.toLowerCase() === 'charcoal' ? '#374151' :
                              product.color.toLowerCase() === 'light grey' ? '#d1d5db' :
                              product.color.toLowerCase() === 'burgundy' ? '#8b0000' :
                              product.color.toLowerCase() === 'light blue' ? '#93c5fd' :
                              product.color.toLowerCase() === 'pink' ? '#fbbf24' :
                              product.color.toLowerCase() === 'lavender' ? '#ddd6fe' :
                              product.color.toLowerCase() === 'silver' ? '#e5e7eb' :
                              product.color.toLowerCase() === 'gold' ? '#daa520' :
                              '#9ca3af'
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