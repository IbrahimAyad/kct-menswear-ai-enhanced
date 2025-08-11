'use client';

import { useState, useCallback } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, X, Sparkles, Zap, ShoppingBag } from 'lucide-react';
import { StyleSwiperImage, SwipeAnalytics } from '@/lib/types';
import { cn } from '@/lib/utils';

// Demo images for Style Swiper
const DEMO_IMAGES: StyleSwiperImage[] = [
  { id: '1', url: '/Swiper-v1/Season-1-bundles/navy-suit-white-burgunndy.webp', category: 'suits', metadata: { tags: ['formal', 'business'], productId: 'navy-suit-1' } },
  { id: '2', url: '/Swiper-v1/Season-1-bundles/black-suit-black-shirt-black.webp', category: 'suits', metadata: { tags: ['formal', 'evening'], productId: 'black-suit-1' } },
  { id: '3', url: '/Swiper-v1/Season-1-bundles/light-grey-2p-pink.webp', category: 'suits', metadata: { tags: ['casual', 'summer'], productId: 'grey-suit-1' } },
  { id: '4', url: '/Swiper-v1/casual-bundles/navy-white-shirt-white-pocket-sqaure.webp', category: 'casual', metadata: { tags: ['casual', 'business-casual'], productId: 'navy-casual-1' } },
  { id: '5', url: '/Swiper-v1/Tuxedo-Bundles/black-tuxedo-white-tix-shirt-black-blowtie.webp', category: 'formal', metadata: { tags: ['formal', 'black-tie'], productId: 'tuxedo-1' } },
  { id: '6', url: '/Swiper-v1/Season-1-bundles/burgundy-black-black.webp', category: 'suits', metadata: { tags: ['bold', 'evening'], productId: 'burgundy-suit-1' } },
  { id: '7', url: '/Swiper-v1/Fall Wedding Bundles/brown-suit-white-shirt-burgundy-tie.webp', category: 'wedding', metadata: { tags: ['wedding', 'fall'], productId: 'brown-suit-1' } },
  { id: '8', url: '/Swiper-v1/Spring Wedding Bundles/indigo-2p-white-sage-green.webp', category: 'wedding', metadata: { tags: ['wedding', 'spring'], productId: 'indigo-suit-1' } },
  { id: '9', url: '/Swiper-v1/Summer Wedding Bundles/light-grey-suit-white-shirt-sage-dusty-pink-tie.webp', category: 'wedding', metadata: { tags: ['wedding', 'summer'], productId: 'light-grey-2' } },
  { id: '10', url: '/Swiper-v1/Season-1-bundles/navy-3p-white-red.webp', category: 'suits', metadata: { tags: ['business', 'power'], productId: 'navy-3piece-1' } },
  { id: '11', url: '/Swiper-v1/casual-bundles/black-suit-burgundy-shirt-burgundy-pocket-sqaure.webp', category: 'casual', metadata: { tags: ['casual', 'evening'], productId: 'black-casual-1' } },
  { id: '12', url: '/Swiper-v1/Tuxedo-Bundles/midnight-blue-tuxedo-white-tuxedo-shirt-black-bowtie.webp', category: 'formal', metadata: { tags: ['formal', 'luxury'], productId: 'midnight-tux-1' } },
  { id: '13', url: '/Swiper-v1/Season-1-bundles/indigo-2p-white-red.webp', category: 'suits', metadata: { tags: ['business', 'modern'], productId: 'indigo-suit-2' } },
  { id: '14', url: '/Swiper-v1/Fall Wedding Bundles/hunter-green-3p-suit-white-shirt-burgundy-tie.webp', category: 'wedding', metadata: { tags: ['wedding', 'fall', 'unique'], productId: 'green-suit-1' } },
  { id: '15', url: '/Swiper-v1/casual-bundles/french-blue-black-shirt-black-pocket-sqaure.webp', category: 'casual', metadata: { tags: ['casual', 'modern'], productId: 'french-blue-1' } },
  { id: '16', url: '/Swiper-v1/Season-1-bundles/brown-pink-navy.webp', category: 'suits', metadata: { tags: ['business', 'creative'], productId: 'brown-suit-2' } },
  { id: '17', url: '/Swiper-v1/Summer Wedding Bundles/sand-suit-white-shirt-sage-green-tie.webp', category: 'wedding', metadata: { tags: ['wedding', 'summer', 'beach'], productId: 'sand-suit-1' } },
  { id: '18', url: '/Swiper-v1/Tuxedo-Bundles/royal-blue-tuxedo-white-tuxedo-shirt-black-bowtie.webp', category: 'formal', metadata: { tags: ['formal', 'bold'], productId: 'royal-tux-1' } },
  { id: '19', url: '/Swiper-v1/Season-1-bundles/dark-grey-white-silver.webp', category: 'suits', metadata: { tags: ['business', 'classic'], productId: 'dark-grey-1' } },
  { id: '20', url: '/Swiper-v1/Fall Wedding Bundles/burgundy-suit-white-shirt-mustard-tie.webp', category: 'wedding', metadata: { tags: ['wedding', 'fall', 'rich'], productId: 'burgundy-wedding-1' } }
];

