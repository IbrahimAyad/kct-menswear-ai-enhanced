'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Eye
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
  const [gridView, setGridView] = useState<'large' | 'small'>('large');
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [visibleProducts, setVisibleProducts] = useState(12);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Filter products based on selected category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
    setVisibleProducts(12); // Reset visible products on category change
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
    setVisibleProducts(prev => prev + 12);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Title Section */}
      <section className="bg-white pt-20 pb-8 px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600 text-sm md:text-base mb-2 uppercase tracking-wider">{subtitle}</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-3">
            {title}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            {description}
          </p>
        </div>
      </section>

      {/* Category Filter Navigation */}
      <section className="sticky top-0 z-40 bg-white border-t border-b">
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
            className="flex gap-4 overflow-x-auto scrollbar-hide px-16 py-6"
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
                "relative w-[200px] h-[250px] rounded-lg overflow-hidden cursor-pointer group",
                selectedCategory === 'all' && "ring-2 ring-burgundy"
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-burgundy to-burgundy-700 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Grid className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-semibold text-lg">All Products</p>
                    <p className="text-sm opacity-80">{products.length} items</p>
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
                  "relative w-[200px] h-[250px] rounded-lg overflow-hidden cursor-pointer group",
                  selectedCategory === category.id && "ring-2 ring-burgundy"
                )}>
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm opacity-80">{category.count} items</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-8 py-4 flex justify-between items-center border-t">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            
            <div className="w-px h-6 bg-gray-300" />
            
            <span className="text-sm text-gray-600">
              {filteredProducts.length} products
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setGridView('large')}
              className={cn(
                "p-2 rounded transition-colors",
                gridView === 'large' ? "bg-gray-200" : "hover:bg-gray-100"
              )}
              aria-label="Large grid"
            >
              <Grid2X2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setGridView('small')}
              className={cn(
                "p-2 rounded transition-colors",
                gridView === 'small' ? "bg-gray-200" : "hover:bg-gray-100"
              )}
              aria-label="Small grid"
            >
              <Grid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-8 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "grid gap-6",
              gridView === 'large' 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            )}
          >
            {filteredProducts.slice(0, visibleProducts).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className={cn(
                  "relative overflow-hidden bg-gray-100 rounded-lg",
                  gridView === 'large' ? "aspect-[3/4]" : "aspect-[2/3]"
                )}>
                  {/* Badges */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-black text-white px-3 py-1 text-xs font-semibold">
                        NEW
                      </span>
                    )}
                    {product.isSale && (
                      <span className="bg-red-500 text-white px-3 py-1 text-xs font-semibold">
                        SALE
                      </span>
                    )}
                  </div>

                  {/* Like button */}
                  <button
                    onClick={() => toggleLike(product.id)}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-all"
                    aria-label="Add to wishlist"
                  >
                    <Heart 
                      className={cn(
                        "w-5 h-5 transition-colors",
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
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes={gridView === 'large' ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 50vw, 20vw"}
                    />
                  </Link>

                  {/* Quick Add Overlay */}
                  <AnimatePresence>
                    {hoveredProduct === product.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur"
                      >
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-burgundy hover:bg-burgundy-700"
                          >
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Quick Add
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="px-3"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Product Info */}
                <div className="mt-4">
                  <h3 className={cn(
                    "font-medium text-gray-900",
                    gridView === 'large' ? "text-lg" : "text-sm"
                  )}>
                    {product.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={cn(
                      "font-semibold",
                      gridView === 'large' ? "text-lg" : "text-base"
                    )}>
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className={cn(
                        "text-gray-500 line-through",
                        gridView === 'large' ? "text-base" : "text-sm"
                      )}>
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
          <div className="text-center mt-12">
            <Button
              onClick={loadMore}
              size="lg"
              variant="outline"
              className="min-w-[200px]"
            >
              Load More ({filteredProducts.length - visibleProducts} remaining)
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}