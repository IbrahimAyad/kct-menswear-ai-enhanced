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

// Master categories for the scrolling header
const masterCategories = [
  {
    id: 'all',
    name: 'All Products',
    count: 24,
    image: null, // Will use gradient
    bgColor: 'from-burgundy to-burgundy-700'
  },
  {
    id: 'classic-suits',
    name: 'Classic Suits',
    count: 89,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/classic-suits.webp'
  },
  {
    id: 'summer-suits',
    name: 'Summer Suits',
    count: 45,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/summer-suits.webp'
  },
  {
    id: 'perennial-suits',
    name: 'Perennial Suits',
    count: 76,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/year-round-suits.webp'
  },
  {
    id: 'wedding-suits',
    name: 'Wedding Suits',
    count: 52,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/wedding-suits.webp'
  },
  {
    id: 'luxury-suits',
    name: 'Luxury Suits',
    count: 38,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/luxury-suits.webp'
  }
];

// All products with categories
const allProducts = [
  // Shirts
  {
    id: 'shirts',
    name: 'Shirts',
    price: 89,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/dress_shirts/stretch_collar/mens_dress_shirt_stretch_collar_model_3005_0.webp',
    category: 'shirts',
    subcategory: 'classic'
  },
  {
    id: 'turtleneck',
    name: 'Turtleneck',
    price: 79,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/dress_shirts/turtle_neck/mens_dress_shirt_turtle_neck_3002_0.webp',
    category: 'shirts',
    subcategory: 'casual'
  },
  // Blazers
  {
    id: 'velvet-blazers',
    name: 'Velvet Blazers',
    price: 299,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/velvet-blazer/mens_green_paisley_pattern_velvet_model_1089.webp',
    category: 'blazers',
    subcategory: 'luxury'
  },
  {
    id: 'blazers',
    name: 'Blazers',
    price: 249,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/prom_blazer/mens_red_floral_pattern_prom_blazer_model_1018.webp',
    category: 'blazers',
    subcategory: 'statement'
  },
  // Accessories
  {
    id: 'suspender-bowtie',
    name: 'Suspender & Bowtie',
    price: 59,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/powder-blue-model.png',
    category: 'accessories',
    subcategory: 'formal'
  },
  // Knitwear
  {
    id: 'knitwear',
    name: 'Knitwear',
    price: 129,
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/9ac91a19-5951-43d4-6a98-c9d658765c00/public',
    category: 'knitwear',
    subcategory: 'casual'
  },
  // More Shirts
  {
    id: 'dress-shirts',
    name: 'Dress Shirts',
    price: 79,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/dress_shirts/stretch_collar/mens_dress_shirt_stretch_collar_model_3005_0.webp',
    category: 'shirts',
    subcategory: 'formal'
  },
  // Vests
  {
    id: 'vests',
    name: 'Vests',
    price: 99,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/vest-tie-main-2.jpg',
    category: 'vests',
    subcategory: 'formal'
  },
  {
    id: 'vest-tie',
    name: 'Vest & Tie',
    price: 119,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/dusty-sage-model.png',
    category: 'vests',
    subcategory: 'wedding'
  },
  // Shoes
  {
    id: 'shoes',
    name: 'Shoes',
    price: 189,
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/7d203d2a-63b7-46d3-9749-1f203e4ccc00/public',
    category: 'shoes',
    subcategory: 'formal'
  },
  // Suits
  {
    id: 'double-breasted',
    name: 'Double Breasted',
    price: 329,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/double_breasted/mens_double_breasted_suit_model_2024_0.webp',
    category: 'suits',
    subcategory: 'classic-suits'
  },
  {
    id: 'shirt-tie',
    name: 'Shirt & Tie',
    price: 109,
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/dd5c1f7d-722d-4e17-00be-60a3fdb33900/public',
    category: 'accessories',
    subcategory: 'sets'
  },
  // Classic Suits
  {
    id: 'navy-suit',
    name: 'Navy Suit',
    price: 179,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg',
    category: 'suits',
    subcategory: 'classic-suits'
  },
  {
    id: 'black-suit',
    name: 'Black Suit',
    price: 179,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/main.png',
    category: 'suits',
    subcategory: 'classic-suits'
  },
  {
    id: 'charcoal-suit',
    name: 'Charcoal Suit',
    price: 179,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/dark-grey-two-main.jpg',
    category: 'suits',
    subcategory: 'classic-suits'
  },
  // Summer Suits
  {
    id: 'beige-suit',
    name: 'Beige Suit',
    price: 179,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/beige/beige-main.jpg',
    category: 'suits',
    subcategory: 'summer-suits'
  },
  {
    id: 'tan-suit',
    name: 'Tan Suit',
    price: 179,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/tan/tan-main.jpg',
    category: 'suits',
    subcategory: 'summer-suits'
  },
  // More products to fill the grid
  {
    id: 'olive-suit',
    name: 'Olive Suit',
    price: 179,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/olive/olive-main.jpg',
    category: 'suits',
    subcategory: 'summer-suits'
  },
  {
    id: 'burgundy-suit',
    name: 'Burgundy Suit',
    price: 179,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/burgundy-main.jpg',
    category: 'suits',
    subcategory: 'wedding-suits'
  },
  {
    id: 'royal-blue-suit',
    name: 'Royal Blue Suit',
    price: 179,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/royal-blue/royal-blue-main.jpg',
    category: 'suits',
    subcategory: 'wedding-suits'
  },
  {
    id: 'white-tux',
    name: 'White Tuxedo',
    price: 299,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/white/white-tux-main.jpg',
    category: 'suits',
    subcategory: 'luxury-suits'
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    price: 249,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/midnight-blue/midnight-main.jpg',
    category: 'suits',
    subcategory: 'luxury-suits'
  },
  {
    id: 'grey-wool',
    name: 'Grey Wool Suit',
    price: 199,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/light-grey/light-grey-two-p-main.jpg',
    category: 'suits',
    subcategory: 'perennial-suits'
  },
  {
    id: 'navy-pinstripe',
    name: 'Navy Pinstripe',
    price: 219,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-pinstripe-main.jpg',
    category: 'suits',
    subcategory: 'perennial-suits'
  }
];

