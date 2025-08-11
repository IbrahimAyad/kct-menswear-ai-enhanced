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

// Prom-specific categories
const promCategories = [
  {
    id: 'all',
    name: 'All Prom',
    count: 121,
    image: null,
    bgColor: 'from-purple-900 to-gold-600'
  },
  {
    id: 'prom-tuxedos',
    name: 'Prom Tuxedos',
    count: 25,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Tuxedo-Bundles/black-tuxedo-white-tix-shirt-black-blowtie.png'
  },
  {
    id: 'prom-blazers',
    name: 'Prom Blazers',
    count: 30,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/prom_blazer/mens_red_floral_pattern_prom_blazer_model_1018.webp'
  },
  {
    id: 'sparkle-sequin',
    name: 'Sparkle & Sequin',
    count: 15,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/velvet-blazer/mens_green_paisley_pattern_velvet_model_1089.webp'
  },
  {
    id: 'prom-vests',
    name: 'Prom Vests',
    count: 20,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/dusty-sage-model.png'
  },
  {
    id: 'prom-accessories',
    name: 'Prom Accessories',
    count: 25,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/powder-blue-model.png'
  },
  {
    id: 'prom-shoes',
    name: 'Prom Shoes',
    count: 21,
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/7d203d2a-63b7-46d3-9749-1f203e4ccc00/public'
  }
];

