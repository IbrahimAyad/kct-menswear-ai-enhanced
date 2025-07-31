'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Heart, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { TuxedoProduct } from '@/lib/products/tuxedoProducts';
import { useCart } from '@/hooks/useCart';
import TuxedoQuickView from './TuxedoQuickView';

interface TuxedoCardProps {
  tuxedo: TuxedoProduct;
}

export default function TuxedoCard({ tuxedo }: TuxedoCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addItem } = useCart();

  const handleQuickAdd = () => {
    addItem({
      id: tuxedo.id,
      name: tuxedo.name,
      price: tuxedo.price,
      image: tuxedo.image,
      quantity: 1,
      category: 'tuxedo',
      metadata: {
        color: tuxedo.color,
        type: '2-piece'
      }
    });
  };

  return (
    <>
      <div 
        className="group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <Link href={`/products/tuxedos/${tuxedo.id}`}>
            <Image
              src={tuxedo.image}
              alt={tuxedo.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
            />
          </Link>
          
          {/* Hover Overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/20 transition-opacity duration-300" />
          )}
          
          {/* Badges */}
          <div className="absolute top-4 left-4 space-y-2">
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Statement Piece
            </span>
          </div>
          
          {/* Favorite Button */}
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md transition-transform hover:scale-110"
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`} 
            />
          </button>
          
          {/* Quick Actions */}
          {isHovered && (
            <div className="absolute bottom-4 left-4 right-4 space-y-2 transform transition-all duration-300 translate-y-0 opacity-100">
              <button
                onClick={handleQuickAdd}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Quick Add
              </button>
              <button
                onClick={() => setShowQuickView(true)}
                className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Quick View
              </button>
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          <Link href={`/products/tuxedos/${tuxedo.id}`}>
            <h3 className="font-semibold text-lg mb-1 hover:underline">
              {tuxedo.name}
            </h3>
          </Link>
          
          <p className="text-sm text-gray-600 mb-2">2-Piece Formal Tuxedo</p>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">${tuxedo.price}</p>
              <p className="text-xs text-gray-500">Free Shipping</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <TuxedoQuickView
          tuxedo={tuxedo}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  );
}