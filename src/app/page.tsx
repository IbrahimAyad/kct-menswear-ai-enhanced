"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ModernHero } from "@/components/home/ModernHero";
import { BuildYourLookModern } from "@/components/home/BuildYourLookModern";
import { EditorialCollections } from "@/components/home/EditorialCollections";
import { ModernProductShowcase } from "@/components/home/ModernProductShowcase";
import { MinimalFooterSection } from "@/components/home/MinimalFooterSection";

// Premium outfit combinations for Build Your Look
const outfitCombinations = [
  {
    id: "executive",
    name: "Executive Power",
    suit: {
      id: "navy-suit",
      name: "Navy Tailored Suit",
      price: 189,
      image: "https://cdn.kctmenswear.com/products/suits/navy/main.png"
    },
    shirt: {
      id: "white-shirt",
      name: "Crisp White Shirt",
      price: 49,
      image: "https://cdn.kctmenswear.com/products/shirts/white/main.png"
    },
    tie: {
      id: "burgundy-tie",
      name: "Burgundy Silk Tie",
      price: 29,
      image: "https://cdn.kctmenswear.com/products/ties/burgundy/main.png"
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
      image: "https://cdn.kctmenswear.com/products/suits/charcoal/main.png"
    },
    shirt: {
      id: "light-blue-shirt",
      name: "Light Blue Shirt",
      price: 55,
      image: "https://cdn.kctmenswear.com/products/shirts/light-blue/main.png"
    },
    tie: {
      id: "silver-tie",
      name: "Silver Tie",
      price: 35,
      image: "https://cdn.kctmenswear.com/products/ties/silver/main.png"
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
      image: "https://cdn.kctmenswear.com/products/tuxedos/black/main.png"
    },
    shirt: {
      id: "formal-white",
      name: "Formal White Shirt",
      price: 65,
      image: "https://cdn.kctmenswear.com/products/shirts/white/formal.png"
    },
    tie: {
      id: "black-bowtie",
      name: "Black Bow Tie",
      price: 25,
      image: "https://cdn.kctmenswear.com/products/bowties/black/main.png"
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
    image: "https://cdn.kctmenswear.com/collections/business/hero.png",
    href: "/collections/business",
    size: "large" as const
  },
  {
    id: "wedding",
    name: "Wedding",
    subtitle: "Timeless Romance",
    image: "https://cdn.kctmenswear.com/collections/wedding/hero.png",
    href: "/collections/wedding",
    size: "medium" as const
  },
  {
    id: "formal",
    name: "Black Tie",
    subtitle: "Evening Elegance",
    image: "https://cdn.kctmenswear.com/collections/formal/hero.png",
    href: "/collections/formal",
    size: "medium" as const
  },
  {
    id: "casual",
    name: "Smart Casual",
    subtitle: "Modern Comfort",
    image: "https://cdn.kctmenswear.com/collections/casual/hero.png",
    href: "/collections/casual",
    size: "small" as const
  },
  {
    id: "prom",
    name: "Prom Night",
    subtitle: "Stand Out Style",
    image: "https://cdn.kctmenswear.com/collections/prom/hero.png",
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
    image: "https://cdn.kctmenswear.com/products/suits/navy/main.png",
    href: "/products/navy-tailored-suit"
  },
  {
    id: 2,
    name: "Charcoal Three-Piece",
    price: 229,
    originalPrice: 279,
    image: "https://cdn.kctmenswear.com/products/suits/charcoal-3piece/main.png",
    href: "/products/charcoal-three-piece"
  },
  {
    id: 3,
    name: "Black Evening Tuxedo",
    price: 279,
    originalPrice: 329,
    image: "https://cdn.kctmenswear.com/products/tuxedos/black/main.png",
    href: "/products/black-evening-tuxedo"
  },
  {
    id: 4,
    name: "Light Grey Suit",
    price: 199,
    originalPrice: 249,
    image: "https://cdn.kctmenswear.com/products/suits/light-grey/main.png",
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

      {/* Build Your Look Interactive Section */}
      <section className="py-32 bg-white">
        <BuildYourLookModern outfits={outfitCombinations} />
      </section>

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