// Prom products
const promProducts = [
  // Prom Tuxedos
  {
    id: 'burgundy-prom-tux',
    name: 'Burgundy Prom Tuxedo',
    price: 249,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/burgundy/burgundy-tux-main.jpg',
    category: 'prom',
    subcategory: 'prom-tuxedos'
  },
  {
    id: 'midnight-blue-prom-tux',
    name: 'Midnight Blue Prom Tuxedo',
    price: 299,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/midnight-blue/midnight-tux-main.jpg',
    category: 'prom',
    subcategory: 'prom-tuxedos'
  },
  {
    id: 'black-prom-tux',
    name: 'Black Prom Tuxedo',
    price: 229,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Tuxedo-Bundles/black-tuxedo-white-tix-shirt-black-blowtie.png',
    category: 'prom',
    subcategory: 'prom-tuxedos'
  },
  {
    id: 'navy-prom-tux',
    name: 'Navy Prom Tuxedo',
    price: 259,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/navy/navy-tux-main.jpg',
    category: 'prom',
    subcategory: 'prom-tuxedos'
  },
  {
    id: 'white-prom-tux',
    name: 'White Prom Tuxedo',
    price: 279,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/white/white-tux-main.jpg',
    category: 'prom',
    subcategory: 'prom-tuxedos'
  },

  // Prom Blazers
  {
    id: 'rose-gold-blazer',
    name: 'Rose Gold Prom Blazer',
    price: 289,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/prom_blazer/mens_gold_brown_floral_prom_blazer.webp',
    category: 'prom',
    subcategory: 'prom-blazers'
  },
  {
    id: 'red-floral-blazer',
    name: 'Red Floral Prom Blazer',
    price: 269,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/prom_blazer/mens_red_floral_pattern_prom_blazer_model_1018.webp',
    category: 'prom',
    subcategory: 'prom-blazers'
  },
  {
    id: 'black-floral-blazer',
    name: 'Black Floral Prom Blazer',
    price: 269,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/prom_blazer/mens_black_floral_prom_blazer.webp',
    category: 'prom',
    subcategory: 'prom-blazers'
  },
  {
    id: 'bronze-geometric-blazer',
    name: 'Bronze Geometric Blazer',
    price: 279,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/prom_blazer/mens_bronze_black_geometric_blazer.webp',
    category: 'prom',
    subcategory: 'prom-blazers'
  },
  {
    id: 'royal-blue-blazer',
    name: 'Royal Blue Prom Blazer',
    price: 259,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/royal-blue/royal-blazer.jpg',
    category: 'prom',
    subcategory: 'prom-blazers'
  },

  // Sparkle & Sequin
  {
    id: 'emerald-velvet-blazer',
    name: 'Emerald Velvet Blazer',
    price: 199,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/velvet-blazer/mens_green_paisley_pattern_velvet_model_1089.webp',
    category: 'prom',
    subcategory: 'sparkle-sequin'
  },
  {
    id: 'royal-blue-velvet',
    name: 'Royal Blue Velvet Gold Trim',
    price: 219,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/velvet-blazer/mens_royal_blue_velvet_gold_trim.webp',
    category: 'prom',
    subcategory: 'sparkle-sequin'
  },
  {
    id: 'burgundy-sequin-blazer',
    name: 'Burgundy Sequin Blazer',
    price: 329,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/velvet-blazer/burgundy-velvet.webp',
    category: 'prom',
    subcategory: 'sparkle-sequin'
  },
  {
    id: 'gold-sparkle-blazer',
    name: 'Gold Sparkle Blazer',
    price: 349,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/gold/gold-main.jpg',
    category: 'prom',
    subcategory: 'sparkle-sequin'
  },

  // Prom Vests
  {
    id: 'dusty-sage-vest',
    name: 'Dusty Sage Vest Set',
    price: 89,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/dusty-sage-model.png',
    category: 'prom',
    subcategory: 'prom-vests'
  },
  {
    id: 'burgundy-vest',
    name: 'Burgundy Vest Set',
    price: 89,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/burgundy-model.png',
    category: 'prom',
    subcategory: 'prom-vests'
  },
  {
    id: 'navy-vest',
    name: 'Navy Vest Set',
    price: 79,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/navy-model.png',
    category: 'prom',
    subcategory: 'prom-vests'
  },
  {
    id: 'gold-vest',
    name: 'Gold Vest Set',
    price: 99,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-solid-vest-tie/gold-model.png',
    category: 'prom',
    subcategory: 'prom-vests'
  },
  {
    id: 'silver-vest',
    name: 'Silver Vest Set',
    price: 89,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/suits/silver/silver-vest.jpg',
    category: 'prom',
    subcategory: 'prom-vests'
  },

  // Prom Accessories
  {
    id: 'powder-blue-suspenders',
    name: 'Powder Blue Suspender Set',
    price: 45,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/main-suspender-bowtie-set/powder-blue-model.png',
    category: 'prom',
    subcategory: 'prom-accessories'
  },
  {
    id: 'burgundy-bowtie',
    name: 'Burgundy Bowtie Set',
    price: 35,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/burgundy.jpg',
    category: 'prom',
    subcategory: 'prom-accessories'
  },
  {
    id: 'gold-cufflinks',
    name: 'Gold Prom Cufflinks',
    price: 29,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/accessories.webp',
    category: 'prom',
    subcategory: 'prom-accessories'
  },
  {
    id: 'dusty-pink-bowtie',
    name: 'Dusty Pink Bowtie',
    price: 32,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/dusty-pink.jpg',
    category: 'prom',
    subcategory: 'prom-accessories'
  },
  {
    id: 'navy-pocket-square',
    name: 'Navy Pocket Square Set',
    price: 25,
    image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/casual-bundles/navy-white-shirt-white-pocket-sqaure.png',
    category: 'prom',
    subcategory: 'prom-accessories'
  },

  // Prom Shoes
  {
    id: 'black-patent-shoes',
    name: 'Black Patent Dress Shoes',
    price: 129,
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/7d203d2a-63b7-46d3-9749-1f203e4ccc00/public',
    category: 'prom',
    subcategory: 'prom-shoes'
  },
  {
    id: 'brown-leather-shoes',
    name: 'Brown Leather Dress Shoes',
    price: 119,
    image: 'https://pub-8ea0502158a94b8ca8a7abb9e18a57e8.r2.dev/Category-Images/shoes.webp',
    category: 'prom',
    subcategory: 'prom-shoes'
  },
  {
    id: 'burgundy-velvet-loafers',
    name: 'Burgundy Velvet Loafers',
    price: 149,
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/5e4f8b2c-7a3d-4f1e-9b8c-2d1a3f4e5678/public',
    category: 'prom',
    subcategory: 'prom-shoes'
  },
  {
    id: 'gold-metallic-shoes',
    name: 'Gold Metallic Dress Shoes',
    price: 159,
    image: 'https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/8f2d1a3b-4c5e-6f7g-8h9i-0j1k2l3m4n5o/public',
    category: 'prom',
    subcategory: 'prom-shoes'
  }
];

export default function PromCollectionPage() {
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
    trackCollectionView('Prom Collection', promProducts);
  }, []);

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'all' 
    ? promProducts 
    : promProducts.filter(p => p.subcategory === selectedCategory);

  // Track category filter changes
  useEffect(() => {
    if (selectedCategory !== 'all') {
      trackFilterChange('Prom Collection', { category: selectedCategory });
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
        const product = promProducts.find(p => p.id === productId);
        if (product) {
          trackWishlistAdd(product);
        }
      }
      return newSet;
    });
  };

  // Handle quick view
  const handleQuickView = (product: typeof promProducts[0]) => {
    const isAccessory = product.subcategory === 'prom-accessories';
    const isShoe = product.subcategory === 'prom-shoes';
    
    setSelectedProduct({
      ...product,
      images: [product.image],
      sizes: isAccessory ? ['One Size'] : 
             isShoe ? ['8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'] :
             ['36', '38', '40', '42', '44', '46', '48'],
      description: 'Make your prom night unforgettable with premium style'
    });
    setSelectedSize('');
    setQuantity(1);
    
    // Track quick view
    trackQuickViewModal(product);
    trackProductClick(product, 'Prom Collection');
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
            {promCategories.map((category) => (
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
                      category.bgColor || "from-purple-900 to-gold-600"
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