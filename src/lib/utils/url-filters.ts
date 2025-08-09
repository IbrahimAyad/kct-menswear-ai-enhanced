/**
 * URL Filter Utilities
 * 
 * Handles conversion between URL parameters and filter objects for SEO-friendly
 * and shareable filter URLs in the unified shop system.
 */

import { UnifiedProductFilters, UnifiedProductSortOptions, UnifiedURLParams } from '@/types/unified-shop'
import { getPresetById } from '@/lib/config/filter-presets'

// ============================================================================
// URL PARAMETER PARSING
// ============================================================================

/**
 * Parse URL search params into unified filters object
 */
export function parseURLFilters(searchParams: URLSearchParams): UnifiedProductFilters {
  const filters: UnifiedProductFilters = {}

  // Handle preset first (overrides other filters)
  const preset = searchParams.get('preset')
  if (preset) {
    const presetConfig = getPresetById(preset)
    if (presetConfig) {
      Object.assign(filters, presetConfig.filters)
      filters.preset = preset
    }
  }

  // Product type inclusion
  const type = searchParams.get('type')
  if (type) {
    switch (type) {
      case 'bundles':
        filters.includeBundles = true
        filters.includeIndividual = false
        break
      case 'individual':
        filters.includeBundles = false
        filters.includeIndividual = true
        break
      case 'all':
      default:
        filters.includeBundles = true
        filters.includeIndividual = true
        break
    }
  }

  const include = searchParams.get('include')
  if (include) {
    const includeTypes = include.split(',').map(s => s.trim())
    filters.includeBundles = includeTypes.includes('bundles')
    filters.includeIndividual = includeTypes.includes('individual')
  }

  // Category filters
  const category = searchParams.get('category')
  if (category && category !== 'all') {
    filters.category = category
  }

  const subcategory = searchParams.get('subcategory')
  if (subcategory) {
    filters.subcategory = subcategory
  }

  // Multi-value filters (comma-separated)
  const colors = searchParams.get('colors')
  if (colors) {
    filters.colors = colors.split(',').map(c => c.trim()).filter(Boolean)
  }

  const occasions = searchParams.get('occasions')
  if (occasions) {
    filters.occasions = occasions.split(',').map(o => o.trim()).filter(Boolean)
  }

  const styles = searchParams.get('styles')
  if (styles) {
    filters.styles = styles.split(',').map(s => s.trim()).filter(Boolean)
  }

  const vendors = searchParams.get('vendors')
  if (vendors) {
    filters.vendors = vendors.split(',').map(v => v.trim()).filter(Boolean)
  }

  const sizes = searchParams.get('sizes')
  if (sizes) {
    filters.sizes = sizes.split(',').map(s => s.trim()).filter(Boolean)
  }

  // Price filters
  const price = searchParams.get('price')
  if (price) {
    if (price.includes('-')) {
      // Range format: "199-299"
      const [min, max] = price.split('-').map(p => parseInt(p.trim()))
      if (!isNaN(min) && !isNaN(max)) {
        filters.priceRange = { min, max }
      }
    } else if (price.includes(',')) {
      // Multiple price points: "199,229,249"
      const points = price.split(',').map(p => parseInt(p.trim()) * 100).filter(p => !isNaN(p))
      if (points.length > 0) {
        filters.pricePoint = points
      }
    } else if (price.endsWith('+')) {
      // Minimum price: "299+"
      const min = parseInt(price.replace('+', ''))
      if (!isNaN(min)) {
        filters.minPrice = min
      }
    } else {
      // Exact price or maximum: "199"
      const priceNum = parseInt(price)
      if (!isNaN(priceNum)) {
        filters.pricePoint = [priceNum * 100]
      }
    }
  }

  const minPrice = searchParams.get('minPrice')
  if (minPrice) {
    const min = parseInt(minPrice)
    if (!isNaN(min)) {
      filters.minPrice = min
    }
  }

  const maxPrice = searchParams.get('maxPrice')
  if (maxPrice) {
    const max = parseInt(maxPrice)
    if (!isNaN(max)) {
      filters.maxPrice = max
    }
  }

  const pricePoint = searchParams.get('pricePoint')
  if (pricePoint) {
    const points = pricePoint.split(',').map(p => parseInt(p.trim()) * 100).filter(p => !isNaN(p))
    if (points.length > 0) {
      filters.pricePoint = points
    }
  }

  // Boolean filters
  const featured = searchParams.get('featured')
  if (featured) {
    filters.featured = featured === 'true' || featured === '1'
  }

  const trending = searchParams.get('trending')
  if (trending) {
    filters.trending = trending === 'true' || trending === '1'
  }

  const inStock = searchParams.get('inStock')
  if (inStock) {
    filters.inStock = inStock === 'true' || inStock === '1'
  }

  const bundles = searchParams.get('bundles')
  if (bundles) {
    filters.includeBundles = bundles === 'true' || bundles === '1'
  }

  const individual = searchParams.get('individual')
  if (individual) {
    filters.includeIndividual = individual === 'true' || individual === '1'
  }

  // Seasonal filter
  const season = searchParams.get('season')
  if (season && ['spring', 'summer', 'fall', 'winter'].includes(season)) {
    filters.seasonal = season as 'spring' | 'summer' | 'fall' | 'winter'
  }

  // Bundle specific filters
  const bundleCategory = searchParams.get('bundleCategory')
  if (bundleCategory && ['classic', 'bold', 'sophisticated', 'contemporary'].includes(bundleCategory)) {
    filters.bundleCategory = bundleCategory as 'classic' | 'bold' | 'sophisticated' | 'contemporary'
  }

  const bundleType = searchParams.get('bundleType')
  if (bundleType) {
    filters.bundleTypes = bundleType.split(',').map(t => t.trim()).filter(Boolean) as any[]
  }

  // Component-specific colors
  const suitColor = searchParams.get('suitColor')
  if (suitColor) {
    filters.suitColor = suitColor
  }

  const shirtColor = searchParams.get('shirtColor')
  if (shirtColor) {
    filters.shirtColor = shirtColor
  }

  const tieColor = searchParams.get('tieColor')
  if (tieColor) {
    filters.tieColor = tieColor
  }

  // Search query
  const search = searchParams.get('q') || searchParams.get('search')
  if (search) {
    filters.search = search
  }

  return filters
}

