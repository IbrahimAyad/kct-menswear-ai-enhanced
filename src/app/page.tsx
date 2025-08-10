"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, ShoppingBag, Sparkles, TrendingUp, Package, Zap } from "lucide-react";
import Link from "next/link";
import { ModernBundleCard } from "@/components/home/ModernBundleCard";
import { BuildYourLookShowcase } from "@/components/home/BuildYourLookShowcase";
import { ShopByStyleGrid } from "@/components/home/ShopByStyleGrid";
import { BundleCarouselTheater } from "@/components/home/BundleCarouselTheater";
import { VelocityGrid } from "@/components/home/VelocityGrid";
import { InteractiveStyleEnvironments } from "@/components/home/InteractiveStyleEnvironments";
import { ServiceJourneyVisualization } from "@/components/home/ServiceJourneyVisualization";
import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Bundle data with actual KCT products from live site - enhanced with new properties
const featuredBundles = [
  {
    id: 'bundle-1',
    name: 'Executive Power Bundle',
    description: 'Navy suit, white shirt, burgundy tie - perfect for boardroom dominance',
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
    popularity: 95
  },
  {
    id: 'bundle-2',
    name: 'Wedding Classic Bundle',
    description: 'Charcoal suit, light blue shirt, silver tie - timeless wedding style',
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
    popularity: 88
  },
  {
    id: 'bundle-3',
    name: 'Power Player',
    description: 'Navy 3-piece suit, white shirt, red tie - executive presence',
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
    popularity: 82
  },
  {
    id: 'bundle-4',
    name: 'Triple Black',
    description: 'Black suit, black shirt, black tie - bold fashion statement',
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
    popularity: 90
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
              <Button size="lg" variant="outline" className="bg-white/5 backdrop-blur-sm text-white border-white/50 hover:bg-white hover:text-black px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Book Appointment
                <Calendar className="ml-2 h-5 w-5" />
              </Button>
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

      {/* Featured Bundles Section - NEW Bundle Carousel Theater */}
      <section className="py-16 bg-gradient-to-b from-white via-gray-50/50 to-white overflow-hidden">
        <div className="container-main">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 text-burgundy mb-4"
            >
              <Package className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-widest uppercase">Curated Collections</span>
              <Package className="h-5 w-5" />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-serif mb-3">
              Complete Outfits, Perfect Styling
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Expertly curated bundles with exclusive savings - swipe to explore
            </p>
          </div>

          {/* Bundle Carousel Theater */}
          <BundleCarouselTheater bundles={featuredBundles} />

          <div className="text-center mt-12">
            <Link href="/bundles">
              <Button size="lg" variant="outline" className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white">
                Explore All Bundles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products - VELOCITY GRID with Live Metrics */}
      <section className="py-12 bg-gradient-to-b from-white to-gray-50/50">
        <div className="container-main">
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 text-burgundy mb-4"
            >
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-widest uppercase">Live Trending</span>
              <TrendingUp className="h-5 w-5" />
            </motion.div>
            
            <h2 className="text-2xl md:text-3xl font-serif mb-2">Most Popular Right Now</h2>
            <p className="text-sm text-gray-600">Real-time popularity metrics • Updated every second</p>
          </div>

          {/* Velocity Grid Component */}
          <VelocityGrid products={trendingProducts} />

          <div className="text-center mt-8">
            <Link href="/products">
              <Button variant="outline" className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white">
                Explore All Products
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

      {/* Services Grid - Service Journey Visualization */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 text-burgundy mb-4"
            >
              <Zap className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-widest uppercase">Your Style Journey</span>
              <Zap className="h-5 w-5" />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-serif mb-3">Tailored to Perfection</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our comprehensive services designed to elevate your wardrobe • Click to explore each journey
            </p>
          </div>

          {/* Service Journey Visualization */}
          <ServiceJourneyVisualization />
        </div>
      </section>

      {/* Social Proof - Instagram Style Grid */}
      <section className="py-12 bg-white">
        <div className="container-main">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif mb-2">Style Inspiration</h2>
            <p className="text-gray-600">See how our customers style their looks</p>
          </div>

          {/* Instagram-style dense grid */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {[1,2,3,4,5,6,7,8,9,10].map((i) => (
              <div key={i} className="aspect-square relative group cursor-pointer overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-lg font-semibold">Customer {i}</span>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-sm font-semibold">@customer_{i}</div>
                    <div className="text-xs">Wedding Guest</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Tag us <span className="font-semibold text-burgundy">@kctmenswear</span> to be featured
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA - Compressed */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-burgundy rounded-full blur-3xl"></div>
        </div>

        <div className="container-main text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Experience the Art of
              <span className="block text-gold mt-2">Expert Tailoring</span>
            </h2>
            <p className="text-lg md:text-xl mb-8 text-gray-300">
              Every garment is meticulously crafted to your exact measurements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-burgundy hover:bg-burgundy-700 text-white px-8 py-3">
                Book Your Consultation
              </Button>
              <Link href="/products">
                <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white hover:text-black px-8 py-3">
                  Explore Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}