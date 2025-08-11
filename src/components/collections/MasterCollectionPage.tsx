'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  ShoppingBag,
  X,
  Grid,
  Grid2X2,
  Eye,
  Grid3X3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  image: string;
  count: number;
  description?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  category: string;
  tags: string[];
  isNew?: boolean;
  isSale?: boolean;
}

interface MasterCollectionPageProps {
  title: string;
  subtitle: string;
  description: string;
  categories: Category[];
  products: Product[];
  heroImage?: string;
}

export function MasterCollectionPage({
  title,
  subtitle,
  description,
  categories,
  products,
  heroImage
}: MasterCollectionPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [visibleProducts, setVisibleProducts] = useState(16);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Determine if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Header shrink animation values
  const headerHeight = useTransform(
    scrollY,
    [0, 100],
    isMobile ? ['160px', '70px'] : ['250px', '180px']
  );
  
  const headerOpacity = useTransform(
    scrollY,
    [0, 100],
    [1, 1]
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

  // Filter products based on selected category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
    setVisibleProducts(16); // Reset visible products on category change
  }, [selectedCategory, products]);

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

  // Load more products
  const loadMore = () => {
    setVisibleProducts(prev => prev + 16);
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Collapsible Category Filter Navigation */}
      <motion.section 
        className="sticky top-0 z-40 bg-white border-b"
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

          {/* Categories - Enhanced for mobile */}
          <div
            ref={categoryScrollRef}
            className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-12 md:px-16 py-3 md:py-4 h-full items-center"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* All Products - Larger on mobile */}
            <motion.button
              onClick={() => setSelectedCategory('all')}
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={cn(
                "relative rounded-xl overflow-hidden cursor-pointer group transition-all",
                isMobile ? "w-[140px] h-[100px]" : "w-[180px] h-[180px]",
                selectedCategory === 'all' && "ring-2 ring-burgundy"
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-burgundy to-burgundy-700 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Grid3X3 className={cn(isMobile ? "w-6 h-6" : "w-8 h-8", "mx-auto mb-2")} />
                    <p className={cn("font-semibold", isMobile ? "text-sm" : "text-lg")}>All Products</p>
                    <p className={cn("opacity-80", isMobile ? "text-xs" : "text-sm")}>{products.length} items</p>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Category Cards - Larger on mobile */}
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={cn(
                  "relative rounded-xl overflow-hidden cursor-pointer group transition-all",
                  isMobile ? "w-[140px] h-[100px]" : "w-[180px] h-[180px]",
                  selectedCategory === category.id && "ring-2 ring-burgundy"
                )}>
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <h3 className={cn("font-semibold", isMobile ? "text-sm" : "text-base")}>{category.name}</h3>
                    <p className={cn("opacity-90", isMobile ? "text-xs" : "text-sm")}>{category.count} items</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Product Count Bar - Hidden on mobile when scrolled */}
        <motion.div 
          className="px-4 md:px-8 py-2 flex justify-between items-center border-t bg-gray-50"
          style={{ opacity: springProductCountOpacity, display: scrolled && isMobile ? 'none' : 'flex' }}
        >
          <span className="text-xs md:text-sm text-gray-600">
            {filteredProducts.length} products
          </span>
        </motion.div>
      </motion.section>

      {/* Floating Filter Button - Appears when header shrinks on mobile */}
      <AnimatePresence>
        {scrolled && isMobile && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setShowFilters(true)}
            className="fixed top-20 right-4 z-50 bg-black text-white p-3 rounded-full shadow-2xl"
          >
            <Filter className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mobile Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-50 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Filter content here */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid - Minimal design matching reference */}
      <section className="px-2 md:px-6 lg:px-8 py-2 md:py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "grid gap-2 md:gap-3",
              isMobile ? "grid-cols-2" : "grid-cols-4"
            )}
          >
            {filteredProducts.slice(0, visibleProducts).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="group relative"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <Link href={`/products/${product.id}`} className="block">
                  <div className="relative overflow-hidden bg-gray-50 rounded-lg aspect-[3/4]">
                    {/* Product Image */}
                    <Image
                      src={hoveredProduct === product.id && product.hoverImage 
                        ? product.hoverImage 
                        : product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes={isMobile ? "50vw" : "25vw"}
                      priority={index < 8}
                      loading={index < 8 ? 'eager' : 'lazy'}
                    />
                    
                    {/* Product Info Overlay - Bottom left like reference */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 md:p-4">
                      <h3 className="text-white font-medium text-sm md:text-base line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-white font-semibold text-sm md:text-lg">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-white/70 line-through text-xs md:text-sm">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick View button - Top right, minimal */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedProduct(product);
                      }}
                      className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
                      aria-label="Quick view"
                    >
                      Quick View
                    </button>

                    {/* Sale/New Badge - Top left */}
                    {(product.isSale || product.isNew) && (
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.isNew && (
                          <span className="bg-black text-white px-2 py-0.5 text-[10px] md:text-xs font-medium rounded">
                            NEW
                          </span>
                        )}
                        {product.isSale && (
                          <span className="bg-red-500 text-white px-2 py-0.5 text-[10px] md:text-xs font-medium rounded">
                            SALE
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Load More */}
        {visibleProducts < filteredProducts.length && (
          <div className="text-center mt-8 md:mt-12">
            <Button
              onClick={loadMore}
              variant="outline"
              className="px-8 py-3 border-gray-300 hover:border-gray-400"
            >
              Load More ({filteredProducts.length - visibleProducts} remaining)
            </Button>
          </div>
        )}
      </section>

      {/* Quick View Modal - Minimal design */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[3/4] bg-gray-50">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-semibold mb-2">{selectedProduct.name}</h2>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl font-bold">${selectedProduct.price}</span>
                    {selectedProduct.originalPrice && (
                      <span className="text-xl text-gray-500 line-through">
                        ${selectedProduct.originalPrice}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2 text-sm text-gray-600">CATEGORY</h3>
                      <p className="capitalize">{selectedProduct.category}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2 text-sm text-gray-600">TAGS</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button className="flex-1 bg-black hover:bg-gray-900">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-gray-300"
                        onClick={() => toggleLike(selectedProduct.id)}
                      >
                        <Heart className={cn(
                          "w-4 h-4",
                          likedProducts.has(selectedProduct.id) && "fill-red-500 text-red-500"
                        )} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}