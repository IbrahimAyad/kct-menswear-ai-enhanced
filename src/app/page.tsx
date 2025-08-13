"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, ShoppingBag, Sparkles, TrendingUp, Package, Zap, Brain } from "lucide-react";
import Link from "next/link";
import { ModernBundleCard } from "@/components/home/ModernBundleCard";
import { BuildYourLookShowcase } from "@/components/home/BuildYourLookShowcase";
import { ShopByStyleGrid } from "@/components/home/ShopByStyleGrid";
import { EnhancedDarkBundleCarousel } from "@/components/home/EnhancedDarkBundleCarousel";
import { VelocityGrid } from "@/components/home/VelocityGrid";
import { InteractiveStyleEnvironments } from "@/components/home/InteractiveStyleEnvironments";
import { ServiceJourneyVisualization } from "@/components/home/ServiceJourneyVisualization";
import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Enhanced bundle data with all premium properties for dark mode carousel
const featuredBundles = [
  {
    id: 'bundle-1',
    name: 'Executive Power Bundle',
    description: 'Navy suit, white shirt, burgundy tie - perfect for boardroom dominance and client meetings',
    totalPrice: 229.99,
    originalPrice: 269.99,
    savings: 40,
    suit: {
      name: 'Navy Suit',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/navy-suit-white-burgunndy.png'
    },
    shirt: {
      name: 'White Shirt',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/White-Dress-Shirt.jpg'
    },
    tie: {
      name: 'Burgundy Tie',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/burgundy.jpg'
    },
    modelImage: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/navy-suit-white-burgunndy.png',
    slug: 'executive-power',
    featured: true,
    popularity: 95,
    rating: 4.9,
    trending: true,
    aiScore: 98
  },
  {
    id: 'bundle-2',
    name: 'Wedding Classic Bundle',
    description: 'Charcoal suit, light blue shirt, silver tie - timeless wedding elegance',
    totalPrice: 249.99,
    originalPrice: 299.99,
    savings: 50,
    suit: {
      name: 'Charcoal Suit',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/charcoal-blue-silver.png'
    },
    shirt: {
      name: 'Light Blue Shirt',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Light-Blue-Dress-Shirt.jpg'
    },
    tie: {
      name: 'Silver Tie',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/silver.jpg'
    },
    modelImage: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/charcoal-blue-silver.png',
    slug: 'wedding-classic',
    popularity: 88,
    rating: 4.8,
    limitedStock: true
  },
  {
    id: 'bundle-3',
    name: 'Power Player Premium',
    description: 'Navy 3-piece suit, white shirt, red tie - command the room with executive presence',
    totalPrice: 249.99,
    originalPrice: 299.99,
    savings: 50,
    suit: {
      name: 'Navy 3-Piece Suit',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/navy-3p-white-red.png'
    },
    shirt: {
      name: 'White Shirt',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/White-Dress-Shirt.jpg'
    },
    tie: {
      name: 'Red Tie',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/red.jpg'
    },
    modelImage: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/navy-3p-white-red.png',
    slug: 'power-player',
    popularity: 92,
    rating: 4.7,
    trending: true,
    aiScore: 94
  },
  {
    id: 'bundle-4',
    name: 'Triple Black Signature',
    description: 'Black suit, black shirt, black tie - bold fashion statement for evening events',
    totalPrice: 229.99,
    originalPrice: 269.99,
    savings: 40,
    suit: {
      name: 'Black Suit',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-suit-black-shirt-black.png'
    },
    shirt: {
      name: 'Black Shirt',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Black-Dress-Shirt.jpg'
    },
    tie: {
      name: 'Black Tie',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/black.jpg'
    },
    modelImage: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-suit-black-shirt-black.png',
    slug: 'triple-black',
    popularity: 90,
    rating: 4.6,
    aiScore: 95
  },
  {
    id: 'bundle-5',
    name: 'Rose Gold Elegance',
    description: 'Light grey suit, pink shirt, navy tie - modern sophistication meets classic style',
    totalPrice: 219.99,
    originalPrice: 259.99,
    savings: 40,
    suit: {
      name: 'Light Grey Suit',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/grey-pink-navy.png'
    },
    shirt: {
      name: 'Pink Shirt',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Light%20Pink-Dress-Shirt.jpg'
    },
    tie: {
      name: 'Navy Tie',
      image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/navy.jpg'
    },
    modelImage: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/grey-pink-navy.png',
    slug: 'rose-gold-elegance',
    popularity: 85,
    rating: 4.8,
    trending: true,
    limitedStock: true
  }
];