/**
 * Parse URL sort parameters into sort options
 */
export function parseURLSort(searchParams: URLSearchParams): UnifiedProductSortOptions {
  const sort = searchParams.get('sort')
  const sortBy = searchParams.get('sortBy')
  const order = searchParams.get('order')

  if (sort) {
    // Format: "price-asc", "name-desc", etc.
    const [field, direction] = sort.split('-')
    return {
      field: field as any,
      direction: (direction as 'asc' | 'desc') || 'desc'
    }
  }

  if (sortBy) {
    return {
      field: sortBy as any,
      direction: (order as 'asc' | 'desc') || 'desc'
    }
  }

  // Default sort
  return {
    field: 'created_at',
    direction: 'desc'
  }
}

// ============================================================================
// FILTER TO URL CONVERSION
// ============================================================================

/**
 * Convert unified filters object to URL search params
 */
export function filtersToURLParams(filters: UnifiedProductFilters): URLSearchParams {
  const params = new URLSearchParams()

  // Preset (overrides individual filters in URL for cleanliness)
  if (filters.preset) {
    params.set('preset', filters.preset)
    return params // Return early for preset-based URLs
  }

  // Product type inclusion
  if (filters.includeBundles !== undefined || filters.includeIndividual !== undefined) {
    if (filters.includeBundles && !filters.includeIndividual) {
      params.set('type', 'bundles')
    } else if (!filters.includeBundles && filters.includeIndividual) {
      params.set('type', 'individual')
    } else if (filters.includeBundles && filters.includeIndividual) {
      params.set('type', 'all')
    }
  }

  // Categories
  if (filters.category) {
    params.set('category', filters.category)
  }

  if (filters.subcategory) {
    params.set('subcategory', filters.subcategory)
  }

  // Multi-value filters
  if (filters.colors && filters.colors.length > 0) {
    params.set('colors', filters.colors.join(','))
  }

  if (filters.occasions && filters.occasions.length > 0) {
    params.set('occasions', filters.occasions.join(','))
  }

  if (filters.styles && filters.styles.length > 0) {
    params.set('styles', filters.styles.join(','))
  }

  if (filters.vendors && filters.vendors.length > 0) {
    params.set('vendors', filters.vendors.join(','))
  }

  if (filters.sizes && filters.sizes.length > 0) {
    params.set('sizes', filters.sizes.join(','))
  }

  // Price filters
  if (filters.priceRange) {
    params.set('price', `${filters.priceRange.min}-${filters.priceRange.max}`)
  } else if (filters.pricePoint && filters.pricePoint.length > 0) {
    const points = filters.pricePoint.map(p => Math.round(p / 100)).join(',')
    params.set('pricePoint', points)
  } else {
    if (filters.minPrice !== undefined) {
      params.set('minPrice', filters.minPrice.toString())
    }
    if (filters.maxPrice !== undefined) {
      params.set('maxPrice', filters.maxPrice.toString())
    }
  }

  // Boolean filters (only set if true)
  if (filters.featured) {
    params.set('featured', 'true')
  }

  if (filters.trending) {
    params.set('trending', 'true')
  }

  if (filters.inStock) {
    params.set('inStock', 'true')
  }

  // Seasonal
  if (filters.seasonal) {
    params.set('season', filters.seasonal)
  }

  // Bundle filters
  if (filters.bundleCategory) {
    params.set('bundleCategory', filters.bundleCategory)
  }

  if (filters.bundleTypes && filters.bundleTypes.length > 0) {
    params.set('bundleType', filters.bundleTypes.join(','))
  }

  // Component-specific colors
  if (filters.suitColor) {
    params.set('suitColor', filters.suitColor)
  }

  if (filters.shirtColor) {
    params.set('shirtColor', filters.shirtColor)
  }

  if (filters.tieColor) {
    params.set('tieColor', filters.tieColor)
  }

  // Search
  if (filters.search) {
    params.set('q', filters.search)
  }

  return params
}

