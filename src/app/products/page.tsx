'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUnifiedShop } from '@/hooks/useUnifiedShop';
import LargeProductGrid from '@/components/products/LargeProductGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Search, 
  Filter, 
  X, 
  ChevronDown,
  Sparkles,
  TrendingUp,
  Package,
  Tag,
  Grid2x2,
  Grid3x3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { getAllPresetIds, getFilterPreset } from '@/lib/config/filter-presets';
import { formatFilterDisplay } from '@/lib/utils/url-filters';

function UnifiedProductsContent() {
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'2x2' | '3x3'>('2x2');
  
  const {
    products,
    loading,
    error,
    totalCount,
    filteredCount,
    facets,
    suggestions,
    pagination,
    presetMetadata,
    filters,
    activePreset,
    updateFilters,
    resetFilters,
    applyPreset,
    clearPreset,
    toggleFilter,
    search,
    setPage,
    setSortBy,
    isFilterActive,
    getShareableLink
  } = useUnifiedShop({
    autoFetch: true,
    debounceDelay: 300
  });
  
  // Calculate active filter count
  const activeFilterCount = Object.keys(filters).filter(key => 
    filters[key as keyof typeof filters] !== undefined && 
    key !== 'page' && 
    key !== 'limit' && 
    key !== 'sortBy'
  ).length;
  
  // Get preset collections for quick access
  const presetCollections = [
    { id: 'black-tie', icon: '🎩', name: 'Black Tie' },
    { id: 'wedding-guest', icon: '💒', name: 'Wedding Guest' },
    { id: 'business-professional', icon: '💼', name: 'Business' },
    { id: 'prom-special', icon: '🌟', name: 'Prom 2025' },
    { id: 'complete-looks-199', icon: '💰', name: '$199 Bundles' },
    { id: 'all-black', icon: '⚫', name: 'All Black' },
    { id: 'navy-collection', icon: '🔷', name: 'Navy' },
    { id: 'summer-wedding', icon: '☀️', name: 'Summer' }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Preset Header if active */}
      {presetMetadata && (
        <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-serif flex items-center gap-3">
                  <span className="text-4xl">{presetMetadata.icon}</span>
                  {presetMetadata.name}
                </h1>
                <p className="mt-2 text-burgundy-100">{presetMetadata.description}</p>
              </div>
              <Button
                onClick={clearPreset}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Preset
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Header */}
      <div className="bg-white border-b border-gold-200/30 sticky top-0 z-30 shadow-sm backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Top Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-serif bg-gradient-to-r from-burgundy-700 to-burgundy-500 bg-clip-text text-transparent">
                {activePreset ? presetMetadata?.name : 'Shop All Products'}
              </h1>
              <div className="flex gap-2">
                <Badge className="bg-gold-100 text-burgundy-700 border-gold-300">
                  {totalCount} total
                </Badge>
                {filteredCount !== totalCount && (
                  <Badge className="bg-burgundy-100 text-burgundy-700 border-burgundy-300">
                    {filteredCount} filtered
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={filters.search || ''}
                  onChange={(e) => search(e.target.value)}
                  placeholder="Search suits, bundles, colors..."
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-300 transition-all duration-200 hover:border-burgundy-200"
                />
                {filters.search && (
                  <button
                    onClick={() => search('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Layout Toggle */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLayoutMode('2x2')}
                  className={cn(
                    "p-2 rounded transition-colors",
                    layoutMode === '2x2' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  )}
                  title="Large Grid"
                >
                  <Grid2x2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLayoutMode('3x3')}
                  className={cn(
                    "p-2 rounded transition-colors",
                    layoutMode === '3x3' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  )}
                  title="Medium Grid"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-burgundy-200 hover:bg-burgundy-50 hover:border-burgundy-300 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2 text-burgundy-600" />
                <span className="text-burgundy-700">Filters</span>
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 bg-burgundy-500 text-white">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
              
              <select
                value={filters.sortBy || 'newest'}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2.5 border-2 border-gold-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-300 bg-white hover:border-gold-300 transition-colors text-burgundy-700 font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
                <option value="trending">Trending</option>
                <option value="ai-score">AI Recommended</option>
              </select>
            </div>
          </div>
          
          {/* Preset Collections Quick Access */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {presetCollections.map(preset => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all whitespace-nowrap",
                  activePreset === preset.id
                    ? "bg-burgundy-600 border-burgundy-600 text-white"
                    : "bg-white border-gold-200 hover:border-burgundy-300 text-burgundy-700"
                )}
              >
                <span className="text-lg">{preset.icon}</span>
                <span className="text-sm font-medium">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="bg-burgundy-50 border-b border-burgundy-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-burgundy-700">Active Filters:</span>
              {Object.entries(filters).map(([key, value]) => {
                if (!value || key === 'page' || key === 'limit' || key === 'sortBy') return null;
                
                const displayValue = Array.isArray(value) 
                  ? value.map(v => formatFilterDisplay(key, v)).join(', ')
                  : formatFilterDisplay(key, value);
                
                return (
                  <Badge
                    key={key}
                    className="bg-white border-burgundy-200 text-burgundy-700 flex items-center gap-1"
                  >
                    {displayValue}
                    <button
                      onClick={() => updateFilters({ [key]: undefined })}
                      className="ml-1 hover:text-burgundy-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                );
              })}
              <Button
                onClick={resetFilters}
                variant="ghost"
                size="sm"
                className="text-burgundy-600 hover:text-burgundy-700"
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b border-gray-200"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {/* Product Type Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.includeBundles !== false}
                        onChange={(e) => updateFilters({ includeBundles: e.target.checked })}
                        className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                      />
                      <span className="text-sm">Complete Looks</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.includeIndividual !== false}
                        onChange={(e) => updateFilters({ includeIndividual: e.target.checked })}
                        className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                      />
                      <span className="text-sm">Individual Items</span>
                    </label>
                  </div>
                </div>
                
                {/* Bundle Tier Filter */}
                {filters.includeBundles !== false && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Bundle Tier</label>
                    <div className="space-y-2">
                      {facets.bundleTiers.map(tier => (
                        <label key={tier.tier} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isFilterActive('bundleTier', tier.tier)}
                            onChange={() => toggleFilter('bundleTier', tier.tier)}
                            className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                          />
                          <span className="text-sm">${tier.price} ({tier.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Color Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Colors</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {facets.colors.slice(0, 10).map(color => (
                      <label key={color.name} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isFilterActive('color', color.name)}
                          onChange={() => toggleFilter('color', color.name)}
                          className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                        />
                        <span className="text-sm capitalize">{color.name} ({color.count})</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Occasion Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Occasions</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {facets.occasions.map(occasion => (
                      <label key={occasion.name} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isFilterActive('occasions', occasion.name)}
                          onChange={() => toggleFilter('occasions', occasion.name)}
                          className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                        />
                        <span className="text-sm">{occasion.name} ({occasion.count})</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Price Range Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Price Range</label>
                  <div className="space-y-2">
                    {facets.priceRanges.map(range => (
                      <button
                        key={range.label}
                        onClick={() => updateFilters({ minPrice: range.min, maxPrice: range.max })}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                          filters.minPrice === range.min && filters.maxPrice === range.max
                            ? "bg-burgundy-100 text-burgundy-700 font-medium"
                            : "hover:bg-gray-100"
                        )}
                      >
                        {range.label} ({range.count})
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Special Filters */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Special</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.trending === true}
                        onChange={(e) => updateFilters({ trending: e.target.checked || undefined })}
                        className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                      />
                      <span className="text-sm flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.onSale === true}
                        onChange={(e) => updateFilters({ onSale: e.target.checked || undefined })}
                        className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                      />
                      <span className="text-sm flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        On Sale
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.newArrivals === true}
                        onChange={(e) => updateFilters({ newArrivals: e.target.checked || undefined })}
                        className="rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                      />
                      <span className="text-sm flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        New Arrivals
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Suggestions */}
        {suggestions?.didYouMean && (
          <div className="mb-6 p-4 bg-gold-50 border border-gold-200 rounded-lg">
            <p className="text-sm text-burgundy-700">
              Did you mean: 
              <button
                onClick={() => search(suggestions.didYouMean!)}
                className="ml-2 font-medium underline hover:text-burgundy-900"
              >
                {suggestions.didYouMean}
              </button>
            </p>
          </div>
        )}
        
        {/* Product Grid - Large 2x2 Layout */}
        <LargeProductGrid
          products={products}
          loading={loading}
          onQuickView={(product) => {
            // Handle quick view
            console.log('Quick view:', product);
          }}
          showLayoutToggle={false}
          defaultLayout={layoutMode}
        />
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setPage(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                variant="outline"
                className="border-burgundy-200 hover:bg-burgundy-50"
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      variant={pagination.currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      className={cn(
                        "w-10 h-10",
                        pagination.currentPage === pageNum
                          ? "bg-burgundy-600 hover:bg-burgundy-700 text-white"
                          : "border-burgundy-200 hover:bg-burgundy-50 text-burgundy-700"
                      )}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {pagination.totalPages > 5 && (
                  <>
                    <span className="px-2 text-gray-500">...</span>
                    <Button
                      onClick={() => setPage(pagination.totalPages)}
                      variant="outline"
                      size="sm"
                      className="w-10 h-10 border-burgundy-200 hover:bg-burgundy-50 text-burgundy-700"
                    >
                      {pagination.totalPages}
                    </Button>
                  </>
                )}
              </div>
              
              <Button
                onClick={() => setPage(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                variant="outline"
                className="border-burgundy-200 hover:bg-burgundy-50"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UnifiedProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-burgundy-600" />
      </div>
    }>
      <UnifiedProductsContent />
    </Suspense>
  );
}