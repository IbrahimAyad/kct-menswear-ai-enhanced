"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Search, 
  Filter, 
  X, 
  ChevronDown,
  Grid3X3,
  List,
  SlidersHorizontal 
} from "lucide-react";
import { EnhancedProduct, ProductFilters, ProductSortOptions } from "@/lib/supabase/types";
import { SupabaseProductCard } from "@/components/shop/SupabaseProductCard";
import { ProductFiltersPanel } from "@/components/shop/ProductFiltersPanel";
import { CategoryPills, menswearCategories } from "@/components/shop/CategoryPills";
import { cn } from "@/lib/utils/cn";

interface ProductsResponse {
  products: EnhancedProduct[]
  totalCount: number
  currentPage: number
  totalPages: number
}

interface FilterMetadata {
  categories: string[]
  brands: string[]
  colors: string[]
  priceRange: { min: number; max: number }
}

function ProductsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [products, setProducts] = useState<EnhancedProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const [filters, setFilters] = useState<ProductFilters>({})
  const [sort, setSort] = useState<ProductSortOptions>({ field: 'created_at', direction: 'desc' })
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const [filterMetadata, setFilterMetadata] = useState<FilterMetadata>({
    categories: [],
    brands: [],
    colors: [],
    priceRange: { min: 0, max: 1000 }
  })

  // Load filter metadata on component mount
  useEffect(() => {
    const loadFilterMetadata = async () => {
      try {
        const [categoriesRes, brandsRes, colorsRes, priceRangeRes] = await Promise.all([
          fetch('/api/supabase/products?meta=categories'),
          fetch('/api/supabase/products?meta=brands'),
          fetch('/api/supabase/products?meta=colors'),
          fetch('/api/supabase/products?meta=price-range')
        ])

        const [categoriesData, brandsData, colorsData, priceRangeData] = await Promise.all([
          categoriesRes.json(),
          brandsRes.json(),
          colorsRes.json(),
          priceRangeRes.json()
        ])

        setFilterMetadata({
          categories: categoriesData.categories || [],
          brands: brandsData.brands || [],
          colors: colorsData.colors || [],
          priceRange: priceRangeData.priceRange || { min: 0, max: 1000 }
        })
      } catch (error) {
        console.error('Error loading filter metadata:', error)
      }
    }

    loadFilterMetadata()
  }, [])

  // Load products based on current filters and sort
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const params = new URLSearchParams()
        
        // Add pagination
        params.set('page', currentPage.toString())
        params.set('limit', '24')
        
        // Add sorting
        params.set('sortField', sort.field)
        params.set('sortDirection', sort.direction)
        
        // Add filters
        if (filters.search) params.set('search', filters.search)
        if (filters.categories?.length) params.set('categories', filters.categories.join(','))
        if (filters.brands?.length) params.set('brands', filters.brands.join(','))
        if (filters.colors?.length) params.set('colors', filters.colors.join(','))
        if (filters.occasions?.length) params.set('occasions', filters.occasions.join(','))
        if (filters.tags?.length) params.set('tags', filters.tags.join(','))
        if (filters.priceRange) {
          params.set('minPrice', filters.priceRange.min.toString())
          params.set('maxPrice', filters.priceRange.max.toString())
        }
        if (filters.inStock !== undefined) params.set('inStock', filters.inStock.toString())
        if (filters.featured !== undefined) params.set('featured', filters.featured.toString())
        
        const response = await fetch(`/api/supabase/products?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data: ProductsResponse = await response.json()
        
        setProducts(data.products)
        setTotalCount(data.totalCount)
        setTotalPages(data.totalPages)
      } catch (error) {
        console.error('Error loading products:', error)
        setError('Failed to load products')
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [filters, sort, currentPage])

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setFilters(prev => ({ ...prev, search: query || undefined }))
    setCurrentPage(1)
  }

  // Handle filter changes
  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  // Handle category changes
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    
    // Update filters based on category
    if (categoryId === 'all') {
      const { categories, ...restFilters } = filters
      setFilters(restFilters)
    } else {
      setFilters(prev => ({ ...prev, categories: [categoryId] }))
    }
    setCurrentPage(1)
  }

  // Handle sort changes
  const handleSortChange = (newSort: ProductSortOptions) => {
    setSort(newSort)
    setCurrentPage(1)
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
    setCurrentPage(1)
  }

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.search) count++
    if (filters.categories?.length) count++
    if (filters.brands?.length) count++
    if (filters.colors?.length) count++
    if (filters.occasions?.length) count++
    if (filters.tags?.length) count++
    if (filters.priceRange) count++
    if (filters.inStock !== undefined) count++
    if (filters.featured !== undefined) count++
    return count
  }, [filters])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-gold mb-4">
              <div className="h-px w-12 bg-gold"></div>
              <span className="text-sm font-semibold tracking-widest uppercase">Premium Collection</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">Shop Collection</h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Discover our complete collection of {totalCount}+ premium formal wear pieces
            </p>
          </div>
        </div>
      </section>

      {/* Quick Category Filter */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4">
          <CategoryPills
            categories={menswearCategories.map(cat => ({
              ...cat,
              count: cat.id === 'all' ? totalCount : 
                     filterMetadata.categories.includes(cat.id) ? 
                     Math.floor(Math.random() * 50) + 10 : undefined
            }))}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            variant="minimal"
            showCounts={true}
          />
        </div>
      </section>

      {/* Search and Controls Bar */}
      <section className="py-4 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="flex gap-3 items-center flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-0 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gold/20 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 items-center">
              {/* Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white border-gray-200 hover:border-gold/50 hover:bg-gold/5 text-gray-700"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 bg-gold text-black text-xs">{activeFilterCount}</Badge>
                )}
              </Button>

              {/* View Mode */}
              <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "rounded-none px-3 border-r border-gray-200",
                    viewMode === 'grid' && "bg-gold text-black hover:bg-gold/90"
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "rounded-none px-3",
                    viewMode === 'list' && "bg-gold text-black hover:bg-gold/90"
                  )}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Sort */}
              <select
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold/50"
                value={`${sort.field}-${sort.direction}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-') as [typeof sort.field, typeof sort.direction]
                  handleSortChange({ field, direction })
                }}
              >
                <option value="created_at-desc">Newest</option>
                <option value="base_price-asc">Price ↑</option>
                <option value="base_price-desc">Price ↓</option>
                <option value="name-asc">A-Z</option>
                <option value="trending_score-desc">Popular</option>
              </select>
            </div>
          </div>

          {/* Active Filters Tags */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 items-center">
              {filters.search && (
                <Badge variant="secondary" className="gap-1 bg-white">
                  "{filters.search}"
                  <button onClick={() => handleSearch('')} className="hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.categories?.filter(cat => cat !== selectedCategory).map(category => (
                <Badge key={category} variant="secondary" className="gap-1 bg-white">
                  {category}
                  <button onClick={() => {
                    const newCategories = filters.categories?.filter(c => c !== category)
                    handleFiltersChange({ ...filters, categories: newCategories?.length ? newCategories : undefined })
                  }} className="hover:text-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-red-600 text-xs px-2 py-1 h-auto"
                >
                  Clear all
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex gap-8 py-8">
            {/* Filters Panel */}
            {showFilters && (
              <div className="w-80 flex-shrink-0">
                <div className="sticky top-32">
                  <ProductFiltersPanel
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    metadata={filterMetadata}
                  />
                </div>
              </div>
            )}

            {/* Products */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {selectedCategory === 'all' ? 'All Products' : selectedCategory}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {isLoading ? 'Loading...' : `${totalCount} products available`}
                  </p>
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="relative">
                    <Loader2 className="h-8 w-8 animate-spin text-gold" />
                    <div className="absolute inset-0 h-8 w-8 border-2 border-gold/20 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-gray-600 mt-4 text-sm">Loading products...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="h-8 w-8 text-red-600" />
                  </div>
                  <p className="text-red-600 mb-4 font-medium">{error}</p>
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && products.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={clearFilters} variant="outline">
                      Clear Filters
                    </Button>
                    <Button onClick={() => handleCategoryChange('all')} className="bg-gold hover:bg-gold/90 text-black">
                      View All Products
                    </Button>
                  </div>
                </div>
              )}

              {/* Products Grid */}
              {!isLoading && !error && products.length > 0 && (
                <>
                  <div className={cn(
                    "transition-all duration-300",
                    viewMode === 'grid' 
                      ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "space-y-4"
                  )}>
                    {products.map((product, index) => (
                      <div
                        key={product.id}
                        className="animate-fadeIn"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <SupabaseProductCard
                          product={product}
                          viewMode={viewMode}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Load More / Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-16 flex items-center justify-center">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-4"
                        >
                          ← Previous
                        </Button>
                        
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1
                            const isCurrentPage = currentPage === page
                            return (
                              <Button
                                key={page}
                                variant={isCurrentPage ? "default" : "ghost"}
                                onClick={() => setCurrentPage(page)}
                                className={cn(
                                  "w-10 h-10 p-0",
                                  isCurrentPage && "bg-gold hover:bg-gold/90 text-black"
                                )}
                              >
                                {page}
                              </Button>
                            )
                          })}
                          {totalPages > 5 && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                        </div>
                        
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="px-4"
                        >
                          Next →
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}