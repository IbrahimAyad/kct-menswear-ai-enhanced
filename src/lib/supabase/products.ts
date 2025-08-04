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

    throw error
  }
}