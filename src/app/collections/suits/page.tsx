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

// Suit-specific categories
const suitCategories = [
  {
    id: 'all',
    name: 'All Suits',
    count: 89,
    image: null,
    bgColor: 'from-gray-900 to-gray-700'
  },
  {
    id: 'classic-suits',
    name: 'Classic Suits',
    count: 32,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/classic-suits.webp'
  },
  {
    id: 'summer-suits',
    name: 'Summer Suits',
    count: 18,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/summer-suits.webp'
  },
  {
    id: 'wedding-suits',
    name: 'Wedding Suits',
    count: 24,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/wedding-suits.webp'
  },
  {
    id: 'luxury-suits',
    name: 'Luxury Suits',
    count: 15,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/luxury-suits.webp'
  },
  {
    id: 'double-breasted',
    name: 'Double Breasted',
    count: 12,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/double_breasted/mens_double_breasted_suit_model_2024_0.webp'
  },
  {
    id: 'three-piece',
    name: 'Three Piece',
    count: 28,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-3p-main.jpg'
  },
  {
    id: 'tuxedos',
    name: 'Tuxedos',
    count: 16,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/white/white-tux-main.jpg'
  }
];

// Suit products
const suitProducts = [
  // Classic Suits
  {
    id: 'navy-classic',
    name: 'Navy Classic',
    price: 179,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg',
    category: 'suits',
    subcategory: 'classic-suits'
  },
  {
    id: 'black-classic',
    name: 'Black Classic',
    price: 179,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/main.png',
    category: 'suits',
    subcategory: 'classic-suits'
  },
  {
    id: 'charcoal-classic',
    name: 'Charcoal Classic',
    price: 179,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/dark-grey-two-main.jpg',
    category: 'suits',
    subcategory: 'classic-suits'
  },
  {
    id: 'grey-classic',
    name: 'Grey Classic',
    price: 179,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/light-grey/light-grey-two-p-main.jpg',
    category: 'suits',
    subcategory: 'classic-suits'
  },
  {
    id: 'brown-classic',
    name: 'Brown Classic',
    price: 179,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/brown/main.png',
    category: 'suits',
    subcategory: 'classic-suits'
  },
  {
    id: 'olive-classic',
    name: 'Olive Classic',
    price: 179,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/olive/olive-main.jpg',
    category: 'suits',
    subcategory: 'classic-suits'
  },
  
  // Summer Suits
  {
    id: 'beige-summer',
    name: 'Beige Summer',
    price: 179,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/beige/beige-main.jpg',
    category: 'suits',
    subcategory: 'summer-suits'
  },
  {
    id: 'tan-summer',
    name: 'Tan Summer',
    price: 179,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/tan/tan-main.jpg',
    category: 'suits',
    subcategory: 'summer-suits'
  },
  {
    id: 'light-blue-summer',
    name: 'Light Blue Summer',
    price: 179,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/light-blue/light-blue-main.jpg',
    category: 'suits',
    subcategory: 'summer-suits'
  },
  {
    id: 'cream-summer',
    name: 'Cream Summer',
    price: 179,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/cream/cream-main.jpg',
    category: 'suits',
    subcategory: 'summer-suits'
  },
  
  // Wedding Suits
  {
    id: 'burgundy-wedding',
    name: 'Burgundy Wedding',
    price: 179,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/burgundy-main.jpg',
    category: 'suits',
    subcategory: 'wedding-suits'
  },
  {
    id: 'royal-blue-wedding',
    name: 'Royal Blue Wedding',
    price: 179,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/royal-blue/royal-blue-main.jpg',
    category: 'suits',
    subcategory: 'wedding-suits'
  },
  {
    id: 'purple-wedding',
    name: 'Purple Wedding',
    price: 179,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/purple/purple-main.jpg',
    category: 'suits',
    subcategory: 'wedding-suits'
  },
  {
    id: 'silver-wedding',
    name: 'Silver Wedding',
    price: 199,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/silver/silver-main.jpg',
    category: 'suits',
    subcategory: 'wedding-suits'
  },
  
  // Luxury Suits
  {
    id: 'midnight-blue-luxury',
    name: 'Midnight Blue',
    price: 249,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/midnight-blue/midnight-main.jpg',
    category: 'suits',
    subcategory: 'luxury-suits'
  },
  {
    id: 'emerald-luxury',
    name: 'Emerald Luxury',
    price: 269,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/emerald/emerald-main.jpg',
    category: 'suits',
    subcategory: 'luxury-suits'
  },
  {
    id: 'gold-luxury',
    name: 'Gold Luxury',
    price: 299,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/gold/gold-main.jpg',
    category: 'suits',
    subcategory: 'luxury-suits'
  },
  
  // Double Breasted
  {
    id: 'db-navy',
    name: 'Navy Double Breasted',
    price: 229,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/double_breasted/mens_double_breasted_suit_model_2024_0.webp',
    category: 'suits',
    subcategory: 'double-breasted'
  },
  {
    id: 'db-grey',
    name: 'Grey Double Breasted',
    price: 229,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/grey/grey-db-main.jpg',
    category: 'suits',
    subcategory: 'double-breasted'
  },
  {
    id: 'db-black',
    name: 'Black Double Breasted',
    price: 229,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/black-db-main.jpg',
    category: 'suits',
    subcategory: 'double-breasted'
  },
  
  // Three Piece Suits
  {
    id: '3p-navy',
    name: 'Navy Three Piece',
    price: 249,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-3p-main.jpg',
    category: 'suits',
    subcategory: 'three-piece'
  },
  {
    id: '3p-charcoal',
    name: 'Charcoal Three Piece',
    price: 249,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/charcoal-3p-main.jpg',
    category: 'suits',
    subcategory: 'three-piece'
  },
  {
    id: '3p-burgundy',
    name: 'Burgundy Three Piece',
    price: 249,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/burgundy-3p-main.jpg',
    category: 'suits',
    subcategory: 'three-piece'
  },
  {
    id: '3p-grey',
    name: 'Grey Three Piece',
    price: 249,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/light-grey/grey-3p-main.jpg',
    category: 'suits',
    subcategory: 'three-piece'
  },
  
  // Tuxedos
  {
    id: 'black-tux',
    name: 'Black Tuxedo',
    price: 299,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/black-tux-main.jpg',
    category: 'suits',
    subcategory: 'tuxedos'
  },
  {
    id: 'white-tux',
    name: 'White Tuxedo',
    price: 299,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/white/white-tux-main.jpg',
    category: 'suits',
    subcategory: 'tuxedos'
  },
  {
    id: 'burgundy-tux',
    name: 'Burgundy Tuxedo',
    price: 299,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/burgundy-tux-main.jpg',
    category: 'suits',
    subcategory: 'tuxedos'
  },
  {
    id: 'midnight-tux',
    name: 'Midnight Tuxedo',
    price: 329,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/midnight-blue/midnight-tux-main.jpg',
    category: 'suits',
    subcategory: 'tuxedos'
  },
  
  // Additional Classic Suits to fill grid
  {
    id: 'navy-pinstripe',
    name: 'Navy Pinstripe',
    price: 199,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-pinstripe-main.jpg',
    category: 'suits',
    subcategory: 'classic-suits'
  },
  {
    id: 'grey-pinstripe',
    name: 'Grey Pinstripe',
    price: 199,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/grey/grey-pinstripe-main.jpg',
    category: 'suits',
    subcategory: 'classic-suits'
  },
  {
    id: 'blue-windowpane',
    name: 'Blue Windowpane',
    price: 209,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/blue/blue-windowpane-main.jpg',
    category: 'suits',
    subcategory: 'classic-suits'
  },
  {
    id: 'grey-herringbone',
    name: 'Grey Herringbone',
    price: 219,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/grey/grey-herringbone-main.jpg',
    category: 'suits',
    subcategory: 'classic-suits'
  }
];

export default function SuitsCollectionPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all' 
    ? suitProducts 
    : suitProducts.filter(p => p.subcategory === selectedCategory);

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
  const handleQuickView = (product: typeof suitProducts[0]) => {
    setSelectedProduct({
      ...product,
      images: [product.image],
      sizes: ['36', '38', '40', '42', '44', '46', '48'],
      description: 'Premium quality suit tailored to perfection'
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
            {suitCategories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={cn(
                  "relative w-[180px] h-[220px] rounded-lg overflow-hidden cursor-pointer",
                  selectedCategory === category.id && "ring-2 ring-black ring-offset-2"
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
                      category.bgColor || "from-gray-900 to-gray-700"
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
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 md:gap-2 p-1 md:p-3">
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
                sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
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