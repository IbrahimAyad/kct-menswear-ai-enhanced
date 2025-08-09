/**
 * Unified Search Engine for KCT Menswear
 * 
 * Handles unified search and filtering across individual products and bundles
 * with intelligent ranking, relevance scoring, and facet generation.
 */

import { 
  UnifiedProduct, 
  UnifiedProductFilters, 
  UnifiedProductSortOptions, 
  UnifiedSearchResult,
  ScoredProduct,
  SearchFacets,
  FacetOption,
  SearchSuggestion,
  BundleComponent,
  STANDARD_COLORS,
  OCCASIONS,
  SEASONS
} from '@/types/unified-shop'
import { EnhancedProduct, toEnhancedProduct } from '@/lib/supabase/types'
import { Bundle, bundleProducts } from '@/lib/products/bundleProducts'
import { fetchProductsWithImages } from '@/lib/shared/supabase-products'
import { getPresetById, FILTER_PRESETS } from '@/lib/config/filter-presets'

// ============================================================================
// SEARCH ENGINE CONFIGURATION
// ============================================================================

export interface SearchEngineConfig {
  maxResults: number
  enableFacets: boolean
  enableSuggestions: boolean
  cacheTimeout: number // minutes
  relevanceWeights: {
    textMatch: number
    aiScore: number
    trending: number
    featured: number
    exactMatch: number
    occasionMatch: number
    colorMatch: number
    priceMatch: number
  }
  facetLimits: {
    categories: number
    vendors: number
    colors: number
    occasions: number
    styles: number
  }
}

const DEFAULT_CONFIG: SearchEngineConfig = {
  maxResults: 1000,
  enableFacets: true,
  enableSuggestions: true,
  cacheTimeout: 15,
  relevanceWeights: {
    textMatch: 1.0,
    aiScore: 0.1,
    trending: 0.3,
    featured: 0.2,
    exactMatch: 2.0,
    occasionMatch: 1.5,
    colorMatch: 1.2,
    priceMatch: 0.1
  },
  facetLimits: {
    categories: 20,
    vendors: 10,
    colors: 15,
    occasions: 15,
    styles: 20
  }
}

// ============================================================================
// UNIFIED SEARCH ENGINE CLASS
// ============================================================================

export class UnifiedSearchEngine {
  private config: SearchEngineConfig
  private cache: Map<string, { data: any, timestamp: number }> = new Map()

