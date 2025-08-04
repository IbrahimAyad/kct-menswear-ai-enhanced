import { createClient } from './client'
import { supabaseAdmin } from './client'
import { 
  Product, 
  ProductWithVariants, 
  EnhancedProduct, 
  ProductFilters, 
  ProductSortOptions,
  ProductSearchParams,
  toEnhancedProduct 
} from './types'

/**
 * Get all products with optional filtering and sorting
 */
export async function getProducts(params: ProductSearchParams = {}) {
  const { filters = {}, sort = { field: 'created_at', direction: 'desc' }, page = 1, limit = 50 } = params
  
  try {
    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        product_variants(*),
        product_images(*)
      `)

    // Apply filters
    if (filters.categories?.length) {
      query = query.in('category', filters.categories)
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,tags.cs.{${filters.search}}`)
    }

    if (filters.priceRange) {
      query = query.gte('base_price', filters.priceRange.min * 100) // Convert to cents
      query = query.lte('base_price', filters.priceRange.max * 100)
    }

    if (filters.colors?.length) {
      query = query.in('color_family', filters.colors)
    }

    if (filters.occasions?.length) {
      query = query.overlaps('occasion_tags', filters.occasions)
    }

    if (filters.brands?.length) {
      query = query.in('brand', filters.brands)
    }

    if (filters.tags?.length) {
      query = query.overlaps('tags', filters.tags)
    }

    if (filters.inStock !== undefined) {
      query = query.eq('in_stock', filters.inStock)
    }

    if (filters.featured !== undefined) {
      query = query.eq('is_featured', filters.featured)
    }

    // Always filter for active products
    query = query.eq('status', 'active')

    // Apply sorting
    query = query.order(sort.field, { ascending: sort.direction === 'asc' })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching products:', error)
      throw new Error(`Failed to fetch products: ${error.message}`)
    }

    // Transform to enhanced products
    const enhancedProducts = data?.map(product => toEnhancedProduct(product as ProductWithVariants)) || []

    return {
      products: enhancedProducts,
      totalCount: count || 0,
      currentPage: page,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Error in getProducts:', error)
    throw error
  }
}

/**
 * Get a single product by ID
 */
export async function getProduct(id: string): Promise<EnhancedProduct | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        product_variants(*),
        product_images(*)
      `)
      .eq('id', id)
      .eq('status', 'active')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Product not found
      }
      throw new Error(`Failed to fetch product: ${error.message}`)
    }

    return toEnhancedProduct(data as ProductWithVariants)
  } catch (error) {
    console.error('Error in getProduct:', error)
    throw error
  }
}

/**
 * Get products by category
 */
export async function getProductsByCategory(
  category: string, 
  params: Omit<ProductSearchParams, 'filters'> & { filters?: Omit<ProductFilters, 'categories'> } = {}
) {
  const { filters = {}, ...restParams } = params
  
  return getProducts({
    ...restParams,
    filters: {
      ...filters,
      categories: [category]
    }
  })
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit = 12) {
  return getProducts({
    filters: { featured: true },
    limit,
    sort: { field: 'trending_score', direction: 'desc' }
  })
}

/**
 * Get products by occasion
 */
export async function getProductsByOccasion(occasion: string, limit = 50) {
  return getProducts({
    filters: { occasions: [occasion] },
    limit,
    sort: { field: 'trending_score', direction: 'desc' }
  })
}

/**
 * Search products with full-text search
 */
export async function searchProducts(query: string, params: ProductSearchParams = {}) {
  return getProducts({
    ...params,
    filters: {
      ...params.filters,
      search: query
    }
  })
}

/**
 * Get all unique categories
 */
export async function getProductCategories() {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('category')
      .eq('status', 'active')

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`)
    }

    const categories = [...new Set(data?.map(item => item.category))]
    return categories.filter(Boolean)
  } catch (error) {
    console.error('Error in getProductCategories:', error)
    throw error
  }
}

/**
 * Get all unique brands
 */
export async function getProductBrands() {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('brand')
      .eq('status', 'active')
      .not('brand', 'is', null)

    if (error) {
      throw new Error(`Failed to fetch brands: ${error.message}`)
    }

    const brands = [...new Set(data?.map(item => item.brand))]
    return brands.filter(Boolean)
  } catch (error) {
    console.error('Error in getProductBrands:', error)
    throw error
  }
}

/**
 * Get all unique colors
 */
export async function getProductColors() {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('color_family')
      .eq('status', 'active')
      .not('color_family', 'is', null)

    if (error) {
      throw new Error(`Failed to fetch colors: ${error.message}`)
    }

    const colors = [...new Set(data?.map(item => item.color_family))]
    return colors.filter(Boolean)
  } catch (error) {
    console.error('Error in getProductColors:', error)
    throw error
  }
}

/**
 * Get product price range
 */
export async function getProductPriceRange() {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('base_price')
      .eq('status', 'active')
      .order('base_price', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch price range: ${error.message}`)
    }

    if (!data || data.length === 0) {
      return { min: 0, max: 0 }
    }

    const prices = data.map(item => item.base_price)
    return {
      min: Math.floor(Math.min(...prices) / 100), // Convert from cents to dollars
      max: Math.ceil(Math.max(...prices) / 100)
    }
  } catch (error) {
    console.error('Error in getProductPriceRange:', error)
    throw error
  }
}