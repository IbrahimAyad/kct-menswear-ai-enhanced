"use client"

import { useState } from 'react'
import Link from 'next/link'
import { EnhancedProduct } from '@/lib/supabase/types'
import { WishlistButton } from '@/components/products/WishlistButton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductImage } from '@/components/ui/ProductImage'
import { ShoppingBag, Eye, Star } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import { useCart } from '@/lib/hooks/useCart'
import { toast } from 'sonner'

interface SupabaseProductCardProps {
  product: EnhancedProduct
  viewMode?: 'grid' | 'list'
  variant?: 'default' | 'compact' | 'featured'
  className?: string
}

export function SupabaseProductCard({ 
  product, 
  viewMode = 'grid',
  variant = 'default',
  className 
}: SupabaseProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useCart()

  const handleQuickAdd = () => {
    try {
      // For Supabase products, we'll add without variant for now
      // This can be enhanced later with size selection modal
      addToCart(product, 'default')
      toast.success('Added to cart', {
        description: `${product.name} has been added to your cart`,
        action: {
          label: 'View Cart',
          onClick: () => window.location.href = '/cart'
        }
      })
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const primaryImage = product.images[0] || product.primaryImage
  const hoverImage = product.images[1] || primaryImage
  
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercent = hasDiscount 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  if (viewMode === 'list') {
    return (
      <div className={cn(
        "group bg-white rounded-lg border border-gray-200 hover:border-gold/30 transition-all duration-300 hover:shadow-lg",
        className
      )}>
        <div className="flex gap-4 p-4">
          {/* Image */}
          <Link href={`/shop/products/${product.id}`} className="flex-shrink-0">
            <div className="relative w-32 h-40 bg-gray-100 rounded-md overflow-hidden">
              <ProductImage
                src={primaryImage}
                alt={product.name}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="128px"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Out of Stock</span>
                </div>
              )}
            </div>
          </Link>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {product.brand && (
                  <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
                )}
                <Link href={`/shop/products/${product.id}`}>
                  <h3 className="font-medium text-gray-900 group-hover:text-gold transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                {product.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                )}
                
                {/* Tags */}
                {product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-4">
                <WishlistButton productId={product.id} variant="icon" />
                {product.inStock && (
                  <Button
                    size="sm"
                    onClick={handleQuickAdd}
                    className="bg-gold hover:bg-gold/90 text-black"
                  >
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.compareAtPrice!)}
                  </span>
                  <Badge className="bg-red-100 text-red-800 text-xs">
                    {discountPercent}% OFF
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div 
      className={cn(
        "group relative bg-white rounded-lg border border-gray-200 hover:border-gold/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden",
        variant === 'compact' && "max-w-xs",
        variant === 'featured' && "ring-2 ring-gold/20",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {!product.inStock && (
          <Badge className="bg-gray-800 text-white">Out of Stock</Badge>
        )}
        {product.isFeatured && (
          <Badge className="bg-gold text-black">Featured</Badge>
        )}
        {hasDiscount && (
          <Badge className="bg-red-500 text-white">{discountPercent}% OFF</Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <WishlistButton 
          productId={product.id} 
          variant="icon" 
          className="bg-white/90 backdrop-blur-sm shadow-md hover:bg-white" 
        />
      </div>

      {/* Image */}
      <Link href={`/shop/products/${product.id}`}>
        <div className={cn(
          "relative bg-gray-100 overflow-hidden",
          variant === 'compact' ? "aspect-[3/4]" : "aspect-[3/4]"
        )}>
          <ProductImage
            src={isHovered && hoverImage !== primaryImage ? hoverImage : primaryImage}
            alt={product.name}
            className="object-cover transition-all duration-500 group-hover:scale-105"
            sizes={variant === 'compact' ? '200px' : '300px'}
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          
          {/* Quick view button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              className="bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white"
            >
              <Eye className="h-4 w-4 mr-2" />
              Quick View
            </Button>
          </div>
          
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {product.brand && (
          <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
        )}
        
        <Link href={`/shop/products/${product.id}`}>
          <h3 className={cn(
            "font-medium text-gray-900 group-hover:text-gold transition-colors line-clamp-2",
            variant === 'compact' ? "text-sm" : "text-base"
          )}>
            {product.name}
          </h3>
        </Link>

        {/* Rating placeholder - can be enhanced later */}
        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3 w-3 text-gold fill-current" />
          ))}
          <span className="text-xs text-gray-500 ml-1">(24)</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-bold text-gray-900",
              variant === 'compact' ? "text-sm" : "text-lg"
            )}>
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>
        </div>

        {/* Available sizes preview */}
        {product.variants.length > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-gray-600">Sizes:</span>
            {product.variants.slice(0, 4).map((variant, idx) => (
              <span key={idx} className="text-xs text-gray-600">
                {variant.option1}{idx < Math.min(3, product.variants.length - 1) ? ',' : ''}
              </span>
            ))}
            {product.variants.length > 4 && <span className="text-xs text-gray-600">+more</span>}
          </div>
        )}

        {/* Quick add button */}
        {product.inStock && (
          <Button
            onClick={handleQuickAdd}
            className="w-full mt-3 bg-gold hover:bg-gold/90 text-black font-medium transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        )}
      </div>
    </div>
  )
}