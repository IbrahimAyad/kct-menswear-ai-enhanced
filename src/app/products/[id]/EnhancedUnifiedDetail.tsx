'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UnifiedProduct } from '@/types/unified-shop'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { WishlistButton } from '@/components/products/WishlistButton'
import SizeGuideModal from '@/components/products/SizeGuideModal'
import { useCart } from '@/hooks/useCart'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, 
  ChevronLeft,
  ChevronRight,
  Star,
  Minus,
  Plus,
  Share2,
  Truck,
  Shield,
  RefreshCw,
  Award,
  Package,
  Heart,
  Check,
  Info,
  Sparkles,
  Lock
} from 'lucide-react'

interface EnhancedUnifiedDetailProps {
  product: UnifiedProduct
}

// Standard sizes for suits and blazers
const SUIT_SIZES = {
  SHORT: ['34S', '36S', '38S', '40S', '42S', '44S', '46S', '48S', '50S'],
  REGULAR: ['34R', '36R', '38R', '40R', '42R', '44R', '46R', '48R', '50R', '52R', '54R'],
  LONG: ['38L', '40L', '42L', '44L', '46L', '48L', '50L', '52L', '54L']
};

// Blazer specific sizes
const BLAZER_SIZES = ['36R', '38R', '40R', '42R', '44R', '46R', '48R', '50R', '52R', '54R'];

