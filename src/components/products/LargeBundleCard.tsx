'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { UnifiedProduct } from '@/types/unified-shop';
import { cn } from '@/lib/utils';

interface LargeBundleCardProps {
  product: UnifiedProduct;
  onQuickView?: (product: UnifiedProduct) => void;
  layout?: '2x2' | '3x3';
}

export default function LargeBundleCard({
  product,
  onQuickView,
  layout = '2x2'
}: LargeBundleCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showComponents, setShowComponents] = useState(false);

  if (!product.isBundle) return null;

  const savingsPercent = product.originalPrice && product.bundlePrice
    ? Math.round(((product.originalPrice - product.bundlePrice) / product.originalPrice) * 100)
    : 0;

  // For 2x2 layout - larger, more impactful
  if (layout === '2x2') {
    return (
      <div className="group relative bg-white">
        {/* Savings Badge */}
        {savingsPercent >= 15 && (
          <div className="absolute top-6 left-6 z-10">
            <span className="bg-burgundy-600 text-white px-4 py-2 text-sm font-medium">
              Save {savingsPercent}%
            </span>
          </div>
        )}

        {/* Favorite */}
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-6 right-6 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full"
        >
          <Heart 
            className={cn(
              "w-5 h-5 transition-all",
              isFavorited ? "fill-burgundy-600 text-burgundy-600" : "text-gray-600"
            )}
          />
        </button>

        {/* Large Image */}
        <div 
          className="relative aspect-[4/5] overflow-hidden bg-gray-50 cursor-pointer"
          onClick={() => setShowComponents(!showComponents)}
        >
          {!showComponents ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            // Component Grid for 2x2 - Larger images
            <div className="grid grid-cols-2 grid-rows-2 h-full gap-1 bg-gray-100 p-4">
              <div className="relative bg-white">
                {product.bundleComponents?.suit?.image && (
                  <Image
                    src={product.bundleComponents.suit.image}
                    alt="Suit"
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute bottom-2 left-2 bg-white/95 px-3 py-1.5 text-sm font-medium">
                  {product.bundleComponents?.suit?.color}
                </div>
              </div>
              <div className="relative bg-white">
                {product.bundleComponents?.shirt?.image && (
                  <Image
                    src={product.bundleComponents.shirt.image}
                    alt="Shirt"
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute bottom-2 left-2 bg-white/95 px-3 py-1.5 text-sm font-medium">
                  {product.bundleComponents?.shirt?.color}
                </div>
              </div>
              <div className="relative bg-white">
                {product.bundleComponents?.tie?.image && (
                  <Image
                    src={product.bundleComponents.tie.image}
                    alt="Tie"
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute bottom-2 left-2 bg-white/95 px-3 py-1.5 text-sm font-medium">
                  {product.bundleComponents?.tie?.color}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center bg-gray-50">
                <div className="text-3xl font-light mb-2">${product.bundlePrice}</div>
                <div className="text-sm text-gray-500 line-through">${product.originalPrice}</div>
                <div className="text-xs text-burgundy-600 mt-2">Complete Bundle</div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="pt-6 pb-2">
          <h3 className="text-xl font-light text-gray-900 mb-2">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-4">{product.occasions?.[0] || 'Formal'}</p>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-light">${product.bundlePrice}</span>
            <span className="text-base text-gray-400 line-through">${product.originalPrice}</span>
          </div>
          <p className="text-xs text-gray-500 mt-3">Click to view outfit</p>
        </div>
      </div>
    );
  }

  // For 3x3 layout - more compact with 4x4 component view
  return (
    <div className="group relative bg-white">
      {/* Savings Badge */}
      {savingsPercent >= 15 && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-burgundy-600 text-white px-3 py-1.5 text-xs font-medium">
            Save {savingsPercent}%
          </span>
        </div>
      )}

      {/* Favorite */}
      <button
        onClick={() => setIsFavorited(!isFavorited)}
        className="absolute top-4 right-4 z-10 p-1.5 bg-white/90 backdrop-blur-sm rounded-full"
      >
        <Heart 
          className={cn(
            "w-4 h-4 transition-all",
            isFavorited ? "fill-burgundy-600 text-burgundy-600" : "text-gray-600"
          )}
        />
      </button>

      {/* Image with 4x4 Component Grid */}
      <div 
        className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer"
        onClick={() => setShowComponents(!showComponents)}
      >
        {!showComponents ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          // 4x4 Grid with 3 components + price box
          <div className="grid grid-cols-2 grid-rows-2 h-full gap-0.5 bg-gray-200">
            {/* Suit */}
            <div className="relative bg-white">
              {product.bundleComponents?.suit?.image ? (
                <Image
                  src={product.bundleComponents.suit.image}
                  alt="Suit"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xs text-gray-400">{product.bundleComponents?.suit?.color}</span>
                </div>
              )}
              <div className="absolute bottom-1 left-1 bg-white/90 px-2 py-0.5 text-xs">
                {product.bundleComponents?.suit?.color}
              </div>
            </div>

            {/* Shirt */}
            <div className="relative bg-white">
              {product.bundleComponents?.shirt?.image ? (
                <Image
                  src={product.bundleComponents.shirt.image}
                  alt="Shirt"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xs text-gray-400">{product.bundleComponents?.shirt?.color}</span>
                </div>
              )}
              <div className="absolute bottom-1 left-1 bg-white/90 px-2 py-0.5 text-xs">
                {product.bundleComponents?.shirt?.color}
              </div>
            </div>

            {/* Tie/Pocket Square */}
            <div className="relative bg-white">
              {(product.bundleComponents?.tie?.image || product.bundleComponents?.pocketSquare) ? (
                <Image
                  src={product.bundleComponents?.tie?.image || '/placeholder.jpg'}
                  alt="Accessory"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xs text-gray-400">
                    {product.bundleComponents?.tie?.color || product.bundleComponents?.pocketSquare?.color}
                  </span>
                </div>
              )}
              <div className="absolute bottom-1 left-1 bg-white/90 px-2 py-0.5 text-xs">
                {product.bundleComponents?.tie?.color || 'Pocket Square'}
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-3">
              <div className="text-2xl font-light mb-1">${product.bundlePrice}</div>
              <div className="text-xs opacity-70 line-through">${product.originalPrice}</div>
              <div className="text-[10px] mt-2 uppercase tracking-wider">Bundle Price</div>
            </div>
          </div>
        )}
      </div>

      {/* Minimal Content */}
      <div className="pt-4">
        <h3 className="text-base font-normal text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.occasions?.[0]}</p>
        <p className="text-xs text-gray-400 mt-2">Click to view outfit</p>
      </div>
    </div>
  );
}