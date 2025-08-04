'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { EnhancedProduct } from '@/lib/supabase/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductImage } from '@/components/ui/ProductImage'
import { WishlistButton } from '@/components/products/WishlistButton'
import SizeGuideModal from '@/components/products/SizeGuideModal'
import { formatPrice } from '@/lib/utils/format'
import { useCart } from '@/lib/hooks/useCart'
import { toast } from 'sonner'
import { 
  ShoppingBag, 
  Check, 
  Truck, 
  Shield, 
  RefreshCw,
  Ruler,
  ChevronLeft,
  Star,
  Minus,
  Plus
} from 'lucide-react'

interface ProductDetailClientProps {
  product: EnhancedProduct
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const { addToCart } = useCart()

  const availableSizes = product.variants
    .filter(v => v.available && v.inventoryQuantity > 0)
    .map(v => v.option1)
    .filter(Boolean)

  const handleAddToCart = async () => {
    if (!selectedSize && availableSizes.length > 0) {
      toast.error('Please select a size')
      return
    }

    setIsAddingToCart(true)
    try {
      for (let i = 0; i < quantity; i++) {
        addToCart(product, selectedSize || 'default')
      }
      toast.success(`Added ${quantity} ${product.name} to cart`, {
        action: {
          label: 'View Cart',
          onClick: () => window.location.href = '/cart'
        }
      })
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercent = hasDiscount 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gold transition-colors">Shop</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link href={`/products?category=${product.category}`} className="hover:text-gold transition-colors">
                {product.category}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              {product.images[selectedImage] ? (
                <ProductImage
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image available
                </div>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-2xl font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-[3/4] bg-gray-100 rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-gold' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <ProductImage
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="object-cover"
                      sizes="150px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              {product.vendor && (
                <p className="text-sm text-gray-600 mb-1">{product.vendor}</p>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-gold fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(24 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.compareAtPrice!)}
                    </span>
                    <Badge className="bg-red-500 text-white">
                      {discountPercent}% OFF
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Size</label>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-sm text-gold hover:text-gold/80 flex items-center gap-1"
                  >
                    <Ruler className="h-4 w-4" />
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-sm font-medium rounded-md border transition-all ${
                        selectedSize === size
                          ? 'border-gold bg-gold text-black'
                          : 'border-gray-300 hover:border-gold'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAddingToCart}
                className="flex-1 bg-gold hover:bg-gold/90 text-black font-medium py-6 text-base"
              >
                {isAddingToCart ? (
                  'Adding...'
                ) : product.inStock ? (
                  <>
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                ) : (
                  'Out of Stock'
                )}
              </Button>
              <WishlistButton 
                productId={product.id} 
                variant="outline"
                className="px-6 py-6"
              />
            </div>

            {/* Features */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-4 w-4 text-gold" />
                <span>Free shipping on orders over $200</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-gold" />
                <span>Secure checkout with SSL encryption</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RefreshCw className="h-4 w-4 text-gold" />
                <span>30-day return policy</span>
              </div>
            </div>

            {/* Product Details Tabs */}
            <Tabs defaultValue="description" className="border-t pt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4 space-y-4">
                <p className="text-gray-600">
                  {product.description || 'Premium quality menswear designed for the modern gentleman. Crafted with attention to detail and superior materials.'}
                </p>
                {product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="details" className="mt-4 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-medium">{product.sku || 'N/A'}</span>
                  
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{product.category || 'N/A'}</span>
                  
                  <span className="text-gray-600">Brand:</span>
                  <span className="font-medium">{product.vendor}</span>
                  
                  {product.weight && (
                    <>
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium">{product.weight}g</span>
                    </>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="shipping" className="mt-4 space-y-2 text-sm text-gray-600">
                <p>• Standard shipping: 5-7 business days</p>
                <p>• Express shipping: 2-3 business days</p>
                <p>• Free shipping on orders over $200</p>
                <p>• International shipping available</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Related Products Section */}
        <section className="mt-16 pt-16 border-t">
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          {/* This would show related products */}
          <div className="text-center py-8 text-gray-500">
            Related products will appear here
          </div>
        </section>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal 
        isOpen={showSizeGuide} 
        onClose={() => setShowSizeGuide(false)} 
      />
    </div>
  )
}