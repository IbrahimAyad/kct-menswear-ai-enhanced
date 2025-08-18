"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ModernHero } from "@/components/home/ModernHero";
import { TrendingNow } from "@/components/home/TrendingNow";
import { EditorialCollections } from "@/components/home/EditorialCollections";
import { ModernProductShowcase } from "@/components/home/ModernProductShowcase";
import { MinimalFooterSection } from "@/components/home/MinimalFooterSection";
// Build Your Look component removed from imports as it doesn't fit the new vision

// Premium outfit combinations for Build Your Look
const outfitCombinations = [
  {
    id: "executive",
    name: "Executive Power",
    suit: {
      id: "navy-suit",
      name: "Navy Tailored Suit",
      price: 189,
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80"
    },
    shirt: {
      id: "white-shirt",
      name: "Crisp White Shirt",
      price: 49,
      image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80"
    },
    tie: {
      id: "burgundy-tie",
      name: "Burgundy Silk Tie",
      price: 29,
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"
    },
    totalPrice: 267,
    bundlePrice: 229,
    savings: 38,
    description: "Commanding presence for the modern executive"
  },
  {
    id: "wedding",
    name: "Wedding Classic",
    suit: {
      id: "charcoal-suit",
      name: "Charcoal Three-Piece",
      price: 229,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
    },
    shirt: {
      id: "light-blue-shirt",
      name: "Light Blue Shirt",
      price: 55,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80"
    },
    tie: {
      id: "silver-tie",
      name: "Silver Tie",
      price: 35,
      image: "https://images.unsplash.com/photo-1592878849122-facb97520f9e?w=800&q=80"
    },
    totalPrice: 319,
    bundlePrice: 279,
    savings: 40,
    description: "Timeless elegance for your special day"
  },
  {
    id: "black-tie",
    name: "Black Tie Elite",
    suit: {
      id: "black-tuxedo",
      name: "Black Tuxedo",
      price: 279,
      image: "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?w=800&q=80"
    },
    shirt: {
      id: "formal-white",
      name: "Formal White Shirt",
      price: 65,
      image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80"
    },
    tie: {
      id: "black-bowtie",
      name: "Black Bow Tie",
      price: 25,
      image: "https://images.unsplash.com/photo-1558040351-6f8e75792509?w=800&q=80"
    },
    totalPrice: 369,
    bundlePrice: 329,
    savings: 40,
    description: "Sophisticated luxury for formal events"
  }
];

// Collections data for editorial grid
const editorialCollections = [
  {
    id: "business",
    name: "Business Collection",
    subtitle: "Power Dressing",
    image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80",
    href: "/collections/business",
    size: "large" as const
  },
  {
    id: "wedding",
    name: "Wedding",
    subtitle: "Timeless Romance",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
    href: "/collections/wedding",
    size: "medium" as const
  },
  {
    id: "formal",
    name: "Black Tie",
    subtitle: "Evening Elegance",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80",
    href: "/collections/formal",
    size: "medium" as const
  },
  {
    id: "casual",
    name: "Smart Casual",
    subtitle: "Modern Comfort",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80",
    href: "/collections/casual",
    size: "small" as const
  },
  {
    id: "prom",
    name: "Prom Night",
    subtitle: "Stand Out Style",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
    href: "/collections/prom",
    size: "large" as const
  }
];

// Featured products for showcase
const featuredProducts = [
  {
    id: 1,
    name: "Navy Tailored Suit",
    price: 189,
    originalPrice: 229,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    href: "/products/navy-tailored-suit"
  },
  {
    id: 2,
    name: "Charcoal Three-Piece",
    price: 229,
    originalPrice: 279,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    href: "/products/charcoal-three-piece"
  },
  {
    id: 3,
    name: "Black Evening Tuxedo",
    price: 279,
    originalPrice: 329,
    image: "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?w=800&q=80",
    href: "/products/black-evening-tuxedo"
  },
  {
    id: 4,
    name: "Light Grey Suit",
    price: 199,
    originalPrice: 249,
    image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=800&q=80",
    href: "/products/light-grey-suit"
  }
];

export default function ModernHomePage() {
  const [showAIGreeting, setShowAIGreeting] = useState(false);

  // Show Atelier AI greeting after a short delay (preserved from original)
  useEffect(() => {
    const hasSeenGreeting = sessionStorage.getItem('atelier-ai-greeted');
    if (!hasSeenGreeting) {
      const timer = setTimeout(() => {
        setShowAIGreeting(true);
        sessionStorage.setItem('atelier-ai-greeted', 'true');
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
          setShowAIGreeting(false);
        }, 4000);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {/* Editorial Hero Section */}
      <ModernHero />

      {/* Trending Now Section - First thing after hero as per new vision */}
      <TrendingNow />

      {/* Editorial Collections Grid */}
      <section className="py-32 bg-gray-50">
        <EditorialCollections collections={editorialCollections} />
      </section>

      {/* Product Showcase */}
      <section className="py-32 bg-white">
        <ModernProductShowcase products={featuredProducts} />
      </section>

      {/* Minimal Footer Section */}
      <MinimalFooterSection />
      
      {/* Build Your Look moved to separate page - doesn't fit new vision */}

      {/* Atelier AI Greeting Notification (Preserved) */}
      <AnimatePresence>
        {showAIGreeting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm"
          >
            <div className="bg-gradient-to-r from-burgundy to-burgundy-700 rounded-2xl shadow-2xl overflow-hidden">
              {/* Atelier AI Header */}
              <div className="bg-black/20 px-4 py-2 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-white/90 tracking-wide">ATELIER AI</span>
                  <button
                    onClick={() => setShowAIGreeting(false)}
                    className="ml-auto hover:opacity-80 transition-opacity"
                    aria-label="Dismiss"
                  >
                    <svg className="w-3.5 h-3.5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Message Content */}
              <div className="px-5 py-4">
                <p className="text-white font-medium text-sm leading-relaxed">
                  Welcome to KCT. I'm here to help you discover your perfect style. 
                  <span className="block mt-2 text-white/90">Let's elevate your wardrobe together ✨</span>
                </p>
              </div>
              
              {/* Progress bar */}
              <motion.div
                className="h-0.5 bg-white/30"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}