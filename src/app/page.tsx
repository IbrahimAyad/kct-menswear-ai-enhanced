"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, ShoppingBag, Sparkles, TrendingUp, Package } from "lucide-react";
import Link from "next/link";
import { ModernBundleCard } from "@/components/home/ModernBundleCard";
import { BuildYourLookShowcase } from "@/components/home/BuildYourLookShowcase";
import { ShopByStyleGrid } from "@/components/home/ShopByStyleGrid";
import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Bundle data with actual KCT products from live site
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
    slug: 'executive-power'
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
    slug: 'wedding-classic'
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
    slug: 'power-player'
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
    slug: 'triple-black'
  }
];

// Trending products with actual KCT product images
const trendingProducts = [
  { id: 1, name: 'Navy 2-Piece Suit', category: 'Suits', price: 189, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/navy-suit-white-burgunndy.png' },
  { id: 2, name: 'White Dress Shirt', category: 'Shirts', price: 49, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/White-Dress-Shirt.jpg' },
  { id: 3, name: 'Burgundy Silk Tie', category: 'Ties', price: 29, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/burgundy.jpg' },
  { id: 4, name: 'Charcoal 3-Piece', category: 'Suits', price: 229, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/charcoal-blue-silver.png' },
  { id: 5, name: 'Light Blue Shirt', category: 'Shirts', price: 55, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Light-Blue-Dress-Shirt.jpg' },
  { id: 6, name: 'Silver Tie', category: 'Ties', price: 35, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/silver.jpg' },
  { id: 7, name: 'Black Tuxedo', category: 'Suits', price: 279, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-suit-black-shirt-black.png' },
  { id: 8, name: 'Pink Dress Shirt', category: 'Shirts', price: 59, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Light%20Pink-Dress-Shirt.jpg' },
  { id: 9, name: 'Navy Knit Tie', category: 'Ties', price: 39, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/navy.jpg' },
  { id: 10, name: 'Light Grey Suit', category: 'Suits', price: 199, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/grey-pink-navy.png' },
  { id: 11, name: 'Lavender Shirt', category: 'Shirts', price: 52, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Dress%20Shirts/Lilac-Dress-Shirt.jpg' },
  { id: 12, name: 'Black Bow Tie', category: 'Ties', price: 25, image: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bow%3ATie/black.jpg' }
];

// Style categories with background images
const styleCategories = [
  {
    name: 'Business Professional',
    slug: 'business',
    description: 'Sharp suits for the modern executive',
    backgroundImage: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/navy-suit-white-burgunndy.png'
  },
  {
    name: 'Wedding Collection',
    slug: 'wedding',
    description: 'Elegant attire for your special day',
    backgroundImage: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/charcoal-blue-silver.png'
  },
  {
    name: 'Black Tie Events',
    slug: 'formal',
    description: 'Tuxedos and formal wear for galas',
    backgroundImage: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-suit-black-shirt-black.png'
  },
  {
    name: 'Prom Night',
    slug: 'prom',
    description: 'Stand out styles for your big night',
    backgroundImage: 'https://pub-46371bda6faf4910b74631159fc2dfd4.r2.dev/kct-prodcuts/Bundles-Augest-2025/Bundles-01/black-pink-pink.png'
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

      {/* Featured Bundles Section - NEW with hover effect */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-3">
              Complete Outfits, Perfect Styling
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Curated bundles that take the guesswork out of style - hover to see the complete look
            </p>
          </div>

          {/* Dense 2x2 grid on desktop, 1 column mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredBundles.map((bundle) => (
              <ModernBundleCard key={bundle.id} bundle={bundle} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/bundles">
              <Button variant="outline" className="border-burgundy text-burgundy hover:bg-burgundy hover:text-white">
                View All Bundles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products - HIGH DENSITY GRID */}
      <section className="py-12 bg-white">
        <div className="container-main">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif">Trending Now</h2>
              <p className="text-sm text-gray-600 mt-1">Most popular items this week</p>
            </div>
            <Link href="/products" className="text-burgundy hover:underline text-sm font-semibold">
              View All Products →
            </Link>
          </div>

          {/* Dense 6-column grid on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {trendingProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <Link href={`/products/${product.id}`}>
                  <div className="bg-white border border-gray-100 overflow-hidden hover:border-burgundy transition-all duration-200 hover:shadow-lg">
                    <div className="aspect-square relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 16vw"
                      />
                      {/* Quick add overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <Button size="sm" className="bg-white text-black hover:bg-gray-100">
                          <ShoppingBag className="w-3 h-3 mr-1" />
                          Quick Add
                        </Button>
                      </div>
                    </div>
                    <div className="p-2">
                      <h4 className="text-sm font-medium truncate">{product.name}</h4>
                      <p className="text-xs text-gray-600 truncate">{product.category}</p>
                      <div className="text-sm font-bold text-burgundy">${product.price}</div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Style Categories - Visual Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container-main">
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">
            Shop by Style
          </h2>

          {/* 2x2 grid on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {styleCategories.map((category) => (
              <Link key={category.slug} href={`/collections/${category.slug}`}>
                <div className="group relative overflow-hidden aspect-[16/10] cursor-pointer">
                  <Image
                    src={category.backgroundImage}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl md:text-3xl font-serif mb-2">{category.name}</h3>
                    <p className="text-gray-200 mb-4">{category.description}</p>
                    <div className="inline-flex items-center text-sm font-semibold">
                      Shop Collection <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid - Compressed */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-3">Tailored to Perfection</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our comprehensive services designed to elevate your wardrobe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/atelier-ai" className="group">
              <div className="relative bg-white border border-gray-200 p-8 h-full transition-all duration-300 hover:border-burgundy hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-full h-1 bg-burgundy transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <Sparkles className="h-12 w-12 text-burgundy mb-4" />
                <h3 className="text-xl font-serif mb-3">Atelier AI</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Experience AI-powered outfit recommendations and personalized styling
                </p>
                <span className="inline-flex items-center text-sm font-semibold text-burgundy">
                  Explore AI Features <ArrowRight className="ml-2 h-3 w-3" />
                </span>
              </div>
            </Link>

            <Link href="/bundles" className="group">
              <div className="relative bg-white border border-gray-200 p-8 h-full transition-all duration-300 hover:border-gold hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-full h-1 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <Package className="h-12 w-12 text-gold mb-4" />
                <h3 className="text-xl font-serif mb-3">Occasion Bundles</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Pre-styled outfits for every occasion with exclusive bundle pricing
                </p>
                <span className="inline-flex items-center text-sm font-semibold text-gold">
                  Browse Bundles <ArrowRight className="ml-2 h-3 w-3" />
                </span>
              </div>
            </Link>

            <Link href="/wedding" className="group">
              <div className="relative bg-white border border-gray-200 p-8 h-full transition-all duration-300 hover:border-gold hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-full h-1 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <Calendar className="h-12 w-12 text-gold mb-4" />
                <h3 className="text-xl font-serif mb-3">Wedding Hub</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Complete wedding party management with group discounts
                </p>
                <span className="inline-flex items-center text-sm font-semibold text-gold">
                  Plan Your Wedding <ArrowRight className="ml-2 h-3 w-3" />
                </span>
              </div>
            </Link>
          </div>
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