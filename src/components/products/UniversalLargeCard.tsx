'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, ArrowRight, Check, Layers } from 'lucide-react';
import { UnifiedProduct } from '@/types/unified-shop';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

interface UniversalLargeCardProps {
  product: UnifiedProduct;
  onQuickView?: (product: UnifiedProduct) => void;
}

export default function UniversalLargeCard({
  product,
  onQuickView
}: UniversalLargeCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showComponents, setShowComponents] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.isBundle ? (product.bundlePrice || product.price) : product.price,
      image: product.imageUrl || '/placeholder.jpg',
      quantity: 1,
      category: product.isBundle ? 'bundle' : product.category || 'product',
      size: selectedSize || '40'
    });
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const sizes = ['36', '38', '40', '42', '44', '46', '48', '50'];
  
  // Get color variants for individual products
  const colorVariants = product.colors && product.colors.length > 0 
    ? product.colors 
    : product.color 
      ? [{ name: product.color, hex: '#000000', image: product.imageUrl }]
      : [];

  const productLink = product.isBundle ? `/bundles/${product.id}` : `/products/${product.slug || product.id}`;
  
  const savingsAmount = product.originalPrice && product.isBundle && product.bundlePrice
    ? product.originalPrice - product.bundlePrice
    : product.originalPrice && !product.isBundle
    ? product.originalPrice - product.price
    : 0;

  return (
    <div 
      className="group relative bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsFavorited(!isFavorited);
        }}
        className="absolute top-6 right-6 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
      >
        <Heart 
          className={cn(
            "w-5 h-5 transition-all",
            isFavorited ? "fill-red-500 text-red-500 animate-pulse" : "text-gray-600"
          )}
        />
      </button>

      {/* Large Product Image */}
      <Link href={productLink}>
        <div 
          className="relative aspect-[4/5] overflow-hidden bg-gray-50 cursor-pointer"
          onClick={(e) => {
            if (showComponents && product.isBundle) {
              e.preventDefault();
              setShowComponents(false);
            }
          }}
        >
          {/* Bundle Component View */}
          {product.isBundle && showComponents && product.bundleComponents ? (
            <div className="grid grid-cols-2 grid-rows-2 h-full gap-1 bg-gray-100 p-4">
              <div className="relative bg-white group/item hover:z-10 hover:scale-105 transition-all">
                {product.bundleComponents.suit?.image && (
                  <Image
                    src={product.bundleComponents.suit.image}
                    alt="Suit"
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <div className="text-white text-sm font-medium">
                    {product.bundleComponents.suit?.color} Suit
                  </div>
                </div>
              </div>
              
              <div className="relative bg-white group/item hover:z-10 hover:scale-105 transition-all">
                {product.bundleComponents.shirt?.image && (
                  <Image
                    src={product.bundleComponents.shirt.image}
                    alt="Shirt"
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <div className="text-white text-sm font-medium">
                    {product.bundleComponents.shirt?.color} Shirt
                  </div>
                </div>
              </div>
              
              <div className="relative bg-white group/item hover:z-10 hover:scale-105 transition-all">
                {product.bundleComponents.tie?.image && (
                  <Image
                    src={product.bundleComponents.tie.image}
                    alt="Tie"
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <div className="text-white text-sm font-medium">
                    {product.bundleComponents.tie?.color} Tie
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-4">
                <div className="text-3xl font-light mb-2">${product.bundlePrice}</div>
                <div className="text-sm text-white/60 line-through mb-1">${product.originalPrice}</div>
                <div className="text-xs text-green-400 font-medium">Save ${savingsAmount}</div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowComponents(false);
                  }}
                  className="mt-3 text-xs underline hover:no-underline"
                >
                  Back to outfit
                </button>
              </div>
            </div>
          ) : (
            // Regular Product Image
            <>
              <Image
                src={colorVariants[selectedColor]?.image || product.imageUrl || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              
              {/* Hover Overlay with Actions */}
              {isHovered && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
                  <div className="flex gap-3">
                    {product.isBundle ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setShowComponents(true);
                        }}
                        className="flex-1 bg-white text-black py-3 px-4 font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <Layers className="w-4 h-4" />
                        View Pieces
                      </button>
                    ) : (
                      <button
                        onClick={handleQuickAddToCart}
                        className="flex-1 bg-white text-black py-3 px-4 font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Quick Add
                      </button>
                    )}
                    {onQuickView && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onQuickView(product);
                        }}
                        className="bg-white/20 backdrop-blur-sm text-white p-3 hover:bg-white/30 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="pt-6 pb-2">
        <Link href={productLink}>
          <h3 className="text-xl font-light text-gray-900 mb-2 hover:underline">{product.name}</h3>
        </Link>
        
        {/* Category/Type */}
        <p className="text-sm text-gray-500 mb-3">
          {product.isBundle 
            ? `${product.occasions?.[0] || 'Complete Look'}`
            : `${product.category || 'Menswear'} ${product.material ? `• ${product.material}` : ''}`
          }
        </p>
        
        {/* Pricing */}
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-2xl font-light">
            ${product.isBundle ? product.bundlePrice : product.price}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-base text-gray-400 line-through">
                ${product.originalPrice}
              </span>
              {savingsAmount > 0 && (
                <span className="text-sm text-green-600 font-medium">
                  Save ${savingsAmount}
                </span>
              )}
            </>
          )}
        </div>

        {/* Size Selector (for hover) */}
        {isHovered && !product.isBundle && (
          <div className="mb-4 animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">Quick Select Size:</span>
              <Link href="/size-guide" className="text-xs text-blue-600 underline">
                Size Guide
              </Link>
            </div>
            <div className="grid grid-cols-8 gap-1">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedSize(size);
                  }}
                  className={cn(
                    "py-1.5 text-xs border transition-all",
                    selectedSize === size 
                      ? "bg-black text-white border-black" 
                      : "bg-white hover:border-black"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Options (for individual products) */}
        {!product.isBundle && colorVariants.length > 1 && (
          <div className="mb-4">
            <span className="text-xs text-gray-600">Colors:</span>
            <div className="flex gap-2 mt-2">
              {colorVariants.map((color, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedColor(index);
                  }}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    selectedColor === index 
                      ? "border-black scale-110" 
                      : "border-gray-300 hover:border-gray-500"
                  )}
                  style={{ backgroundColor: color.hex || '#ccc' }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleQuickAddToCart}
            className={cn(
              "flex-1 py-3 px-4 font-medium transition-all flex items-center justify-center gap-2",
              addedToCart 
                ? "bg-green-600 text-white" 
                : "bg-black text-white hover:bg-gray-800"
            )}
          >
            {addedToCart ? (
              <>
                <Check className="w-4 h-4" />
                Added!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>
          
          <Link 
            href={productLink}
            className="px-4 py-3 border border-black text-black hover:bg-black hover:text-white transition-all flex items-center gap-2"
          >
            Details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Helper Text */}
        {product.isBundle && (
          <p className="text-xs text-gray-500 mt-3 text-center">
            {showComponents ? 'Click image to view full outfit' : 'Hover to see bundle pieces'}
          </p>
        )}
      </div>
    </div>
  );
}