export function EnhancedUnifiedDetail({ product }: EnhancedUnifiedDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedStyle, setSelectedStyle] = useState<'2-piece' | '3-piece'>('2-piece')
  const [quantity, setQuantity] = useState(1)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const { addItem } = useCart()

  // Get all images
  const allImages = product.images?.length > 0 
    ? product.images 
    : [product.imageUrl || '/placeholder.jpg'];

  // Determine product type
  const isSuit = product.category?.toLowerCase().includes('suit') || 
                 product.name?.toLowerCase().includes('suit');
  
  const isBlazer = product.category?.toLowerCase().includes('blazer') || 
                   product.name?.toLowerCase().includes('blazer');

  // Get available sizes based on product type
  const getAvailableSizes = () => {
    if (isBlazer && !product.isBundle) {
      return BLAZER_SIZES;
    }
    if (isSuit || product.isBundle) {
      return SUIT_SIZES;
    }
    return product.size || ['S', 'M', 'L', 'XL', 'XXL'];
  };

  const availableSizes = getAvailableSizes();

  const handleAddToCart = () => {
    if (!selectedSize && !product.isBundle) {
      toast.error('Please select a size')
      return
    }

    try {
      // For bundles, add all components
      if (product.isBundle && product.bundleComponents) {
        let allAdded = true;
        for (const component of product.bundleComponents) {
          const added = addItem({
            id: `${product.id}-${component.type}`,
            name: `${component.name} (${product.name})`,
            price: Math.round(product.price / product.bundleComponents.length * 100), // Convert to cents
            image: component.image || product.imageUrl || '/placeholder-product.svg',
            quantity: quantity,
            selectedSize: selectedSize || 'M',
            stripePriceId: product.stripePriceId,
            category: product.category,
            bundleId: product.id,
            metadata: {
              bundleName: product.name,
              componentType: component.type
            }
          });
          if (!added) allAdded = false;
        }
        if (allAdded) {
          toast.success(
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Complete look added to cart!</span>
            </div>
          )
        }
      } else {
        // For individual products
        const priceInDollars = selectedStyle === '3-piece' && isSuit 
          ? product.price + 20 // Add $20 for vest
          : product.price;
        
        const priceInCents = Math.round(priceInDollars * 100);

        const added = addItem({
          id: product.id,
          name: product.name,
          price: priceInCents, // Price in cents
          image: product.imageUrl || '/placeholder-product.svg',
          quantity: quantity,
          selectedSize: selectedSize,
          stripePriceId: product.stripePriceId || '',
          category: product.category,
          metadata: {
            style: isSuit ? selectedStyle : undefined,
            productType: product.type || 'catalog'
          }
        });
        
        if (added) {
          toast.success(`${product.name} added to cart!`)
        }
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    toast.success(isFavorited ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-6">
          <ol className="flex items-center space-x-2">
            <li><Link href="/products" className="text-gray-500 hover:text-gray-700">Products</Link></li>
            <li><span className="text-gray-400">/</span></li>
            {product.category && (
              <>
                <li><Link href={`/products?category=${product.category}`} className="text-gray-500 hover:text-gray-700 capitalize">{product.category}</Link></li>
                <li><span className="text-gray-400">/</span></li>
              </>
            )}
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={allImages[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev - 1 + allImages.length) % allImages.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev + 1) % allImages.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isBundle && (
                  <Badge className="bg-burgundy-600 text-white">
                    <Package className="h-3 w-3 mr-1" />
                    Complete Look
                  </Badge>
                )}
                {product.trending && (
                  <Badge className="bg-red-500 text-white">Trending</Badge>
                )}
                {product.aiScore && product.aiScore >= 85 && (
                  <Badge className="bg-gold-500 text-black">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Score: {product.aiScore}
                  </Badge>
                )}
              </div>

              {/* Image Counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImage + 1} / {allImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 transition-all",
                      selectedImage === index 
                        ? "ring-2 ring-burgundy-600 ring-offset-2" 
                        : "hover:opacity-75"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 25vw, 150px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Bundle Components */}
            {product.isBundle && product.bundleComponents && (
              <div className="bg-gradient-to-r from-burgundy-50 to-gold-50 rounded-lg p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-burgundy-600" />
                  Included Items
                </h3>
                <div className="space-y-3">
                  {product.bundleComponents.map((component, index) => (
                    <div key={index} className="flex items-center gap-4 bg-white rounded-lg p-3">
                      {component.image && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={component.image}
                            alt={component.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{component.name}</p>
                        <p className="text-sm text-gray-600">
                          {component.color && `${component.color} • `}
                          {component.material}
                        </p>
                      </div>
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              {/* Price Section */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${selectedStyle === '3-piece' && isSuit 
                      ? (product.price + 20).toFixed(2) 
                      : product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <Badge variant="destructive" className="text-sm">
                    Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </Badge>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(127 reviews)</span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Style Selection (for suits) */}
            {isSuit && !product.isBundle && (
              <div>
                <label className="text-sm font-semibold text-gray-900 mb-3 block">Style</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedStyle('2-piece')}
                    className={cn(
                      "p-4 border-2 rounded-lg transition-all",
                      selectedStyle === '2-piece'
                        ? "border-burgundy-600 bg-burgundy-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="font-medium">2-Piece Suit</div>
                    <div className="text-sm text-gray-500">Jacket & Pants</div>
                    <div className="text-lg font-bold mt-1">${product.price.toFixed(2)}</div>
                  </button>
                  <button
                    onClick={() => setSelectedStyle('3-piece')}
                    className={cn(
                      "p-4 border-2 rounded-lg transition-all",
                      selectedStyle === '3-piece'
                        ? "border-burgundy-600 bg-burgundy-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="font-medium">3-Piece Suit</div>
                    <div className="text-sm text-gray-500">Jacket, Vest & Pants</div>
                    <div className="text-lg font-bold mt-1">${(product.price + 20).toFixed(2)}</div>
                  </button>
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-900">Size</label>
                <div className="flex items-center gap-3">
                  {isSuit && (
                    <button className="text-sm text-burgundy-600 hover:text-burgundy-700 font-medium flex items-center gap-1">
                      <Sparkles className="h-4 w-4" />
                      AI Size Assistant
                    </button>
                  )}
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Size Guide
                  </button>
                </div>
              </div>
              
              {isBlazer && !product.isBundle ? (
                // Blazer sizes - single row
                <div className="grid grid-cols-5 gap-2">
                  {(availableSizes as string[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "py-3 px-4 border-2 rounded-lg transition-all font-medium",
                        selectedSize === size
                          ? "border-burgundy-600 bg-burgundy-50 text-burgundy-600"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              ) : isSuit || product.isBundle ? (
                // Suit sizes with categories
                <div className="space-y-3">
                  {Object.entries(availableSizes).map(([category, sizes]) => (
                    <div key={category}>
                      <p className="text-xs font-medium text-gray-500 mb-2">
                        {category} ({category === 'SHORT' ? "5'4\" - 5'7\"" : category === 'REGULAR' ? "5'8\" - 6'1\"" : "6'2\" +"})
                      </p>
                      <div className="grid grid-cols-5 gap-2">
                        {(sizes as string[]).map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={cn(
                              "py-2 px-3 border rounded-lg transition-all text-sm font-medium",
                              selectedSize === size
                                ? "border-burgundy-600 bg-burgundy-50 text-burgundy-600"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Regular sizes (S, M, L, XL, XXL)
                <div className="grid grid-cols-5 gap-2">
                  {(availableSizes as string[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size.toString())}
                      className={cn(
                        "py-3 px-4 border-2 rounded-lg transition-all font-medium",
                        selectedSize === size
                          ? "border-burgundy-600 bg-burgundy-50 text-burgundy-600"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}

              {/* Size Recommendation */}
              {(isSuit || isBlazer) && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    Based on your previous orders, we recommend size <strong>40R</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex gap-4">
              <div className="flex items-center border-2 border-gray-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 font-medium min-w-[50px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-burgundy-600 hover:bg-burgundy-700 text-white py-6 text-lg font-semibold"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.isBundle ? 'Add Bundle to Cart' : 'Add to Cart'}
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleFavorite}
                variant="outline"
                className={cn(
                  "flex-1",
                  isFavorited && "border-red-500 text-red-500"
                )}
              >
                <Heart className={cn("h-4 w-4 mr-2", isFavorited && "fill-current")} />
                {isFavorited ? 'Saved' : 'Save'}
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-1"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 py-6 border-y">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Truck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-500">Over $200</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">30-Day Returns</p>
                  <p className="text-xs text-gray-500">Easy process</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">100% Secure</p>
                  <p className="text-xs text-gray-500">Checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Award className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Free Alterations</p>
                  <p className="text-xs text-gray-500">In-store</p>
                </div>
              </div>
            </div>

            {/* Perfect For Section */}
            {product.occasions && product.occasions.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm text-gray-900 mb-3">Perfect For:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.occasions.map((occasion) => (
                    <span
                      key={occasion}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {occasion}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bundle Savings */}
            {product.isBundle && product.savings && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Lock className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-green-900">Bundle Savings</p>
                  <p className="text-sm text-green-700">Up to 15% off when purchased as a complete look</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <SizeGuideModal
          isOpen={showSizeGuide}
          onClose={() => setShowSizeGuide(false)}
        />
      )}
    </div>
  )
}