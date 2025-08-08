"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TinderStyleSwiper } from "@/components/style/TinderStyleSwiper";
import { StyleRecommendations } from "@/components/style/StyleRecommendations";
import { PersonalizedOutfitBuilder } from "@/components/style/PersonalizedOutfitBuilder";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Product, StylePreferences } from '@/lib/types';
import { facebookTracking } from '@/lib/analytics/FacebookTrackingService';
import { useFacebookPageTracking } from '@/hooks/useFacebookTracking';
import { getSmartStyleOrder, styleBundleToProduct, analyzeStylePreferences, styleBundles } from '@/lib/services/styleDiscoveryService';

// Get smart ordered style bundles and convert to products
const styleProducts: Product[] = getSmartStyleOrder().map((bundle, index) => 
  styleBundleToProduct(bundle, index)
);

export default function StyleQuizPage() {
  const router = useRouter();
  const [showResults, setShowResults] = useState(false);
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [likedBundles, setLikedBundles] = useState<string[]>([]);
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
    if (direction === 'right' && product.id) {
      setLikedBundles(prev => [...prev, product.id]);
    }
  };

  const handleComplete = (liked: Product[]) => {
    setLikedProducts(liked);

    // Get the actual style bundles that were liked
    const likedStyleBundles = styleBundles.filter(bundle => 
      liked.some(product => product.id === bundle.id)
    );

    // Analyze preferences using the service
    const analysis = analyzeStylePreferences(likedStyleBundles);

    // Generate style preferences based on analysis
    const preferences: StylePreferences = {
      colors: analysis.topColors,
      fit: analysis.averageFormality > 3.5 ? 'classic' : 'modern',
      occasions: analysis.topOccasions,
      stylePersona: `${analysis.dominantStyle.charAt(0).toUpperCase() + analysis.dominantStyle.slice(1)} ${analysis.formalityPreference.charAt(0).toUpperCase() + analysis.formalityPreference.slice(1)}`,
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

  };

  const handleAddOutfitToCart = (outfit: Product[]) => {

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

            <TinderStyleSwiper 
              products={styleProducts}
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
              products={styleProducts}
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