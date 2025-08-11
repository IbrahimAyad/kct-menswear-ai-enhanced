'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  X, 
  ChevronLeft, 
  ChevronRight,
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Eye,
  Grid3X3
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Shoe categories following SuitSupply pattern
const shoeCategories = [
  {
    id: 'all',
    name: 'All Shoes',
    count: 84,
    image: null,
    bgColor: 'from-slate-900 to-slate-700'
  },
  {
    id: 'studded-loafers',
    name: 'Studded Loafers',
    count: 18,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/gold-studded-loafers.jpg'
  },
  {
    id: 'rhinestone-loafers',
    name: 'Rhinestone Loafers',
    count: 16,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/silver-rhinestone-loafers.jpg'
  },
  {
    id: 'velvet-loafers',
    name: 'Velvet Loafers',
    count: 14,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/burgundy-velvet-loafers.jpg'
  },
  {
    id: 'dress-shoes',
    name: 'Dress Shoes',
    count: 22,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/black-oxford-dress.jpg'
  },
  {
    id: 'casual-shoes',
    name: 'Casual Shoes',
    count: 14,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/brown-leather-casual.jpg'
  }
];

// Comprehensive shoe products
const shoeProducts = [
  // Studded Loafers Collection
  {
    id: 'gold-studded-loafers',
    name: 'Gold Studded Loafers',
    price: 89,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/gold-studded-loafers.jpg',
    category: 'shoes',
    subcategory: 'studded-loafers'
  },
  {
    id: 'silver-studded-loafers',
    name: 'Silver Studded Loafers',
    price: 89,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/silver-studded-loafers.jpg',
    category: 'shoes',
    subcategory: 'studded-loafers'
  },
  {
    id: 'black-studded-loafers',
    name: 'Black Studded Loafers',
    price: 89,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/black-studded-loafers.jpg',
    category: 'shoes',
    subcategory: 'studded-loafers'
  },
  {
    id: 'red-studded-loafers',
    name: 'Red Studded Loafers',
    price: 99,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/red-studded-loafers.jpg',
    category: 'shoes',
    subcategory: 'studded-loafers'
  },
  {
    id: 'royal-blue-studded',
    name: 'Royal Blue Studded Loafers',
    price: 99,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/royal-blue-studded.jpg',
    category: 'shoes',
    subcategory: 'studded-loafers'
  },
  {
    id: 'burgundy-studded',
    name: 'Burgundy Studded Loafers',
    price: 99,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/burgundy-studded.jpg',
    category: 'shoes',
    subcategory: 'studded-loafers'
  },
  
  // Rhinestone Loafers
  {
    id: 'silver-rhinestone-loafers',
    name: 'Silver Rhinestone Loafers',
    price: 99,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/silver-rhinestone-loafers.jpg',
    category: 'shoes',
    subcategory: 'rhinestone-loafers'
  },
  {
    id: 'gold-rhinestone-loafers',
    name: 'Gold Rhinestone Loafers',
    price: 99,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/gold-rhinestone-loafers.jpg',
    category: 'shoes',
    subcategory: 'rhinestone-loafers'
  },
  {
    id: 'black-rhinestone-loafers',
    name: 'Black Rhinestone Loafers',
    price: 99,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/black-rhinestone-loafers.jpg',
    category: 'shoes',
    subcategory: 'rhinestone-loafers'
  },
  {
    id: 'white-rhinestone-loafers',
    name: 'White Rhinestone Loafers',
    price: 99,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/white-rhinestone-loafers.jpg',
    category: 'shoes',
    subcategory: 'rhinestone-loafers'
  },
  {
    id: 'red-rhinestone-loafers',
    name: 'Red Rhinestone Loafers',
    price: 99,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/red-rhinestone-loafers.jpg',
    category: 'shoes',
    subcategory: 'rhinestone-loafers'
  },
  
  // Velvet Loafers
  {
    id: 'burgundy-velvet-loafers',
    name: 'Burgundy Velvet Loafers',
    price: 79,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/burgundy-velvet-loafers.jpg',
    category: 'shoes',
    subcategory: 'velvet-loafers'
  },
  {
    id: 'black-velvet-loafers',
    name: 'Black Velvet Loafers',
    price: 79,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/black-velvet-loafers.jpg',
    category: 'shoes',
    subcategory: 'velvet-loafers'
  },
  {
    id: 'navy-velvet-loafers',
    name: 'Navy Velvet Loafers',
    price: 79,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/navy-velvet-loafers.jpg',
    category: 'shoes',
    subcategory: 'velvet-loafers'
  },
  {
    id: 'emerald-velvet-loafers',
    name: 'Emerald Velvet Loafers',
    price: 89,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/emerald-velvet-loafers.jpg',
    category: 'shoes',
    subcategory: 'velvet-loafers'
  },
  {
    id: 'royal-blue-velvet',
    name: 'Royal Blue Velvet Loafers',
    price: 79,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/royal-blue-velvet.jpg',
    category: 'shoes',
    subcategory: 'velvet-loafers'
  },
  
  // Dress Shoes
  {
    id: 'black-oxford-dress',
    name: 'Black Oxford Dress Shoes',
    price: 85,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/black-oxford-dress.jpg',
    category: 'shoes',
    subcategory: 'dress-shoes'
  },
  {
    id: 'brown-oxford-dress',
    name: 'Brown Oxford Dress Shoes',
    price: 85,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/brown-oxford-dress.jpg',
    category: 'shoes',
    subcategory: 'dress-shoes'
  },
  {
    id: 'burgundy-dress-shoes',
    name: 'Burgundy Dress Shoes',
    price: 89,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/burgundy-dress-shoes.jpg',
    category: 'shoes',
    subcategory: 'dress-shoes'
  },
  {
    id: 'navy-dress-shoes',
    name: 'Navy Dress Shoes',
    price: 89,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/navy-dress-shoes.jpg',
    category: 'shoes',
    subcategory: 'dress-shoes'
  },
  {
    id: 'tan-dress-shoes',
    name: 'Tan Dress Shoes',
    price: 85,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/tan-dress-shoes.jpg',
    category: 'shoes',
    subcategory: 'dress-shoes'
  },
  {
    id: 'grey-dress-shoes',
    name: 'Grey Dress Shoes',
    price: 85,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/grey-dress-shoes.jpg',
    category: 'shoes',
    subcategory: 'dress-shoes'
  },
  
  // Casual Shoes
  {
    id: 'brown-leather-casual',
    name: 'Brown Leather Casual',
    price: 79,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/brown-leather-casual.jpg',
    category: 'shoes',
    subcategory: 'casual-shoes'
  },
  {
    id: 'white-sneaker-casual',
    name: 'White Sneaker Casual',
    price: 69,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/white-sneaker-casual.jpg',
    category: 'shoes',
    subcategory: 'casual-shoes'
  },
  {
    id: 'black-leather-casual',
    name: 'Black Leather Casual',
    price: 79,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/black-leather-casual.jpg',
    category: 'shoes',
    subcategory: 'casual-shoes'
  },
  {
    id: 'navy-boat-shoes',
    name: 'Navy Boat Shoes',
    price: 75,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/navy-boat-shoes.jpg',
    category: 'shoes',
    subcategory: 'casual-shoes'
  },
  {
    id: 'brown-boat-shoes',
    name: 'Brown Boat Shoes',
    price: 75,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/brown-boat-shoes.jpg',
    category: 'shoes',
    subcategory: 'casual-shoes'
  },
  {
    id: 'grey-canvas-sneakers',
    name: 'Grey Canvas Sneakers',
    price: 65,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/kct-shoes/grey-canvas-sneakers.jpg',
    category: 'shoes',
    subcategory: 'casual-shoes'
  }
];

