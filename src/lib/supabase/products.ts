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
    // Check if Supabase is configured
    if (!supabaseAdmin) {
      console.error('Supabase admin client is not configured')
      return {
        products: [],
        totalCount: 0,
        currentPage: 1,
        totalPages: 0
      }
    }

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
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters.priceRange) {
      query = query.gte('base_price', filters.priceRange.min * 100) // Convert to cents
      query = query.lte('base_price', filters.priceRange.max * 100)
    }

    if (filters.vendors?.length) {
      query = query.in('vendor', filters.vendors)
    }

    if (filters.tags?.length) {
      query = query.overlaps('tags', filters.tags)
    }

    if (filters.featured !== undefined) {
      query = query.eq('featured', filters.featured)
    }

    // Always filter for active and visible products
    query = query.eq('status', 'active').eq('visibility', true)

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
    // Check if Supabase is configured
    if (!supabaseAdmin) {
      console.error('Supabase admin client is not configured')
      return null
    }

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
    if (!supabaseAdmin) {
      console.error('Supabase admin client is not configured')
      return []
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('category')
      .eq('status', 'active')
      .eq('visibility', true)

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
 * Get all unique vendors
 */
export async function getProductVendors() {
  try {
    if (!supabaseAdmin) {
      console.error('Supabase admin client is not configured')
      return []
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('vendor')
      .eq('status', 'active')
      .eq('visibility', true)
      .not('vendor', 'is', null)

    if (error) {
      throw new Error(`Failed to fetch vendors: ${error.message}`)
    }

    const vendors = [...new Set(data?.map(item => item.vendor))]
    return vendors.filter(Boolean)
  } catch (error) {
    console.error('Error in getProductVendors:', error)
    throw error
  }
}

/**
 * Get all unique product tags (colors extracted from tags)
 */
export async function getProductColors() {
  try {
    if (!supabaseAdmin) {
      console.error('Supabase admin client is not configured')
      return []
    }

    // Since color_family doesn't exist in new schema, extract from tags
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('tags')
      .eq('status', 'active')
      .eq('visibility', true)

    if (error) {
      throw new Error(`Failed to fetch product tags: ${error.message}`)
    }

    const allTags = data?.flatMap(item => item.tags || []) || []
    const colorTags = allTags.filter(tag => 
      tag.includes('Blue') || tag.includes('Red') || tag.includes('Green') || 
      tag.includes('Pink') || tag.includes('Yellow') || tag.includes('Purple') ||
      tag.includes('Orange') || tag.includes('Brown') || tag.includes('Grey') ||
      tag.includes('Gold') || tag.includes('Silver') || tag.includes('Black') ||
      tag.includes('White') || tag.includes('Wine') || tag.includes('Turquoise')
    )
    return [...new Set(colorTags)]
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
    if (!supabaseAdmin) {
      console.error('Supabase admin client is not configured')
      return { min: 0, max: 1000 }
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .select('base_price')
      .eq('status', 'active')
      .eq('visibility', true)
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