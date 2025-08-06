import { NextRequest, NextResponse } from 'next/server'
import { fetchProductsWithImages, Product } from '@/lib/shared/supabase-products'
import { toEnhancedProduct } from '@/lib/supabase/types'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action') || searchParams.get('meta')

    // Handle metadata requests
    switch (action) {
      case 'categories':
        // Return actual categories from products
        const categoryResult = await fetchProductsWithImages({ limit: 1000 })
        const categories = [...new Set(categoryResult.data.map(p => p.category).filter(Boolean))]
        return NextResponse.json({ 
          categories: categories.length > 0 ? categories : ['Suits', 'Shirts', 'Accessories', 'Shoes', 'Vest & Tie Sets'] 
        })
      
      case 'vendors':
      case 'brands':
        // Return static brands for now
        return NextResponse.json({ 
          vendors: ['KCT', 'Premium Collection', 'Classic Line'] 
        })
      
      case 'colors':
        // Return common colors
        return NextResponse.json({ 
          colors: ['Black', 'Navy', 'Gray', 'Blue', 'White', 'Burgundy'] 
        })
      
      case 'priceRange':
      case 'price-range':
        return NextResponse.json({ 
          priceRange: { min: 0, max: 1000 } 
        })
      
      default:
        // Fetch products using shared service
        const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 24
        const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1
        const category = searchParams.get('category')
        const search = searchParams.get('search')
        const sortBy = searchParams.get('sortBy') || 'created_at'
        const sortOrder = searchParams.get('sortOrder') || 'desc'
        
        // First, fetch ALL products to get accurate count
        const allResult = await fetchProductsWithImages({ 
          limit: 1000, // Fetch all products for filtering/counting
          offset: 0,
          category: category || undefined,
          status: 'active'
        })
        
        if (!allResult.success) {
          throw new Error(allResult.error || 'Failed to fetch products')
        }
        
        // Convert all products to enhanced format
        let allEnhancedProducts = allResult.data.map(product => {
          return toEnhancedProduct({
            ...product,
            product_variants: product.variants || [],
            product_images: product.images || []
          } as any)
        })
        
        // Apply search filter if provided
        if (search) {
          const searchLower = search.toLowerCase()
          allEnhancedProducts = allEnhancedProducts.filter(p => 
            p.name.toLowerCase().includes(searchLower) ||
            p.description?.toLowerCase().includes(searchLower) ||
            p.category?.toLowerCase().includes(searchLower) ||
            p.tags?.some(tag => tag.toLowerCase().includes(searchLower))
          )
        }
        
        // Sort all products
        allEnhancedProducts.sort((a, b) => {
          let aVal, bVal
          
          switch(sortBy) {
            case 'price':
              aVal = a.price
              bVal = b.price
              break
            case 'title':
            case 'name':
              aVal = a.name.toLowerCase()
              bVal = b.name.toLowerCase()
              break
            case 'created_at':
            default:
              aVal = new Date(a.createdAt || 0).getTime()
              bVal = new Date(b.createdAt || 0).getTime()
          }
          
          if (sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1
          } else {
            return aVal < bVal ? 1 : -1
          }
        })
        
        // Calculate pagination from sorted/filtered results
        const totalCount = allEnhancedProducts.length
        const totalPages = Math.ceil(totalCount / limit)
        const offset = (page - 1) * limit
        const paginatedProducts = allEnhancedProducts.slice(offset, offset + limit)
        
        // Return paginated response with correct total count
        return NextResponse.json({
          products: paginatedProducts,
          totalCount: totalCount,
          currentPage: page,
          totalPages: totalPages
        })
    }
  } catch (error) {
    console.error('Error in products API:', error)
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action') || searchParams.get('meta')
    
    // Return appropriate empty structure based on what was requested
    switch (action) {
      case 'categories':
        return NextResponse.json({ categories: [] })
      case 'vendors':
        return NextResponse.json({ vendors: [] })
      case 'colors':
        return NextResponse.json({ colors: [] })
      case 'priceRange':
      case 'price-range':
        return NextResponse.json({ priceRange: { min: 0, max: 1000 } })
      default:
        return NextResponse.json({
          products: [],
          totalCount: 0,
          currentPage: 1,
          totalPages: 1,
          error: error instanceof Error ? error.message : 'Failed to fetch products'
        })
    }
  }
}