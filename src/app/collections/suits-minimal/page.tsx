'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
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
  Filter,
  Grid3X3
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Suit products from the existing page
const suitProducts = [
  {
    id: 'navy-suit',
    name: 'Navy Suit',
    price: 179.99,
    price3Piece: 199.99,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main-2.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-three-p-main.jpg'
    ],
    category: 'classic',
    description: 'Timeless navy suit perfect for business and formal occasions',
    sizes: ['36', '38', '40', '42', '44', '46', '48'],
    color: 'Navy Blue',
    fabric: '100% Wool'
  },
  {
    id: 'black-suit',
    name: 'Black Suit',
    price: 179.99,
    price3Piece: 199.99,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/main.png',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/main.png',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/black-two-p-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/black-three-p-main.jpg'
    ],
    category: 'classic',
    description: 'Essential black suit for formal events and evening wear',
    sizes: ['36', '38', '40', '42', '44', '46', '48'],
    color: 'Black',
    fabric: '100% Wool'
  },
  {
    id: 'charcoal-suit',
    name: 'Charcoal Grey Suit',
    price: 179.99,
    price3Piece: 199.99,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/dark-grey-two-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/dark-grey-two-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/char%20grey/dark-grey-three-p-main.jpg'
    ],
    category: 'classic',
    description: 'Versatile charcoal suit for professional settings',
    sizes: ['36', '38', '40', '42', '44', '46', '48'],
    color: 'Charcoal Grey',
    fabric: '100% Wool'
  },
  {
    id: 'light-grey-suit',
    name: 'Light Grey Suit',
    price: 179.99,
    price3Piece: 199.99,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/light-grey/light-grey-two-p-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/light-grey/light-grey-two-p-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/light-grey/light-grey-three-p-main.jpg'
    ],
    category: 'classic',
    description: 'Sophisticated light grey suit for daytime events',
    sizes: ['36', '38', '40', '42', '44', '46', '48'],
    color: 'Light Grey',
    fabric: '100% Wool'
  },
  {
    id: 'beige-suit',
    name: 'Beige Suit',
    price: 179.99,
    price3Piece: 199.99,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/beige/beige-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/beige/beige-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/beige/beige-two-p-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/beige/beige-three-p-main.jpg'
    ],
    category: 'earth-tone',
    description: 'Elegant beige suit perfect for summer occasions',
    sizes: ['36', '38', '40', '42', '44', '46', '48'],
    color: 'Beige',
    fabric: 'Cotton Blend'
  },
  {
    id: 'tan-suit',
    name: 'Tan Suit',
    price: 179.99,
    price3Piece: 199.99,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/tan/tan-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/tan/tan-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/tan/tan-two-p-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/tan/tan-three-p-main.jpg'
    ],
    category: 'earth-tone',
    description: 'Stylish tan suit for casual elegance',
    sizes: ['36', '38', '40', '42', '44', '46', '48'],
    color: 'Tan',
    fabric: 'Cotton Blend'
  },
  {
    id: 'olive-suit',
    name: 'Olive Suit',
    price: 179.99,
    price3Piece: 199.99,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/olive/olive-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/olive/olive-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/olive/olive-two-p-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/olive/olive-three-p-main.jpg'
    ],
    category: 'earth-tone',
    description: 'Unique olive suit for standout style',
    sizes: ['36', '38', '40', '42', '44', '46', '48'],
    color: 'Olive Green',
    fabric: 'Cotton Blend'
  },
  {
    id: 'royal-blue-suit',
    name: 'Royal Blue Suit',
    price: 179.99,
    price3Piece: 199.99,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/royal-blue/royal-blue-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/royal-blue/royal-blue-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/royal-blue/royal-blue-two-p-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/royal-blue/royal-blue-three-p-main.jpg'
    ],
    category: 'statement',
    description: 'Bold royal blue suit for special occasions',
    sizes: ['36', '38', '40', '42', '44', '46', '48'],
    color: 'Royal Blue',
    fabric: '100% Wool'
  },
  {
    id: 'burgundy-suit',
    name: 'Burgundy Suit',
    price: 179.99,
    price3Piece: 199.99,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/burgundy-main.jpg',
    images: [
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/burgundy-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/burgundy-two-p-main.jpg',
      'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/burgundy-three-p-main.jpg'
    ],
    category: 'statement',
    description: 'Rich burgundy suit for evening events',
    sizes: ['36', '38', '40', '42', '44', '46', '48'],
    color: 'Burgundy',
    fabric: '100% Wool'
  }
];

