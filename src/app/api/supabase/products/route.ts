import { NextRequest, NextResponse } from 'next/server'
import { getProducts, getProductCategories, getProductVendors, getProductColors, getProductPriceRange } from '@/lib/supabase/products'
import { ProductSearchParams } from '@/lib/supabase/types'
import { getMockProducts, getMockCategories, getMockBrands, getMockColors, getMockPriceRange } from '@/lib/supabase/mockData'

export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    const supabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseConfigured) {
      // Return mock data if Supabase is not configured
      const searchParams = request.nextUrl.searchParams
      const action = searchParams.get('action') || searchParams.get('meta')

      switch (action) {
        case 'categories':
          return NextResponse.json(getMockCategories())
        case 'brands':
        case 'vendors':
          return NextResponse.json(getMockBrands())
        case 'colors':
          return NextResponse.json(getMockColors())
        case 'priceRange':
        case 'price-range':
          return NextResponse.json(getMockPriceRange())
        default:
          return NextResponse.json(getMockProducts())
      }
    }

    // Use real Supabase data
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action') || searchParams.get('meta')

    switch (action) {
      case 'categories':
        const categories = await getProductCategories()
        return NextResponse.json({ categories: categories || [] })
      
      case 'vendors':
        const vendors = await getProductVendors()
        return NextResponse.json({ vendors: vendors || [] })
      
      case 'colors':
        const colors = await getProductColors()
        return NextResponse.json({ colors: colors || [] })
      
      case 'priceRange':
      case 'price-range':
        const priceRange = await getProductPriceRange()
        return NextResponse.json({ priceRange: priceRange || { min: 0, max: 1000 } })
      
      default:
        const params: ProductSearchParams = {
          category: searchParams.get('category') || undefined,
          vendor: searchParams.get('vendor') || undefined,
          minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
          maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
          color: searchParams.get('color') || undefined,
          search: searchParams.get('search') || undefined,
          sortBy: searchParams.get('sortBy') as any || 'created_at',
          sortOrder: searchParams.get('sortOrder') as any || 'desc',
          page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
          limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20
        }

        const result = await getProducts(params)
        return NextResponse.json({
          products: result?.products || [],
          totalCount: result?.totalCount || 0,
          currentPage: result?.currentPage || 1,
          totalPages: result?.totalPages || 1
        })
    }
  } catch (error) {
    console.error('Error in products API:', error)
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action') || searchParams.get('meta')
    
    // Return appropriate empty structure based on what was requested
    switch (action) {
      case 'categories':
        return NextResponse.json({ categories: [] }, { status: 500 })
      case 'vendors':
        return NextResponse.json({ vendors: [] }, { status: 500 })
      case 'colors':
        return NextResponse.json({ colors: [] }, { status: 500 })
      case 'priceRange':
      case 'price-range':
        return NextResponse.json({ priceRange: { min: 0, max: 1000 } }, { status: 500 })
      default:
        return NextResponse.json({
          products: [],
          totalCount: 0,
          currentPage: 1,
          totalPages: 1,
          error: 'Failed to fetch products'
        }, { status: 500 })
    }
  }
}