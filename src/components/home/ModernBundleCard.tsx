'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useSimpleCart } from '@/hooks/useSimpleCart';

interface BundleProduct {
  name: string;
  image: string;
  color?: string;
}

interface Bundle {
  id: string;
  name: string;
  description: string;
  totalPrice: number;
  originalPrice: number;
  savings: number;
  suit: BundleProduct;
  shirt: BundleProduct;
  tie: BundleProduct;
  modelImage: string;
  slug: string;
}

interface ModernBundleCardProps {
  bundle: Bundle;
}

export function ModernBundleCard({ bundle }: ModernBundleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useSimpleCart();

  const handleQuickShop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add bundle to cart with proper metadata
    addItem({
      id: bundle.id,
      name: bundle.name,
      price: bundle.totalPrice * 100, // Convert to cents
      image: bundle.modelImage,
      quantity: 1,
      category: 'bundle',
      stripePriceId: 'price_1RpvQqCHc12x7sCzfRrWStZb' // Default bundle price ID
    });
  };

  return (
    <Link href={`/bundles/${bundle.slug}`}>
      <div 
        className="relative bg-white border border-gray-200 overflow-hidden transition-all duration-500 hover:border-burgundy hover:shadow-2xl cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
          <AnimatePresence mode="wait">
            {!isHovered ? (
              // 3-Product Grid (Default State)
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-3 h-full gap-0.5 bg-gray-200"
              >
                {/* Suit */}
                <div className="relative bg-white">
                  <Image
                    src={bundle.suit.image}
                    alt={bundle.suit.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 20vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0">
                    <div className="bg-black/70 text-white text-xs px-2 py-1 text-center">
                      {bundle.suit.name}
                    </div>
                  </div>
                </div>
                
                {/* Shirt */}
                <div className="relative bg-white">
                  <Image
                    src={bundle.shirt.image}
                    alt={bundle.shirt.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 20vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0">
                    <div className="bg-black/70 text-white text-xs px-2 py-1 text-center">
                      {bundle.shirt.name}
                    </div>
                  </div>
                </div>
                
                {/* Tie */}
                <div className="relative bg-white">
                  <Image
                    src={bundle.tie.image}
                    alt={bundle.tie.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 20vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0">
                    <div className="bg-black/70 text-white text-xs px-2 py-1 text-center">
                      {bundle.tie.name}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              // Single Model View (Hover State)
              <motion.div
                key="model"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative h-full"
              >
                <Image
                  src={bundle.modelImage}
                  alt={`Model wearing ${bundle.name}`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Quick Shop Button - appears on hover */}
                <div className="absolute bottom-4 left-4 right-4">
                  <Button 
                    onClick={handleQuickShop}
                    className="w-full bg-white text-black hover:bg-gray-100 font-semibold"
                    size="sm"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Quick Add to Cart
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Bundle Info - Compressed spacing */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-serif font-semibold line-clamp-1">{bundle.name}</h3>
            <div className="text-right">
              <div className="text-burgundy font-bold">${bundle.totalPrice}</div>
              <div className="text-xs text-gray-500 line-through">${bundle.originalPrice}</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{bundle.description}</p>
          <div className="flex justify-between items-center">
            <div className="text-xs text-green-600 font-medium">
              Save ${bundle.savings}
            </div>
            <span className="text-xs text-burgundy font-semibold group-hover:underline flex items-center">
              View Details
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}