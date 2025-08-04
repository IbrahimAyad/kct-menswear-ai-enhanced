import { NextRequest, NextResponse } from 'next/server'
import { getProducts, getProductCategories, getProductVendors, getProductColors, getProductPriceRange } from '@/lib/supabase/products'
import { ProductSearchParams } from '@/lib/supabase/types'
import { getMockProducts, getMockCategories, getMockBrands, getMockColors, getMockPriceRange } from '@/lib/supabase/mockData'

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    const supabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseConfigured) {
      console.warn('Supabase not configured, using mock data')
      
      const { searchParams } = new URL(request.url)
      const meta = searchParams.get('meta')
      
      // Return mock metadata
      if (meta === 'categories') {
        return NextResponse.json({ categories: getMockCategories() })
      }
      if (meta === 'brands') {
        return NextResponse.json({ brands: getMockBrands() })
      }
      if (meta === 'colors') {
        return NextResponse.json({ colors: getMockColors() })
      }
      if (meta === 'price-range') {
        return NextResponse.json({ priceRange: getMockPriceRange() })
      }
      
      // Return mock products
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '24')
      
      return NextResponse.json(getMockProducts(page, limit))
    }

    const { searchParams } = new URL(request.url)
    
    // Check if this is a request for metadata (categories, brands, colors, price range)
    const meta = searchParams.get('meta')
    if (meta === 'categories') {
      const categories = await getProductCategories()
      return NextResponse.json({ categories })
    }
    
    if (meta === 'vendors') {
      const vendors = await getProductVendors()
      return NextResponse.json({ vendors })
    }
    
    if (meta === 'colors') {
      const colors = await getProductColors()
      return NextResponse.json({ colors })
    }
    
    if (meta === 'price-range') {
      const priceRange = await getProductPriceRange()
      return NextResponse.json({ priceRange })
    }

    // Parse search parameters
    const params: ProductSearchParams = {}
    
    // Pagination
    if (searchParams.get('page')) {
      params.page = parseInt(searchParams.get('page')!)
    }
    if (searchParams.get('limit')) {
      params.limit = parseInt(searchParams.get('limit')!)
    }
    
    // Sorting
    const sortField = searchParams.get('sortField') as 'name' | 'base_price' | 'created_at' | 'trending_score'
    const sortDirection = searchParams.get('sortDirection') as 'asc' | 'desc'
    if (sortField && sortDirection) {
      params.sort = { field: sortField, direction: sortDirection }
    }
    
    // Filters
    params.filters = {}
    
    if (searchParams.get('search')) {
      params.filters.search = searchParams.get('search')!
    }
    
    if (searchParams.get('categories')) {
      params.filters.categories = searchParams.get('categories')!.split(',')
    }
    
    if (searchParams.get('vendors')) {
      params.filters.vendors = searchParams.get('vendors')!.split(',')
    }
    
    if (searchParams.get('colors')) {
      params.filters.colors = searchParams.get('colors')!.split(',')
    }
    
    if (searchParams.get('occasions')) {
      params.filters.occasions = searchParams.get('occasions')!.split(',')
    }
    
    if (searchParams.get('tags')) {
      params.filters.tags = searchParams.get('tags')!.split(',')
    }
    
    if (searchParams.get('minPrice') && searchParams.get('maxPrice')) {
      params.filters.priceRange = {
        min: parseInt(searchParams.get('minPrice')!),
        max: parseInt(searchParams.get('maxPrice')!)
      }
    }
    
    if (searchParams.get('inStock')) {
      params.filters.inStock = searchParams.get('inStock') === 'true'
    }
    
    if (searchParams.get('featured')) {
      params.filters.featured = searchParams.get('featured') === 'true'
    }

    const result = await getProducts(params)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in products API:', error)
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const errorDetails = {
      error: 'Failed to fetch products',
      message: errorMessage,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing',
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'configured' : 'missing',
      products: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0
    }
    
    return NextResponse.json(errorDetails, { status: 500 })
  }
}