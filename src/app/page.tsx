"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Star, ShoppingCart, Heart, CheckCircle, Phone, MapPin, Clock } from "lucide-react";

// Working video solution using iframe embeds instead of HLS
const FeaturedVideo = ({ videoId, title, className = "" }: { videoId: string; title: string; className?: string }) => {
  return (
    <div className={`relative aspect-video rounded-lg overflow-hidden group cursor-pointer ${className}`}>
      <iframe
        src={`https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/${videoId}/iframe`}
        className="w-full h-full"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
        title={title}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
    </div>
  );
};

// Simple HTML5 video for hero with direct MP4 fallback
const HeroVideo = ({ className = "" }: { className?: string }) => {
  const [videoError, setVideoError] = useState(false);
  
  if (videoError) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=80"
          alt="KCT Menswear Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        onError={() => setVideoError(true)}
      >
        <source 
          src={`https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/a9ab22d2732a9eccfe01085f0127188f/downloads/default.mp4`}
          type="video/mp4"
        />
        {/* Fallback image if video fails */}
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
    </div>
  );
};

// Product card with real data handling
const ProductCard = ({ product }: { product: any }) => {
  const getImageUrl = () => {
    if (product?.images?.hero?.url) return product.images.hero.url;
    if (product?.images?.hero?.cdn_url) return product.images.hero.cdn_url;
    if (product?.images?.primary?.url) return product.images.primary.url;
    if (product?.images?.primary?.cdn_url) return product.images.primary.cdn_url;
    
    // Use category-appropriate stock images instead of placeholder
    const categoryImages = {
      suits: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80",
      tuxedos: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      accessories: "https://images.unsplash.com/photo-1521505772811-d7e4ec1b5c7b?w=400&q=80",
      shoes: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&q=80"
    };
    
    return categoryImages[product.category?.toLowerCase()] || categoryImages.suits;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={getImageUrl()}
          alt={product.name || "Product"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors">
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-2">
              <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-50 transition-colors shadow-lg">
                <ShoppingCart size={18} />
              </button>
              <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-50 transition-colors shadow-lg">
                <Heart size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span className="capitalize">{product.category || "Menswear"}</span>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-current" />
            <span className="text-xs">4.8</span>
          </div>
        </div>
        
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
          {product.name || "Premium Suit"}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ${product.base_price ? product.base_price.toFixed(2) : "299.00"}
          </span>
          <button className="text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium">
            Quick View
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products/enhanced?status=active&limit=12');
      if (response.ok) {
        const data = await response.json();
        // If no real products, create some demo products
        const loadedProducts = data.products?.length ? data.products : createDemoProducts();
        setProducts(loadedProducts);
      } else {
        setProducts(createDemoProducts());
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(createDemoProducts());
    } finally {
      setLoading(false);
    }
  };

  // Create demo products if API fails
  const createDemoProducts = () => [
    { id: 1, name: "Classic Navy Suit", category: "suits", base_price: 599.99 },
    { id: 2, name: "Black Tuxedo", category: "tuxedos", base_price: 799.99 },
    { id: 3, name: "Charcoal Business Suit", category: "suits", base_price: 549.99 },
    { id: 4, name: "Wedding Vest Set", category: "accessories", base_price: 199.99 },
    { id: 5, name: "Prom Tuxedo", category: "tuxedos", base_price: 699.99 },
    { id: 6, name: "Oxford Dress Shoes", category: "shoes", base_price: 299.99 }
  ];

  const featuredProducts = products.slice(0, 6);
  const videoIds = [
    "e5193da33f11d8a7c9e040d49d89da68",
    "2e3811499ae08de6d3a57c9811fe6c6c", 
    "0e292b2b0a7d9e5b9a0ced80590d4898",
    "89027eb56b4470a759bb0bd6e83ebac4"
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - Clean & Bright */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <HeroVideo className="absolute inset-0 w-full h-full" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <div className="w-20 h-px bg-white mx-auto mb-4" />
            <p className="text-white/90 text-sm tracking-widest uppercase font-light">
              Detroit's Premier Menswear Since 1985
            </p>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-light text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Exceptional
            <span className="block font-normal">Menswear</span>
          </motion.h1>

          <motion.p
            className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Discover premium suits, tuxedos, and accessories crafted for the modern gentleman.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link href="/collections">
              <button className="bg-white text-gray-900 px-8 py-4 font-medium hover:bg-gray-50 transition-colors rounded-sm flex items-center justify-center">
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </Link>
            <Link href="/services">
              <button className="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-gray-900 transition-all rounded-sm">
                Schedule Fitting
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products - Clean White Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
              Featured Collection
            </h2>
            <div className="w-20 h-px bg-gray-300 mx-auto mb-6" />
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Handpicked pieces that represent the finest in menswear craftsmanship.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id || index} product={product} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link href="/collections">
              <button className="bg-gray-900 text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors rounded-sm">
                View All Products
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Collections Highlight */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Shop by Category
            </h2>
            <div className="w-20 h-px bg-gray-300 mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Wedding Suits",
                subtitle: "Your perfect day deserves perfection",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
                href: "/collections/wedding"
              },
              {
                title: "Prom Tuxedos", 
                subtitle: "Stand out on your special night",
                image: "https://images.unsplash.com/photo-1521505772811-d7e4ec1b5c7b?w=600&q=80",
                href: "/collections/prom"
              },
              {
                title: "Business Suits",
                subtitle: "Professional excellence, redefined",
                image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
                href: "/collections/suits"
              }
            ].map((collection, index) => (
              <motion.div
                key={collection.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group cursor-pointer"
              >
                <Link href={collection.href}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg mb-4">
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-2xl font-light text-white mb-2">
                        {collection.title}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {collection.subtitle}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Showcase - Working Videos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
              Style Stories
            </h2>
            <div className="w-20 h-px bg-gray-300 mx-auto mb-6" />
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              See our craftsmanship in action and discover the stories behind every piece.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {videoIds.map((videoId, index) => (
              <motion.div
                key={videoId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <FeaturedVideo 
                  videoId={videoId} 
                  title={`KCT Style Story ${index + 1}`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Clean & Professional */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Premium Services
            </h2>
            <div className="w-20 h-px bg-gray-300 mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <CheckCircle className="w-12 h-12 text-blue-600" />,
                title: "Expert Tailoring",
                description: "Precision fittings by master craftsmen with decades of experience."
              },
              {
                icon: <Clock className="w-12 h-12 text-blue-600" />,
                title: "Quick Turnaround", 
                description: "Same-day alterations available for most items and styles."
              },
              {
                icon: <Heart className="w-12 h-12 text-blue-600" />,
                title: "Style Consultation",
                description: "Personal styling sessions to find your perfect look."
              },
              {
                icon: <MapPin className="w-12 h-12 text-blue-600" />,
                title: "Multiple Locations",
                description: "Convenient locations across Detroit and surrounding areas."
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <button className="bg-blue-600 text-white px-8 py-4 font-medium hover:bg-blue-700 transition-colors rounded-sm">
                Learn More About Our Services
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA - Simple & Clean */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-4xl font-light mb-4">
              Ready to Look Your Best?
            </h3>
            <p className="text-gray-300 mb-8 text-lg">
              Schedule a consultation or visit our showroom today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button className="bg-white text-gray-900 px-8 py-4 font-medium hover:bg-gray-100 transition-colors rounded-sm">
                  Schedule Appointment
                </button>
              </Link>
              <a href="tel:313-525-2424">
                <button className="border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-gray-900 transition-all rounded-sm flex items-center justify-center">
                  <Phone className="mr-2 h-4 w-4" />
                  Call (313) 525-2424
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}