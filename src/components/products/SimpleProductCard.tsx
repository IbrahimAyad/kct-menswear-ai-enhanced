'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Tag } from 'lucide-react';
import { UnifiedProduct } from '@/types/unified-shop';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

interface SimpleProductCardProps {
  product: UnifiedProduct;
  onQuickView?: (product: UnifiedProduct) => void;
  onAddToCart?: (product: UnifiedProduct) => void;
  featured?: boolean;
}

export default function SimpleProductCard({
  product,
  onQuickView,
  onAddToCart,
  featured = false
}: SimpleProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl || '/placeholder.jpg',
        quantity: 1,
        category: product.category || 'product'
      });
    }
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div
      className={cn(
        "group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300",
        featured && "ring-2 ring-burgundy-500"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {hasDiscount && (
          <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            -{discountPercent}%
          </span>
        )}
        {product.trending && (
          <span className="bg-burgundy-600 text-white px-2 py-1 rounded text-xs font-medium">
            Trending
          </span>
        )}
        {!product.inStock && (
          <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs font-medium">
            Out of Stock
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button
        onClick={() => setIsFavorited(!isFavorited)}
        className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
      >
        <Heart 
          className={cn(
            "w-4 h-4 transition-colors",
            isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"
          )}
        />
      </button>

      {/* Image */}
      <Link href={`/products/${product.slug || product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Tag className="w-12 h-12" />
          </div>
        )}
        
        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-2 transition-opacity">
            {onQuickView && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(product);
                }}
                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              >
                <Eye className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              disabled={!product.inStock}
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.category}
          </p>
        )}

        {/* Name */}
        <h3 className="font-medium text-sm mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Color/Size Info */}
        <div className="flex gap-2 mb-2">
          {product.color && (
            <span className="text-xs text-gray-600 capitalize">
              {product.color}
            </span>
          )}
          {product.size && Array.isArray(product.size) && product.size.length > 0 && (
            <span className="text-xs text-gray-600">
              {product.size.length} sizes
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">${product.price}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        {/* Quick Add Button (Mobile) */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={cn(
            "md:hidden w-full mt-3 py-2 rounded-lg font-medium transition-colors",
            product.inStock
              ? "bg-burgundy-600 text-white hover:bg-burgundy-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}