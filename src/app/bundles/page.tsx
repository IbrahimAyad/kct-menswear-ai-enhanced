'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Heart, ShoppingBag, Sliders, X, Check, Clock, Tag, Grid3x3, Grid2x2, LayoutGrid } from 'lucide-react';
import { bundleProductsWithImages } from '@/lib/products/bundleProductsWithImages';
import BundleCard from '@/components/bundles/BundleCard';
import MinimalBundleCard from '@/components/products/MinimalBundleCard';
import LargeBundleCard from '@/components/products/LargeBundleCard';
import BundleFilters from '@/components/bundles/BundleFilters';
import BundleHero from '@/components/bundles/BundleHero';
import BundleQuickView from '@/components/bundles/BundleQuickView';
import { useCart } from '@/hooks/useCart';
import { facebookTracking } from '@/lib/analytics/FacebookTrackingService';
import { useFacebookPageTracking } from '@/hooks/useFacebookTracking';

export default function BundleCollectionPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'newest'>('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<any>(null);
  const [layoutMode, setLayoutMode] = useState<'2x2' | '3x3' | '4x4'>('2x2');
  const { addItem } = useCart();

  // Track page views
  useFacebookPageTracking();

  // Track bundle views when quick view is opened
  useEffect(() => {
    if (selectedBundle) {
      facebookTracking.trackBundleInteraction(
        selectedBundle.name,
        selectedBundle.bundlePrice / 100,
        'view'
      );
    }
  }, [selectedBundle]);

  // Convert bundle to UnifiedProduct format for minimal cards
  const bundleToUnifiedProduct = (bundle: any) => ({
    id: bundle.id,
    name: bundle.name,
    price: bundle.bundlePrice,
    originalPrice: bundle.originalPrice,
    bundlePrice: bundle.bundlePrice,
    imageUrl: bundle.imageUrl,
    description: bundle.description,
    category: bundle.category,
    isBundle: true,
    inStock: true,
    trending: bundle.trending,
    aiScore: bundle.aiScore,
    occasions: bundle.occasions,
    savings: bundle.savings,
    bundleComponents: {
      suit: bundle.suit,
      shirt: bundle.shirt,
      tie: bundle.tie,
      pocketSquare: bundle.pocketSquare
    }
  });

  // Get unique colors from bundles
  const allColors = Array.from(new Set(
    bundleProductsWithImages.bundles.flatMap(b => [
      b.suit?.color,
      b.shirt?.color,
      b.tie?.color
    ].filter(Boolean))
  ));

  // Filter and sort bundles
  const filteredBundles = bundleProductsWithImages.bundles.filter(bundle => {
    if (selectedCategory !== 'all' && bundle.category !== selectedCategory) return false;
    if (selectedOccasion !== 'all' && !bundle.occasions.includes(selectedOccasion)) return false;
    if (selectedColor !== 'all' && 
        ![bundle.suit?.color, bundle.shirt?.color, bundle.tie?.color].includes(selectedColor)) return false;
    if (bundle.bundlePrice < priceRange[0] || bundle.bundlePrice > priceRange[1]) return false;
    return true;
  });

  const sortedBundles = [...filteredBundles].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.bundlePrice - b.bundlePrice;
      case 'price-high':
        return b.bundlePrice - a.bundlePrice;
      case 'newest':
        return b.id.localeCompare(a.id);
      case 'popular':
      default:
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
    }
  });

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Bundles', count: bundleProductsWithImages.bundles.length },
    { id: 'classic', name: 'Classic', count: bundleProductsWithImages.bundles.filter(b => b.category === 'classic').length },
    { id: 'bold', name: 'Bold', count: bundleProductsWithImages.bundles.filter(b => b.category === 'bold').length },
    { id: 'sophisticated', name: 'Sophisticated', count: bundleProductsWithImages.bundles.filter(b => b.category === 'sophisticated').length },
    { id: 'contemporary', name: 'Contemporary', count: bundleProductsWithImages.bundles.filter(b => b.category === 'contemporary').length },
    { id: 'wedding', name: 'Wedding', count: bundleProductsWithImages.bundles.filter(b => b.occasions?.includes('Wedding')).length },
    { id: 'prom', name: 'Prom', count: bundleProductsWithImages.bundles.filter(b => b.occasions?.includes('Prom')).length },
    { id: 'casual', name: 'Casual', count: bundleProductsWithImages.bundles.filter(b => b.pocketSquare).length }
  ];

  const occasions = [
    { id: 'all', name: 'All Occasions' },
    { id: 'Wedding', name: 'Weddings' },
    { id: 'Business', name: 'Business' },
    { id: 'Black Tie', name: 'Black Tie' },
    { id: 'Cocktail Party', name: 'Cocktail' },
    { id: 'Date Night', name: 'Date Night' },
    { id: 'Prom', name: 'Prom' },
    { id: 'Garden Party', name: 'Garden Party' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <BundleHero />

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-30 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-6">
              <h2 className="text-lg font-semibold">
                {sortedBundles.length} Curated Styles
              </h2>
              
              {/* Desktop Categories - Scrollable */}
              <div className="hidden lg:flex items-center space-x-3 overflow-x-auto">
                {categories.slice(0, 5).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.name}
                    <span className="ml-1.5 text-xs opacity-70">({cat.count})</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Layout Switcher */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLayoutMode('2x2')}
                  className={`p-2 rounded transition-colors ${
                    layoutMode === '2x2' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                  title="Large Grid"
                >
                  <Grid2x2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLayoutMode('3x3')}
                  className={`p-2 rounded transition-colors ${
                    layoutMode === '3x3' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                  title="Medium Grid"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLayoutMode('4x4')}
                  className={`p-2 rounded transition-colors ${
                    layoutMode === '4x4' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                  title="Compact Grid"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <Sliders className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters */}
      {showFilters && (
        <BundleFilters
          categories={categories}
          occasions={occasions}
          selectedCategory={selectedCategory}
          selectedOccasion={selectedOccasion}
          onCategoryChange={setSelectedCategory}
          onOccasionChange={setSelectedOccasion}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* All Bundles Grid - Dynamic Layout */}
        <div className={`grid ${
          layoutMode === '2x2' 
            ? 'grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12' 
            : layoutMode === '3x3'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
        }`}>
          {sortedBundles.map((bundle, index) => (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {layoutMode === '4x4' ? (
                <MinimalBundleCard
                  product={bundleToUnifiedProduct(bundle)}
                  onQuickView={() => setSelectedBundle(bundle)}
                  featured={index < 2}
                />
              ) : (
                <LargeBundleCard
                  product={bundleToUnifiedProduct(bundle)}
                  onQuickView={() => setSelectedBundle(bundle)}
                  layout={layoutMode}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {sortedBundles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No bundles match your filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedOccasion('all');
              }}
              className="text-black underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Custom Bundle CTA */}
        <div className="mt-20 bg-gradient-to-r from-gray-900 to-black rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Don't See Your Perfect Match?
          </h2>
          <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto">
            Create your own combination with our Custom Bundle Builder. 
            Choose from 100+ suit, shirt, and tie options with the same bundle savings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/custom-suits"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Create Custom Bundle
            </Link>
            <Link
              href="/style-quiz"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-black transition-colors"
            >
              Get AI Recommendations
            </Link>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2">Save Up to 15%</h3>
            <p className="text-sm text-gray-600">Bundle pricing on all combinations</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2">Free Express Shipping</h3>
            <p className="text-sm text-gray-600">On all bundle orders</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2">Style Consultation</h3>
            <p className="text-sm text-gray-600">Free virtual styling session included</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2">Easy Exchanges</h3>
            <p className="text-sm text-gray-600">Swap any piece within 30 days</p>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedBundle && (
        <BundleQuickView
          bundle={selectedBundle}
          onClose={() => setSelectedBundle(null)}
        />
      )}
    </div>
  );
}