export default function MasterCollectionPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.subcategory === selectedCategory);

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
  const handleQuickView = (product: typeof allProducts[0]) => {
    setSelectedProduct({
      ...product,
      images: [product.image],
      sizes: ['36', '38', '40', '42', '44', '46'],
      description: 'Premium quality menswear'
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
            {masterCategories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={cn(
                  "relative w-[180px] h-[220px] rounded-lg overflow-hidden cursor-pointer",
                  selectedCategory === category.id && "ring-2 ring-burgundy ring-offset-2"
                )}>
                  {category.image ? (
                    <>
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover"
                        sizes="180px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    </>
                  ) : (
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br flex items-center justify-center",
                      category.bgColor || "from-burgundy to-burgundy-700"
                    )}>
                      <Grid3X3 className="w-10 h-10 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <h3 className="font-semibold text-base">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.count} items</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Product count bar */}
        <div className="px-4 py-2 bg-gray-50 border-t flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {filteredProducts.length} products
          </span>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Grid3X3 className="w-4 h-4" />
            <span>Grid View</span>
          </div>
        </div>
      </div>

      {/* Product Grid - 3x3 on mobile */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 md:gap-2 p-1 md:p-3">
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
                sizes="(max-width: 768px) 33vw, 20vw"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Product Info */}
              <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3">
                <h3 className="text-white font-serif text-xs md:text-sm mb-0.5 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-white/90 text-xs md:text-sm font-medium">
                  ${product.price}
                </p>
              </div>

              {/* Like indicator */}
              {likedProducts.has(product.id) && (
                <div className="absolute top-2 right-2 z-10">
                  <Heart className="w-3 h-3 md:w-4 md:h-4 text-red-500 fill-red-500" />
                </div>
              )}

              {/* Quick View on Hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button className="bg-white/90 backdrop-blur text-black px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  View
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