// Trending products with actual KCT product images - enhanced with metrics
const trendingProducts = [
  { id: 1, name: 'Navy 2-Piece Suit', category: 'Suits', price: 189, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/navy-suit-white-burgunndy.png', trending: 'up' as const, hotness: 92, recentlyViewed: 47 },
  { id: 2, name: 'White Dress Shirt', category: 'Shirts', price: 49, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/White-Dress-Shirt.jpg', trending: 'up' as const, hotness: 88, recentlyViewed: 35 },
  { id: 3, name: 'Burgundy Silk Tie', category: 'Ties', price: 29, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/burgundy.jpg', hotness: 75, recentlyViewed: 22 },
  { id: 4, name: 'Charcoal 3-Piece', category: 'Suits', price: 229, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/charcoal-blue-silver.png', trending: 'up' as const, hotness: 85, recentlyViewed: 31 },
  { id: 5, name: 'Light Blue Shirt', category: 'Shirts', price: 55, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Light-Blue-Dress-Shirt.jpg', hotness: 70, recentlyViewed: 18 },
  { id: 6, name: 'Silver Tie', category: 'Ties', price: 35, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/silver.jpg', hotness: 65, recentlyViewed: 15 },
  { id: 7, name: 'Black Tuxedo', category: 'Suits', price: 279, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-suit-black-shirt-black.png', trending: 'up' as const, hotness: 90, recentlyViewed: 42 },
  { id: 8, name: 'Pink Dress Shirt', category: 'Shirts', price: 59, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Light%20Pink-Dress-Shirt.jpg', hotness: 72, recentlyViewed: 20 },
  { id: 9, name: 'Navy Knit Tie', category: 'Ties', price: 39, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/navy.jpg', hotness: 68, recentlyViewed: 16 },
  { id: 10, name: 'Light Grey Suit', category: 'Suits', price: 199, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/grey-pink-navy.png', trending: 'up' as const, hotness: 82, recentlyViewed: 28 },
  { id: 11, name: 'Lavender Shirt', category: 'Shirts', price: 52, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Lilac-Dress-Shirt.jpg', hotness: 66, recentlyViewed: 14 },
  { id: 12, name: 'Black Bow Tie', category: 'Ties', price: 25, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/black.jpg', trending: 'up' as const, hotness: 78, recentlyViewed: 24 }
];

// Style categories with enhanced interactive properties
const styleCategories = [
  {
    name: 'Business Professional',
    slug: 'business',
    description: 'Sharp suits for the modern executive',
    backgroundImage: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/navy-suit-white-burgunndy.png',
    particleType: 'fabric' as const,
    borderColor: '#1e3a8a',
    styleDNA: ['Power', 'Confidence', 'Success']
  },
  {
    name: 'Wedding Collection',
    slug: 'wedding',
    description: 'Elegant attire for your special day',
    backgroundImage: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/charcoal-blue-silver.png',
    particleType: 'sparkle' as const,
    borderColor: '#D4AF37',
    styleDNA: ['Elegant', 'Timeless', 'Romantic']
  },
  {
    name: 'Black Tie Events',
    slug: 'formal',
    description: 'Tuxedos and formal wear for galas',
    backgroundImage: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-suit-black-shirt-black.png',
    particleType: 'sparkle' as const,
    borderColor: '#000000',
    styleDNA: ['Luxury', 'Sophisticated', 'Elite']
  },
  {
    name: 'Prom Night',
    slug: 'prom',
    description: 'Stand out styles for your big night',
    backgroundImage: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-pink-pink.png',
    particleType: 'sparkle' as const,
    borderColor: '#ec4899',
    styleDNA: ['Bold', 'Trendy', 'Memorable']
  }
];

export default function ModernHomePage() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <>
      {/* Hero Section with Full Screen Design */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full relative">
            <img 
              src="/KCT-Home-Banner-Update.jpg"
              alt="KCT Menswear Premium Collection"
              className="w-full h-full object-cover object-[25%_center] md:object-center scale-105 transition-transform duration-700 hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4 max-w-5xl mx-auto">
            <div className="space-y-2 mb-8 animate-fade-up">
              <div className="h-px w-24 bg-gold mx-auto"></div>
              <p className="text-gold text-sm tracking-[0.3em] uppercase">Excellence in Every Stitch</p>
              <div className="h-px w-24 bg-gold mx-auto"></div>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold mb-6 animate-fade-up tracking-tight leading-[0.9]" style={{ animationDelay: '0.2s' }}>
              Elevate Your
              <span className="block text-gold">Style</span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-12 font-light animate-fade-up max-w-3xl mx-auto leading-relaxed text-gray-100" style={{ animationDelay: '0.4s' }}>
              Premium men's formal wear crafted with uncompromising attention to detail
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-up" style={{ animationDelay: '0.6s' }}>
              <Link href="/products">
                <Button size="lg" className="group bg-burgundy hover:bg-burgundy-700 text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                </Button>
              </Link>
              <Link href="/style-swiper-r2">
                <Button size="lg" variant="outline" className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm text-white border-purple-400/50 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center">
                    Style Profile Atelier AI
                    <Sparkles className="ml-2 h-5 w-5 animate-pulse" />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-12 bg-white/50"></div>
          </div>
        </div>
      </section>

      {/* Shop by Style Grid - Category Selection */}
      <ShopByStyleGrid />

      {/* Build Your Perfect Ensemble - Moved up after Shop by Style */}
      <section className="py-8 bg-gradient-to-br from-gray-50 to-white">
        <BuildYourLookShowcase />
      </section>

      {/* Featured Bundles Section - Enhanced Dark Bundle Carousel */}
      <section className="py-16 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="container-main">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 text-gold mb-4"
            >
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-widest uppercase">Premium Collections</span>
              <Sparkles className="h-5 w-5" />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-serif mb-3 text-white">
              Luxury Bundles, Exclusive Savings
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Experience our premium dark mode carousel with 3D effects and interactive features
            </p>
          </div>

          {/* Enhanced Dark Bundle Carousel */}
          <EnhancedDarkBundleCarousel 
            bundles={featuredBundles} 
            autoPlay={true}
            showParticles={true}
          />

          <div className="text-center mt-12">
            <Link href="/bundles">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-black font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Explore All Bundles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>


      {/* Style Categories - Interactive Style Environments */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-main">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 text-burgundy mb-4"
            >
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-widest uppercase">Style Experiences</span>
              <Sparkles className="h-5 w-5" />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-serif mb-3">
              Find Your Perfect Occasion
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Interactive style environments that adapt to your needs • Hover to explore
            </p>
          </div>

          {/* Interactive Style Environments Component */}
          <InteractiveStyleEnvironments categories={styleCategories} />
        </div>
      </section>


    </>
  );
}