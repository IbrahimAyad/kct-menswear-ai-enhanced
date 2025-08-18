"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ModernHero } from "@/components/home/ModernHero";
import { SmartTrendingNow } from "@/components/home/SmartTrendingNow";
import { EditorialCollections } from "@/components/home/EditorialCollections";
import { ModernProductShowcase } from "@/components/home/ModernProductShowcase";
import { MinimalFooterSection } from "@/components/home/MinimalFooterSection";
import { UniversalProductCard, UniversalProductGrid } from "@/components/products/UniversalProductCard";
import { cachedKnowledgeAnalyzer } from "@/lib/ai/knowledge-product-analyzer-cached";

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
      name: "Light Blue Textured",
      price: 45,
      image: "https://images.unsplash.com/photo-1603252109612-24fa03d145c8?w=800&q=80"
    },
    tie: {
      id: "silver-tie",
      name: "Silver Pattern Tie",
      price: 35,
      image: "https://images.unsplash.com/photo-1589756823695-278bc923f962?w=800&q=80"
    },
    totalPrice: 309,
    bundlePrice: 259,
    savings: 50,
    description: "Timeless elegance for your special day"
  }
];

export default function HomePage() {
  const [aiProducts, setAiProducts] = useState<{
    trending: any[];
    newArrivals: any[];
  }>({
    trending: [],
    newArrivals: []
  });
  const [loadingAI, setLoadingAI] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Load AI products in background
    loadAIProducts();
    
    // Show notification after a delay
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const loadAIProducts = async () => {
    try {
      setLoadingAI(true);
      const organized = await cachedKnowledgeAnalyzer.analyzeAndOrganizeProducts();
      setAiProducts({
        trending: organized.trending.slice(0, 4),
        newArrivals: organized.newArrivals.slice(0, 4)
      });
    } catch (error) {
      console.error('Error loading AI products:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* AI Assistant Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-burgundy text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm"
          >
            <Sparkles className="w-5 h-5" />
            <div>
              <p className="font-medium">Atelier AI is here!</p>
              <p className="text-sm opacity-90">Click the chat icon for style assistance</p>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="ml-auto text-white/80 hover:text-white"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Original Hero Section */}
      <ModernHero />

      {/* AI-Powered Trending Section */}
      {!loadingAI && aiProducts.trending.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-burgundy" />
                AI-Curated Trending
              </h2>
              <a
                href="/collections/trending"
                className="text-sm text-gray-900 hover:text-burgundy transition-colors"
              >
                View All →
              </a>
            </div>
            <UniversalProductGrid products={aiProducts.trending} />
          </div>
        </section>
      )}

      {/* Original Smart Trending Now */}
      <SmartTrendingNow />

      {/* Editorial Collections */}
      <EditorialCollections />

      {/* AI-Powered New Arrivals */}
      {!loadingAI && aiProducts.newArrivals.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900">
                New Arrivals
              </h2>
              <a
                href="/collections/new-arrivals"
                className="text-sm text-gray-900 hover:text-burgundy transition-colors"
              >
                View All →
              </a>
            </div>
            <UniversalProductGrid products={aiProducts.newArrivals} />
          </div>
        </section>
      )}

      {/* Build Your Look Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-light text-center mb-12">
            Build Your Look
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {outfitCombinations.map((outfit) => (
              <motion.div
                key={outfit.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-3 aspect-[3/2]">
                  <img
                    src={outfit.suit.image}
                    alt={outfit.suit.name}
                    className="w-full h-full object-cover"
                  />
                  <img
                    src={outfit.shirt.image}
                    alt={outfit.shirt.name}
                    className="w-full h-full object-cover"
                  />
                  <img
                    src={outfit.tie.image}
                    alt={outfit.tie.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium mb-2">{outfit.name}</h3>
                  <p className="text-gray-600 mb-4">{outfit.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-gray-400 line-through mr-2">
                        ${outfit.totalPrice}
                      </span>
                      <span className="text-2xl font-light">
                        ${outfit.bundlePrice}
                      </span>
                    </div>
                    <span className="text-green-600 text-sm">
                      Save ${outfit.savings}
                    </span>
                  </div>
                  <button className="w-full bg-burgundy text-white py-3 hover:bg-burgundy/90 transition-colors">
                    Shop This Look
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Product Showcase */}
      <ModernProductShowcase />

      {/* AI Insight Banner */}
      <section className="py-12 bg-burgundy text-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-light mb-3">
            Powered by Atelier AI
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Our AI analyzes trends, seasons, and style preferences to curate the perfect collection for you
          </p>
          <a
            href="/style-quiz"
            className="inline-block bg-white text-burgundy px-8 py-3 hover:bg-gray-100 transition-colors"
          >
            Take Our Style Quiz
          </a>
        </div>
      </section>

      {/* Footer */}
      <MinimalFooterSection />
    </main>
  );
}