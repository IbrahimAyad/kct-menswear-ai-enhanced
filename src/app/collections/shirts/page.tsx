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

// Shirt categories following SuitSupply pattern
const shirtCategories = [
  {
    id: 'all',
    name: 'All Shirts',
    count: 96,
    image: null,
    bgColor: 'from-slate-900 to-slate-700'
  },
  {
    id: 'dress-shirts',
    name: 'Dress Shirts',
    count: 34,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/white-dress-shirt.jpg'
  },
  {
    id: 'casual-shirts',
    name: 'Casual Shirts',
    count: 26,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/casual-shirt.jpg'
  },
  {
    id: 'turtlenecks',
    name: 'Turtlenecks',
    count: 18,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/black-turtleneck.jpg'
  },
  {
    id: 'oxford-shirts',
    name: 'Oxford Shirts',
    count: 12,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/oxford-shirt.jpg'
  },
  {
    id: 'linen-shirts',
    name: 'Linen Shirts',
    count: 6,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/white-linen-shirt.jpg'
  }
];

// Comprehensive shirt products
const shirtProducts = [
  // Dress Shirts Collection
  {
    id: 'white-dress-classic',
    name: 'Classic White Dress Shirt',
    price: 89,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/white-dress-shirt.jpg',
    category: 'shirts',
    subcategory: 'dress-shirts'
  },
  {
    id: 'light-blue-dress',
    name: 'Light Blue Dress Shirt',
    price: 89,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/light-blue-dress.jpg',
    category: 'shirts',
    subcategory: 'dress-shirts'
  },
  {
    id: 'navy-dress-shirt',
    name: 'Navy Dress Shirt',
    price: 89,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/navy-dress-shirt.jpg',
    category: 'shirts',
    subcategory: 'dress-shirts'
  },
  {
    id: 'black-dress-shirt',
    name: 'Black Dress Shirt',
    price: 89,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/black-dress-shirt.jpg',
    category: 'shirts',
    subcategory: 'dress-shirts'
  },
  {
    id: 'grey-dress-shirt',
    name: 'Grey Dress Shirt',
    price: 89,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/grey-dress-shirt.jpg',
    category: 'shirts',
    subcategory: 'dress-shirts'
  },
  {
    id: 'burgundy-dress',
    name: 'Burgundy Dress Shirt',
    price: 99,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/burgundy-dress.jpg',
    category: 'shirts',
    subcategory: 'dress-shirts'
  },
  {
    id: 'pink-dress-shirt',
    name: 'Pink Dress Shirt',
    price: 89,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/pink-dress-shirt.jpg',
    category: 'shirts',
    subcategory: 'dress-shirts'
  },
  {
    id: 'striped-dress-blue',
    name: 'Blue Striped Dress Shirt',
    price: 99,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/blue-striped-dress.jpg',
    category: 'shirts',
    subcategory: 'dress-shirts'
  },
  
  // Casual Shirts
  {
    id: 'denim-casual',
    name: 'Denim Casual Shirt',
    price: 79,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/casual-shirt.jpg',
    category: 'shirts',
    subcategory: 'casual-shirts'
  },
  {
    id: 'flannel-red',
    name: 'Red Flannel Shirt',
    price: 69,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/red-flannel.jpg',
    category: 'shirts',
    subcategory: 'casual-shirts'
  },
  {
    id: 'plaid-casual',
    name: 'Plaid Casual Shirt',
    price: 69,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/plaid-casual.jpg',
    category: 'shirts',
    subcategory: 'casual-shirts'
  },
  {
    id: 'olive-utility',
    name: 'Olive Utility Shirt',
    price: 79,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/olive-utility.jpg',
    category: 'shirts',
    subcategory: 'casual-shirts'
  },
  {
    id: 'white-casual',
    name: 'White Casual Shirt',
    price: 65,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/white-casual.jpg',
    category: 'shirts',
    subcategory: 'casual-shirts'
  },
  {
    id: 'khaki-casual',
    name: 'Khaki Casual Shirt',
    price: 69,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/khaki-casual.jpg',
    category: 'shirts',
    subcategory: 'casual-shirts'
  },
  
  // Turtlenecks
  {
    id: 'black-turtleneck',
    name: 'Black Turtleneck',
    price: 59,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/black-turtleneck.jpg',
    category: 'shirts',
    subcategory: 'turtlenecks'
  },
  {
    id: 'navy-turtleneck',
    name: 'Navy Turtleneck',
    price: 59,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/navy-turtleneck.jpg',
    category: 'shirts',
    subcategory: 'turtlenecks'
  },
  {
    id: 'grey-turtleneck',
    name: 'Grey Turtleneck',
    price: 59,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/grey-turtleneck.jpg',
    category: 'shirts',
    subcategory: 'turtlenecks'
  },
  {
    id: 'white-turtleneck',
    name: 'White Turtleneck',
    price: 59,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/white-turtleneck.jpg',
    category: 'shirts',
    subcategory: 'turtlenecks'
  },
  {
    id: 'cream-turtleneck',
    name: 'Cream Turtleneck',
    price: 59,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/cream-turtleneck.jpg',
    category: 'shirts',
    subcategory: 'turtlenecks'
  },
  {
    id: 'burgundy-turtleneck',
    name: 'Burgundy Turtleneck',
    price: 65,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/burgundy-turtleneck.jpg',
    category: 'shirts',
    subcategory: 'turtlenecks'
  },
  
  // Oxford Shirts
  {
    id: 'white-oxford',
    name: 'White Oxford Shirt',
    price: 75,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/oxford-shirt.jpg',
    category: 'shirts',
    subcategory: 'oxford-shirts'
  },
  {
    id: 'blue-oxford',
    name: 'Blue Oxford Shirt',
    price: 75,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/blue-oxford.jpg',
    category: 'shirts',
    subcategory: 'oxford-shirts'
  },
  {
    id: 'pink-oxford',
    name: 'Pink Oxford Shirt',
    price: 75,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/pink-oxford.jpg',
    category: 'shirts',
    subcategory: 'oxford-shirts'
  },
  {
    id: 'grey-oxford',
    name: 'Grey Oxford Shirt',
    price: 75,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/grey-oxford.jpg',
    category: 'shirts',
    subcategory: 'oxford-shirts'
  },
  
  // Linen Shirts
  {
    id: 'white-linen',
    name: 'White Linen Shirt',
    price: 85,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/white-linen-shirt.jpg',
    category: 'shirts',
    subcategory: 'linen-shirts'
  },
  {
    id: 'blue-linen',
    name: 'Blue Linen Shirt',
    price: 85,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/blue-linen.jpg',
    category: 'shirts',
    subcategory: 'linen-shirts'
  },
  {
    id: 'beige-linen',
    name: 'Beige Linen Shirt',
    price: 85,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/beige-linen.jpg',
    category: 'shirts',
    subcategory: 'linen-shirts'
  },
  {
    id: 'green-linen',
    name: 'Green Linen Shirt',
    price: 85,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/shirts/green-linen.jpg',
    category: 'shirts',
    subcategory: 'linen-shirts'
  }
];

export default function ShirtsCollectionPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all' 
    ? shirtProducts 
    : shirtProducts.filter(p => p.subcategory === selectedCategory);

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
  const handleQuickView = (product: typeof shirtProducts[0]) => {
    setSelectedProduct({
      ...product,
      images: [product.image],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      description: 'Premium crafted shirt in classic and modern styles'
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
        <h1 className="text-3xl md:text-4xl font-serif mb-2">Shirts for Men</h1>
        <p className="text-gray-600 max-w-2xl">
          From classic dress shirts to casual weekend wear, discover premium crafted shirts in timeless and contemporary styles.
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
            {shirtCategories.map((category) => (
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