interface SimpleStyleSwiperProps {
  category?: string;
  onSwipe?: (image: StyleSwiperImage, direction: 'left' | 'right') => void;
  onComplete?: (likedImages: StyleSwiperImage[], analytics: SwipeAnalytics) => void;
  onProductClick?: (productId: string) => void;
}

export function SimpleStyleSwiper({ 
  category = 'all',
  onSwipe, 
  onComplete,
  onProductClick
}: SimpleStyleSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedImages, setLikedImages] = useState<StyleSwiperImage[]>([]);
  const [removedCards, setRemovedCards] = useState<Set<number>>(new Set());
  
  // Filter images by category
  const images = category === 'all' 
    ? DEMO_IMAGES 
    : DEMO_IMAGES.filter(img => img.category === category);
  
  const currentImage = images[currentIndex];
  const progress = images.length > 0 ? ((currentIndex + 1) / images.length) * 100 : 0;
  
  const handleCardRemoval = useCallback((direction: 'left' | 'right') => {
    if (!currentImage) return;
    
    // Mark card as removed
    setRemovedCards(prev => new Set(prev).add(currentIndex));
    
    // Handle like
    if (direction === 'right') {
      setLikedImages(prev => [...prev, currentImage]);
    }
    
    // Call parent handler
    onSwipe?.(currentImage, direction);
    
    // Move to next card after animation
    setTimeout(() => {
      if (currentIndex >= images.length - 1) {
        // Complete
        onComplete?.(
          direction === 'right' ? [...likedImages, currentImage] : likedImages,
          {
            totalSwipes: currentIndex + 1,
            leftSwipes: currentIndex + 1 - likedImages.length,
            rightSwipes: likedImages.length,
            averageSwipeTime: 0,
            swipeVelocities: [],
            undoCount: 0,
            categoryPreferences: {}
          }
        );
      } else {
        setCurrentIndex(prev => prev + 1);
        setRemovedCards(new Set()); // Clear removed cards for clean state
      }
    }, 300);
  }, [currentIndex, currentImage, images.length, likedImages, onSwipe, onComplete]);
  
  const handleDragEnd = (event: any, info: PanInfo, index: number) => {
    if (index !== currentIndex || removedCards.has(index)) return;
    
    const threshold = 100;
    const offset = info.offset.x;
    
    if (Math.abs(offset) > threshold) {
      handleCardRemoval(offset > 0 ? 'right' : 'left');
    }
  };
  
  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      if (likedImages[likedImages.length - 1]?.id === images[currentIndex - 1]?.id) {
        setLikedImages(prev => prev.slice(0, -1));
      }
      setRemovedCards(new Set());
    }
  };
  
  if (!currentImage) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gradient-to-br from-gold-50 via-white to-burgundy-50 rounded-3xl shadow-2xl border border-gold-200">
        <div className="text-center p-8">
          <div className="w-24 h-24 bg-gradient-to-br from-gold-100 to-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-12 h-12 text-burgundy" />
          </div>
          <h3 className="text-4xl font-serif mb-6">Style Discovery Complete!</h3>
          <p className="text-black-700 mb-3 text-lg">You discovered <strong className="text-burgundy">{likedImages.length}</strong> favorite styles</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-black-700">Style Discovery Journey</span>
          <div className="bg-gradient-to-r from-burgundy-100 to-gold-100 px-3 py-1 rounded-full">
            <span className="text-sm font-bold text-burgundy">{currentIndex + 1} of {images.length}</span>
          </div>
        </div>
        <div className="h-3 bg-gradient-to-r from-gold-100 to-burgundy-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-burgundy via-burgundy-600 to-gold"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        </div>
      </div>

      {/* Card Stack - Simple approach */}
      <div className="relative h-[600px]" style={{ perspective: 1000 }}>
        {/* Show only current and next card */}
        {images.slice(currentIndex, currentIndex + 2).map((image, index) => {
          const isTop = index === 0;
          const cardIndex = currentIndex + index;
          const isRemoved = removedCards.has(cardIndex);
          
          return (
            <motion.div
              key={`${image.id}-${cardIndex}`}
              className={cn(
                "absolute inset-0",
                isTop ? "z-20 cursor-grab active:cursor-grabbing" : "z-10"
              )}
              style={{
                transformStyle: 'preserve-3d',
                boxShadow: isTop ? '0 10px 40px rgba(0,0,0,0.2)' : '0 5px 20px rgba(0,0,0,0.1)'
              }}
              initial={false}
              animate={
                isRemoved
                  ? { 
                      x: 0,
                      opacity: 0,
                      scale: 0.8
                    }
                  : isTop
                  ? { 
                      scale: 1,
                      y: 0,
                      opacity: 1
                    }
                  : { 
                      scale: 0.95,
                      y: 20,
                      opacity: 0.5
                    }
              }
              drag={isTop && !isRemoved ? "x" : false}
              dragConstraints={{ left: -300, right: 300 }}
              dragElastic={0.5}
              onDragEnd={(e, info) => handleDragEnd(e, info, cardIndex)}
              whileDrag={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="relative h-full rounded-3xl overflow-hidden bg-white border border-gold-200">
                <img
                  src={image.url}
                  alt={`Style ${cardIndex + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-burgundy/80 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold">
                      {image.category}
                    </span>
                    {image.metadata?.tags?.map((tag, i) => (
                      <span key={i} className="bg-white/25 backdrop-blur px-3 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {image.metadata?.productId && (
                    <button
                      onClick={() => onProductClick?.(image.metadata!.productId!)}
                      className="bg-white text-black px-5 py-3 rounded-full font-bold text-sm"
                    >
                      <ShoppingBag className="w-4 h-4 inline mr-2" />
                      Shop This Look
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center items-center gap-6">
        <button
          onClick={handleUndo}
          disabled={currentIndex === 0}
          className={cn(
            "w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center",
            currentIndex === 0 ? "opacity-50" : "hover:scale-110"
          )}
        >
          <ChevronLeft className="w-6 h-6 text-burgundy" />
        </button>

        <button
          onClick={() => handleCardRemoval('left')}
          className="w-18 h-18 rounded-full bg-white shadow-2xl flex items-center justify-center hover:scale-110"
        >
          <X className="w-8 h-8 text-red-500" />
        </button>

        <button
          onClick={() => handleCardRemoval('right')}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-burgundy-500 shadow-2xl flex items-center justify-center hover:scale-110"
        >
          <Zap className="w-7 h-7 text-white" />
        </button>

        <button
          onClick={() => handleCardRemoval('right')}
          className="w-18 h-18 rounded-full bg-white shadow-2xl flex items-center justify-center hover:scale-110"
        >
          <Heart className="w-8 h-8 text-green-500" />
        </button>

        <button
          onClick={() => setCurrentIndex(Math.min(images.length - 1, currentIndex + 1))}
          disabled={currentIndex >= images.length - 1}
          className={cn(
            "w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center",
            currentIndex >= images.length - 1 ? "opacity-50" : "hover:scale-110"
          )}
        >
          <ChevronRight className="w-6 h-6 text-burgundy" />
        </button>
      </div>
    </div>
  );
}