export default function MinimalistSuitsCollection() {
  const [selectedProduct, setSelectedProduct] = useState<typeof suitProducts[0] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedType, setSelectedType] = useState<'2-piece' | '3-piece'>('2-piece');
  const [quantity, setQuantity] = useState(1);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const { scrollY } = useScroll();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter products
  const filteredProducts = selectedCategory === 'all' 
    ? suitProducts 
    : suitProducts.filter(p => p.category === selectedCategory);

  // Handle scroll to hide/show filters
  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setShowFilters(latest < 100);
    });
    return unsubscribe;
  }, [scrollY]);

  // Touch handlers for tap detection
  const handleTouchStart = (e: React.TouchEvent, product: typeof suitProducts[0]) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    });
  };

  const handleTouchEnd = (e: React.TouchEvent, product: typeof suitProducts[0]) => {
    if (!touchStart) return;
    
    const touch = e.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - touchStart.x);
    const deltaY = Math.abs(touch.clientY - touchStart.y);
    const deltaTime = Date.now() - touchStart.time;
    
    // Tap detected (minimal movement, quick touch)
    if (deltaX < 10 && deltaY < 10 && deltaTime < 200) {
      setSelectedProduct(product);
      setCurrentImageIndex(0);
      setSelectedSize('');
      setQuantity(1);
    }
    
    setTouchStart(null);
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

  return (
    <div className="min-h-screen bg-white">
      {/* Collapsible Filter Bar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="sticky top-16 z-30 bg-white border-b"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all",
                    selectedCategory === 'all' 
                      ? "bg-black text-white" 
                      : "bg-gray-100 text-gray-700"
                  )}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedCategory('classic')}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all",
                    selectedCategory === 'classic' 
                      ? "bg-black text-white" 
                      : "bg-gray-100 text-gray-700"
                  )}
                >
                  Classic
                </button>
                <button
                  onClick={() => setSelectedCategory('earth-tone')}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all",
                    selectedCategory === 'earth-tone' 
                      ? "bg-black text-white" 
                      : "bg-gray-100 text-gray-700"
                  )}
                >
                  Earth Tone
                </button>
                <button
                  onClick={() => setSelectedCategory('statement')}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all",
                    selectedCategory === 'statement' 
                      ? "bg-black text-white" 
                      : "bg-gray-100 text-gray-700"
                  )}
                >
                  Statement
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Grid3X3 className="w-4 h-4" />
                <span>{filteredProducts.length}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimalist Product Grid - 3x3 on mobile, no text */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0.5 md:gap-1 pt-16">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            className="relative aspect-[3/4] bg-gray-100 cursor-pointer overflow-hidden"
            onTouchStart={(e) => handleTouchStart(e, product)}
            onTouchEnd={(e) => handleTouchEnd(e, product)}
            onClick={() => {
              // Desktop click handler
              if (window.innerWidth > 768) {
                setSelectedProduct(product);
                setCurrentImageIndex(0);
                setSelectedSize('');
                setQuantity(1);
              }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, 20vw"
            />
            
            {/* Like indicator (subtle) */}
            {likedProducts.has(product.id) && (
              <div className="absolute top-2 right-2 z-10">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white"
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-white/90 backdrop-blur">
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 -ml-2"
              >
                <X className="w-6 h-6" />
              </button>
              <button
                onClick={() => toggleLike(selectedProduct.id)}
                className="p-2"
              >
                <Heart 
                  className={cn(
                    "w-6 h-6 transition-all",
                    likedProducts.has(selectedProduct.id) 
                      ? "text-red-500 fill-red-500" 
                      : "text-gray-700"
                  )} 
                />
              </button>
            </div>

            {/* Image Carousel */}
            <div className="relative h-[60vh] bg-gray-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="relative h-full"
                >
                  <Image
                    src={selectedProduct.images[currentImageIndex]}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Image navigation */}
              {selectedProduct.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      prev > 0 ? prev - 1 : selectedProduct.images.length - 1
                    )}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur rounded-full"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      prev < selectedProduct.images.length - 1 ? prev + 1 : 0
                    )}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur rounded-full"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {selectedProduct.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      index === currentImageIndex 
                        ? "bg-white w-6" 
                        : "bg-white/50"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6 pb-24">
              <h2 className="text-2xl font-serif mb-2">{selectedProduct.name}</h2>
              <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
              
              {/* Type selector */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">Type</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedType('2-piece')}
                    className={cn(
                      "flex-1 py-2 px-4 border rounded-lg transition-all",
                      selectedType === '2-piece'
                        ? "border-black bg-black text-white"
                        : "border-gray-300"
                    )}
                  >
                    2-Piece
                  </button>
                  <button
                    onClick={() => setSelectedType('3-piece')}
                    className={cn(
                      "flex-1 py-2 px-4 border rounded-lg transition-all",
                      selectedType === '3-piece'
                        ? "border-black bg-black text-white"
                        : "border-gray-300"
                    )}
                  >
                    3-Piece (+$20)
                  </button>
                </div>
              </div>

              {/* Size selector */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">Size</p>
                <div className="grid grid-cols-4 gap-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "py-2 border rounded-lg transition-all",
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-300"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity selector */}
              <div className="mb-6">
                <p className="text-sm text-gray-700 mb-2">Quantity</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 border border-gray-300 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="text-2xl font-semibold mb-6">
                ${selectedType === '3-piece' ? selectedProduct.price3Piece : selectedProduct.price}
              </div>

              {/* Actions */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="flex-1 bg-black hover:bg-gray-800 text-white"
                    disabled={!selectedSize}
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Add to Bag
                  </Button>
                  <Link href={`/products/suits/${selectedProduct.id}`}>
                    <Button size="lg" variant="outline">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}