export default function ShoesCollectionPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all' 
    ? shoeProducts 
    : shoeProducts.filter(p => p.subcategory === selectedCategory);

  // Scroll category nav
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 300;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Toggle like
  const toggleLike = (productId: string) => {
    setLikedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  // Handle quick view
  const handleQuickView = (product: typeof shoeProducts[0]) => {
    setSelectedProduct({
      ...product,
      images: [product.image],
      sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
      description: 'Premium quality shoes crafted with attention to detail and style'
    });
    setSelectedSize('');
    setQuantity(1);
  };

  // Close modal when clicking outside
  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setSelectedProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Title */}
      <div className="bg-gray-50 px-4 py-8 md:px-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-serif mb-2">Shoes for Men</h1>
        <p className="text-gray-600 max-w-2xl">
          Step out in style with our curated collection of premium shoes, from statement loafers to classic dress shoes.
        </p>
      </div>

      {/* Sticky Category Navigation Header */}
      <div className="sticky top-16 z-40 bg-white border-b">
        <div className="relative">
          {/* Scroll buttons */}
          <button
            onClick={() => scrollCategories('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur p-2 shadow-lg rounded-r-lg hover:bg-white transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => scrollCategories('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur p-2 shadow-lg rounded-l-lg hover:bg-white transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Categories */}
          <div
            ref={categoryScrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide px-12 py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {shoeCategories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={cn(
                  "relative w-[200px] h-[250px] rounded-lg overflow-hidden cursor-pointer",
                  selectedCategory === category.id && "ring-2 ring-black ring-offset-2"
                )}>
                  {category.image ? (
                    <>
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    </>
                  ) : (
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br flex items-center justify-center",
                      category.bgColor || "from-slate-900 to-slate-700"
                    )}>
                      <Grid3X3 className="w-10 h-10 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.count} items</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-4 py-3 bg-gray-50 border-t flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {filteredProducts.length} products
          </span>
          <button className="text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
        </div>
      </div>

      {/* Product Grid - Responsive columns */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1 md:gap-2 p-1 md:p-3">
        <AnimatePresence mode="wait">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={`${selectedCategory}-${product.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.02 }}
              className="relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => handleQuickView(product)}
            >
              {/* Product Image */}
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              
              {/* Gradient Overlay for text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Product Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h3 className="text-white font-medium text-sm md:text-base mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-white/90 text-sm md:text-base font-semibold">
                  ${product.price}
                </p>
              </div>

              {/* Like indicator */}
              {likedProducts.has(product.id) && (
                <div className="absolute top-3 right-3 z-10">
                  <Heart className="w-4 h-4 md:w-5 md:h-5 text-red-500 fill-red-500" />
                </div>
              )}

              {/* Quick View on Hover - Desktop Only */}
              <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center justify-center">
                <button className="bg-white/90 backdrop-blur text-black px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Quick View
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={handleModalClick}
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover rounded-t-2xl"
                />
              </div>

              {/* Product Details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-serif mb-1">{selectedProduct.name}</h2>
                    <p className="text-gray-600 text-sm">{selectedProduct.description}</p>
                  </div>
                  <button
                    onClick={() => toggleLike(selectedProduct.id)}
                    className="p-2"
                  >
                    <Heart 
                      className={cn(
                        "w-5 h-5 transition-all",
                        likedProducts.has(selectedProduct.id) 
                          ? "text-red-500 fill-red-500" 
                          : "text-gray-400"
                      )} 
                    />
                  </button>
                </div>

                {/* Price */}
                <div className="text-2xl font-semibold mb-4">
                  ${selectedProduct.price}
                </div>

                {/* Size Selector */}
                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "px-4 py-2 border rounded-lg text-sm transition-all",
                          selectedSize === size
                            ? "border-black bg-black text-white"
                            : "border-gray-300 hover:border-gray-400"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <p className="text-sm text-gray-700 mb-2">Quantity</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Add to Bag Button */}
                <Button
                  className="w-full bg-black hover:bg-gray-800 text-white py-3"
                  disabled={!selectedSize}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Add to Bag
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}