/**
 * Convert sort options to URL parameters
 */
export function sortToURLParams(sort: UnifiedProductSortOptions): URLSearchParams {
  const params = new URLSearchParams()
  params.set('sort', `${sort.field}-${sort.direction}`)
  return params
}

// ============================================================================
// URL BUILDING UTILITIES
// ============================================================================

/**
 * Build complete shop URL with filters and sort
 */
export function buildShopURL(
  filters: UnifiedProductFilters,
  sort?: UnifiedProductSortOptions,
  page?: number,
  baseURL: string = '/products'
): string {
  const url = new URL(baseURL, window.location.origin)

  // Add filter parameters
  const filterParams = filtersToURLParams(filters)
  filterParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })

  // Add sort parameters
  if (sort) {
    const sortParams = sortToURLParams(sort)
    sortParams.forEach((value, key) => {
      url.searchParams.set(key, value)
    })
  }

  // Add pagination
  if (page && page > 1) {
    url.searchParams.set('page', page.toString())
  }

  return url.pathname + url.search
}

/**
 * Build preset URL
 */
export function buildPresetURL(presetId: string, baseURL: string = '/products'): string {
  const url = new URL(baseURL, window.location.origin)
  url.searchParams.set('preset', presetId)
  return url.pathname + url.search
}

/**
 * Add filter to existing URL
 */
export function addFilterToURL(
  currentURL: string,
  filterKey: keyof UnifiedProductFilters,
  filterValue: any
): string {
  const url = new URL(currentURL, window.location.origin)
  const currentFilters = parseURLFilters(url.searchParams)
  
  // Update the specific filter
  const updatedFilters = {
    ...currentFilters,
    [filterKey]: filterValue
  }

  // Remove preset if we're modifying individual filters
  if (filterKey !== 'preset') {
    delete updatedFilters.preset
  }

  return buildShopURL(updatedFilters)
}

/**
 * Remove filter from existing URL
 */
export function removeFilterFromURL(
  currentURL: string,
  filterKey: keyof UnifiedProductFilters
): string {
  const url = new URL(currentURL, window.location.origin)
  const currentFilters = parseURLFilters(url.searchParams)
  
  // Remove the specific filter
  const updatedFilters = { ...currentFilters }
  delete updatedFilters[filterKey]

  // Remove preset if we're modifying individual filters
  if (filterKey !== 'preset') {
    delete updatedFilters.preset
  }

  return buildShopURL(updatedFilters)
}

/**
 * Toggle filter value in URL
 */
