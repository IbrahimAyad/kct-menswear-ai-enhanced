"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Volume2, VolumeX, ChevronDown, Star, Eye, Heart, Share2 } from "lucide-react";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { EnhancedProductGrid } from "@/components/products/enhanced/EnhancedProductCard";

// Video IDs for integration
const featuredVideos = [
  "a9ab22d2732a9eccfe01085f0127188f", // Hero video
  "e5193da33f11d8a7c9e040d49d89da68",
  "2e3811499ae08de6d3a57c9811fe6c6c",
  "0e292b2b0a7d9e5b9a0ced80590d4898",
  "89027eb56b4470a759bb0bd6e83ebac4",
  "a069add00bdc6e25e89bfeb59d243311",
  "965c2718880583e88f4d879d3c2d2122",
  "f380c467a2cad915c1bc77f0e05feee4",
  "5ca7d4ab2ccc70679cdf6da96539dba5",
  "8ce1e2f11c8672a5ed7f176cc483817e",
  "efaf442247a5e3364fe3018f9a56972a",
  "77c515b506bf3898f7240f3d902f55c7"
];

// Luxury editorial collections
const editorialStories = [
  {
    title: "The Modern Gentleman",
    subtitle: "Redefining elegance for today's discerning man",
    description: "Discover our curated selection of contemporary tailoring that bridges tradition with innovation.",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=80",
    href: "/collections/modern",
    theme: "dark"
  },
  {
    title: "Wedding Grandeur",
    subtitle: "Your most important day deserves perfection",
    description: "From intimate ceremonies to grand celebrations, our wedding collection ensures you look extraordinary.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    href: "/collections/wedding",
    theme: "light"
  },
  {
    title: "Prom Royalty",
    subtitle: "Make your mark with confidence",
    description: "Stand out with our premium prom collection designed to make your night truly unforgettable.",
    image: "https://images.unsplash.com/photo-1521505772811-d7e4ec1b5c7b?w=1200&q=80",
    href: "/collections/prom",
    theme: "dark"
  }
];

// Premium services
const luxuryServices = [
  {
    title: "Bespoke Tailoring",
    description: "Personalized fittings with master craftsmen",
    icon: "✂️"
  },
  {
    title: "Style Consultation",
    description: "Expert guidance from our style consultants",
    icon: "👔"
  },
  {
    title: "Concierge Service",
    description: "White-glove service from selection to delivery",
    icon: "🤵"
  },
  {
    title: "Private Shopping",
    description: "Exclusive appointments in our showroom",
    icon: "🏪"
  }
];