  constructor(config: Partial<SearchEngineConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Main search method that handles unified product search
   */
  async searchProducts(
    query: string = '',
    filters: UnifiedProductFilters = {},
    sort: UnifiedProductSortOptions = { field: 'created_at', direction: 'desc' },
    page: number = 1,
    limit: number = 24
  ): Promise<UnifiedSearchResult> {
    const startTime = Date.now()

    try {
      // 1. Resolve preset filters if specified
      const resolvedFilters = this.resolvePresetFilters(filters)

      // 2. Get all products (individual + bundles)
      const allProducts = await this.getAllProducts(resolvedFilters)

      // 3. Apply text search
      const textFiltered = this.applyTextSearch(allProducts, query)

      // 4. Apply categorical filters
      const categoryFiltered = this.applyCategoryFilters(textFiltered, resolvedFilters)

      // 5. Apply color filters (including bundle component colors)
      const colorFiltered = this.applyColorFilters(categoryFiltered, resolvedFilters)

      // 6. Apply occasion filters
      const occasionFiltered = this.applyOccasionFilters(colorFiltered, resolvedFilters)

      // 7. Apply price filters
      const priceFiltered = this.applyPriceFilters(occasionFiltered, resolvedFilters)

      // 8. Apply availability and inventory filters
      const availabilityFiltered = this.applyAvailabilityFilters(priceFiltered, resolvedFilters)

      // 9. Apply style and bundle filters
      const styleFiltered = this.applyStyleFilters(availabilityFiltered, resolvedFilters)

      // 10. Calculate relevance scores
      const scoredProducts = this.calculateRelevanceScores(styleFiltered, query, resolvedFilters)

      // 11. Sort results
      const sortedProducts = this.sortResults(scoredProducts, sort)

      // 12. Generate facets (before pagination)
      const facets = this.config.enableFacets 
        ? this.generateFacets(sortedProducts, resolvedFilters)
        : undefined

      // 13. Apply pagination
      const totalCount = sortedProducts.length
      const totalPages = Math.ceil(totalCount / limit)
      const offset = (page - 1) * limit
      const paginatedProducts = sortedProducts.slice(offset, offset + limit)

      // 14. Generate suggestions
      const suggestions = this.config.enableSuggestions
        ? this.generateSuggestions(query, sortedProducts, resolvedFilters)
        : undefined

      // 15. Get related presets
      const relatedPresets = this.getRelatedPresets(resolvedFilters)

      const searchTime = Date.now() - startTime

      return {
        products: paginatedProducts,
        totalCount,
        currentPage: page,
        totalPages,
        limit,
        hasMore: page < totalPages,
        searchQuery: query || undefined,
        appliedFilters: resolvedFilters,
        appliedSort: sort,
        searchTime,
        facets,
        suggestions,
        relatedPresets,
        searchId: this.generateSearchId(),
        sessionId: this.getSessionId()
      }

    } catch (error) {
      console.error('Search error:', error)
      throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ============================================================================
  // PRODUCT AGGREGATION
  // ============================================================================

  /**
   * Get all products (individual + bundles) based on inclusion filters
   */
  private async getAllProducts(filters: UnifiedProductFilters): Promise<UnifiedProduct[]> {
    const cacheKey = `all-products-${JSON.stringify(filters)}`
    const cached = this.getCachedResult(cacheKey)
    if (cached) return cached

    const results: UnifiedProduct[] = []

    // Include individual products
    if (filters.includeIndividual !== false) {
      const individualProducts = await this.getIndividualProducts()
      results.push(...individualProducts)
    }

    // Include bundles
    if (filters.includeBundles !== false) {
      const bundles = await this.getBundleProducts(filters.bundleTypes)
      results.push(...bundles)
    }

    this.setCachedResult(cacheKey, results)
    return results
  }

  /**
   * Get individual products converted to unified format
   */
  private async getIndividualProducts(): Promise<UnifiedProduct[]> {
    const result = await fetchProductsWithImages({ 
      limit: 1000, 
      status: 'active' 
    })

    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch individual products')
    }

    return result.data.map(product => this.convertToUnifiedProduct(product, 'individual'))
  }

  /**
   * Get bundle products converted to unified format
   */
  private async getBundleProducts(bundleTypes?: string[]): Promise<UnifiedProduct[]> {
    let bundles = bundleProducts.bundles

    // Filter by bundle types if specified
    if (bundleTypes && bundleTypes.length > 0) {
      bundles = bundles.filter(bundle => {
        // Map bundle categories to types
        const typeMapping: Record<string, string[]> = {
          'classic': ['classic', 'wedding'],
          'bold': ['bold', 'prom'],
          'sophisticated': ['sophisticated', 'wedding'],
          'contemporary': ['contemporary', 'casual']
        }

        return bundleTypes.some(type => 
          typeMapping[bundle.category]?.includes(type) ||
          bundle.occasions.some(occ => occ.toLowerCase().includes(type.toLowerCase()))
        )
      })
    }

    return bundles.map(bundle => this.convertToUnifiedProduct(bundle, 'bundle'))
  }

  // ============================================================================
  // PRODUCT CONVERSION
  // ============================================================================

  /**
   * Convert individual product to unified format
   */
  private convertToUnifiedProduct(product: any, type: 'individual'): UnifiedProduct {
    const enhanced = toEnhancedProduct({
      ...product,
      product_variants: product.variants || [],
      product_images: product.images || []
    } as any)

    return {
      id: enhanced.id,
      type,
      name: enhanced.name,
      description: enhanced.description,
      handle: enhanced.handle,
      sku: enhanced.sku,
      price: enhanced.price,
      compareAtPrice: enhanced.compareAtPrice,
      category: enhanced.category,
      subcategory: this.extractSubcategory(enhanced),
      productType: enhanced.productType,
      vendor: enhanced.vendor,
      brand: enhanced.brand,
      images: enhanced.images,
      primaryImage: enhanced.primaryImage,
      inStock: enhanced.inStock,
      totalInventory: enhanced.totalInventory,
      trackInventory: enhanced.trackInventory,
      available: enhanced.inStock,
      searchableColors: this.extractColors(enhanced.name, enhanced.tags),
      searchableOccasions: this.extractOccasions(enhanced.name, enhanced.tags, enhanced.description),
      searchableTags: enhanced.tags.map(tag => tag.toLowerCase()),
      searchableStyles: this.extractStyles(enhanced.name, enhanced.tags, enhanced.category),
      searchableSizes: this.extractSizes(enhanced.variants),
      searchableSeasons: this.extractSeasons(enhanced.name, enhanced.tags),
      featured: enhanced.featured,
      trending: enhanced.featured, // Use featured as proxy for trending
      viewCount: enhanced.viewCount,
      tags: enhanced.tags,
      variants: enhanced.variants,
      createdAt: enhanced.createdAt,
      updatedAt: enhanced.updatedAt,
      additionalInfo: enhanced.additionalInfo
    }
  }

  /**
   * Convert bundle to unified format
   */
  private convertToUnifiedProduct(bundle: Bundle, type: 'bundle'): UnifiedProduct {
    const bundleComponents: BundleComponent[] = [
      {
        type: 'suit',
        color: bundle.suit.color,
        style: bundle.suit.type,
        image: bundle.suit.image
      },
      {
        type: 'shirt',
        color: bundle.shirt.color,
        fit: bundle.shirt.fit,
        image: bundle.shirt.image
      },
      {
        type: bundle.tie.style === 'Bowtie' ? 'bowtie' : 'tie',
        color: bundle.tie.color,
        style: bundle.tie.style,
        image: bundle.tie.image
      }
    ]

    const allColors = bundleComponents.map(comp => comp.color)
    const searchableColors = [...new Set([
      ...allColors,
      ...this.extractColors(bundle.name, bundle.occasions)
    ])]

    return {
      id: bundle.id,
      type,
      name: bundle.name,
      description: bundle.description,
      handle: bundle.id.replace('bundle-', ''),
      price: Math.round(bundle.bundlePrice * 100), // Convert to cents
      compareAtPrice: Math.round(bundle.originalPrice * 100),
      bundlePrice: Math.round(bundle.bundlePrice * 100),
      originalPrice: Math.round(bundle.originalPrice * 100),
      savings: Math.round(bundle.savings * 100),
      category: 'Bundles',
      subcategory: bundle.category,
      productType: 'Bundle',
      vendor: 'KCT',
      brand: 'KCT',
      images: [bundle.imageUrl],
      primaryImage: bundle.imageUrl,
      inStock: true, // Bundles are always available
      totalInventory: 100,
      trackInventory: false,
      available: true,
      searchableColors,
      searchableOccasions: bundle.occasions.map(occ => occ.toLowerCase()),
      searchableTags: [
        ...bundle.occasions.map(occ => occ.toLowerCase()),
        bundle.category,
        bundle.seasonal || 'year-round',
        ...allColors.map(color => color.toLowerCase())
      ],
      searchableStyles: this.extractBundleStyles(bundle),
      searchableSizes: ['Small', 'Medium', 'Large', 'XL'], // Standard sizes for bundles
      searchableSeasons: [bundle.seasonal || 'year-round'],
      bundleComponents,
      bundleCategory: bundle.category,
      seasonal: bundle.seasonal,
      aiScore: bundle.aiScore,
      stripePriceId: bundle.stripePriceId,
      featured: bundle.trending || false,
      trending: bundle.trending || false,
      viewCount: 0, // Bundles start with 0 views
      tags: [
        ...bundle.occasions,
        bundle.category,
        bundle.seasonal || 'year-round'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      additionalInfo: {
        originalBundle: bundle
      }
    }
  }

  // ============================================================================
  // FILTER APPLICATION METHODS
  // ============================================================================

  /**
   * Resolve preset filters into full filter object
   */
  private resolvePresetFilters(filters: UnifiedProductFilters): UnifiedProductFilters {
    if (!filters.preset) return filters

    const preset = getPresetById(filters.preset)
    if (!preset) return filters

    // Merge preset filters with any additional filters
    return {
      ...preset.filters,
      ...filters,
      preset: filters.preset // Keep preset reference
    }
  }

  /**
   * Apply text search across all searchable fields
   */
  private applyTextSearch(products: UnifiedProduct[], query: string): UnifiedProduct[] {
    if (!query || query.trim() === '') return products

    const queryLower = query.toLowerCase().trim()
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 0)

    return products.filter(product => {
      const searchableText = [
        product.name,
        product.description || '',
        product.category || '',
        product.subcategory || '',
        product.productType,
        product.vendor,
        product.brand || '',
        ...product.searchableColors,
        ...product.searchableOccasions,
        ...product.searchableTags,
        ...product.searchableStyles,
        ...product.tags
      ].join(' ').toLowerCase()

      // All query words must be found
      return queryWords.every(word => searchableText.includes(word))
    })
  }

  /**
   * Apply category and product type filters
   */
  private applyCategoryFilters(products: UnifiedProduct[], filters: UnifiedProductFilters): UnifiedProduct[] {
    return products.filter(product => {
      // Category filter
      if (filters.category && filters.category !== 'all') {
        const categoryMatch = product.category?.toLowerCase() === filters.category.toLowerCase() ||
                             product.subcategory?.toLowerCase() === filters.category.toLowerCase()
        if (!categoryMatch) return false
      }

      if (filters.categories && filters.categories.length > 0) {
        const categoryMatch = filters.categories.some(cat =>
          product.category?.toLowerCase().includes(cat.toLowerCase()) ||
          product.subcategory?.toLowerCase().includes(cat.toLowerCase())
        )
        if (!categoryMatch) return false
      }

      // Product type filter
      if (filters.productType) {
        if (product.productType.toLowerCase() !== filters.productType.toLowerCase()) {
          return false
        }
      }

      if (filters.productTypes && filters.productTypes.length > 0) {
        const typeMatch = filters.productTypes.some(type =>
          product.productType.toLowerCase().includes(type.toLowerCase())
        )
        if (!typeMatch) return false
      }

      // Vendor filter
      if (filters.vendor && filters.vendor !== 'all') {
        if (product.vendor.toLowerCase() !== filters.vendor.toLowerCase()) {
          return false
        }
      }

      if (filters.vendors && filters.vendors.length > 0) {
        const vendorMatch = filters.vendors.some(vendor =>
          product.vendor.toLowerCase().includes(vendor.toLowerCase())
        )
        if (!vendorMatch) return false
      }

      return true
    })
  }

  /**
   * Apply color filters including bundle component colors
   */
  private applyColorFilters(products: UnifiedProduct[], filters: UnifiedProductFilters): UnifiedProduct[] {
    const hasColorFilters = filters.colors?.length || filters.color || 
                           filters.suitColor || filters.shirtColor || filters.tieColor

    if (!hasColorFilters) return products

    return products.filter(product => {
      // General color filter
      if (filters.colors && filters.colors.length > 0) {
        const colorMatch = filters.colors.some(filterColor =>
          product.searchableColors.some(productColor =>
            productColor.toLowerCase().includes(filterColor.toLowerCase()) ||
            filterColor.toLowerCase().includes(productColor.toLowerCase())
          )
        )
        if (!colorMatch) return false
      }

      if (filters.color) {
        const colorMatch = product.searchableColors.some(productColor =>
          productColor.toLowerCase().includes(filters.color!.toLowerCase()) ||
          filters.color!.toLowerCase().includes(productColor.toLowerCase())
        )
        if (!colorMatch) return false
      }

      // Bundle-specific component color filters
      if (product.type === 'bundle' && product.bundleComponents) {
        if (filters.suitColor) {
          const suitComponent = product.bundleComponents.find(comp => comp.type === 'suit')
          if (suitComponent && !suitComponent.color.toLowerCase().includes(filters.suitColor.toLowerCase())) {
            return false
          }
        }

        if (filters.shirtColor) {
          const shirtComponent = product.bundleComponents.find(comp => comp.type === 'shirt')
          if (shirtComponent && !shirtComponent.color.toLowerCase().includes(filters.shirtColor.toLowerCase())) {
            return false
          }
        }

        if (filters.tieColor) {
          const tieComponent = product.bundleComponents.find(comp => 
            comp.type === 'tie' || comp.type === 'bowtie'
          )
          if (tieComponent && !tieComponent.color.toLowerCase().includes(filters.tieColor.toLowerCase())) {
            return false
          }
        }
      }

      return true
    })
  }

  /**
   * Apply occasion filters
   */
  private applyOccasionFilters(products: UnifiedProduct[], filters: UnifiedProductFilters): UnifiedProduct[] {
    const hasOccasionFilters = filters.occasions?.length || filters.occasion

    if (!hasOccasionFilters) return products

    return products.filter(product => {
      if (filters.occasions && filters.occasions.length > 0) {
        const occasionMatch = filters.occasions.some(filterOccasion =>
          product.searchableOccasions.some(productOccasion =>
            productOccasion.toLowerCase().includes(filterOccasion.toLowerCase()) ||
            filterOccasion.toLowerCase().includes(productOccasion.toLowerCase())
          )
        )
        if (!occasionMatch) return false
      }

      if (filters.occasion) {
        const occasionMatch = product.searchableOccasions.some(productOccasion =>
          productOccasion.toLowerCase().includes(filters.occasion!.toLowerCase()) ||
          filters.occasion!.toLowerCase().includes(productOccasion.toLowerCase())
        )
        if (!occasionMatch) return false
      }

      return true
    })
  }

  /**
   * Apply price filters
   */
  private applyPriceFilters(products: UnifiedProduct[], filters: UnifiedProductFilters): UnifiedProduct[] {
    return products.filter(product => {
      const price = product.price / 100 // Convert to dollars

      // Price range filter
      if (filters.priceRange) {
        if (price < filters.priceRange.min || price > filters.priceRange.max) {
          return false
        }
      }

      // Min/Max price filters
      if (filters.minPrice !== undefined && price < filters.minPrice) {
        return false
      }

      if (filters.maxPrice !== undefined && price > filters.maxPrice) {
        return false
      }

      // Specific price points (for bundles)
      if (filters.pricePoint && filters.pricePoint.length > 0) {
        const priceMatches = filters.pricePoint.some(targetPrice => {
          const targetPriceInDollars = targetPrice / 100
          return Math.abs(price - targetPriceInDollars) < 1 // Allow $1 variance
        })
        if (!priceMatches) return false
      }

      return true
    })
  }

  /**
   * Apply availability and inventory filters
   */
  private applyAvailabilityFilters(products: UnifiedProduct[], filters: UnifiedProductFilters): UnifiedProduct[] {
    return products.filter(product => {
      if (filters.inStock && !product.inStock) {
        return false
      }

      if (filters.available !== undefined && product.available !== filters.available) {
        return false
      }

      if (filters.minInventory !== undefined && product.totalInventory < filters.minInventory) {
        return false
      }

      return true
    })
  }

  /**
   * Apply style and bundle-specific filters
   */
  private applyStyleFilters(products: UnifiedProduct[], filters: UnifiedProductFilters): UnifiedProduct[] {
    return products.filter(product => {
      // Style filters
      if (filters.styles && filters.styles.length > 0) {
        const styleMatch = filters.styles.some(filterStyle =>
          product.searchableStyles.some(productStyle =>
            productStyle.toLowerCase().includes(filterStyle.toLowerCase())
          )
        )
        if (!styleMatch) return false
      }

      // Bundle category filter
      if (filters.bundleCategory) {
        if (product.type === 'bundle') {
          if (product.bundleCategory !== filters.bundleCategory) {
            return false
          }
        } else {
          // Individual products don't have bundle categories
          return false
        }
      }

      if (filters.bundleCategories && filters.bundleCategories.length > 0) {
        if (product.type === 'bundle') {
          if (!filters.bundleCategories.includes(product.bundleCategory!)) {
            return false
          }
        } else {
          return false
        }
      }

      // Seasonal filter
      if (filters.seasonal) {
        if (!product.searchableSeasons.includes(filters.seasonal) && 
            !product.searchableSeasons.includes('year-round')) {
          return false
        }
      }

      // Featured/Trending filters
      if (filters.featured && !product.featured) {
        return false
      }

      if (filters.trending && !product.trending) {
        return false
      }

      // AI score filter
      if (filters.aiScoreMin !== undefined) {
        if (!product.aiScore || product.aiScore < filters.aiScoreMin) {
          return false
        }
      }

      return true
    })
  }

  // ============================================================================
  // RELEVANCE SCORING
  // ============================================================================

  /**
   * Calculate relevance scores for search ranking
   */
  private calculateRelevanceScores(
    products: UnifiedProduct[],
    query: string,
    filters: UnifiedProductFilters
  ): ScoredProduct[] {
    const weights = this.config.relevanceWeights

    return products.map(product => {
      let score = 0
      const factors = {
        textMatch: 0,
        aiScore: 0,
        trending: 0,
        featured: 0,
        priceMatch: 0,
        occasionMatch: 0,
        colorMatch: 0
      }

      // Text relevance score
      if (query) {
        factors.textMatch = this.calculateTextScore(product, query)
        score += factors.textMatch * weights.textMatch
      }

      // AI score bonus
      if (product.aiScore) {
        factors.aiScore = product.aiScore
        score += factors.aiScore * weights.aiScore
      }

      // Trending bonus
      if (product.trending) {
        factors.trending = 10
        score += factors.trending * weights.trending
      }

      // Featured bonus
      if (product.featured) {
        factors.featured = 5
        score += factors.featured * weights.featured
      }

      // Bundle completeness bonus
      if (product.type === 'bundle') {
        score += 15 // Base bonus for complete looks
      }

      // Exact occasion match bonus
      if (filters.occasions) {
        const matches = filters.occasions.filter(occ =>
          product.searchableOccasions.some(productOcc =>
            productOcc.toLowerCase() === occ.toLowerCase()
          )
        ).length
        factors.occasionMatch = matches * 5
        score += factors.occasionMatch * weights.occasionMatch
      }

      // Color match bonus
      if (filters.colors || filters.color) {
        const filterColors = filters.colors || (filters.color ? [filters.color] : [])
        const matches = filterColors.filter(color =>
          product.searchableColors.some(productColor =>
            productColor.toLowerCase() === color.toLowerCase()
          )
        ).length
        factors.colorMatch = matches * 3
        score += factors.colorMatch * weights.colorMatch
      }

      return {
        ...product,
        relevanceScore: Math.max(0, score),
        matchStrength: this.calculateMatchStrength(product, query, filters),
        rankingFactors: factors
      }
    })
  }

  /**
   * Calculate text match score
   */
  private calculateTextScore(product: UnifiedProduct, query: string): number {
    if (!query) return 0

    const queryLower = query.toLowerCase()
    const queryWords = queryLower.split(/\s+/)
    let score = 0

    // Exact name match gets highest score
    if (product.name.toLowerCase() === queryLower) {
      score += 50
    }

    // Name contains query
    if (product.name.toLowerCase().includes(queryLower)) {
      score += 25
    }

    // Word matches in name
    queryWords.forEach(word => {
      if (product.name.toLowerCase().includes(word)) {
        score += 10
      }
    })

    // Description matches
    if (product.description) {
      if (product.description.toLowerCase().includes(queryLower)) {
        score += 15
      }
      queryWords.forEach(word => {
        if (product.description!.toLowerCase().includes(word)) {
          score += 5
        }
      })
    }

    // Tag matches
    queryWords.forEach(word => {
      if (product.searchableTags.some(tag => tag.includes(word))) {
        score += 8
      }
    })

    return score
  }

  /**
   * Calculate overall match strength
   */
  private calculateMatchStrength(
    product: UnifiedProduct,
    query: string,
    filters: UnifiedProductFilters
  ): number {
    let strength = 0
    let totalCriteria = 0

    // Text match strength
    if (query) {
      totalCriteria++
      if (this.calculateTextScore(product, query) > 0) {
        strength++
      }
    }

    // Color match strength
    if (filters.colors || filters.color) {
      totalCriteria++
      const filterColors = filters.colors || (filters.color ? [filters.color] : [])
      if (filterColors.some(color =>
        product.searchableColors.some(productColor =>
          productColor.toLowerCase().includes(color.toLowerCase())
        )
      )) {
        strength++
      }
    }

    // Occasion match strength
    if (filters.occasions || filters.occasion) {
      totalCriteria++
      const filterOccasions = filters.occasions || (filters.occasion ? [filters.occasion] : [])
      if (filterOccasions.some(occ =>
        product.searchableOccasions.some(productOcc =>
          productOcc.toLowerCase().includes(occ.toLowerCase())
        )
      )) {
        strength++
      }
    }

    return totalCriteria > 0 ? strength / totalCriteria : 1
  }

  // ============================================================================
  // SORTING
  // ============================================================================

  /**
   * Sort products based on sort options
   */
  private sortResults(products: ScoredProduct[], sort: UnifiedProductSortOptions): ScoredProduct[] {
    return [...products].sort((a, b) => {
      let aVal: any, bVal: any

      switch (sort.field) {
        case 'relevance':
          aVal = a.relevanceScore || 0
          bVal = b.relevanceScore || 0
          break
        case 'price':
          aVal = a.price
          bVal = b.price
          break
        case 'bundle_price':
          aVal = a.bundlePrice || a.price
          bVal = b.bundlePrice || b.price
          break
        case 'savings':
          aVal = a.savings || 0
          bVal = b.savings || 0
          break
        case 'name':
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
          break
        case 'ai_score':
          aVal = a.aiScore || 0
          bVal = b.aiScore || 0
          break
        case 'trending_score':
          aVal = (a.trending ? 10 : 0) + (a.viewCount || 0)
          bVal = (b.trending ? 10 : 0) + (b.viewCount || 0)
          break
        case 'view_count':
          aVal = a.viewCount || 0
          bVal = b.viewCount || 0
          break
        case 'inventory':
          aVal = a.totalInventory
          bVal = b.totalInventory
          break
        case 'created_at':
        default:
          aVal = new Date(a.createdAt || 0).getTime()
          bVal = new Date(b.createdAt || 0).getTime()
          break
      }

      if (sort.direction === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
      }
    })
  }

  // ============================================================================
  // FACET GENERATION
  // ============================================================================

  /**
   * Generate facets for filter refinement
   */
  private generateFacets(products: ScoredProduct[], appliedFilters: UnifiedProductFilters): SearchFacets {
    const limits = this.config.facetLimits

    return {
      categories: this.generateFacetOptions(
        products.map(p => p.category).filter(Boolean),
        limits.categories,
        appliedFilters.categories
      ),
      vendors: this.generateFacetOptions(
        products.map(p => p.vendor),
        limits.vendors,
        appliedFilters.vendors
      ),
      colors: this.generateFacetOptions(
        products.flatMap(p => p.searchableColors),
        limits.colors,
        appliedFilters.colors
      ),
      occasions: this.generateFacetOptions(
        products.flatMap(p => p.searchableOccasions),
        limits.occasions,
        appliedFilters.occasions
      ),
      styles: this.generateFacetOptions(
        products.flatMap(p => p.searchableStyles),
        limits.styles,
        appliedFilters.styles
      ),
      priceRanges: this.generatePriceFacets(products),
      bundleCategories: this.generateFacetOptions(
        products.filter(p => p.bundleCategory).map(p => p.bundleCategory!),
        10,
        appliedFilters.bundleCategories
      ),
      seasons: this.generateFacetOptions(
        products.flatMap(p => p.searchableSeasons),
        4,
        appliedFilters.seasonals
      ),
      sizes: this.generateFacetOptions(
        products.flatMap(p => p.searchableSizes),
        10,
        appliedFilters.sizes
      ),
      productTypes: this.generateFacetOptions(
        products.map(p => p.productType),
        10,
        appliedFilters.productTypes
      )
    }
  }

  /**
   * Generate facet options with counts
   */
  private generateFacetOptions(
    values: string[],
    limit: number,
    selectedValues?: string[]
  ): FacetOption[] {
    const counts = new Map<string, number>()

    values.forEach(value => {
      if (value) {
        const key = value.toLowerCase()
        counts.set(key, (counts.get(key) || 0) + 1)
      }
    })

    return Array.from(counts.entries())
      .map(([value, count]) => ({
        value,
        label: this.capitalizeWords(value),
        count,
        selected: selectedValues?.some(sv => sv.toLowerCase() === value) || false
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  /**
   * Generate price range facets
   */
  private generatePriceFacets(products: ScoredProduct[]): FacetOption[] {
    const prices = products.map(p => p.price / 100) // Convert to dollars
    if (prices.length === 0) return []

    const ranges = [
      { value: '0-199', label: 'Under $199', min: 0, max: 199 },
      { value: '199-249', label: '$199 - $249', min: 199, max: 249 },
      { value: '249-299', label: '$249 - $299', min: 249, max: 299 },
      { value: '299-399', label: '$299 - $399', min: 299, max: 399 },
      { value: '399+', label: '$399+', min: 399, max: Infinity }
    ]

    return ranges.map(range => ({
      value: range.value,
      label: range.label,
      count: prices.filter(price => price >= range.min && price < range.max).length,
      selected: false
    })).filter(range => range.count > 0)
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private extractColors(name: string, tags: string[]): string[] {
    const colors: string[] = []
    const colorTerms = Object.values(STANDARD_COLORS)
    const searchText = `${name} ${tags.join(' ')}`.toLowerCase()

    colorTerms.forEach(color => {
      if (searchText.includes(color.toLowerCase())) {
        colors.push(this.capitalizeWords(color))
      }
    })

    return [...new Set(colors)]
  }

  private extractOccasions(name: string, tags: string[], description?: string | null): string[] {
    const occasions: string[] = []
    const occasionTerms = Object.values(OCCASIONS)
    const searchText = `${name} ${tags.join(' ')} ${description || ''}`.toLowerCase()

    occasionTerms.forEach(occasion => {
      if (searchText.includes(occasion)) {
        occasions.push(this.capitalizeWords(occasion.replace('-', ' ')))
      }
    })

    // Additional occasion detection logic
    if (searchText.includes('formal') || searchText.includes('tuxedo')) {
      occasions.push('Black Tie', 'Formal Evening')
    }
    if (searchText.includes('interview') || searchText.includes('business')) {
      occasions.push('Business', 'Interview')
    }

    return [...new Set(occasions)]
  }

  private extractStyles(name: string, tags: string[], category?: string | null): string[] {
    const styles: string[] = []
    const searchText = `${name} ${tags.join(' ')} ${category || ''}`.toLowerCase()

    const styleMap = {
      'modern': ['modern', 'contemporary'],
      'classic': ['classic', 'traditional', 'timeless'],
      'formal': ['formal', 'tuxedo', 'black tie'],
      'casual': ['casual', 'relaxed'],
      'slim': ['slim', 'fitted'],
      'bold': ['bold', 'statement']
    }

    Object.entries(styleMap).forEach(([style, keywords]) => {
      if (keywords.some(keyword => searchText.includes(keyword))) {
        styles.push(this.capitalizeWords(style))
      }
    })

    return [...new Set(styles)]
  }

  private extractSizes(variants?: any[]): string[] {
    if (!variants || variants.length === 0) {
      return ['Small', 'Medium', 'Large', 'XL']
    }

    return [...new Set(variants.map(v => v.option1 || v.title).filter(Boolean))]
  }

  private extractSeasons(name: string, tags: string[]): string[] {
    const seasons: string[] = []
    const searchText = `${name} ${tags.join(' ')}`.toLowerCase()

    Object.values(SEASONS).forEach(season => {
      if (season !== 'year-round' && searchText.includes(season)) {
        seasons.push(season)
      }
    })

    if (seasons.length === 0) {
      seasons.push('year-round')
    }

    return seasons
  }

  private extractSubcategory(product: any): string | undefined {
    // Logic to extract subcategory from product data
    if (product.tags.some((tag: string) => tag.toLowerCase().includes('vest'))) {
      return 'Vest Sets'
    }
    // Add more subcategory logic as needed
    return undefined
  }

  private extractBundleStyles(bundle: Bundle): string[] {
    const styles = [bundle.category]
    
    if (bundle.trending) styles.push('trending')
    if (bundle.seasonal && bundle.seasonal !== 'year-round') styles.push('seasonal')
    
    return styles.map(style => this.capitalizeWords(style))
  }

  private capitalizeWords(str: string): string {
    return str.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
  }

  private generateSuggestions(
    query: string,
    products: ScoredProduct[],
    filters: UnifiedProductFilters
  ): SearchSuggestion[] {
    // Implementation for search suggestions
    return []
  }

  private getRelatedPresets(filters: UnifiedProductFilters): any[] {
    // Find related presets based on current filters
    return FILTER_PRESETS
      .filter(preset => {
        // Simple similarity check
        if (filters.occasions) {
          return preset.filters.occasions?.some(occ =>
            filters.occasions!.includes(occ)
          )
        }
        return false
      })
      .slice(0, 3)
  }

  // ============================================================================
  // CACHING UTILITIES
  // ============================================================================

  private getCachedResult(key: string): any {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.config.cacheTimeout * 60 * 1000) {
      return cached.data
    }
    return null
  }

  private setCachedResult(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  private generateSearchId(): string {
    return `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getSessionId(): string {
    // Simple session ID generation
    return `session_${Date.now()}`
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const unifiedSearchEngine = new UnifiedSearchEngine()