'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
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
  Grid3X3,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGA4 } from '@/hooks/useGA4';

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
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/casual-bundles/navy-white-shirt-white-pocket-sqaure.png'
  },
  {
    id: 'summer-suits',
    name: 'Summer Suits',
    count: 18,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Summer%20Wedding%20Bundles/sand-suit-white-shirt-sage-green-tie.png'
  },
  {
    id: 'wedding-suits',
    name: 'Wedding Suits',
    count: 24,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Spring%20Wedding%20Bundles/indigo-2p-white-dusty-pink.png'
  },
  {
    id: 'luxury-suits',
    name: 'Luxury Suits',
    count: 15,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Fall%20Wedding%20Bundles/brown-suit-white-shirt-brown-tie.png'
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
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/black/main.png'
  },
  {
    id: 'tuxedos',
    name: 'Tuxedos',
    count: 16,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Tuxedo-Bundles/black-tuxedo-white-tix-shirt-black-blowtie.png'
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
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // GA4 tracking
  const {
    trackCollectionView,
    trackProductClick,
    trackQuickViewModal,
    trackAddCart,
    trackWishlistAdd,
    trackFilterChange
  } = useGA4();
  
  // Determine if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Header shrink animation values - keeping collapsed state more visible
  const headerHeight = useTransform(
    scrollY,
    [0, 100],
    isMobile ? ['280px', '140px'] : ['300px', '200px']
  );
  
  const headerOpacity = useTransform(
    scrollY,
    [0, 100],
    [1, 0.95]
  );
  
  const productCountOpacity = useTransform(
    scrollY,
    [0, 50],
    isMobile ? [1, 0] : [1, 1]
  );

  const springHeaderHeight = useSpring(headerHeight, { stiffness: 400, damping: 30 });
  const springHeaderOpacity = useSpring(headerOpacity, { stiffness: 400, damping: 30 });
  const springProductCountOpacity = useSpring(productCountOpacity, { stiffness: 400, damping: 30 });
  
  // Track scroll for floating filter button
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track collection view on mount
  useEffect(() => {
    trackCollectionView('Suits Collection', suitProducts);
  }, []);

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all' 
    ? suitProducts 
    : suitProducts.filter(p => p.subcategory === selectedCategory);

  // Track category filter changes
  useEffect(() => {
    if (selectedCategory !== 'all') {
      trackFilterChange('Suits Collection', { category: selectedCategory });
    }
  }, [selectedCategory]);

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
        // Track wishlist add
        const product = suitProducts.find(p => p.id === productId);
        if (product) {
          trackWishlistAdd(product);
        }
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
    
    // Track quick view
    trackQuickViewModal(product);
    trackProductClick(product, 'Suits Collection');
  };

  // Close modal when clicking outside
  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setSelectedProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Collapsible Category Filter Navigation */}
      <motion.section 
        className={cn(
          "sticky top-0 z-40 bg-white border-b transition-shadow duration-300",
          scrolled ? "shadow-lg border-b-2" : "shadow-sm"
        )}
        style={{ 
          height: springHeaderHeight,
          opacity: springHeaderOpacity
        }}
      >
        <div className="relative h-full">
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

          {/* Categories - Dynamic sizing based on scroll */}
          <div
            ref={categoryScrollRef}
            className={cn(
              "flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-12 md:px-16 h-full items-center",
              scrolled ? "py-2" : "py-3 md:py-4"
            )}
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
                  "relative rounded-xl overflow-hidden cursor-pointer group transition-all shadow-lg",
                  scrolled && isMobile 
                    ? "w-[140px] h-[100px]"  // Smaller when scrolled on mobile
                    : isMobile 
                      ? "w-[220px] h-[160px]"  // Large size on mobile
                      : scrolled
                        ? "w-[160px] h-[120px]"  // Smaller when scrolled on desktop
                        : "w-[200px] h-[200px]",  // Normal size on desktop
                  selectedCategory === category.id && "ring-2 ring-black ring-offset-2"
                )}>
                  {category.image ? (
                    <>
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 220px, 200px"
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
                  {/* Text positioned at bottom with gradient overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                    <h3 className={cn(
                      "font-semibold",
                      scrolled && isMobile ? "text-sm" : isMobile ? "text-lg" : scrolled ? "text-base" : "text-lg"
                    )}>
                      {category.name}
                    </h3>
                    {/* Hide item count on mobile when scrolled */}
                    {(!scrolled || !isMobile) && (
                      <p className={cn(
                        "opacity-90",
                        scrolled ? "text-xs" : "text-sm"
                      )}>
                        {category.count} items
                      </p>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Product count bar - Hidden on mobile when scrolled */}
        <motion.div 
          className="px-4 md:px-8 py-2 flex justify-between items-center border-t bg-gray-50"
          style={{ opacity: springProductCountOpacity, display: scrolled && isMobile ? 'none' : 'flex' }}
        >
          <span className="text-xs md:text-sm text-gray-600">
            {filteredProducts.length} products
          </span>
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
            <Grid3X3 className="w-4 h-4" />
            <span>Grid View</span>
          </div>
        </motion.div>
      </motion.section>

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
                  onClick={() => {
                    if (selectedProduct && selectedSize) {
                      const productWithDetails = {
                        ...selectedProduct,
                        size: selectedSize,
                        quantity: quantity
                      };
                      trackAddCart(productWithDetails);
                      // TODO: Actually add to cart
                      setSelectedProduct(null); // Close modal after adding
                    }
                  }}
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