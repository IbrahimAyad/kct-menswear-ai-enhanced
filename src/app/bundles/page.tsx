'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Heart, ShoppingBag, Sliders, X, Check, Clock, Tag } from 'lucide-react';
import { bundleProductsWithImages } from '@/lib/products/bundleProductsWithImages';
import BundleCard from '@/components/bundles/BundleCard';
import MinimalBundleCard from '@/components/products/MinimalBundleCard';
import BundleFilters from '@/components/bundles/BundleFilters';
import BundleHero from '@/components/bundles/BundleHero';
import BundleQuickView from '@/components/bundles/BundleQuickView';
import { useCart } from '@/hooks/useCart';
import { facebookTracking } from '@/lib/analytics/FacebookTrackingService';
import { useFacebookPageTracking } from '@/hooks/useFacebookTracking';

export default function BundleCollectionPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'newest'>('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<any>(null);
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

  // Filter and sort bundles
  const filteredBundles = bundleProductsWithImages.bundles.filter(bundle => {
    if (selectedCategory !== 'all' && bundle.category !== selectedCategory) return false;
    if (selectedOccasion !== 'all' && !bundle.occasions.includes(selectedOccasion)) return false;
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
    { id: 'classic', name: 'The Classics', count: 9 },
    { id: 'bold', name: 'Bold & Modern', count: 8 },
    { id: 'sophisticated', name: 'Sophisticated', count: 7 },
    { id: 'contemporary', name: 'Contemporary', count: 6 }
  ];

  const occasions = [
    { id: 'all', name: 'All Occasions' },
    { id: 'Wedding', name: 'Weddings' },
    { id: 'Business', name: 'Business' },
    { id: 'Black Tie', name: 'Black Tie' },
    { id: 'Cocktail Party', name: 'Cocktail' },
    { id: 'Date Night', name: 'Date Night' }
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
              
              {/* Desktop Categories */}
              <div className="hidden lg:flex items-center space-x-4">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.name}
                    {cat.count && (
                      <span className="ml-2 text-xs opacity-70">({cat.count})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <Sliders className="w-4 h-4" />
                Filters
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
        {/* Featured Section */}
        {selectedCategory === 'all' && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-red-500" />
                Trending This Season
              </h2>
              <Link 
                href="/bundles/trending"
                className="text-sm font-medium text-gray-600 hover:text-black"
              >
                View All Trending →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {sortedBundles.filter(b => b.trending).slice(0, 3).map((bundle) => (
                <MinimalBundleCard
                  key={bundle.id}
                  product={bundleToUnifiedProduct(bundle)}
                  onQuickView={() => setSelectedBundle(bundle)}
                  featured
                />
              ))}
            </div>
          </div>
        )}

        {/* All Bundles Grid - Minimal Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
          {sortedBundles.map((bundle, index) => (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <MinimalBundleCard
                product={bundleToUnifiedProduct(bundle)}
                onQuickView={() => setSelectedBundle(bundle)}
                featured={index < 2}
              />
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