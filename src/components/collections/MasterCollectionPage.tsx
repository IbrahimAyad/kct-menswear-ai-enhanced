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
    isMobile ? ['280px', '80px'] : ['280px', '200px']
  );
  
  const headerOpacity = useTransform(
    scrollY,
    [0, 100],
    isMobile ? [1, 0.3] : [1, 0.9]
  );
  
  const productCountOpacity = useTransform(
    scrollY,
    [0, 50],
    isMobile ? [1, 0] : [1, 1]
  );

  const springHeaderHeight = useSpring(headerHeight, { stiffness: isMobile ? 400 : 300, damping: 30 });
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

          {/* Categories */}
          <div
            ref={categoryScrollRef}
            className="flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide px-12 md:px-16 py-2 md:py-6 h-full items-center"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* All Products */}
            <motion.button
              onClick={() => setSelectedCategory('all')}
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={cn(
                "relative rounded-lg overflow-hidden cursor-pointer group",
                isMobile ? "w-[120px] h-[60px]" : "w-[200px] h-[200px]",
                selectedCategory === 'all' && "ring-2 ring-burgundy"
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-burgundy to-burgundy-700 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Grid3X3 className={cn(isMobile ? "w-5 h-5" : "w-8 h-8", "mx-auto mb-1")} />
                    <p className={cn("font-semibold", isMobile ? "text-xs" : "text-lg")}>All Products</p>
                    {!isMobile && <p className="text-sm opacity-80">{products.length} items</p>}
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Category Cards */}
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={cn(
                  "relative rounded-lg overflow-hidden cursor-pointer group",
                  isMobile ? "w-[120px] h-[60px]" : "w-[200px] h-[200px]",
                  selectedCategory === category.id && "ring-2 ring-burgundy"
                )}>
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 text-white">
                    <h3 className={cn("font-semibold", isMobile ? "text-xs" : "text-lg")}>{category.name}</h3>
                    {!isMobile && <p className="text-sm opacity-80">{category.count} items</p>}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Product Count Bar - Disappears on mobile when scrolled */}
        <motion.div 
          className="px-4 md:px-8 py-2 md:py-4 flex justify-between items-center border-t"
          style={{ opacity: springProductCountOpacity }}
        >
          <span className="text-xs md:text-sm text-gray-600">
            {filteredProducts.length} products
          </span>
        </motion.div>
      </motion.section>

      {/* Floating Filter Button - Appears when header shrinks */}
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

      {/* Products Grid - Optimized for 4x4 desktop, 3x3 mobile */}
      <section className="px-1 md:px-4 lg:px-8 py-4 md:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-3 md:grid-cols-4 gap-1 md:gap-2"
          >
            {filteredProducts.slice(0, visibleProducts).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="group relative"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="relative overflow-hidden bg-gray-100 rounded-lg aspect-[3/4]">
                  {/* Badges */}
                  <div className="absolute top-1 md:top-2 left-1 md:left-2 z-10 flex flex-col gap-1">
                    {product.isNew && (
                      <span className="bg-black text-white px-1 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-semibold">
                        NEW
                      </span>
                    )}
                    {product.isSale && (
                      <span className="bg-red-500 text-white px-1 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-semibold">
                        SALE
                      </span>
                    )}
                  </div>

                  {/* Like button */}
                  <button
                    onClick={() => toggleLike(product.id)}
                    className="absolute top-1 md:top-2 right-1 md:right-2 z-10 p-1 md:p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Add to wishlist"
                  >
                    <Heart 
                      className={cn(
                        "w-3 md:w-4 h-3 md:h-4 transition-colors",
                        likedProducts.has(product.id) 
                          ? "fill-red-500 text-red-500" 
                          : "text-gray-600"
                      )}
                    />
                  </button>

                  {/* Product Image */}
                  <Link href={`/products/${product.id}`}>
                    <Image
                      src={hoveredProduct === product.id && product.hoverImage 
                        ? product.hoverImage 
                        : product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      sizes="(max-width: 768px) 33vw, 25vw"
                      priority={index < 8}
                      loading={index < 8 ? 'eager' : 'lazy'}
                    />
                  </Link>

                  {/* Quick View button */}
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="absolute bottom-1 md:bottom-2 right-1 md:right-2 bg-white/95 backdrop-blur p-1.5 md:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
                    aria-label="Quick view"
                  >
                    <Eye className="w-3 md:w-4 h-3 md:h-4" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-1 md:p-3">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-xs md:text-sm font-medium text-gray-900 hover:text-burgundy transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm md:text-lg font-semibold">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs md:text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
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
              className="px-8 py-3"
            >
              Load More ({filteredProducts.length - visibleProducts} remaining)
            </Button>
          </div>
        )}
      </section>

      {/* Quick View Modal */}
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
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[3/4] bg-gray-100">
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
                  <h2 className="text-2xl font-semibold mb-4">{selectedProduct.name}</h2>
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
                      <h3 className="font-medium mb-2">Category</h3>
                      <p className="text-gray-600 capitalize">{selectedProduct.category}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button className="flex-1 bg-burgundy hover:bg-burgundy-600">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button variant="outline" onClick={() => toggleLike(selectedProduct.id)}>
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