export default function LuxuryHomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showVideoGallery, setShowVideoGallery] = useState(false);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.1]);
  const textY = useTransform(scrollY, [0, 300], [0, -50]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products/enhanced?status=active&limit=24');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Split products into different sections
  const featuredProducts = products.slice(0, 8);
  const newArrivals = products.slice(8, 16);
  const trendingProducts = products.slice(16, 24);

  return (
    <main className="min-h-screen bg-black">
      {/* Luxury Video Hero Section */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
        {/* Video Background */}
        <motion.div 
          className="absolute inset-0"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <VideoPlayer
            videoId={featuredVideos[0]}
            className="w-full h-full"
            autoPlay={true}
            muted={isMuted}
            loop={true}
          />
          {/* Premium overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 flex items-center justify-center h-full"
          style={{ y: textY }}
        >
          <div className="text-center max-w-4xl mx-auto px-6">
            {/* Brand Mark */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mb-8"
            >
              <div className="w-24 h-px bg-white/80 mx-auto mb-6" />
              <p className="text-white/90 text-sm font-light tracking-[0.3em] uppercase">
                Detroit's Finest Since 1985
              </p>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8 leading-[0.85] tracking-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.7 }}
            >
              Luxury
              <span className="block font-normal italic">Redefined</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-white/80 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              Experience the pinnacle of menswear craftsmanship with our curated collection of premium suits, accessories, and bespoke tailoring services.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.3 }}
            >
              <Link href="/collections">
                <button className="group bg-white text-black px-8 py-4 text-base font-medium hover:bg-gray-100 transition-all duration-300 flex items-center">
                  Explore Collection
                  <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <button 
                onClick={() => setShowVideoGallery(true)}
                className="group bg-transparent border-2 border-white text-white px-8 py-4 text-base font-light hover:bg-white hover:text-black transition-all duration-300 flex items-center"
              >
                <Play className="mr-3 h-4 w-4" />
                Watch Stories
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Audio Control */}
        <motion.button
          className="absolute top-6 right-6 z-20 bg-black/30 text-white p-3 rounded-full backdrop-blur-sm hover:bg-black/50 transition-colors"
          onClick={() => setIsMuted(!isMuted)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </motion.button>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div 
            className="flex flex-col items-center gap-2 cursor-pointer"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="text-xs tracking-[0.3em] uppercase font-light">Discover</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* Editorial Stories Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-light text-black mb-6">
              Editorial Stories
            </h2>
            <div className="w-24 h-px bg-black mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {editorialStories.map((story, index) => (
              <motion.div
                key={story.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group cursor-pointer"
              >
                <Link href={story.href}>
                  <div className="relative aspect-[3/4] overflow-hidden mb-6">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="font-serif text-2xl font-light text-white mb-2">
                        {story.title}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {story.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="px-2">
                    <p className="text-gray-600 leading-relaxed">
                      {story.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {!loading && featuredProducts.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-serif text-4xl md:text-5xl font-light text-black mb-6">
                Featured Collection
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Handpicked pieces that exemplify our commitment to excellence and timeless style.
              </p>
            </motion.div>
            
            <EnhancedProductGrid 
              products={featuredProducts}
              showPricingTier={false}
              showQuickActions={true}
              columns={{ mobile: 2, tablet: 3, desktop: 4 }}
            />
            
            <div className="text-center mt-12">
              <Link href="/collections">
                <button className="bg-black text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors">
                  View Full Collection
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Video Gallery Masonry */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
              Style Stories
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Behind every great suit is a story. Discover the artistry and attention to detail that goes into every piece.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredVideos.slice(1, 9).map((videoId, index) => (
              <motion.div
                key={videoId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-lg cursor-pointer group ${
                  index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'
                }`}
                onClick={() => {
                  setCurrentVideoIndex(index + 1);
                  setShowVideoGallery(true);
                }}
              >
                <VideoPlayer
                  videoId={videoId}
                  autoPlay={false}
                  muted={true}
                  controls={false}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <motion.div
                    className="bg-white/90 text-black rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Play size={20} />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {!loading && newArrivals.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-16"
            >
              <div>
                <h2 className="font-serif text-4xl md:text-5xl font-light text-black mb-4">
                  New Arrivals
                </h2>
                <p className="text-gray-600 text-lg">
                  The latest additions to our curated collection.
                </p>
              </div>
              <Link href="/collections/new-arrivals">
                <button className="text-black hover:text-gray-600 transition-colors flex items-center">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </Link>
            </motion.div>
            
            <EnhancedProductGrid 
              products={newArrivals}
              showPricingTier={false}
              showQuickActions={true}
              columns={{ mobile: 2, tablet: 3, desktop: 4 }}
            />
          </div>
        </section>
      )}

      {/* Luxury Services Section */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
              Premium Services
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Experience personalized service that goes beyond expectations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {luxuryServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group cursor-pointer"
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-white text-xl font-medium mb-4">
                  {service.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/services">
              <button className="bg-white text-black px-8 py-4 font-medium hover:bg-gray-100 transition-colors">
                Book Consultation
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-light text-black mb-8">
              Four Decades of Excellence
            </h2>
            <div className="w-24 h-px bg-black mx-auto mb-8" />
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Since 1985, KCT Menswear has been Detroit's premier destination for luxury menswear. 
              From our humble beginnings as a small tailor shop to becoming Michigan's most trusted 
              name in formal wear, we've never compromised on quality or service.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-12">
              Every suit tells a story. Every fitting creates a relationship. Every detail matters. 
              This is the KCT difference.
            </p>
            <Link href="/about">
              <button className="border-2 border-black text-black px-8 py-4 font-medium hover:bg-black hover:text-white transition-all duration-300">
                Our Story
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Video Gallery Modal */}
      <AnimatePresence>
        {showVideoGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
            onClick={() => setShowVideoGallery(false)}
          >
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-4xl aspect-video"
                onClick={(e) => e.stopPropagation()}
              >
                <VideoPlayer
                  videoId={featuredVideos[currentVideoIndex]}
                  controls={true}
                  autoPlay={true}
                  muted={false}
                />
                <button
                  className="absolute -top-12 right-0 text-white hover:text-gray-300"
                  onClick={() => setShowVideoGallery(false)}
                >
                  ✕
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Newsletter Section */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-serif text-3xl font-light text-white mb-4">
              Stay in Style
            </h3>
            <p className="text-white/70 mb-8">
              Subscribe to receive exclusive updates on new arrivals and private events.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-4 bg-white text-black placeholder-gray-500 focus:outline-none"
              />
              <button className="bg-white text-black px-8 py-4 font-medium hover:bg-gray-100 transition-colors sm:ml-0 -ml-px">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}