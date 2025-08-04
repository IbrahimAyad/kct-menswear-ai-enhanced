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
      const action = searchParams.get('action')

      switch (action) {
        case 'categories':
          return NextResponse.json(getMockCategories())
        case 'brands':
          return NextResponse.json(getMockBrands())
        case 'colors':
          return NextResponse.json(getMockColors())
        case 'priceRange':
          return NextResponse.json(getMockPriceRange())
        default:
          return NextResponse.json(getMockProducts())
      }
    }

    // Use real Supabase data
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')

    switch (action) {
      case 'categories':
        const categories = await getProductCategories()
        return NextResponse.json(categories)
      
      case 'vendors':
        const vendors = await getProductVendors()
        return NextResponse.json(vendors)
      
      case 'colors':
        const colors = await getProductColors()
        return NextResponse.json(colors)
      
      case 'priceRange':
        const priceRange = await getProductPriceRange()
        return NextResponse.json(priceRange)
      
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
        return NextResponse.json(result)
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}