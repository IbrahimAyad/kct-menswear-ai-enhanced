'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shirt, Package, Footprints, Watch, ShoppingBag, RefreshCw } from 'lucide-react';
import { Product, ProductCategory } from '@/lib/types';

interface OutfitItem {
  category: ProductCategory;
  product: Product | null;
}

interface PersonalizedOutfitBuilderProps {
  products: Product[];
  onAddOutfitToCart: (outfit: Product[]) => void;
}

const categoryIcons = {
  suits: Package,
  shirts: Shirt,
  shoes: Footprints,
  accessories: Watch,
};

export function PersonalizedOutfitBuilder({ products, onAddOutfitToCart }: PersonalizedOutfitBuilderProps) {
  const [outfit, setOutfit] = useState<Record<ProductCategory, Product | null>>({
    suits: null,
    shirts: null,
    shoes: null,
    accessories: null,
  });

  const [activeCategory, setActiveCategory] = useState<ProductCategory>('suits');

  const categoryProducts = products.filter(p => p.category === activeCategory);

  const selectProduct = (product: Product) => {
    setOutfit(prev => ({
      ...prev,
      [activeCategory]: product,
    }));
  };

  const randomizeCategory = (category: ProductCategory) => {
    const categoryItems = products.filter(p => p.category === category);
    if (categoryItems.length > 0) {
      const randomProduct = categoryItems[Math.floor(Math.random() * categoryItems.length)];
      setOutfit(prev => ({
        ...prev,
        [category]: randomProduct,
      }));
    }
  };

  const randomizeOutfit = () => {
    Object.keys(outfit).forEach(category => {
      randomizeCategory(category as ProductCategory);
    });
  };

  const outfitTotal = Object.values(outfit)
    .filter(Boolean)
    .reduce((total, product) => total + (product?.price || 0), 0);

  const outfitComplete = Object.values(outfit).every(item => item !== null);

  const handleAddToCart = () => {
    const outfitItems = Object.values(outfit).filter(Boolean) as Product[];
    onAddOutfitToCart(outfitItems);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif mb-4">Build Your Perfect Outfit</h2>
        <p className="text-gray-600">Mix and match to create your ideal look</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {(Object.keys(outfit) as ProductCategory[]).map((category) => {
              const Icon = categoryIcons[category];
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-sm transition-colors whitespace-nowrap ${
                    activeCategory === category
                      ? 'bg-black text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="capitalize">{category}</span>
                  {outfit[category] && (
                    <span className="w-2 h-2 bg-gold rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <AnimatePresence mode="wait">
              {categoryProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => selectProduct(product)}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    outfit[activeCategory]?.id === product.id
                      ? 'border-gold shadow-lg'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="aspect-square relative">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {outfit[activeCategory]?.id === product.id && (
                      <div className="absolute inset-0 bg-gold/20 flex items-center justify-center">
                        <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-black font-bold"
                          >
                            ✓
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm mb-1 line-clamp-1">{product.name}</h4>
                    <p className="text-lg font-semibold">${(product.price / 100).toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-serif">Your Outfit</h3>
              <button
                onClick={randomizeOutfit}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Randomize
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {(Object.entries(outfit) as [ProductCategory, Product | null][]).map(([category, product]) => {
                const Icon = categoryIcons[category];
                return (
                  <div key={category} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      {product ? (
                        <>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-gray-600">${(product.price / 100).toFixed(2)}</p>
                        </>
                      ) : (
                        <p className="text-gray-400 text-sm">Select {category}</p>
                      )}
                    </div>
                    {product && (
                      <button
                        onClick={() => randomizeCategory(category)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${(outfitTotal / 100).toFixed(2)}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={!outfitComplete}
              className={`w-full px-6 py-3 rounded-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                outfitComplete
                  ? 'bg-gold hover:bg-gold/90 text-black'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              Add Outfit to Cart
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}