"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StyleSwiper } from "@/components/style/StyleSwiper";
import { StyleRecommendations } from "@/components/style/StyleRecommendations";
import { PersonalizedOutfitBuilder } from "@/components/style/PersonalizedOutfitBuilder";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Product, StylePreferences } from '@/lib/types';
import { facebookTracking } from '@/lib/analytics/FacebookTrackingService';
import { useFacebookPageTracking } from '@/hooks/useFacebookTracking';

// Mock products for the quiz
const quizProducts: Product[] = [
  {
    id: '1',
    sku: 'SQ-001',
    name: 'Classic Black Tuxedo',
    price: 89900,
    images: ['/api/placeholder/600/800'],
    category: 'suits',
    stock: { '40R': 10 },
    variants: [],
  },
  {
    id: '2',
    sku: 'SQ-002',
    name: 'Modern Navy Suit',
    price: 79900,
    images: ['/api/placeholder/600/800'],
    category: 'suits',
    stock: { '40R': 8 },
    variants: [],
  },
  {
    id: '3',
    sku: 'SQ-003',
    name: 'Burgundy Velvet Blazer',
    price: 59900,
    images: ['/api/placeholder/600/800'],
    category: 'suits',
    stock: { '40R': 5 },
    variants: [],
  },
  {
    id: '4',
    sku: 'SQ-004',
    name: 'Charcoal Three-Piece',
    price: 99900,
    images: ['/api/placeholder/600/800'],
    category: 'suits',
    stock: { '40R': 6 },
    variants: [],
  },
  {
    id: '5',
    sku: 'SQ-005',
    name: 'Slim Fit White Dinner Jacket',
    price: 69900,
    images: ['/api/placeholder/600/800'],
    category: 'suits',
    stock: { '40R': 4 },
    variants: [],
  },
];

export default function StyleQuizPage() {
  const router = useRouter();
  const [showResults, setShowResults] = useState(false);
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [stylePreferences, setStylePreferences] = useState<StylePreferences>({
    colors: [],
    fit: 'modern',
    occasions: [],
  });
  const [quizStarted, setQuizStarted] = useState(false);

  // Track page views
  useFacebookPageTracking();

  // Track quiz start
  useEffect(() => {
    if (!quizStarted) {
      facebookTracking.trackStyleQuizProgress('start');
      setQuizStarted(true);
    }
  }, [quizStarted]);

  const handleSwipe = (product: Product, direction: 'left' | 'right') => {
    console.log(`Swiped ${direction} on ${product.name}`);
  };

  const handleComplete = (liked: Product[]) => {
    setLikedProducts(liked);
    
    // Generate style preferences based on liked products
    const preferences: StylePreferences = {
      colors: liked.map(p => p.name.toLowerCase().includes('navy') ? 'navy' : 
                           p.name.toLowerCase().includes('black') ? 'black' :
                           p.name.toLowerCase().includes('burgundy') ? 'burgundy' : 'gray'),
      fit: liked.some(p => p.name.toLowerCase().includes('slim')) ? 'slim' : 'modern',
      occasions: liked.some(p => p.name.toLowerCase().includes('tuxedo')) ? ['formal', 'wedding'] : ['business', 'casual'],
      stylePersona: 'Modern Professional',
    };
    
    setStylePreferences(preferences);
    setShowResults(true);

    // Track quiz completion
    const budget = liked.length > 3 ? '1000-plus' : liked.length > 1 ? '500-1000' : 'under-500';
    facebookTracking.trackStyleQuizProgress('complete', {
      styleType: preferences.stylePersona || 'Modern Professional',
      budget: budget
    });
  };

  const mockRecommendations = likedProducts.map((product, index) => ({
    ...product,
    id: `rec-${product.id}`,
    matchScore: 95 - (index * 5),
    reasons: [
      { type: 'color' as const, description: 'Matches your color preference' },
      { type: 'fit' as const, description: 'Perfect for your body type' },
      { type: 'occasion' as const, description: 'Ideal for formal events' },
    ],
  }));

  const handleProductClick = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  const handleAddToCart = (product: Product) => {
    console.log('Adding to cart:', product);
  };

  const handleAddOutfitToCart = (outfit: Product[]) => {
    console.log('Adding outfit to cart:', outfit);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gold/10 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gold transition-colors group">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Style Swiper Section */}
      {!showResults && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-gold mb-6">
                <div className="h-px w-12 bg-gold"></div>
                <span className="text-sm font-semibold tracking-widest uppercase">AI-Powered Styling</span>
                <div className="h-px w-12 bg-gold"></div>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
                Find Your 
                <span className="text-gold block mt-2">Perfect Style</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Swipe right on styles you love, left on ones you don't. 
                Our AI will learn your preferences and create personalized recommendations.
              </p>
            </div>

            <StyleSwiper 
              products={quizProducts}
              onSwipe={handleSwipe}
              onComplete={handleComplete}
            />
          </div>
        </section>
      )}

      {/* Recommendations Section */}
      {showResults && (
        <>
          <section className="py-12 bg-white">
            <StyleRecommendations 
              products={mockRecommendations}
              stylePreferences={stylePreferences}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
            />
          </section>

          {/* Outfit Builder Section */}
          <section className="py-12">
            <PersonalizedOutfitBuilder 
              products={quizProducts}
              onAddOutfitToCart={handleAddOutfitToCart}
            />
          </section>
        </>
      )}

      {/* CTA Section */}
      <section className="relative py-24 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
            Ready to Shop Your
            <span className="block text-gold mt-2">Signature Style?</span>
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Browse our curated collection filtered by your unique style preferences
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-black px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-gold/20 transition-all duration-300 transform hover:scale-105">
                Shop Your Style
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white hover:text-black px-10 py-6 text-lg backdrop-blur-sm transition-all duration-300">
              Book Personal Styling
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}