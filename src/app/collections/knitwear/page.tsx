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

// Knitwear categories following SuitSupply pattern
const knitwearCategories = [
  {
    id: 'all',
    name: 'All Knitwear',
    count: 96,
    image: null,
    bgColor: 'from-stone-900 to-stone-700'
  },
  {
    id: 'crewnecks',
    name: 'Crewnecks & V-Necks',
    count: 24,
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9ac91a19-5951-43d4-6a98-c9d658765c00/public'
  },
  {
    id: 'polos',
    name: 'Polos',
    count: 18,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/dress_shirts/stretch_collar/mens_dress_shirt_stretch_collar_model_3005_0.webp'
  },
  {
    id: 'cardigans',
    name: 'Cardigans',
    count: 12,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/knitwear.webp'
  },
  {
    id: 'zip-sweaters',
    name: 'Zip Sweaters',
    count: 16,
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/7c38e3e4-2a23-43f5-d9a4-a4c0f9aa4c00/public'
  },
  {
    id: 'turtlenecks',
    name: 'Turtlenecks',
    count: 26,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/dress_shirts/turtle_neck/mens_dress_shirt_turtle_neck_3002_0.webp'
  }
];

// Comprehensive knitwear products
const knitwearProducts = [
  // Turtlenecks
  {
    id: 'black-turtleneck',
    name: 'Black Merino Turtleneck',
    price: 129,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/dress_shirts/turtle_neck/mens_dress_shirt_turtle_neck_3002_0.webp',
    category: 'knitwear',
    subcategory: 'turtlenecks'
  },
  {
    id: 'navy-turtleneck',
    name: 'Navy Turtleneck',
    price: 119,
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9ac91a19-5951-43d4-6a98-c9d658765c00/public',
    category: 'knitwear',
    subcategory: 'turtlenecks'
  },
  {
    id: 'grey-turtleneck',
    name: 'Grey Cashmere Turtleneck',
    price: 149,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/grey-turtleneck.webp',
    category: 'knitwear',
    subcategory: 'turtlenecks'
  },
  {
    id: 'burgundy-turtleneck',
    name: 'Burgundy Turtleneck',
    price: 119,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/burgundy-turtleneck.webp',
    category: 'knitwear',
    subcategory: 'turtlenecks'
  },
  {
    id: 'cream-turtleneck',
    name: 'Cream Wool Turtleneck',
    price: 129,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/cream-turtleneck.webp',
    category: 'knitwear',
    subcategory: 'turtlenecks'
  },
  {
    id: 'charcoal-turtleneck',
    name: 'Charcoal Turtleneck',
    price: 119,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/charcoal-turtleneck.webp',
    category: 'knitwear',
    subcategory: 'turtlenecks'
  },
  
  // Crewnecks
  {
    id: 'navy-crewneck',
    name: 'Navy Crewneck Sweater',
    price: 99,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/navy-crewneck.webp',
    category: 'knitwear',
    subcategory: 'crewnecks'
  },
  {
    id: 'grey-vneck',
    name: 'Grey V-Neck Sweater',
    price: 99,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/grey-vneck.webp',
    category: 'knitwear',
    subcategory: 'crewnecks'
  },
  {
    id: 'black-crewneck',
    name: 'Black Crewneck',
    price: 99,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/black-crewneck.webp',
    category: 'knitwear',
    subcategory: 'crewnecks'
  },
  {
    id: 'beige-vneck',
    name: 'Beige V-Neck',
    price: 89,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/beige-vneck.webp',
    category: 'knitwear',
    subcategory: 'crewnecks'
  },
  {
    id: 'forest-crewneck',
    name: 'Forest Green Crewneck',
    price: 99,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/forest-crewneck.webp',
    category: 'knitwear',
    subcategory: 'crewnecks'
  },
  {
    id: 'burgundy-vneck',
    name: 'Burgundy V-Neck',
    price: 99,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/burgundy-vneck.webp',
    category: 'knitwear',
    subcategory: 'crewnecks'
  },
  
  // Polos
  {
    id: 'navy-polo',
    name: 'Navy Knit Polo',
    price: 79,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/navy-polo.webp',
    category: 'knitwear',
    subcategory: 'polos'
  },
  {
    id: 'white-polo',
    name: 'White Cotton Polo',
    price: 69,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/dress_shirts/stretch_collar/mens_dress_shirt_stretch_collar_model_3005_0.webp',
    category: 'knitwear',
    subcategory: 'polos'
  },
  {
    id: 'grey-polo',
    name: 'Grey Melange Polo',
    price: 79,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/grey-polo.webp',
    category: 'knitwear',
    subcategory: 'polos'
  },
  {
    id: 'burgundy-polo',
    name: 'Burgundy Polo',
    price: 79,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/burgundy-polo.webp',
    category: 'knitwear',
    subcategory: 'polos'
  },
  {
    id: 'olive-polo',
    name: 'Olive Green Polo',
    price: 79,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/olive-polo.webp',
    category: 'knitwear',
    subcategory: 'polos'
  },
  {
    id: 'black-polo',
    name: 'Black Polo',
    price: 79,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/black-polo.webp',
    category: 'knitwear',
    subcategory: 'polos'
  },
  
  // Cardigans
  {
    id: 'navy-cardigan',
    name: 'Navy Button Cardigan',
    price: 139,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/navy-cardigan.webp',
    category: 'knitwear',
    subcategory: 'cardigans'
  },
  {
    id: 'grey-shawl-cardigan',
    name: 'Grey Shawl Cardigan',
    price: 149,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/grey-shawl-cardigan.webp',
    category: 'knitwear',
    subcategory: 'cardigans'
  },
  {
    id: 'brown-cable-cardigan',
    name: 'Brown Cable Knit Cardigan',
    price: 159,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/brown-cable-cardigan.webp',
    category: 'knitwear',
    subcategory: 'cardigans'
  },
  {
    id: 'black-cardigan',
    name: 'Black Merino Cardigan',
    price: 139,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/black-cardigan.webp',
    category: 'knitwear',
    subcategory: 'cardigans'
  },
  
  // Zip Sweaters
  {
    id: 'navy-zip',
    name: 'Navy Full Zip',
    price: 119,
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/7c38e3e4-2a23-43f5-d9a4-a4c0f9aa4c00/public',
    category: 'knitwear',
    subcategory: 'zip-sweaters'
  },
  {
    id: 'grey-half-zip',
    name: 'Grey Half Zip',
    price: 109,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/grey-half-zip.webp',
    category: 'knitwear',
    subcategory: 'zip-sweaters'
  },
  {
    id: 'black-quarter-zip',
    name: 'Black Quarter Zip',
    price: 99,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/black-quarter-zip.webp',
    category: 'knitwear',
    subcategory: 'zip-sweaters'
  },
  {
    id: 'burgundy-zip',
    name: 'Burgundy Full Zip',
    price: 119,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/burgundy-zip.webp',
    category: 'knitwear',
    subcategory: 'zip-sweaters'
  },
  {
    id: 'olive-half-zip',
    name: 'Olive Half Zip',
    price: 109,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/olive-half-zip.webp',
    category: 'knitwear',
    subcategory: 'zip-sweaters'
  },
  
  // Additional mixed knitwear
  {
    id: 'striped-crewneck',
    name: 'Striped Crewneck',
    price: 89,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/striped-crewneck.webp',
    category: 'knitwear',
    subcategory: 'crewnecks'
  },
  {
    id: 'cable-knit-cream',
    name: 'Cable Knit Cream',
    price: 139,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/cable-knit-cream.webp',
    category: 'knitwear',
    subcategory: 'crewnecks'
  },
  {
    id: 'ribbed-navy',
    name: 'Ribbed Navy Sweater',
    price: 109,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/ribbed-navy.webp',
    category: 'knitwear',
    subcategory: 'crewnecks'
  },
  {
    id: 'cashmere-grey',
    name: 'Cashmere Grey V-Neck',
    price: 179,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/cashmere-grey.webp',
    category: 'knitwear',
    subcategory: 'crewnecks'
  },
  {
    id: 'merino-black',
    name: 'Merino Black Turtleneck',
    price: 139,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/merino-black.webp',
    category: 'knitwear',
    subcategory: 'turtlenecks'
  }
];

export default function KnitwearCollectionPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all' 
    ? knitwearProducts 
    : knitwearProducts.filter(p => p.subcategory === selectedCategory);

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
  const handleQuickView = (product: typeof knitwearProducts[0]) => {
    setSelectedProduct({
      ...product,
      images: [product.image],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      description: 'From crewnecks to turtlenecks, find the perfect complement to any look'
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
        <h1 className="text-3xl md:text-4xl font-serif mb-2">Knitwear & Sweaters for Men</h1>
        <p className="text-gray-600 max-w-2xl">
          From crewnecks, cardigans, turtlenecks & V-necks to polos, T-shirts, and more, find the perfect complement to any look in our collection of soft, luxurious Australian Merino wool, Mulberry silk, and organic cotton.
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
            {knitwearCategories.map((category) => (
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
                      category.bgColor || "from-stone-900 to-stone-700"
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 md:gap-2 p-1 md:p-3">
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
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
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