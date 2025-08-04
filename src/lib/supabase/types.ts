import { Database } from './database.types'

// Database table types
export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type ProductVariant = Database['public']['Tables']['product_variants']['Row']
export type ProductVariantInsert = Database['public']['Tables']['product_variants']['Insert']
export type ProductVariantUpdate = Database['public']['Tables']['product_variants']['Update']

export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type ProductImageInsert = Database['public']['Tables']['product_images']['Insert']
export type ProductImageUpdate = Database['public']['Tables']['product_images']['Update']

// Enhanced product types with relations
export interface ProductWithVariants extends Product {
  product_variants: ProductVariant[]
  product_images: ProductImage[]
}

export interface ProductWithImages extends Product {
  product_images: ProductImage[]
}

// Frontend-friendly product interface
export interface EnhancedProduct {
  id: string
  name: string
  description: string | null
  category: string
  productType: string | null
  brand: string | null
  sku: string
  price: number // base_price in cents
  compareAtPrice: number | null
  weight: number | null
  status: 'active' | 'draft' | 'archived'
  inStock: boolean
  tags: string[]
  metaTitle: string | null
  metaDescription: string | null
  seoHandle: string | null
  images: string[] // Combined primary_image and image_gallery
  primaryImage: string | null
  colorFamily: string | null
  isFeatured: boolean
  trendingScore: number | null
  occasionTags: string[]
  styleAttributes: Record<string, any> | null
  variants: ProductVariant[]
  createdAt: string
  updatedAt: string
}

// Product filters and search
export interface ProductFilters {
  categories?: string[]
  priceRange?: { min: number; max: number }
  colors?: string[]
  occasions?: string[]
  brands?: string[]
  tags?: string[]
  inStock?: boolean
  featured?: boolean
  search?: string
}

export interface ProductSortOptions {
  field: 'name' | 'base_price' | 'created_at' | 'trending_score'
  direction: 'asc' | 'desc'
}

export interface ProductSearchParams {
  filters?: ProductFilters
  sort?: ProductSortOptions
  page?: number
  limit?: number
}

// Product categories based on your database
export const PRODUCT_CATEGORIES = [
  'Vest & Accessory Sets',
  'Formal Wear', 
  'Footwear',
  'Apparel',
  'Other'
] as const

export type ProductCategory = typeof PRODUCT_CATEGORIES[number]

// Helper function to convert database product to enhanced product
export function toEnhancedProduct(product: ProductWithVariants): EnhancedProduct {
  const images = [
    ...(product.primary_image ? [product.primary_image] : []),
    ...product.image_gallery
  ].filter((img, index, arr) => arr.indexOf(img) === index) // Remove duplicates

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    productType: product.product_type,
    brand: product.brand,
    sku: product.sku,
    price: product.base_price,
    compareAtPrice: product.compare_at_price,
    weight: product.weight,
    status: product.status,
    inStock: product.in_stock,
    tags: product.tags,
    metaTitle: product.meta_title,
    metaDescription: product.meta_description,
    seoHandle: product.seo_handle,
    images,
    primaryImage: product.primary_image,
    colorFamily: product.color_family,
    isFeatured: product.is_featured,
    trendingScore: product.trending_score,
    occasionTags: product.occasion_tags,
    styleAttributes: product.style_attributes as Record<string, any> | null,
    variants: product.product_variants || [],
    createdAt: product.created_at,
    updatedAt: product.updated_at
  }
}