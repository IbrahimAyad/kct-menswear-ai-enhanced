import { NextRequest, NextResponse } from 'next/server'
import { getProducts, getProductCategories, getProductBrands, getProductColors, getProductPriceRange } from '@/lib/supabase/products'
import { ProductSearchParams } from '@/lib/supabase/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Check if this is a request for metadata (categories, brands, colors, price range)
    const meta = searchParams.get('meta')
    if (meta === 'categories') {
      const categories = await getProductCategories()
      return NextResponse.json({ categories })
    }
    
    if (meta === 'brands') {
      const brands = await getProductBrands()
      return NextResponse.json({ brands })
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
    
    if (searchParams.get('brands')) {
      params.filters.brands = searchParams.get('brands')!.split(',')
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
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}