export function toggleFilterInURL(
  currentURL: string,
  filterKey: keyof UnifiedProductFilters,
  filterValue: any
): string {
  const url = new URL(currentURL, window.location.origin)
  const currentFilters = parseURLFilters(url.searchParams)
  
  const currentValue = currentFilters[filterKey]
  
  if (Array.isArray(currentValue)) {
    // Handle array filters (colors, occasions, etc.)
    const newArray = currentValue.includes(filterValue)
      ? currentValue.filter(v => v !== filterValue)
      : [...currentValue, filterValue]
    
    const updatedFilters = {
      ...currentFilters,
      [filterKey]: newArray.length > 0 ? newArray : undefined
    }
    
    if (newArray.length === 0) {
      delete updatedFilters[filterKey]
    }
    
    return buildShopURL(updatedFilters)
  } else {
    // Handle single value filters
    if (currentValue === filterValue) {
      return removeFilterFromURL(currentURL, filterKey)
    } else {
      return addFilterToURL(currentURL, filterKey, filterValue)
    }
  }
}

// ============================================================================
// URL VALIDATION AND CLEANUP
// ============================================================================

/**
 * Validate and clean URL parameters
 */
export function cleanURLParams(searchParams: URLSearchParams): URLSearchParams {
  const cleaned = new URLSearchParams()

  searchParams.forEach((value, key) => {
    if (value && value.trim() !== '') {
      // Clean up common issues
      const cleanValue = value
        .trim()
        .replace(/\s+/g, ' ') // Multiple spaces to single space
        .replace(/,,+/g, ',') // Multiple commas to single comma
        .replace(/^,|,$/g, '') // Remove leading/trailing commas

      if (cleanValue) {
        cleaned.set(key, cleanValue)
      }
    }
  })

  return cleaned
}

/**
 * Get canonical URL for current filters (for SEO)
 */
export function getCanonicalShopURL(
  filters: UnifiedProductFilters,
  sort?: UnifiedProductSortOptions
): string {
  // For canonical URLs, we prefer preset URLs when possible
  if (filters.preset) {
    return buildPresetURL(filters.preset)
  }

  // Otherwise build standard filter URL
  return buildShopURL(filters, sort)
}

// ============================================================================
// URL QUERY HELPERS
// ============================================================================

/**
 * Extract filter summary from URL for display
 */
export function getFilterSummaryFromURL(url: string): {
  activeFilters: number
  hasPreset: boolean
  presetName?: string
  searchQuery?: string
} {
  const urlObj = new URL(url, window.location.origin)
  const filters = parseURLFilters(urlObj.searchParams)

  let activeFilters = 0
  
  // Count active filters
  Object.entries(filters).forEach(([key, value]) => {
    if (key === 'preset') return // Don't count preset as active filter
    if (key === 'includeIndividual' || key === 'includeBundles') return // Don't count inclusion flags
    
    if (value !== undefined && value !== null) {
      if (Array.isArray(value) && value.length > 0) {
        activeFilters++
      } else if (typeof value === 'boolean' && value) {
        activeFilters++
      } else if (typeof value === 'string' || typeof value === 'number') {
        activeFilters++
      }
    }
  })

  const preset = filters.preset ? getPresetById(filters.preset) : undefined

  return {
    activeFilters,
    hasPreset: !!filters.preset,
    presetName: preset?.name,
    searchQuery: filters.search
  }
}

/**
 * Check if current URL matches a specific preset
 */
export function isPresetActive(url: string, presetId: string): boolean {
  const urlObj = new URL(url, window.location.origin)
  const filters = parseURLFilters(urlObj.searchParams)
  return filters.preset === presetId
}

/**
 * Get shareable URL for current filters
 */
export function getShareableURL(
  filters: UnifiedProductFilters,
  sort?: UnifiedProductSortOptions
): string {
  const url = buildShopURL(filters, sort)
  return `${window.location.origin}${url}`
}

// ============================================================================
// BROWSER HISTORY UTILITIES
// ============================================================================

/**
 * Update browser URL without page reload
 */
export function updateBrowserURL(
  filters: UnifiedProductFilters,
  sort?: UnifiedProductSortOptions,
  page?: number
): void {
  const url = buildShopURL(filters, sort, page)
  
  if (typeof window !== 'undefined' && window.history) {
    window.history.pushState(
      { filters, sort, page },
      '',
      url
    )
  }
}

/**
 * Replace current browser URL without adding to history
 */
export function replaceBrowserURL(
  filters: UnifiedProductFilters,
  sort?: UnifiedProductSortOptions,
  page?: number
): void {
  const url = buildShopURL(filters, sort, page)
  
  if (typeof window !== 'undefined' && window.history) {
    window.history.replaceState(
      { filters, sort, page },
      '',
      url
    )
  }
}